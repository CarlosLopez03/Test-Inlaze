import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { CoreModule } from './core/core.module';

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
  ],
})
export class AppModule {}
