import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { RouterModule } from 'nest-router';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '@config/configuration';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthMiddleware } from '~/middlewares/auth.middleware';
import { AuthService } from './modules/auth/auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: configService.get('database.type') as any,
          host: configService.get('database.host'),
          port: configService.get('database.port'),
          username: configService.get('database.username'),
          password: configService.get('database.password'),
          database: configService.get<string>('database.name'),
          // try autoload entities
          autoLoadEntities: true,
          // use cli and run schema:sync is better for secured data
          synchronize: false,
        };
      },
      inject: [ConfigService],
    }),
    RouterModule.forRoutes([
      { path: 'api', module: AuthModule },
      { path: 'api', module: UserModule },
    ]),
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [AuthService],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({ path: 'api/users', method: RequestMethod.ALL });
  }
}
