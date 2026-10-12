import { Request, Response } from 'express';
import { Pokemon } from '@domain/entities/pokemon.entity';
import { ListPokemonsUseCase } from '@application/useCases/listPokemons';
import { GetPokemonByIdUseCase } from '@application/useCases/getPokemonById';
import { CreatePokemonUseCase } from '@application/useCases/createPokemon';
import { UpdatePokemonUseCase } from '@application/useCases/updatePokemon';
import { DeletePokemonUseCase } from '@application/useCases/deletePokemon';
import { UpdatePokemonLevelUseCase } from '@application/useCases/updatePokemonLevel';
import { SearchPokemonsByNameUseCase } from '@application/useCases/searchPokemonsByName';
import { CountPokemonsUseCase } from '@application/useCases/countPokemons';

function formatPokemon(pokemon: Pokemon) {
  return {
    id: pokemon.id,
    name: pokemon.name,
    type: pokemon.type,
    hp: pokemon.hp,
    attack: pokemon.attack,
    defense: pokemon.defense,
    level: pokemon.level,
    trainerId: pokemon.trainerId,
  };
}

export class PokemonController {
  constructor(
    private listPokemonsUseCase: ListPokemonsUseCase,
    private getPokemonByIdUseCase: GetPokemonByIdUseCase,
    private createPokemonUseCase: CreatePokemonUseCase,
    private updatePokemonUseCase: UpdatePokemonUseCase,
    private deletePokemonUseCase: DeletePokemonUseCase,
    private updatePokemonLevelUseCase: UpdatePokemonLevelUseCase,
    private searchPokemonsByNameUseCase: SearchPokemonsByNameUseCase,
    private countPokemonsUseCase: CountPokemonsUseCase,
  ) {}

  async list(req: Request, res: Response): Promise<Response> {
    // A query já chega validada/convertida pelo middleware do Zod
    const { type, minLevel, maxLevel } = req.query as unknown as {
      type?: string;
      minLevel?: number;
      maxLevel?: number;
    };

    const pokemons = await this.listPokemonsUseCase.execute({
      type,
      minLevel,
      maxLevel,
    });

    return res.status(200).json({ data: pokemons.map(formatPokemon) });
  }

  async getById(req: Request, res: Response): Promise<Response> {
    const id = String(req.params.id);
    const pokemon = await this.getPokemonByIdUseCase.execute(id);

    return res.status(200).json({ data: formatPokemon(pokemon) });
  }

  async create(req: Request, res: Response): Promise<Response> {
    const { id, name, type, hp, attack, defense, level, trainerId } = req.body;

    const pokemon = await this.createPokemonUseCase.execute({
      id,
      name,
      type,
      hp,
      attack,
      defense,
      level,
      trainerId,
    });

    return res.status(201).json({
      message: 'Pokémon cadastrado com sucesso!',
      data: formatPokemon(pokemon),
    });
  }

  async update(req: Request, res: Response): Promise<Response> {
    const id = String(req.params.id);
    const { name, type, hp, attack, defense, level, trainerId } = req.body;

    const pokemon = await this.updatePokemonUseCase.execute(id, {
      name,
      type,
      hp,
      attack,
      defense,
      level,
      trainerId,
    });

    return res.status(200).json({
      message: 'Pokémon atualizado com sucesso!',
      data: formatPokemon(pokemon),
    });
  }

  async updateLevel(req: Request, res: Response): Promise<Response> {
    const id = String(req.params.id);
    const { level } = req.body;

    const pokemon = await this.updatePokemonLevelUseCase.execute(id, level);

    return res.status(200).json({
      message: 'Nível do Pokémon atualizado com sucesso!',
      data: formatPokemon(pokemon),
    });
  }

  async search(req: Request, res: Response): Promise<Response> {
    const { name } = req.query;

    const pokemons = await this.searchPokemonsByNameUseCase.execute(
      typeof name === 'string' ? name : '',
    );

    return res.status(200).json({ data: pokemons.map(formatPokemon) });
  }

  async count(req: Request, res: Response): Promise<Response> {
    const total = await this.countPokemonsUseCase.execute();

    return res.status(200).json({ data: { total } });
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const id = String(req.params.id);
    await this.deletePokemonUseCase.execute(id);

    return res.status(204).send();
  }
}
