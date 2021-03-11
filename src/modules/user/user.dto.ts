import { ApiProperty } from '@nestjs/swagger';

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

export class UserPaginationDTO extends PaginationDTO {
  @ApiProperty({ isArray: true, type: UserDTO })
  items: UserDTO[];
}
