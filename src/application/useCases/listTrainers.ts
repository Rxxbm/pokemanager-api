import { Trainer } from '@domain/entities/trainer.entity';
import { ITrainerRepository } from '@domain/repositories/trainer.repository';

export class ListTrainersUseCase {
  constructor(private trainerRepository: ITrainerRepository) {}

  async execute(): Promise<Trainer[]> {
    return await this.trainerRepository.findAll();
  }
}
