import { ListPokemonsUseCase } from '@application/useCases/listPokemons';
import { GetPokemonByIdUseCase } from '@application/useCases/getPokemonById';
import { CreatePokemonUseCase } from '@application/useCases/createPokemon';
import { UpdatePokemonUseCase } from '@application/useCases/updatePokemon';
import { DeletePokemonUseCase } from '@application/useCases/deletePokemon';
import { UpdatePokemonLevelUseCase } from '@application/useCases/updatePokemonLevel';
import { SearchPokemonsByNameUseCase } from '@application/useCases/searchPokemonsByName';
import { CountPokemonsUseCase } from '@application/useCases/countPokemons';
import { PokemonController } from '@infrastructure/http/controllers/pokemon.controller';
import { PrismaPokemonRepository } from '@infrastructure/database/prisma/prismaPokemon.repository';

// Implementação que se conecta ao PostgreSQL real
const pokemonRepository = new PrismaPokemonRepository();

export function makePokemonController(): PokemonController {
  const listPokemonsUseCase = new ListPokemonsUseCase(pokemonRepository);
  const getPokemonByIdUseCase = new GetPokemonByIdUseCase(pokemonRepository);
  const createPokemonUseCase = new CreatePokemonUseCase(pokemonRepository);
  const updatePokemonUseCase = new UpdatePokemonUseCase(pokemonRepository);
  const deletePokemonUseCase = new DeletePokemonUseCase(pokemonRepository);
  const updatePokemonLevelUseCase = new UpdatePokemonLevelUseCase(
    pokemonRepository,
  );
  const searchPokemonsByNameUseCase = new SearchPokemonsByNameUseCase(
    pokemonRepository,
  );
  const countPokemonsUseCase = new CountPokemonsUseCase(pokemonRepository);

  return new PokemonController(
    listPokemonsUseCase,
    getPokemonByIdUseCase,
    createPokemonUseCase,
    updatePokemonUseCase,
    deletePokemonUseCase,
    updatePokemonLevelUseCase,
    searchPokemonsByNameUseCase,
    countPokemonsUseCase,
  );
}
