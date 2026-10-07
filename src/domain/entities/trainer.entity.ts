import { AppError } from '@domain/errors/app.error';

export interface TrainerProps {
  id: string;
  name: string;
  email: string;
  city: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class Trainer {
  private props: TrainerProps;

  constructor(props: TrainerProps) {
    if (!props.name || props.name.trim().length === 0) {
      throw new AppError('Nome do Treinador é obrigatório.', 400);
    }

    if (!props.email || !EMAIL_REGEX.test(props.email)) {
      throw new AppError('E-mail do Treinador inválido.', 400);
    }

    if (!props.city || props.city.trim().length === 0) {
      throw new AppError('Cidade do Treinador é obrigatória.', 400);
    }

    this.props = props;
  }

  toProps(): TrainerProps {
    return { ...this.props };
  }

  get id() {
    return this.props.id;
  }
  get name() {
    return this.props.name;
  }
  get email() {
    return this.props.email;
  }
  get city() {
    return this.props.city;
  }
}
