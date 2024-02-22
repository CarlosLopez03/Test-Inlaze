import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { UsersModule } from '../users/users.module';
import { ExtractCredentialsMiddleware } from 'src/shared/middlewares/extract-credentials.middleware';
import { RedisModule } from '../../shared/redis/redis.module';
import { RedisService } from 'src/shared/redis/redis.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_TOKEN'),
      }),
    }),
    RedisModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, RedisService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ExtractCredentialsMiddleware).forRoutes(
      {
        path: 'auth/refresh',
        method: RequestMethod.POST,
      },
      { path: 'auth/logout', method: RequestMethod.POST },
    );
  }
}
