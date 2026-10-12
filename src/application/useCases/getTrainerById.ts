import { Trainer } from '@domain/entities/trainer.entity';
import { ITrainerRepository } from '@domain/repositories/trainer.repository';
import { AppError } from '@domain/errors/app.error';

export class GetTrainerByIdUseCase {
  constructor(private trainerRepository: ITrainerRepository) {}

  async execute(id: string): Promise<Trainer> {
    const trainer = await this.trainerRepository.findById(id);

    if (!trainer) {
      throw new AppError('Treinador não encontrado.', 404);
    }

    return trainer;
  }
}
