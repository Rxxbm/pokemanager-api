import { Pokemon } from '@domain/entities/pokemon.entity';
import {
  IPokemonRepository,
  ListPokemonsFilters,
} from '@domain/repositories/pokemon.repository';

export class ListPokemonsUseCase {
  constructor(private pokemonRepository: IPokemonRepository) {}

  async execute(filters?: ListPokemonsFilters): Promise<Pokemon[]> {
    return await this.pokemonRepository.findAll(filters);
  }
}
