import { Router } from 'express';
import { makePokedexController } from '@main/factories/makePokedexController.factory';
import { validateRequest } from '../middlewares/validateRequest';
import { pokedexSearchQuerySchema } from '../schemas/pokedex.schemas';

const pokedexRoutes = Router();
const pokedexController = makePokedexController();

pokedexRoutes.get(
  '/search',
  validateRequest({ query: pokedexSearchQuerySchema }),
  (req, res) => pokedexController.search(req, res),
);

export { pokedexRoutes };
