import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';

import { UserDTO } from './user.dto';
import { UserEntity } from './user.entity';
import { CreateUserInput } from './user.interface';

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

  async getUsers(options: IPaginationOptions): Promise<Pagination<UserDTO>> {
    const queryBuilder = this.userRepository.createQueryBuilder('u');
    queryBuilder.orderBy('u.createdAt', 'DESC');

    const records = await paginate<UserEntity>(queryBuilder, options);
    const items: UserDTO[] = records.items.map((item) => ({ ...item.toDto() }));

    return {
      ...records,
      items,
    };
  }
}
