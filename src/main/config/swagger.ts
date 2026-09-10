import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import { openapiDocument } from '@main/config/openapi';

export const setupSwagger = (app: Express): void => {
  app.use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(openapiDocument as swaggerUi.JsonObject, {
      customSiteTitle: 'PokéManager API — Docs',
    }),
  );
};
