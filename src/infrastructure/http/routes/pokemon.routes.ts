import { Router } from 'express';
import { makePokemonController } from '@main/factories/makePokemonController.factory';

const pokemonRoutes = Router();
const pokemonController = makePokemonController();

pokemonRoutes.get('/', (req, res) => pokemonController.list(req, res));
pokemonRoutes.get('/:id', (req, res) => pokemonController.getById(req, res));
pokemonRoutes.post('/', (req, res) => pokemonController.create(req, res));
pokemonRoutes.put('/:id', (req, res) => pokemonController.update(req, res));
pokemonRoutes.delete('/:id', (req, res) => pokemonController.delete(req, res));

export { pokemonRoutes };
