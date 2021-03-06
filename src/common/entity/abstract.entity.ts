import { BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { AbstractDTO } from '~/common/dto/abstract.dto';

export abstract class AbstractEntity<
  DTO extends AbstractDTO = AbstractDTO,
  DTOOption = any
> extends BaseEntity {
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  updatedAt: Date;

  dtoClass: new (entity: AbstractEntity, options?: any) => DTO;

  toDto(options?: DTOOption): DTO {
    return new this.dtoClass(this, options);
  }
}
