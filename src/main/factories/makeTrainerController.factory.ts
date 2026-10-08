import { ListTrainersUseCase } from '@application/useCases/listTrainers';
import { GetTrainerByIdUseCase } from '@application/useCases/getTrainerById';
import { CreateTrainerUseCase } from '@application/useCases/createTrainer';
import { UpdateTrainerUseCase } from '@application/useCases/updateTrainer';
import { TrainerController } from '@infrastructure/http/controllers/trainer.controller';
import { PrismaTrainerRepository } from '@infrastructure/database/prisma/prismaTrainer.repository';

const trainerRepository = new PrismaTrainerRepository();

export function makeTrainerController(): TrainerController {
  const listTrainersUseCase = new ListTrainersUseCase(trainerRepository);
  const getTrainerByIdUseCase = new GetTrainerByIdUseCase(trainerRepository);
  const createTrainerUseCase = new CreateTrainerUseCase(trainerRepository);
  const updateTrainerUseCase = new UpdateTrainerUseCase(trainerRepository);

  return new TrainerController(
    listTrainersUseCase,
    getTrainerByIdUseCase,
    createTrainerUseCase,
    updateTrainerUseCase,
  );
}
