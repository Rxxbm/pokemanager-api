import { z } from 'zod';

const nameField = z
  .string({ required_error: 'O nome é obrigatório' })
  .trim()
  .min(3, 'O nome deve ter no mínimo 3 caracteres');

const emailField = z
  .string({ required_error: 'O e-mail é obrigatório' })
  .trim()
  .email('Formato de e-mail inválido')
  .toLowerCase();

const cityField = z
  .string({ required_error: 'A cidade é obrigatória' })
  .trim()
  .min(2, 'A cidade deve ter no mínimo 2 caracteres');

export const createTrainerSchema = z.object({
  name: nameField,
  email: emailField,
  city: cityField,
});

export const updateTrainerSchema = z.object({
  name: nameField.optional(),
  email: emailField.optional(),
  city: cityField.optional(),
});

export const trainerIdParamsSchema = z.object({
  id: z.string().uuid('O ID do treinador deve ser um UUID válido'),
});

export type CreateTrainerBody = z.infer<typeof createTrainerSchema>;
export type UpdateTrainerBody = z.infer<typeof updateTrainerSchema>;
export type TrainerIdParams = z.infer<typeof trainerIdParamsSchema>;
