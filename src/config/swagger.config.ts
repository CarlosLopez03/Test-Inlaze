import { INestApplication } from '@nestjs/common';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Swagger configure in application.
 * @param {INestApplication} app - App.
 */
export function setupSwagger(app: INestApplication) {
  const CONFIG = new DocumentBuilder()
    .setTitle('Prueba INLAZE')
    .addBearerAuth()
    .setDescription('Documentación de los métodos.')
    .setVersion('1.0')
    .addTag('Endpoints')
    .build();

  const DOCUMENT = SwaggerModule.createDocument(app, CONFIG);

  SwaggerModule.setup('api', app, DOCUMENT, {
    explorer: true,
    swaggerOptions: {
      filter: true,
      showRequestDuration: true,
    },
  });
}
