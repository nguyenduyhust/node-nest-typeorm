import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';

import { UserDTO } from './user.dto';
import { UserEntity } from './user.entity';
import { CreateUserInput } from './user.interface';
import { ErrorHelper } from '@helpers/error.helper';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  findOneById(id: string) {
    return this.userRepository.findOne({ id });
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOne({ email });
  }

  async create(payload: CreateUserInput): Promise<UserDTO> {
    const user = await this.userRepository.findOne({ email: payload.email });
    if (user) {
      throw ErrorHelper.BadRequestException('User already exists');
    }
    const newUser = await new UserEntity({
      ...payload,
      password: await UserEntity.hashPassword(payload.password),
    }).save();
    return newUser.toDto();
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
