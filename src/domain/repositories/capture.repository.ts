import { Capture } from '@domain/entities/capture.entity';

export interface ICaptureRepository {
  create(capture: Capture): Promise<void>;
  countActiveByTrainer(trainerId: string): Promise<number>;
  findActiveByTrainer(trainerId: string): Promise<Capture[]>;
}
