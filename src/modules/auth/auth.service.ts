import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

import { UserService } from '@modules/user/user.service';
import { RegisterUserInput, GenerateTokenReturn } from './auth.interface';
import { TokenHelper } from '@helpers/token.helper';
import { ErrorHelper } from '@helpers/error.helper';
import { EncryptHelper } from '@helpers/encrypt.helper';
import { UserDTO } from '../user/user.dto';
import { CookieHelper } from '@helpers/cookie.helper';
import { EnvConfiguration } from '~/config/configuration';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private configService: ConfigService<EnvConfiguration>,
  ) {}

  async register(payload: RegisterUserInput): Promise<boolean> {
    await this.userService.create(payload);

    return true;
  }

  async login(email: string, password: string): Promise<GenerateTokenReturn> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw ErrorHelper.BadRequestException('User does not exist');
    }
    const isPasswordCorrect = await EncryptHelper.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw ErrorHelper.BadRequestException('Password was wrong');
    }

    return this.generateToken(new UserDTO(user));
  }

  async validateRequest(req: Request): Promise<UserDTO> {
    try {
      const accessToken = req.headers.authorization
        ? TokenHelper.bearerSchemaToToken(req.headers.authorization)
        : String(CookieHelper.getToken(req));
      const tokenDataObj = await TokenHelper.verify<{ user_id: string }>(
        accessToken,
        `${this.configService.get('secret')}`,
      );
      const user = await this.userService.findOneById(tokenDataObj.user_id);
      if (!user) {
        throw ErrorHelper.UnauthorizedException('Invalid token');
      }
      return new UserDTO(user);
    } catch (error) {
      throw ErrorHelper.UnauthorizedException('Unauthorized');
    }
  }

  async generateToken(user: UserDTO): Promise<GenerateTokenReturn> {
    const token = await TokenHelper.generate(
      { user_id: user.id },
      this.configService.get('secret') as any,
      this.configService.get('tokenExpires') as any,
    );
    const refreshToken = await TokenHelper.generate(
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
      const tokenDataObj = await TokenHelper.verify<{ user_id: string }>(
        refreshToken,
        `refresh_${this.configService.get('secret')}`,
      );
      const user = await this.userService.findOneById(tokenDataObj.user_id);
      if (!user) {
        throw ErrorHelper.BadRequestException('Invalid token');
      }

      return this.generateToken(new UserDTO(user));
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw ErrorHelper.BadRequestException('Token expired');
      }
      throw ErrorHelper.UnauthorizedException('Invalid token');
    }
  }
}
