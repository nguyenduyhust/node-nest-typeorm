import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

import { RegisterUserInput, GenerateTokenReturn } from './auth.interface';
import { UserDTO } from '../user/user.dto';
import { EnvConfiguration } from '~/config/configuration';
import { CookieUtils, EncryptUtils, ErrorUtils, TokenUtils } from '~/common/utils';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService<EnvConfiguration>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async register(payload: RegisterUserInput): Promise<boolean> {
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

  async login(email: string, password: string): Promise<GenerateTokenReturn> {
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      throw ErrorUtils.BadRequestException('User does not exist');
    }
    const isPasswordCorrect = await EncryptUtils.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw ErrorUtils.BadRequestException('Password was wrong');
    }

    return this.generateToken(new UserDTO(user));
  }

  async validateRequest(req: Request): Promise<UserDTO> {
    try {
      const accessToken = req.headers.authorization
        ? TokenUtils.bearerSchemaToToken(req.headers.authorization)
        : String(CookieUtils.getToken(req));
      const tokenDataObj = await TokenUtils.verify<{ user_id: string }>(
        accessToken,
        `${this.configService.get('secret')}`,
      );
      const user = await this.userRepository.findOne(tokenDataObj.user_id);
      if (!user) {
        throw ErrorUtils.UnauthorizedException('Invalid token');
      }
      return new UserDTO(user);
    } catch (error) {
      throw ErrorUtils.UnauthorizedException('Unauthorized');
    }
  }

  async generateToken(user: UserDTO): Promise<GenerateTokenReturn> {
    const token = await TokenUtils.generate(
      { user_id: user.id },
      this.configService.get('secret') as any,
      this.configService.get('tokenExpires') as any,
    );
    const refreshToken = await TokenUtils.generate(
      { user_id: user.id },
      `refresh_${this.configService.get('secret')}`,
      this.configService.get('refreshTokenExpires') as any,
    );

    return {
      token,
      refreshToken,
      user,
    };
  }

  async refreshToken(refreshToken: string): Promise<GenerateTokenReturn> {
    try {
      const tokenDataObj = await TokenUtils.verify<{ user_id: string }>(
        refreshToken,
        `refresh_${this.configService.get('secret')}`,
      );
      const user = await this.userRepository.findOne(tokenDataObj.user_id);
      if (!user) {
        throw ErrorUtils.BadRequestException('Invalid token');
      }

      return this.generateToken(new UserDTO(user));
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw ErrorUtils.BadRequestException('Token expired');
      }
      throw ErrorUtils.UnauthorizedException('Invalid token');
    }
  }
}
