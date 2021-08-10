import { Controller, Post, Body, Res, HttpCode } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
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

  @Post('register')
  @HttpCode(200)
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({
    description: 'Register',
    type: Boolean,
  })
  async register(@Body() payload: RegisterDTO) {
    return this.authService.register(payload);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({
    description: 'Login',
    type: LoginResponseDTO,
  })
  async login(@Body() payload: LoginDTO, @Res() res: Response) {
    const loginData = await this.authService.login(payload.email, payload.password);
    return res.json(loginData);
  }

  @Post('refresh-access-token')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    description: 'Refreshing Access Token',
    type: RefreshAccessTokenResponseDTO,
  })
  @HttpCode(200)
  async token(@Body() payload: RefreshAccessTokenDTO) {
    return this.authService.refreshAccessToken(payload.refreshToken);
  }
}
