import { z } from 'zod';

// Nomes da PokéAPI são minúsculos, com letras, números e hífen (ex: mr-mime)
export const pokemonNameField = (requiredMessage: string) =>
  z
    .string({ required_error: requiredMessage })
    .trim()
    .toLowerCase()
    .min(1, requiredMessage)
    .max(50, 'O nome do Pokémon deve ter no máximo 50 caracteres')
    .regex(
      /^[a-z0-9-]+$/,
      'O nome do Pokémon deve conter apenas letras, números e hífen (ex: mr-mime)',
    );

export const pokedexSearchQuerySchema = z.object({
  name: pokemonNameField('O nome do Pokémon (name) é obrigatório'),
});

export type PokedexSearchQuery = z.infer<typeof pokedexSearchQuerySchema>;
