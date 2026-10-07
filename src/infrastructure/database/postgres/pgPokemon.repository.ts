import { Pokemon } from '@domain/entities/pokemon.entity';
import {
  IPokemonRepository,
  ListPokemonsFilters,
} from '@domain/repositories/pokemon.repository';
import { postgresPool } from './connection';

interface PokemonRow {
  id: string;
  name: string;
  type: string;
  hp: number;
  attack: number;
  defense: number;
  level: number;
}

const COLUMNS = 'id, name, type, hp, attack, defense, level';

const toEntity = (row: PokemonRow): Pokemon => new Pokemon({ ...row });

export class PgPokemonRepository implements IPokemonRepository {
  async create(pokemon: Pokemon): Promise<void> {
    const query = `
      INSERT INTO pokemons (id, name, type, hp, attack, defense, level)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    await postgresPool.query(query, [
      pokemon.id,
      pokemon.name,
      pokemon.type,
      pokemon.hp,
      pokemon.attack,
      pokemon.defense,
      pokemon.level,
    ]);
  }

  async findById(id: string): Promise<Pokemon | null> {
    const result = await postgresPool.query<PokemonRow>(
      `SELECT ${COLUMNS} FROM pokemons WHERE id = $1`,
      [id],
    );

    if (result.rows.length === 0) return null;
    return toEntity(result.rows[0]);
  }

  async findAll(filters?: ListPokemonsFilters): Promise<Pokemon[]> {
    const result = filters?.type
      ? await postgresPool.query<PokemonRow>(
          `SELECT ${COLUMNS} FROM pokemons WHERE LOWER(type) = LOWER($1) ORDER BY created_at`,
          [filters.type],
        )
      : await postgresPool.query<PokemonRow>(
          `SELECT ${COLUMNS} FROM pokemons ORDER BY created_at`,
        );

    return result.rows.map(toEntity);
  }

  async update(pokemon: Pokemon): Promise<void> {
    const query = `
      UPDATE pokemons
      SET name = $2, type = $3, hp = $4, attack = $5, defense = $6, level = $7
      WHERE id = $1
    `;
    await postgresPool.query(query, [
      pokemon.id,
      pokemon.name,
      pokemon.type,
      pokemon.hp,
      pokemon.attack,
      pokemon.defense,
      pokemon.level,
    ]);
  }

  async updateLevel(id: string, newLevel: number): Promise<void> {
    await postgresPool.query('UPDATE pokemons SET level = $2 WHERE id = $1', [
      id,
      newLevel,
    ]);
  }

  async searchByName(term: string): Promise<Pokemon[]> {
    const result = await postgresPool.query<PokemonRow>(
      `SELECT ${COLUMNS} FROM pokemons WHERE name ILIKE $1 ORDER BY created_at`,
      [`%${term}%`],
    );

    return result.rows.map(toEntity);
  }

  async count(): Promise<number> {
    const result = await postgresPool.query<{ total: number }>(
      'SELECT COUNT(*)::int AS total FROM pokemons',
    );
    return result.rows[0].total;
  }

  async delete(id: string): Promise<void> {
    await postgresPool.query('DELETE FROM pokemons WHERE id = $1', [id]);
  }
}
