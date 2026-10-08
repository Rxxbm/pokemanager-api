import { Pokemon } from '@domain/entities/pokemon.entity';
import { IPokemonRepository } from '@domain/repositories/pokemon.repository';
import { ITrainerRepository } from '@domain/repositories/trainer.repository';
import { AppError } from '@domain/errors/app.error';

interface CreatePokemonDTO {
  id: string;
  name: string;
  type: string;
  hp: number;
  attack: number;
  defense: number;
  level?: number;
  trainerId?: string;
}

export class CreatePokemonUseCase {
  constructor(
    private pokemonRepository: IPokemonRepository,
    private trainerRepository: ITrainerRepository,
  ) {}

  async execute(data: CreatePokemonDTO): Promise<Pokemon> {
    const pokemonAlreadyExists = await this.pokemonRepository.findById(data.id);

    if (pokemonAlreadyExists) {
      throw new AppError('Já existe um Pokémon cadastrado com este ID.', 409);
    }

    if (data.trainerId) {
      const trainer = await this.trainerRepository.findById(data.trainerId);

      if (!trainer) {
        throw new AppError('Treinador não encontrado.', 404);
      }
    }

    const pokemon = new Pokemon({ ...data, level: data.level ?? 1 });
    await this.pokemonRepository.create(pokemon);
    return pokemon;
  }
}
