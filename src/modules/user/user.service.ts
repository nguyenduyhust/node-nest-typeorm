import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './user.entity';

export interface CreateUserInput {
  email: string;
  password: string;
  fullName: string;
  phone: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(payload: CreateUserInput) {
    const user = new UserEntity({
      ...payload,
      password: await UserEntity.hashPassword(payload.password),
    });
    return this.userRepository.save(user);
  }
}
