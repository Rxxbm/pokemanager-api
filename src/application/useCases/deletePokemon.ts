import { IPokemonRepository } from '@domain/repositories/pokemon.repository';
import { AppError } from '@domain/errors/app.error';

export class DeletePokemonUseCase {
  constructor(private pokemonRepository: IPokemonRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.pokemonRepository.findById(id);

    if (!existing) {
      throw new AppError('Pokémon não encontrado no catálogo.', 404);
    }

    await this.pokemonRepository.delete(id);
  }
}
