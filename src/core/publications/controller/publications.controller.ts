import { Controller } from '@nestjs/common';
import { PublicationsService } from '../service/publications.service';

@Controller('publications')
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) {}
}
