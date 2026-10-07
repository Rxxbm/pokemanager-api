import { Trainer } from '@domain/entities/trainer.entity';

export interface ITrainerRepository {
  create(trainer: Trainer): Promise<void>;
  update(trainer: Trainer): Promise<void>;
  findById(id: string): Promise<Trainer | null>;
  findAll(): Promise<Trainer[]>;
}
