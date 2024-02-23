import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { PublicationsService } from './service/publications.service';
import { PublicationsController } from './controller/publications.controller';
import { PUBLICATIONS_SCHEMA } from './schema/publication.schema';
import {
  ExtractCredentialsMiddleware,
  ValidateSessionMiddleware,
} from 'src/shared/middlewares';
import { RedisModule } from 'src/shared/redis/redis.module';
import { RedisService } from 'src/shared/redis/redis.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Posts',
        schema: PUBLICATIONS_SCHEMA,
        collection: 'Posts',
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
  controllers: [PublicationsController],
  providers: [PublicationsService, RedisService],
})
export class PublicationsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ExtractCredentialsMiddleware, ValidateSessionMiddleware)
      .forRoutes(PublicationsController);
  }
}
