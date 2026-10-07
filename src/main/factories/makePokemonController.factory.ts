import { ListPokemonsUseCase } from '@application/useCases/listPokemons';
import { GetPokemonByIdUseCase } from '@application/useCases/getPokemonById';
import { CreatePokemonUseCase } from '@application/useCases/createPokemon';
import { UpdatePokemonUseCase } from '@application/useCases/updatePokemon';
import { DeletePokemonUseCase } from '@application/useCases/deletePokemon';
import { PokemonController } from '@infrastructure/http/controllers/pokemon.controller';
import { PgPokemonRepository } from '@infrastructure/database/postgres/pgPokemon.repository';

// Implementação que se conecta ao PostgreSQL real
const pokemonRepository = new PgPokemonRepository();

export function makePokemonController(): PokemonController {
  const listPokemonsUseCase = new ListPokemonsUseCase(pokemonRepository);
  const getPokemonByIdUseCase = new GetPokemonByIdUseCase(pokemonRepository);
  const createPokemonUseCase = new CreatePokemonUseCase(pokemonRepository);
  const updatePokemonUseCase = new UpdatePokemonUseCase(pokemonRepository);
  const deletePokemonUseCase = new DeletePokemonUseCase(pokemonRepository);

  return new PokemonController(
    listPokemonsUseCase,
    getPokemonByIdUseCase,
    createPokemonUseCase,
    updatePokemonUseCase,
    deletePokemonUseCase,
  );
}
