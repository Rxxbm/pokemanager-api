import { Pokemon } from '@domain/entities/pokemon.entity';
import { IPokemonRepository } from '@domain/repositories/pokemon.repository';
import { AppError } from '@domain/errors/app.error';

interface UpdatePokemonDTO {
  name?: string;
  type?: string;
  hp?: number;
  attack?: number;
  defense?: number;
}

export class UpdatePokemonUseCase {
  constructor(private pokemonRepository: IPokemonRepository) {}

  async execute(id: string, data: UpdatePokemonDTO): Promise<Pokemon> {
    const existing = await this.pokemonRepository.findById(id);

    if (!existing) {
      throw new AppError('Pokémon não encontrado no catálogo.', 404);
    }

    const updated = new Pokemon({
      id: existing.id,
      name: data.name ?? existing.name,
      type: data.type ?? existing.type,
      hp: data.hp ?? existing.hp,
      attack: data.attack ?? existing.attack,
      defense: data.defense ?? existing.defense,
    });

    await this.pokemonRepository.update(updated);
    return updated;
  }
}
