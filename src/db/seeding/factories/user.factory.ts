import { define } from 'typeorm-seeding';
import * as Faker from 'faker';
import { UserEntity } from '~/db/entities';

define(UserEntity, () => {
  return new UserEntity({
    email: Faker.internet.email().toLowerCase(),
    password: Faker.internet.password(),
    fullName: `${Faker.name.firstName()} ${Faker.name.lastName()}`,
    createdAt: Faker.date.recent(),
    updatedAt: Faker.date.recent(),
  });
});
