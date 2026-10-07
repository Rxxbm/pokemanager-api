import { IPokemonRepository } from '@domain/repositories/pokemon.repository';

export class CountPokemonsUseCase {
  constructor(private pokemonRepository: IPokemonRepository) {}

  async execute(): Promise<number> {
    return await this.pokemonRepository.count();
  }
}
