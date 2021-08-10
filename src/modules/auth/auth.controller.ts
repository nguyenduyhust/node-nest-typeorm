import { Controller, Post, Body, Res, HttpCode } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';

import {
  LoginDTO,
  LoginResponseDTO,
  RefreshAccessTokenDTO,
  RefreshAccessTokenResponseDTO,
  RegisterDTO,
} from './auth.dto';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse({
    description: 'Register',
    type: Boolean,
  })
  @HttpCode(200)
  @Post('register')
  async register(@Body() payload: RegisterDTO) {
    return this.authService.register(payload);
  }

  @ApiResponse({
    description: 'Login',
    type: LoginResponseDTO,
  })
  @HttpCode(200)
  @Post('login')
  async login(@Body() payload: LoginDTO, @Res() res: Response) {
    const loginData = await this.authService.login(payload.email, payload.password);
    return res.json(loginData);
  }

  @ApiResponse({
    description: 'Refreshing Access Token',
    type: RefreshAccessTokenResponseDTO,
  })
  @HttpCode(200)
  @Post('refresh-access-token')
  async token(@Body() payload: RefreshAccessTokenDTO) {
    return this.authService.refreshAccessToken(payload.refreshToken);
  }
}
