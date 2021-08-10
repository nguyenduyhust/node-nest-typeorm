import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

import { AbstractDTO } from '~/common/dtos/abstract.dto';
import { PaginationDTO } from '~/common/dtos/pagination.dto';
import { OrderByEnum } from '~/common/enums/sorting.enum';
import { UserEntity } from '~/db/entities';
import { UserSortByEnum } from './user.enum';

export interface UserDTOOptions {}

export class UserDTO extends AbstractDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  phone: string;

  constructor(user: UserEntity, options?: UserDTOOptions) {
    const {} = options || {};

    super(user);
    this.id = user.id;
    this.email = user.email;
    this.fullName = user.fullName;
    this.phone = user.phone;
  }
}

export class GetUsersQueryDTO {
  @ApiPropertyOptional({ type: Number, default: 1 })
  @Type(() => Number)
  @IsOptional()
  readonly page: number = 1;

  @ApiPropertyOptional({ type: Number, default: 10 })
  @Type(() => Number)
  @IsOptional()
  readonly limit: number = 10;

  @ApiPropertyOptional({
    enum: UserSortByEnum,
    default: UserSortByEnum.CREATED_AT,
  })
  @IsOptional()
  @IsEnum(UserSortByEnum)
  readonly sortBy: UserSortByEnum = UserSortByEnum.CREATED_AT;

  @ApiPropertyOptional({
    enum: OrderByEnum,
    default: OrderByEnum.DESC,
  })
  @IsOptional()
  @IsEnum(OrderByEnum)
  readonly orderBy: OrderByEnum = OrderByEnum.DESC;

  @ApiPropertyOptional({ type: String, description: 'Filter by email' })
  @IsOptional()
  readonly email?: string;

  @ApiPropertyOptional({ type: String, description: 'Filter by fullName' })
  @IsOptional()
  readonly fullName?: string;
}

export class UserSortingDTO {
  @ApiProperty({ enum: UserSortByEnum })
  sortBy: UserSortByEnum;

  @ApiProperty({ enum: OrderByEnum })
  orderBy: OrderByEnum;
}

export class UserFilteringDTO {
  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  fullName?: string;
}

export class GetUsersResponseDTO {
  @ApiProperty({ isArray: true, type: UserDTO })
  items: UserDTO[];

  @ApiProperty({ type: PaginationDTO })
  pagination: PaginationDTO;

  @ApiProperty({ type: UserSortingDTO })
  sorting: UserSortingDTO;

  @ApiProperty({ type: UserFilteringDTO })
  filtering: UserFilteringDTO;
}
