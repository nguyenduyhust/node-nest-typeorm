import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UserModule } from './modules/user/user.module';
import { version } from '../package.json';
import { AuthModule } from './modules/auth/auth.module';

export const setupAppSwagger = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle('Node nest typeorm')
    .setDescription('Node nest typeorm Api')
    .setVersion(version)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options, {
    include: [UserModule, AuthModule],
  });

  SwaggerModule.setup('api/doc', app, document);
};
