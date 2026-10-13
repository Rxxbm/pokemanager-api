import { CapturePokemonUseCase } from '@application/useCases/capturePokemon';
import { GetTrainerTeamUseCase } from '@application/useCases/getTrainerTeam';
import { CaptureController } from '@infrastructure/http/controllers/capture.controller';
import { PrismaTrainerRepository } from '@infrastructure/database/prisma/prismaTrainer.repository';
import { PrismaCaptureRepository } from '@infrastructure/database/prisma/prismaCapture.repository';
import { FetchPokeApiGateway } from '@infrastructure/providers/fetchPokeApi.gateway';

const trainerRepository = new PrismaTrainerRepository();
const captureRepository = new PrismaCaptureRepository();
const pokeApiGateway = new FetchPokeApiGateway();

export function makeCaptureController(): CaptureController {
  const capturePokemonUseCase = new CapturePokemonUseCase(
    trainerRepository,
    captureRepository,
    pokeApiGateway,
  );
  const getTrainerTeamUseCase = new GetTrainerTeamUseCase(
    trainerRepository,
    captureRepository,
  );

  return new CaptureController(capturePokemonUseCase, getTrainerTeamUseCase);
}
