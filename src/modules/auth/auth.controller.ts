import { Controller, Post, Body, Res } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';

import { SignUpDTO, AuthValidateDTO, AuthResponseDTO, AuthRefreshTokenDTO } from './auth.dto';
import { AuthService } from './auth.service';
import { CookieHelper } from '@helpers/cookie.helper';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse({
    description: 'Register user',
    status: 200,
    type: Boolean,
  })
  @Post('sign-up')
  async signUp(@Body() payload: SignUpDTO) {
    return this.authService.register(payload);
  }

  @ApiResponse({
    status: 200,
    isArray: false,
    type: AuthResponseDTO,
  })
  @Post('validate')
  async validate(@Body() payload: AuthValidateDTO, @Res() res: Response) {
    const loginData = await this.authService.login(payload.email, payload.password);
    CookieHelper.setToken(res, loginData.token);
    return res.json(loginData);
  }

  @ApiResponse({
    description: 'Refreshing Access Tokens',
    status: 200,
    isArray: false,
    type: AuthResponseDTO,
  })
  @Post('refresh-token')
  async token(@Body() payload: AuthRefreshTokenDTO) {
    return this.authService.refreshToken(payload.refresh_token);
  }

  @ApiResponse({
    description: 'Sign out',
    status: 200,
    type: Boolean,
  })
  @Post('sign-out')
  async signOut(@Res() res: Response) {
    CookieHelper.clearToken(res);
    return res.json(true);
  }
}
