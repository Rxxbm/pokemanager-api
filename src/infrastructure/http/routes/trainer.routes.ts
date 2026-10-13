import { Router } from 'express';
import { makeTrainerController } from '@main/factories/makeTrainerController.factory';
import { makeCaptureController } from '@main/factories/makeCaptureController.factory';
import { validateRequest } from '../middlewares/validateRequest';
import {
  createTrainerSchema,
  trainerIdParamsSchema,
  updateTrainerSchema,
} from '../schemas/trainer.schemas';
import {
  capturePokemonSchema,
  trainerCaptureParamsSchema,
} from '../schemas/capture.schemas';

const trainerRoutes = Router();
const trainerController = makeTrainerController();
const captureController = makeCaptureController();

trainerRoutes.get('/', (req, res) => trainerController.list(req, res));
trainerRoutes.get(
  '/:id',
  validateRequest({ params: trainerIdParamsSchema }),
  (req, res) => trainerController.getById(req, res),
);
trainerRoutes.post(
  '/',
  validateRequest({ body: createTrainerSchema }),
  (req, res) => trainerController.create(req, res),
);
trainerRoutes.put(
  '/:id',
  validateRequest({ params: trainerIdParamsSchema, body: updateTrainerSchema }),
  (req, res) => trainerController.update(req, res),
);

// Captura de Pokémons (integração com a PokéAPI) e time do treinador
trainerRoutes.post(
  '/:trainerId/captures',
  validateRequest({
    params: trainerCaptureParamsSchema,
    body: capturePokemonSchema,
  }),
  (req, res) => captureController.capture(req, res),
);
trainerRoutes.get(
  '/:trainerId/team',
  validateRequest({ params: trainerCaptureParamsSchema }),
  (req, res) => captureController.team(req, res),
);

export { trainerRoutes };
