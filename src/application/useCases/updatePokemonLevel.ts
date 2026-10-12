import { Pokemon, MAX_LEVEL, MIN_LEVEL } from '@domain/entities/pokemon.entity';
import { IPokemonRepository } from '@domain/repositories/pokemon.repository';
import { AppError } from '@domain/errors/app.error';

export class UpdatePokemonLevelUseCase {
  constructor(private pokemonRepository: IPokemonRepository) {}

  async execute(id: string, newLevel: number): Promise<Pokemon> {
    if (
      !Number.isInteger(newLevel) ||
      newLevel < MIN_LEVEL ||
      newLevel > MAX_LEVEL
    ) {
      throw new AppError(
        `O nível deve ser um inteiro entre ${MIN_LEVEL} e ${MAX_LEVEL}.`,
        400,
      );
    }

    const existing = await this.pokemonRepository.findById(id);

    if (!existing) {
      throw new AppError('Pokémon não encontrado no catálogo.', 404);
    }

    await this.pokemonRepository.updateLevel(id, newLevel);

    return new Pokemon({ ...existing.toProps(), level: newLevel });
  }
}
