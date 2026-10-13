import { z } from 'zod';
import { pokemonNameField } from './pokedex.schemas';

export const trainerCaptureParamsSchema = z.object({
  trainerId: z.string().uuid('O trainerId deve ser um UUID válido'),
});

export const capturePokemonSchema = z.object({
  pokemonName: pokemonNameField(
    'O nome do Pokémon (pokemonName) é obrigatório',
  ),
});

export type TrainerCaptureParams = z.infer<typeof trainerCaptureParamsSchema>;
export type CapturePokemonBody = z.infer<typeof capturePokemonSchema>;
