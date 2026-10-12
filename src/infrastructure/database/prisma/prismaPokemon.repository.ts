import { Pokemon as PokemonModel } from '@prisma/client';
import { Pokemon } from '@domain/entities/pokemon.entity';
import {
  IPokemonRepository,
  ListPokemonsFilters,
} from '@domain/repositories/pokemon.repository';
import { prisma } from './client';

const toEntity = (row: PokemonModel): Pokemon =>
  new Pokemon({
    id: row.id,
    name: row.name,
    type: row.type,
    hp: row.hp,
    attack: row.attack,
    defense: row.defense,
    level: row.level,
    trainerId: row.trainerId,
  });

export class PrismaPokemonRepository implements IPokemonRepository {
  async create(pokemon: Pokemon): Promise<void> {
    await prisma.pokemon.create({ data: pokemon.toProps() });
  }

  async findById(id: string): Promise<Pokemon | null> {
    const row = await prisma.pokemon.findUnique({ where: { id } });
    return row ? toEntity(row) : null;
  }

  async findAll(filters?: ListPokemonsFilters): Promise<Pokemon[]> {
    const rows = await prisma.pokemon.findMany({
      where: {
        ...(filters?.type && {
          type: { equals: filters.type, mode: 'insensitive' as const },
        }),
        level: { gte: filters?.minLevel, lte: filters?.maxLevel },
      },
      orderBy: { createdAt: 'asc' },
    });

    return rows.map(toEntity);
  }

  async update(pokemon: Pokemon): Promise<void> {
    const { id, ...data } = pokemon.toProps();
    await prisma.pokemon.update({ where: { id }, data });
  }

  async updateLevel(id: string, newLevel: number): Promise<void> {
    await prisma.pokemon.update({ where: { id }, data: { level: newLevel } });
  }

  async searchByName(term: string): Promise<Pokemon[]> {
    const rows = await prisma.pokemon.findMany({
      where: { name: { contains: term, mode: 'insensitive' } },
      orderBy: { createdAt: 'asc' },
    });

    return rows.map(toEntity);
  }

  async count(): Promise<number> {
    return await prisma.pokemon.count();
  }

  async delete(id: string): Promise<void> {
    await prisma.pokemon.delete({ where: { id } });
  }
}
