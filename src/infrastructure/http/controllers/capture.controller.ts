import { Request, Response } from 'express';
import { Capture, MAX_TEAM_SIZE } from '@domain/entities/capture.entity';
import { CapturePokemonUseCase } from '@application/useCases/capturePokemon';
import { GetTrainerTeamUseCase } from '@application/useCases/getTrainerTeam';

function formatCapture(capture: Capture) {
  return {
    id: capture.id,
    pokedexNumber: capture.pokedexNumber,
    name: capture.name,
    types: capture.types,
    imageUrl: capture.imageUrl,
    stats: capture.stats,
    capturedAt: capture.capturedAt,
  };
}

export class CaptureController {
  constructor(
    private capturePokemonUseCase: CapturePokemonUseCase,
    private getTrainerTeamUseCase: GetTrainerTeamUseCase,
  ) {}

  async capture(req: Request, res: Response): Promise<Response> {
    const trainerId = String(req.params.trainerId);
    const { pokemonName } = req.body;

    const capture = await this.capturePokemonUseCase.execute({
      trainerId,
      pokemonName,
    });

    return res.status(201).json({
      message: 'Pokémon capturado com sucesso!',
      data: formatCapture(capture),
    });
  }

  async team(req: Request, res: Response): Promise<Response> {
    const trainerId = String(req.params.trainerId);
    const team = await this.getTrainerTeamUseCase.execute(trainerId);

    return res.status(200).json({
      data: {
        trainerId,
        size: team.length,
        maxSize: MAX_TEAM_SIZE,
        pokemons: team.map(formatCapture),
      },
    });
  }
}
