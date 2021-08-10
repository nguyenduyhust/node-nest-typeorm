import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';

import { UserDTO } from './user.dto';
import { UserEntity } from './user.entity';
import { CreateUserInput } from './user.interface';
import { ErrorUtils } from '~/common/utils';

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
      throw ErrorUtils.BadRequestException('User already exists');
    }
    const newUser = await new UserEntity({
      ...payload,
      password: await UserEntity.hashPassword(payload.password),
    }).save();
    return new UserDTO(newUser);
  }

  async getUsers(options: IPaginationOptions): Promise<Pagination<UserDTO>> {
    const queryBuilder = this.userRepository.createQueryBuilder('u');
    queryBuilder.orderBy('u.createdAt', 'DESC');

    const records = await paginate<UserEntity>(queryBuilder, options);
    const items: UserDTO[] = records.items.map((item) => ({ ...new UserDTO(item) }));

    return {
      ...records,
      items,
    };
  }
}
