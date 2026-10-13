import { randomUUID } from 'node:crypto';
import { Capture, MAX_TEAM_SIZE } from '@domain/entities/capture.entity';
import { ICaptureRepository } from '@domain/repositories/capture.repository';
import { ITrainerRepository } from '@domain/repositories/trainer.repository';
import { IPokeApiGateway } from '@domain/providers/pokeApi.gateway';
import { NotFoundError, TeamFullError } from '@domain/errors/domain.errors';

interface CapturePokemonDTO {
  trainerId: string;
  pokemonName: string;
}

export class CapturePokemonUseCase {
  constructor(
    private trainerRepository: ITrainerRepository,
    private captureRepository: ICaptureRepository,
    private pokeApiGateway: IPokeApiGateway,
  ) {}

  async execute({
    trainerId,
    pokemonName,
  }: CapturePokemonDTO): Promise<Capture> {
    const trainer = await this.trainerRepository.findById(trainerId);

    if (!trainer) {
      throw new NotFoundError('Treinador não encontrado.');
    }

    // Valida a regra antes de chamar a API externa (evita requisição à toa)
    const teamSize =
      await this.captureRepository.countActiveByTrainer(trainerId);

    if (teamSize >= MAX_TEAM_SIZE) {
      throw new TeamFullError(MAX_TEAM_SIZE);
    }

    const pokemon = await this.pokeApiGateway.findByName(pokemonName);

    if (!pokemon) {
      throw new NotFoundError(
        `Pokémon "${pokemonName}" não encontrado na PokéAPI.`,
      );
    }

    const capture = new Capture({
      id: randomUUID(),
      trainerId,
      pokedexNumber: pokemon.pokedexNumber,
      name: pokemon.name,
      types: pokemon.types,
      imageUrl: pokemon.imageUrl,
      stats: {
        hp: pokemon.stats.hp,
        attack: pokemon.stats.attack,
        defense: pokemon.stats.defense,
        speed: pokemon.stats.speed,
      },
      active: true,
      capturedAt: new Date(),
    });

    await this.captureRepository.create(capture);
    return capture;
  }
}
