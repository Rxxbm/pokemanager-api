import { Pokemon } from '@domain/entities/pokemon.entity';
import { IPokemonRepository } from '@domain/repositories/pokemon.repository';
import { AppError } from '@domain/errors/app.error';

interface CreatePokemonDTO {
  id: string;
  name: string;
  type: string;
  hp: number;
  attack: number;
  defense: number;
}

export class CreatePokemonUseCase {
  constructor(private pokemonRepository: IPokemonRepository) {}

  async execute(data: CreatePokemonDTO): Promise<Pokemon> {
    const pokemonAlreadyExists = await this.pokemonRepository.findById(data.id);

    if (pokemonAlreadyExists) {
      throw new AppError('Já existe um Pokémon cadastrado com este ID.', 409);
    }

    const pokemon = new Pokemon(data);
    await this.pokemonRepository.create(pokemon);
    return pokemon;
  }
}
