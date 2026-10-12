import { Trainer } from '@domain/entities/trainer.entity';
import { ITrainerRepository } from '@domain/repositories/trainer.repository';
import { AppError } from '@domain/errors/app.error';

interface UpdateTrainerDTO {
  name?: string;
  email?: string;
  city?: string;
}

export class UpdateTrainerUseCase {
  constructor(private trainerRepository: ITrainerRepository) {}

  async execute(id: string, data: UpdateTrainerDTO): Promise<Trainer> {
    const existing = await this.trainerRepository.findById(id);

    if (!existing) {
      throw new AppError('Treinador não encontrado.', 404);
    }

    const updated = new Trainer({
      id: existing.id,
      name: data.name ?? existing.name,
      email: data.email ?? existing.email,
      city: data.city ?? existing.city,
    });

    await this.trainerRepository.update(updated);
    return updated;
  }
}
