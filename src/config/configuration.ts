import * as Joi from 'joi';
import { StringUtils } from '~/common/utils';

export interface EnvConfiguration {
  nodeEnv: 'development' | 'staging' | 'production';
  port: number;
  apiUrl: string;
  allowedHosts: Array<string>;
  enableSwagger: boolean;
  secret: string;
  tokenExpires: number;
  refreshTokenExpires: string;

  databaseType: string;
  databaseHost: string;
  databaseName: string;
  databaseUsername: string;
  databasePassword: string;
  databaseRootPassword: string;
  databasePort: number;
}

const validationSchema = Joi.object<any, EnvConfiguration>({
  nodeEnv: Joi.string().valid('development', 'staging', 'production').required(),
  apiUrl: Joi.string().required(),
  port: Joi.number().required(),
  allowedHosts: Joi.array().items(Joi.string()),
  enableSwagger: Joi.boolean().required(),
  secret: Joi.string().required(),
  tokenExpires: Joi.number().required(),
  refreshTokenExpires: Joi.string().required(),

  databaseType: Joi.string().required(),
  databaseHost: Joi.string().required(),
  databaseName: Joi.string().required(),
  databaseUsername: Joi.string().required(),
  databasePassword: Joi.string().required(),
  databaseRootPassword: Joi.string().required(),
  databasePort: Joi.number().required(),
});

export default () => {
  const env: Record<string, any> = {};
  for (const key in process.env) {
    env[key] = StringUtils.getEnvWithoutComment(process.env[key] || '');
  }

  const envConfiguration: Partial<EnvConfiguration> = {
    nodeEnv: env.NODE_ENV || 'development',
    apiUrl: env.API_URL,
    port: parseInt(env.PORT) || 3000,
    allowedHosts: env.ALLOWED_HOSTS ? env.ALLOWED_HOSTS.replace(/ /g, '').split(',') : [],
    enableSwagger: env.ENABLE_SWAGGER ? ['true', 1, true].includes(env.ENABLE_SWAGGER) : false,
    secret: env.SECRET,
    tokenExpires: parseInt(env.TOKEN_EXPIRES) || 3600,
    refreshTokenExpires: env.REFRESH_TOKEN_EXPIRES || '1d',

    databaseType: env.DATABASE_TYPE,
    databaseHost: env.DATABASE_HOST,
    databaseName: env.DATABASE_NAME,
    databaseUsername: env.DATABASE_USERNAME,
    databasePassword: env.DATABASE_PASSWORD,
    databaseRootPassword: env.DATABASE_ROOT_PASSWORD,
    databasePort: parseInt(env.DATABASE_PORT),
  };

  const { error } = validationSchema.validate(envConfiguration);
  if (error) {
    throw new Error(`ENV configuration error: ${error.message}`);
  }

  return envConfiguration;
};
