import { Connection } from 'typeorm';
import { Seeder, Factory } from 'typeorm-seeding';
import { UserEntity } from '~/modules/user/user.entity';
import { EncryptHelper } from '@helpers/encrypt.helper';
import * as userData from './data/users.json';

export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const userRepository = connection.getRepository(UserEntity);

    if (await userRepository.findOne()) {
      return;
    }

    const queryRunner = connection.createQueryRunner();
    await queryRunner.startTransaction();

    const users = (
      await Promise.all(
        userData.map(async (item) => ({
          ...item,
          password: await EncryptHelper.hash(item.password),
        })),
      )
    ).map((item) => new UserEntity(item));

    try {
      await queryRunner.manager.save(users);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
