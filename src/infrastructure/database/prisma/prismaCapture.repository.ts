import { Capture as CaptureModel } from '@prisma/client';
import { Capture } from '@domain/entities/capture.entity';
import { ICaptureRepository } from '@domain/repositories/capture.repository';
import { prisma } from './client';

const toEntity = (row: CaptureModel): Capture =>
  new Capture({
    id: row.id,
    trainerId: row.trainerId,
    pokedexNumber: row.pokedexNumber,
    name: row.name,
    types: row.types,
    imageUrl: row.imageUrl,
    stats: {
      hp: row.hp,
      attack: row.attack,
      defense: row.defense,
      speed: row.speed,
    },
    active: row.active,
    capturedAt: row.capturedAt,
  });

export class PrismaCaptureRepository implements ICaptureRepository {
  async create(capture: Capture): Promise<void> {
    const { stats, ...data } = capture.toProps();
    await prisma.capture.create({ data: { ...data, ...stats } });
  }

  async countActiveByTrainer(trainerId: string): Promise<number> {
    return await prisma.capture.count({ where: { trainerId, active: true } });
  }

  async findActiveByTrainer(trainerId: string): Promise<Capture[]> {
    const rows = await prisma.capture.findMany({
      where: { trainerId, active: true },
      orderBy: { capturedAt: 'asc' },
    });

    return rows.map(toEntity);
  }
}
