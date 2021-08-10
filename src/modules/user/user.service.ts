import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, IPaginationOptions } from 'nestjs-typeorm-paginate';

import { GetUsersResponseDTO, UserDTO } from './user.dto';
import { UserFilteringOptions, UserSortingOptions } from './user.interface';
import { UserEntity } from '~/db/entities';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getMany(
    paginationOptions: IPaginationOptions,
    sortingOptions: UserSortingOptions,
    filteringOptions: UserFilteringOptions,
  ): Promise<GetUsersResponseDTO> {
    const { sortBy, orderBy } = sortingOptions;
    const { email, fullName } = filteringOptions;
    const queryBuilder = this.userRepository.createQueryBuilder('qb');

    if (email && email.length > 0) {
      queryBuilder.andWhere('qb.email like :email', { email: `%${email}%` });
    }

    if (fullName && fullName.length > 0) {
      queryBuilder.andWhere('qb.fullName like :fullName', { fullName: `%${fullName}%` });
    }

    queryBuilder.orderBy(`qb.${sortBy}`, orderBy);

    const records = await paginate<UserEntity>(queryBuilder, paginationOptions);
    const items: UserDTO[] = records.items.map((item) => ({ ...new UserDTO(item) }));

    return {
      items,
      pagination: records.meta,
      sorting: sortingOptions,
      filtering: filteringOptions,
    };
  }
}
