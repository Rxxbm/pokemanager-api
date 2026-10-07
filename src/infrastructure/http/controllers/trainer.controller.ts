import { Request, Response } from 'express';
import { Trainer } from '@domain/entities/trainer.entity';
import { CreateTrainerUseCase } from '@application/useCases/createTrainer';
import { UpdateTrainerUseCase } from '@application/useCases/updateTrainer';
import { GetTrainerByIdUseCase } from '@application/useCases/getTrainerById';
import { ListTrainersUseCase } from '@application/useCases/listTrainers';

function formatTrainer(trainer: Trainer) {
  return {
    id: trainer.id,
    name: trainer.name,
    email: trainer.email,
    city: trainer.city,
  };
}

export class TrainerController {
  constructor(
    private listTrainersUseCase: ListTrainersUseCase,
    private getTrainerByIdUseCase: GetTrainerByIdUseCase,
    private createTrainerUseCase: CreateTrainerUseCase,
    private updateTrainerUseCase: UpdateTrainerUseCase,
  ) {}

  async list(req: Request, res: Response): Promise<Response> {
    const trainers = await this.listTrainersUseCase.execute();

    return res.status(200).json({ data: trainers.map(formatTrainer) });
  }

  async getById(req: Request, res: Response): Promise<Response> {
    const id = String(req.params.id);
    const trainer = await this.getTrainerByIdUseCase.execute(id);

    return res.status(200).json({ data: formatTrainer(trainer) });
  }

  async create(req: Request, res: Response): Promise<Response> {
    const { name, email, city } = req.body;

    const trainer = await this.createTrainerUseCase.execute({
      name,
      email,
      city,
    });

    return res.status(201).json({
      message: 'Treinador cadastrado com sucesso!',
      data: formatTrainer(trainer),
    });
  }

  async update(req: Request, res: Response): Promise<Response> {
    const id = String(req.params.id);
    const { name, email, city } = req.body;

    const trainer = await this.updateTrainerUseCase.execute(id, {
      name,
      email,
      city,
    });

    return res.status(200).json({
      message: 'Treinador atualizado com sucesso!',
      data: formatTrainer(trainer),
    });
  }
}
