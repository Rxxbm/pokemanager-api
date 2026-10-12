// DTO já formatado com os dados da PokéAPI que interessam à aplicação.
// O domínio não conhece o formato bruto da API externa.
export interface PokedexPokemon {
  pokedexNumber: number;
  name: string;
  types: string[];
  imageUrl: string | null;
  heightMeters: number;
  weightKg: number;
  stats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
}

export interface IPokeApiGateway {
  /** Retorna `null` quando o Pokémon não existe na PokéAPI. */
  findByName(name: string): Promise<PokedexPokemon | null>;
}
