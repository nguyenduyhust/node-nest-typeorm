import { StringHelper } from '~/helpers/string.helper';

export default () => {
  const env: Record<string, any> = {};
  for (const key in process.env) {
    env[key] = StringHelper.getEnvWithoutComment(process.env[key] || '');
  }

  return {
    app: {
      port: parseInt(env.PORT, 10) || 3000,
      environment: env.NODE_ENV || 'development',
      apiUrl: env.API_URL || 'http://localhost:3000',
      auth: {
        secret: env.SECRET,
        tokenExpires: parseInt(env.TOKEN_EXPIRES) || 3600,
        refreshTokenExpires: env.REFRESH_TOKEN_EXPIRES || '1d',
      },
    },
    database: {
      type: env.DATABASE_TYPE || 'NEED TO CONFIGURED',
      host: env.DATABASE_HOST || 'NEED TO CONFIGURED',
      port: parseInt(env.MYSQL_PORT) || 'NEED TO CONFIGURED',
      name: env.MYSQL_DATABASE || 'NEED TO CONFIGURED',
      username: env.MYSQL_USER || 'NEED TO CONFIGURED',
      password: env.MYSQL_PASSWORD || 'NEED TO CONFIGURED',
    },
  };
};
