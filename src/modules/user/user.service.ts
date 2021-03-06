import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';

export interface CreateUserInput {
  email: string;
  password: string;
  fullName: string;
  phone: string;
}

export interface UserResponse {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(payload: CreateUserInput) {
    const user = new User({
      ...payload,
      password: await User.hashPassword(payload.password),
    });
    return this.userRepository.save(user);
  }
}
