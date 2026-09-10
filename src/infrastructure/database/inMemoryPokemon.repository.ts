import { Pokemon } from '@domain/entities/pokemon.entity';
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
    if (filters?.type) {
      const type = filters.type.toLowerCase();
      return this.items.filter((item) => item.type.toLowerCase() === type);
    }

    return this.items;
  }

  async update(pokemon: Pokemon): Promise<void> {
    const index = this.items.findIndex((item) => item.id === pokemon.id);
    if (index >= 0) {
      this.items[index] = pokemon;
    }
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((item) => item.id !== id);
  }
}
