import { Pokemon } from '@domain/entities/pokemon.entity';

export interface ListPokemonsFilters {
  type?: string;
}

export interface IPokemonRepository {
  create(pokemon: Pokemon): Promise<void>;
  findById(id: string): Promise<Pokemon | null>;
  findAll(filters?: ListPokemonsFilters): Promise<Pokemon[]>;
  update(pokemon: Pokemon): Promise<void>;
  delete(id: string): Promise<void>;
}
