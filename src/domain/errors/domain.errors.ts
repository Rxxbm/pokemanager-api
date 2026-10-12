import { AppError } from '@domain/errors/app.error';

// Exceções de domínio: especializações do AppError com o status HTTP já
// definido. O middleware global de erros trata todas via `instanceof AppError`.

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}

export class BusinessRuleError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 422, details);
  }
}

export class TeamFullError extends BusinessRuleError {
  constructor(maxTeamSize: number) {
    super(
      `O treinador já possui ${maxTeamSize} Pokémons no time ativo. ` +
        'Não é possível capturar mais.',
      { maxTeamSize },
    );
  }
}

export class ExternalServiceError extends AppError {
  constructor(message: string, statusCode = 502) {
    super(message, statusCode);
  }
}
