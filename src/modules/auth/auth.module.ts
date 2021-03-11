import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [ConfigModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
