import { NestFactory } from '@nestjs/core';

import { Logger, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // Init logger
  const LOGGER = new Logger();

  // Init Swagger
  setupSwagger(app);

  await app.listen(3000);
  // Config Validation for Dtos
  app.useGlobalPipes(new ValidationPipe());

  // Log port
  LOGGER.log(`Server in: ${await app.getUrl()}`);
}
bootstrap();
