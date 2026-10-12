import { Pokemon } from '@domain/entities/pokemon.entity';
import { IPokemonRepository } from '@domain/repositories/pokemon.repository';
import { AppError } from '@domain/errors/app.error';

export class SearchPokemonsByNameUseCase {
  constructor(private pokemonRepository: IPokemonRepository) {}

  async execute(term: string): Promise<Pokemon[]> {
    if (!term || term.trim().length === 0) {
      throw new AppError('O termo de busca é obrigatório.', 400);
    }

    return await this.pokemonRepository.searchByName(term.trim());
  }
}
