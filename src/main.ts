import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { EnvConfiguration } from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  const configService: ConfigService<EnvConfiguration> = app.get(ConfigService);
  app.use(cookieParser());
  // swagger
  if (configService.get('nodeEnv') === 'development') {
    const options = new DocumentBuilder()
      .setTitle('Node Nest Typeorm API')
      .setDescription('Node Nest Typeorm API')
      .setVersion('0.1')
      .addBearerAuth()
      .addCookieAuth('jwt-token')
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api/doc', app, document);
  }
  await app.listen(configService.get('port') || 3000);
}
bootstrap();
