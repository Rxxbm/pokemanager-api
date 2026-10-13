import { Capture } from '@domain/entities/capture.entity';
import { ICaptureRepository } from '@domain/repositories/capture.repository';
import { ITrainerRepository } from '@domain/repositories/trainer.repository';
import { NotFoundError } from '@domain/errors/domain.errors';

export class GetTrainerTeamUseCase {
  constructor(
    private trainerRepository: ITrainerRepository,
    private captureRepository: ICaptureRepository,
  ) {}

  async execute(trainerId: string): Promise<Capture[]> {
    const trainer = await this.trainerRepository.findById(trainerId);

    if (!trainer) {
      throw new NotFoundError('Treinador não encontrado.');
    }

    return await this.captureRepository.findActiveByTrainer(trainerId);
  }
}
