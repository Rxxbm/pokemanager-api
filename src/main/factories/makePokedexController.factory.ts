import { SearchPokedexUseCase } from '@application/useCases/searchPokedex';
import { PokedexController } from '@infrastructure/http/controllers/pokedex.controller';
import { FetchPokeApiGateway } from '@infrastructure/providers/fetchPokeApi.gateway';

// Implementação que consulta a PokéAPI oficial via fetch
const pokeApiGateway = new FetchPokeApiGateway();

export function makePokedexController(): PokedexController {
  const searchPokedexUseCase = new SearchPokedexUseCase(pokeApiGateway);

  return new PokedexController(searchPokedexUseCase);
}
