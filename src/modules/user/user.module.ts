import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from '~/db/entities';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
