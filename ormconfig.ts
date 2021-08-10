import * as dotenv from 'dotenv';
import { StringUtils } from './src/common/utils';
import { ConnectionOptions } from 'typeorm-seeding';

dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}`,
});

const env: Record<string, any> = {};
for (const key in process.env) {
  env[key] = StringUtils.getEnvWithoutComment(process.env[key] || '');
}

const connectionOptions: ConnectionOptions = {
  type: env.DATABASE_TYPE as any,
  host: env.DATABASE_HOST,
  port: parseInt(env.DATABASE_PORT),
  username: env.DATABASE_USERNAME,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE_NAME,
  synchronize: false,
  logging: true,
  entities: ['src/db/**/*.entity.ts'],
  migrations: ['src/db/migrations/**/*.ts'],
  cli: {
    migrationsDir: 'src/db/migrations',
  },
  seeds: ['src/db/seeding/seeds/**/*.ts'],
  factories: ['src/db/seeding/factories/**/*.ts'],
};

export default connectionOptions;
