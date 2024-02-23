import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { Redis } from 'ioredis';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis({
          host: 'redis',
          port: 6379,
          db: 0,
          name: 'test_inlaze',
        });
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
