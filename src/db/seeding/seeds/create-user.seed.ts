import { Connection } from 'typeorm';
import { Seeder, Factory } from 'typeorm-seeding';
import { UserEntity } from '~/modules/user/user.entity';
import { EncryptHelper } from '@helpers/encrypt.helper';
import * as userData from './data/users.json';

export default class CreateEndUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const arr = await Promise.all(
      userData.map(async (item) => ({
        ...item,
        password: await EncryptHelper.hash(item.password),
      })),
    );
    await connection
      .createQueryBuilder()
      .insert()
      .into(UserEntity)
      .values(arr as any)
      .execute();

    // generate random users
    // await factory(UserEntity)().createMany(5);
  }
}
