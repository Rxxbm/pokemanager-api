import {
  IPokeApiGateway,
  PokedexPokemon,
} from '@domain/providers/pokeApi.gateway';
import { NotFoundError } from '@domain/errors/domain.errors';

export class SearchPokedexUseCase {
  constructor(private pokeApiGateway: IPokeApiGateway) {}

  async execute(name: string): Promise<PokedexPokemon> {
    const pokemon = await this.pokeApiGateway.findByName(name);

    if (!pokemon) {
      throw new NotFoundError(`Pokémon "${name}" não encontrado na PokéAPI.`);
    }

    return pokemon;
  }
}
