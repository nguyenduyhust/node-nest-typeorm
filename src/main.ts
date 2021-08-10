import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { EnvConfiguration } from './config/configuration';
import { setupAppSwagger } from './app.swagger';

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

  // cookie parser
  app.use(cookieParser());

  // enable cors
  app.enableCors({ origin: configService.get('allowedHosts') });

  // swagger
  if (configService.get('enableSwagger')) {
    setupAppSwagger(app);
  }
  await app.listen(configService.get('port') || 3000);
}
bootstrap();
