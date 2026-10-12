import { Router } from 'express';
import { makeTrainerController } from '@main/factories/makeTrainerController.factory';
import { validateRequest } from '../middlewares/validateRequest';
import {
  createTrainerSchema,
  trainerIdParamsSchema,
  updateTrainerSchema,
} from '../schemas/trainer.schemas';

const trainerRoutes = Router();
const trainerController = makeTrainerController();

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

export { trainerRoutes };
