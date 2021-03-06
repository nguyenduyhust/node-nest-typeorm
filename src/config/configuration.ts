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
    },
  };
};
