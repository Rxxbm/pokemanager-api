import { Trainer } from '@domain/entities/trainer.entity';
import { ITrainerRepository } from '@domain/repositories/trainer.repository';
import { AppError } from '@domain/errors/app.error';
import { postgresPool } from './connection';

interface TrainerRow {
  id: string;
  name: string;
  email: string;
  city: string;
}

const UNIQUE_VIOLATION = '23505';
const COLUMNS = 'id, name, email, city';

const toEntity = (row: TrainerRow): Trainer => new Trainer({ ...row });

const isUniqueViolation = (error: unknown): boolean =>
  typeof error === 'object' &&
  error !== null &&
  (error as { code?: string }).code === UNIQUE_VIOLATION;

export class PgTrainerRepository implements ITrainerRepository {
  async create(trainer: Trainer): Promise<void> {
    const query = `
      INSERT INTO trainers (id, name, email, city)
      VALUES ($1, $2, $3, $4)
    `;

    try {
      await postgresPool.query(query, [
        trainer.id,
        trainer.name,
        trainer.email,
        trainer.city,
      ]);
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new AppError(
          'Já existe um Treinador cadastrado com este e-mail.',
          409,
        );
      }
      throw error;
    }
  }

  async update(trainer: Trainer): Promise<void> {
    const query = `
      UPDATE trainers
      SET name = $2, email = $3, city = $4
      WHERE id = $1
    `;

    try {
      await postgresPool.query(query, [
        trainer.id,
        trainer.name,
        trainer.email,
        trainer.city,
      ]);
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new AppError(
          'Já existe um Treinador cadastrado com este e-mail.',
          409,
        );
      }
      throw error;
    }
  }

  async findById(id: string): Promise<Trainer | null> {
    const result = await postgresPool.query<TrainerRow>(
      `SELECT ${COLUMNS} FROM trainers WHERE id = $1`,
      [id],
    );

    if (result.rows.length === 0) return null;
    return toEntity(result.rows[0]);
  }

  async findAll(): Promise<Trainer[]> {
    const result = await postgresPool.query<TrainerRow>(
      `SELECT ${COLUMNS} FROM trainers ORDER BY created_at`,
    );

    return result.rows.map(toEntity);
  }
}
