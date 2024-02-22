import { Module } from '@nestjs/common';
import { PublicationsService } from './service/publications.service';
import { PublicationsController } from './controller/publications.controller';

@Module({
  controllers: [PublicationsController],
  providers: [PublicationsService],
})
export class PublicationsModule {}
