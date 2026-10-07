import { Router } from 'express';
import { makeTrainerController } from '@main/factories/makeTrainerController.factory';

const trainerRoutes = Router();
const trainerController = makeTrainerController();

trainerRoutes.get('/', (req, res) => trainerController.list(req, res));
trainerRoutes.get('/:id', (req, res) => trainerController.getById(req, res));
trainerRoutes.post('/', (req, res) => trainerController.create(req, res));
trainerRoutes.put('/:id', (req, res) => trainerController.update(req, res));

export { trainerRoutes };
