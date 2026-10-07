import { randomUUID } from 'node:crypto';
import { Trainer } from '@domain/entities/trainer.entity';
import { ITrainerRepository } from '@domain/repositories/trainer.repository';

interface CreateTrainerDTO {
  name: string;
  email: string;
  city: string;
}

export class CreateTrainerUseCase {
  constructor(private trainerRepository: ITrainerRepository) {}

  async execute(data: CreateTrainerDTO): Promise<Trainer> {
    const trainer = new Trainer({ id: randomUUID(), ...data });
    await this.trainerRepository.create(trainer);
    return trainer;
  }
}
