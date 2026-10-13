import { AppError } from '@domain/errors/app.error';

// Regra de negócio: um treinador pode ter no máximo 6 Pokémons no time ativo
export const MAX_TEAM_SIZE = 6;

export interface CaptureStats {
  hp: number;
  attack: number;
  defense: number;
  speed: number;
}

export interface CaptureProps {
  id: string;
  trainerId: string;
  pokedexNumber: number;
  name: string;
  types: string[];
  imageUrl: string | null;
  stats: CaptureStats;
  active: boolean;
  capturedAt: Date;
}

export class Capture {
  private props: CaptureProps;

  constructor(props: CaptureProps) {
    if (!props.trainerId) {
      throw new AppError(
        'A captura precisa estar associada a um treinador.',
        400,
      );
    }

    if (!props.name || props.name.trim().length === 0) {
      throw new AppError('Nome do Pokémon capturado é obrigatório.', 400);
    }

    if (props.types.length === 0) {
      throw new AppError(
        'O Pokémon capturado precisa ter ao menos um tipo.',
        400,
      );
    }

    if (Object.values(props.stats).some((value) => value < 0)) {
      throw new AppError('Atributos de batalha não podem ser negativos.', 400);
    }

    this.props = props;
  }

  toProps(): CaptureProps {
    return { ...this.props, stats: { ...this.props.stats } };
  }

  get id() {
    return this.props.id;
  }
  get trainerId() {
    return this.props.trainerId;
  }
  get pokedexNumber() {
    return this.props.pokedexNumber;
  }
  get name() {
    return this.props.name;
  }
  get types() {
    return [...this.props.types];
  }
  get imageUrl() {
    return this.props.imageUrl;
  }
  get stats() {
    return { ...this.props.stats };
  }
  get active() {
    return this.props.active;
  }
  get capturedAt() {
    return this.props.capturedAt;
  }
}
