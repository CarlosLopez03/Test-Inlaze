import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { UsersService } from './service/users.service';
import { UsersController } from './controller/users.controller';
import { USER_SCHEMA } from './schema/user.schema';
import {
  ExtractCredentialsMiddleware,
  ValidateSessionMiddleware,
} from 'src/shared/middlewares';
import { RedisService } from 'src/shared/redis/redis.service';
import { RedisModule } from 'src/shared/redis/redis.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Users',
        schema: USER_SCHEMA,
        collection: 'Users',
      },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_TOKEN'),
      }),
    }),
    RedisModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, RedisService],
  exports: [MongooseModule, UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ExtractCredentialsMiddleware, ValidateSessionMiddleware)
      .forRoutes(UsersController);
  }
}
