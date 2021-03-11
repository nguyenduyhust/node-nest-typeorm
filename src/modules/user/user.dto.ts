import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

import { AbstractDTO } from '~/common/dtos/abstract.dto';
import { PaginationDTO } from '~/common/dtos/pagination.dto';
import { UserEntity } from './user.entity';

export class UserDTO extends AbstractDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  phone: string;

  constructor(user: UserEntity) {
    super(user);
    this.id = user.id;
    this.email = user.email;
    this.fullName = user.fullName;
    this.phone = user.phone;
  }
}

export class CreateUserDTO {
  @ApiProperty()
  @MaxLength(60, { message: '60' })
  @IsNotEmpty({ message: 'required' })
  email: string;

  @ApiProperty()
  @MinLength(6, { message: '6' })
  @MaxLength(60, { message: '60' })
  @IsNotEmpty({ message: 'required' })
  password: string;

  @ApiProperty()
  @MaxLength(180, { message: '180' })
  @IsNotEmpty({ message: 'required' })
  fullName: string;

  @ApiProperty()
  @IsOptional()
  @MaxLength(15, { message: '15' })
  @IsNotEmpty({ message: 'required' })
  phone: string;
}

export class UserPaginationDTO extends PaginationDTO {
  @ApiProperty({ isArray: true, type: UserDTO })
  items: UserDTO[];
}
