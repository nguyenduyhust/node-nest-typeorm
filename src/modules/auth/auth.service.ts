import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

import { UserDTO } from '../user/user.dto';
import { EnvConfiguration } from '~/config/configuration';
import { EncryptUtils, ErrorUtils, TokenUtils } from '~/common/utils';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginResponseDTO, RefreshAccessTokenResponseDTO, RegisterDTO } from './auth.dto';
import { UserEntity } from '~/db/entities';

@Injectable()
export class AuthService {
  private refreshTokenSecret: string;

  constructor(
    private configService: ConfigService<EnvConfiguration>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    this.refreshTokenSecret = `refresh_${this.configService.get('secret')}`;
  }

  async register(payload: RegisterDTO): Promise<boolean> {
    const user = await this.userRepository.findOne({ email: payload.email });
    if (user) {
      throw ErrorUtils.BadRequestException('User already exists');
    }

    await new UserEntity({
      ...payload,
      password: await UserEntity.hashPassword(payload.password),
    }).save();

    return true;
  }

  async login(email: string, password: string): Promise<LoginResponseDTO> {
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      throw ErrorUtils.BadRequestException('User does not exist');
    }
    const isPasswordCorrect = await EncryptUtils.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw ErrorUtils.BadRequestException('Password was wrong');
    }

    return {
      accessToken: await this.generateAccessToken(user.id),
      refreshToken: await this.generateRefreshToken(user.id),
    };
  }

  async validateRequest(req: Request): Promise<UserDTO> {
    try {
      const accessToken =
        req.headers.authorization && TokenUtils.bearerSchemaToToken(req.headers.authorization);
      if (!accessToken) {
        throw ErrorUtils.UnauthorizedException('Unauthorized');
      }

      const { userId } = await TokenUtils.verify<{ userId: string }>(
        accessToken,
        `${this.configService.get('secret')}`,
      );
      const user = await this.userRepository.findOne(userId);

      if (!user) {
        throw ErrorUtils.UnauthorizedException('Invalid token');
      }

      return new UserDTO(user);
    } catch (error) {
      throw ErrorUtils.UnauthorizedException('Unauthorized');
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<RefreshAccessTokenResponseDTO> {
    try {
      const { userId } = await TokenUtils.verify<{ userId: string }>(
        refreshToken,
        this.refreshTokenSecret,
      );
      if (!userId) {
        throw ErrorUtils.BadRequestException('Invalid token');
      }

      const user = await this.userRepository.findOne(userId);
      if (!user) {
        throw ErrorUtils.BadRequestException('Invalid token');
      }

      return {
        accessToken: await this.generateAccessToken(userId),
      };
    } catch (error) {
      throw ErrorUtils.BadRequestException('Invalid token');
    }
  }

  async generateAccessToken(userId: string) {
    return TokenUtils.generate(
      { userId },
      this.configService.get('secret') || '',
      this.configService.get('tokenExpires') || '',
    );
  }

  async generateRefreshToken(userId: string) {
    return TokenUtils.generate(
      { userId },
      this.refreshTokenSecret,
      this.configService.get('refreshTokenExpires') || '',
    );
  }
}
