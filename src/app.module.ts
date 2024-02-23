import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { CoreModule } from './core/core.module';
import { EmailCronService } from './shared/cronjob/email-cron.service';
import { RedisModule } from './shared/redis/redis.module';
import { RedisService } from './shared/redis/redis.service';
import { NodemailerService } from './shared/mail/nodemailer.service';

@Module({
  imports: [
    /** Config .env */
    ConfigModule.forRoot(),
    /** Config mongo */
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('TEST_DATABASE'),
      }),
    }),
    CoreModule,
    RedisModule,
  ],
  providers: [RedisService, NodemailerService, EmailCronService],
})
export class AppModule {}
