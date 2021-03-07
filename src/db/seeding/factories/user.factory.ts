import { define } from 'typeorm-seeding';
import { UserEntity } from '~/modules/user/user.entity';
import * as Faker from 'faker';

define(UserEntity, () => {
  return new UserEntity({
    email: Faker.internet.email().toLowerCase(),
    password: Faker.internet.password(),
    fullName: `${Faker.name.firstName()} ${Faker.name.lastName()}`,
    createdAt: Faker.date.recent(),
    updatedAt: Faker.date.recent(),
  });
});
