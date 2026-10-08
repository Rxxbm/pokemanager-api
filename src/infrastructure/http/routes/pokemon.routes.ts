import { Router } from 'express';
import { makePokemonController } from '@main/factories/makePokemonController.factory';
import { validateRequest } from '../middlewares/validateRequest';
import {
  createPokemonSchema,
  listPokemonsQuerySchema,
  pokemonIdParamsSchema,
  searchPokemonsQuerySchema,
  updatePokemonLevelSchema,
  updatePokemonSchema,
} from '../schemas/pokemon.schemas';

const pokemonRoutes = Router();
const pokemonController = makePokemonController();

pokemonRoutes.get(
  '/',
  validateRequest({ query: listPokemonsQuerySchema }),
  (req, res) => pokemonController.list(req, res),
);
pokemonRoutes.get(
  '/search',
  validateRequest({ query: searchPokemonsQuerySchema }),
  (req, res) => pokemonController.search(req, res),
);
pokemonRoutes.get('/count', (req, res) => pokemonController.count(req, res));
pokemonRoutes.get(
  '/:id',
  validateRequest({ params: pokemonIdParamsSchema }),
  (req, res) => pokemonController.getById(req, res),
);
pokemonRoutes.post(
  '/',
  validateRequest({ body: createPokemonSchema }),
  (req, res) => pokemonController.create(req, res),
);
pokemonRoutes.put(
  '/:id',
  validateRequest({ params: pokemonIdParamsSchema, body: updatePokemonSchema }),
  (req, res) => pokemonController.update(req, res),
);
pokemonRoutes.patch(
  '/:id/level',
  validateRequest({
    params: pokemonIdParamsSchema,
    body: updatePokemonLevelSchema,
  }),
  (req, res) => pokemonController.updateLevel(req, res),
);
pokemonRoutes.delete(
  '/:id',
  validateRequest({ params: pokemonIdParamsSchema }),
  (req, res) => pokemonController.delete(req, res),
);

export { pokemonRoutes };
