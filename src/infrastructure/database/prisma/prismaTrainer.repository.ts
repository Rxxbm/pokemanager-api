import { Prisma, Trainer as TrainerModel } from '@prisma/client';
import { Trainer } from '@domain/entities/trainer.entity';
import { ITrainerRepository } from '@domain/repositories/trainer.repository';
import { AppError } from '@domain/errors/app.error';
import { prisma } from './client';

const UNIQUE_CONSTRAINT_FAILED = 'P2002';

const toEntity = (row: TrainerModel): Trainer =>
  new Trainer({
    id: row.id,
    name: row.name,
    email: row.email,
    city: row.city,
  });

const handleUniqueViolation = (error: unknown): never => {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === UNIQUE_CONSTRAINT_FAILED
  ) {
    throw new AppError(
      'Já existe um Treinador cadastrado com este e-mail.',
      409,
    );
  }
  throw error;
};

export class PrismaTrainerRepository implements ITrainerRepository {
  async create(trainer: Trainer): Promise<void> {
    try {
      await prisma.trainer.create({ data: trainer.toProps() });
    } catch (error) {
      handleUniqueViolation(error);
    }
  }

  async update(trainer: Trainer): Promise<void> {
    const { id, ...data } = trainer.toProps();

    try {
      await prisma.trainer.update({ where: { id }, data });
    } catch (error) {
      handleUniqueViolation(error);
    }
  }

  async findById(id: string): Promise<Trainer | null> {
    const row = await prisma.trainer.findUnique({ where: { id } });
    return row ? toEntity(row) : null;
  }

  async findAll(): Promise<Trainer[]> {
    const rows = await prisma.trainer.findMany({
      orderBy: { createdAt: 'asc' },
    });

    return rows.map(toEntity);
  }
}
