import { Pokemon, MAX_LEVEL, MIN_LEVEL } from '@domain/entities/pokemon.entity';
import {
  IPokemonRepository,
  ListPokemonsFilters,
} from '@domain/repositories/pokemon.repository';

export class InMemoryPokemonRepository implements IPokemonRepository {
  public items: Pokemon[] = [];

  async create(pokemon: Pokemon): Promise<void> {
    this.items.push(pokemon);
  }

  async findById(id: string): Promise<Pokemon | null> {
    const pokemon = this.items.find((item) => item.id === id);
    if (!pokemon) return null;
    return pokemon;
  }

  async findAll(filters?: ListPokemonsFilters): Promise<Pokemon[]> {
    const type = filters?.type?.toLowerCase();
    const minLevel = filters?.minLevel ?? MIN_LEVEL;
    const maxLevel = filters?.maxLevel ?? MAX_LEVEL;

    return this.items.filter(
      (item) =>
        (!type || item.type.toLowerCase() === type) &&
        item.level >= minLevel &&
        item.level <= maxLevel,
    );
  }

  async update(pokemon: Pokemon): Promise<void> {
    const index = this.items.findIndex((item) => item.id === pokemon.id);
    if (index >= 0) {
      this.items[index] = pokemon;
    }
  }

  async updateLevel(id: string, newLevel: number): Promise<void> {
    const pokemon = await this.findById(id);
    if (!pokemon) return;

    await this.update(new Pokemon({ ...pokemon.toProps(), level: newLevel }));
  }

  async searchByName(term: string): Promise<Pokemon[]> {
    const normalized = term.toLowerCase();
    return this.items.filter((item) =>
      item.name.toLowerCase().includes(normalized),
    );
  }

  async count(): Promise<number> {
    return this.items.length;
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((item) => item.id !== id);
  }
}
