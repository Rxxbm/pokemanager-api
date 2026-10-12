import { z } from 'zod';

// Os 6 primeiros são os tipos exigidos pela atividade; os demais completam
// os 18 tipos do catálogo.
export const POKEMON_TYPES = [
  'FIRE',
  'WATER',
  'GRASS',
  'ELECTRIC',
  'POISON',
  'FLYING',
  'NORMAL',
  'ICE',
  'FIGHTING',
  'GROUND',
  'PSYCHIC',
  'BUG',
  'ROCK',
  'GHOST',
  'DRAGON',
  'DARK',
  'STEEL',
  'FAIRY',
] as const;

const nameField = z
  .string({ required_error: 'O nome é obrigatório' })
  .trim()
  .min(2, 'O nome deve ter no mínimo 2 caracteres');

const typeField = z.enum(POKEMON_TYPES, {
  required_error: 'O tipo é obrigatório',
});

const statField = (label: string, required: string) =>
  z
    .number({ required_error: required })
    .int(`${label} deve ser um número inteiro`)
    .min(0, `${label} não pode ser negativo`);

const levelField = z
  .number({ required_error: 'O nível é obrigatório' })
  .int('O nível deve ser um número inteiro')
  .min(1, 'O nível deve ser no mínimo 1')
  .max(100, 'O nível deve ser no máximo 100');

const trainerIdField = z.string().uuid('O trainerId deve ser um UUID válido');

export const createPokemonSchema = z.object({
  id: z
    .string({ required_error: 'O ID é obrigatório' })
    .trim()
    .min(1, 'O ID é obrigatório')
    .max(50, 'O ID deve ter no máximo 50 caracteres'),
  name: nameField,
  type: typeField,
  hp: statField('O HP', 'O HP é obrigatório'),
  attack: statField('O ataque', 'O ataque é obrigatório'),
  defense: statField('A defesa', 'A defesa é obrigatória'),
  level: levelField,
  trainerId: trainerIdField.optional(),
});

export const updatePokemonSchema = z.object({
  name: nameField.optional(),
  type: typeField.optional(),
  hp: statField('O HP', '').optional(),
  attack: statField('O ataque', '').optional(),
  defense: statField('A defesa', '').optional(),
  level: levelField.optional(),
  trainerId: trainerIdField.optional(),
});

export const updatePokemonLevelSchema = z.object({ level: levelField });

export const pokemonIdParamsSchema = z.object({
  id: z.string().trim().min(1, 'O ID do Pokémon é obrigatório'),
});

// Converte a string numérica da query em inteiro (padrão quando ausente)
const levelQueryField = (label: string, defaultValue: number) =>
  z
    .string()
    .optional()
    .transform((value, ctx) => {
      if (value === undefined || value.trim() === '') return defaultValue;

      const parsed = Number(value);
      if (!Number.isInteger(parsed) || parsed < 1 || parsed > 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${label} deve ser um inteiro entre 1 e 100`,
        });
        return z.NEVER;
      }
      return parsed;
    });

export const listPokemonsQuerySchema = z
  .object({
    type: z.string().trim().optional(),
    minLevel: levelQueryField('O minLevel', 1),
    maxLevel: levelQueryField('O maxLevel', 100),
  })
  .refine((query) => !(query.minLevel > query.maxLevel), {
    message: 'O minLevel não pode ser maior que o maxLevel',
    path: ['minLevel'],
  });

export const searchPokemonsQuerySchema = z.object({
  name: z
    .string({ required_error: 'O termo de busca (name) é obrigatório' })
    .trim()
    .min(1, 'O termo de busca (name) é obrigatório'),
});

// Inferência automática de tipos a partir dos schemas
export type CreatePokemonBody = z.infer<typeof createPokemonSchema>;
export type UpdatePokemonBody = z.infer<typeof updatePokemonSchema>;
export type ListPokemonsQuery = z.infer<typeof listPokemonsQuerySchema>;
