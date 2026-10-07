import { AppError } from '@domain/errors/app.error';

export const MIN_LEVEL = 1;
export const MAX_LEVEL = 100;

export interface PokemonProps {
  id: string;
  name: string;
  type: string;
  hp: number;
  attack: number;
  defense: number;
  level: number;
}

export class Pokemon {
  private props: PokemonProps;

  constructor(props: PokemonProps) {
    if (!props.name || props.name.trim().length === 0) {
      throw new AppError('Nome do Pokémon é obrigatório.', 400);
    }

    if (!props.type || props.type.trim().length === 0) {
      throw new AppError('Tipo do Pokémon é obrigatório.', 400);
    }

    if (props.hp < 0 || props.attack < 0 || props.defense < 0) {
      throw new AppError('Atributos de batalha não podem ser negativos.', 400);
    }

    if (
      !Number.isInteger(props.level) ||
      props.level < MIN_LEVEL ||
      props.level > MAX_LEVEL
    ) {
      throw new AppError(
        `O nível deve ser um inteiro entre ${MIN_LEVEL} e ${MAX_LEVEL}.`,
        400,
      );
    }

    this.props = props;
  }

  get id() {
    return this.props.id;
  }
  get name() {
    return this.props.name;
  }
  get type() {
    return this.props.type;
  }
  get hp() {
    return this.props.hp;
  }
  get attack() {
    return this.props.attack;
  }
  get defense() {
    return this.props.defense;
  }
  get level() {
    return this.props.level;
  }
}
