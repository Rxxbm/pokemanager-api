import {
  IPokeApiGateway,
  PokedexPokemon,
} from '@domain/providers/pokeApi.gateway';
import { ExternalServiceError } from '@domain/errors/domain.errors';

const DEFAULT_BASE_URL = 'https://pokeapi.co/api/v2';
const TIMEOUT_MS = 5000;

// Formato bruto (parcial) da resposta de GET /pokemon/{name} da PokéAPI
interface PokeApiPokemonResponse {
  id: number;
  name: string;
  height: number; // decímetros
  weight: number; // hectogramas
  types: { slot: number; type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  sprites: {
    front_default: string | null;
    other?: { 'official-artwork'?: { front_default: string | null } };
  };
}

const toPokedexPokemon = (body: PokeApiPokemonResponse): PokedexPokemon => {
  const stat = (name: string) =>
    body.stats.find((item) => item.stat.name === name)?.base_stat ?? 0;

  return {
    pokedexNumber: body.id,
    name: body.name,
    types: [...body.types]
      .sort((a, b) => a.slot - b.slot)
      .map((item) => item.type.name.toUpperCase()),
    imageUrl:
      body.sprites.other?.['official-artwork']?.front_default ??
      body.sprites.front_default,
    heightMeters: body.height / 10,
    weightKg: body.weight / 10,
    stats: {
      hp: stat('hp'),
      attack: stat('attack'),
      defense: stat('defense'),
      specialAttack: stat('special-attack'),
      specialDefense: stat('special-defense'),
      speed: stat('speed'),
    },
  };
};

export class FetchPokeApiGateway implements IPokeApiGateway {
  constructor(
    private baseUrl = process.env.POKEAPI_BASE_URL || DEFAULT_BASE_URL,
  ) {}

  async findByName(name: string): Promise<PokedexPokemon | null> {
    const url = `${this.baseUrl}/pokemon/${encodeURIComponent(name.toLowerCase())}`;

    let response: Response;
    try {
      response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    } catch (error) {
      console.error('💥 [pokeapi]: Falha ao consultar a PokéAPI:', error);

      const isTimeout = error instanceof Error && error.name === 'TimeoutError';
      throw new ExternalServiceError(
        isTimeout
          ? 'A PokéAPI demorou demais para responder. Tente novamente.'
          : 'Não foi possível conectar à PokéAPI. Tente novamente.',
        isTimeout ? 504 : 502,
      );
    }

    if (response.status === 404) return null;

    if (!response.ok) {
      throw new ExternalServiceError(
        `A PokéAPI respondeu com erro (status ${response.status}).`,
      );
    }

    return toPokedexPokemon((await response.json()) as PokeApiPokemonResponse);
  }
}
