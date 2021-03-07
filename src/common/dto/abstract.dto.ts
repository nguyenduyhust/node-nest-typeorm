import { ApiProperty } from '@nestjs/swagger';
import { AbstractEntity } from '~/common/entity/abstract.entity';

export class AbstractDTO {
  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;

  constructor(entity: AbstractEntity<AbstractDTO>) {
    this.createdAt = entity.createdAt.toISOString();
    this.updatedAt = entity.updatedAt.toISOString();
  }
}
