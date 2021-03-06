import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';
import { AbstractEntity } from '~/common/entities/abstract.entity';
import { EncryptUtils } from '~/common/utils';

@Entity('user')
export class UserEntity extends AbstractEntity {
  constructor(partial: Partial<UserEntity>) {
    super();
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 60,
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 60,
    nullable: false,
  })
  password: string;

  static async hashPassword(password: string) {
    return EncryptUtils.hash(password);
  }

  @Column({
    name: 'full_name',
    type: 'varchar',
    length: 180,
    nullable: false,
  })
  fullName: string;

  @Column({
    name: 'phone',
    type: 'varchar',
    length: 15,
    nullable: true,
  })
  phone: string;
}
