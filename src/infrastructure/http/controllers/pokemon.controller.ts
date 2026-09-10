import { Request, Response } from 'express';
import { Pokemon } from '@domain/entities/pokemon.entity';
import { ListPokemonsUseCase } from '@application/useCases/listPokemons';
import { GetPokemonByIdUseCase } from '@application/useCases/getPokemonById';
import { CreatePokemonUseCase } from '@application/useCases/createPokemon';
import { UpdatePokemonUseCase } from '@application/useCases/updatePokemon';
import { DeletePokemonUseCase } from '@application/useCases/deletePokemon';

function formatPokemon(pokemon: Pokemon) {
  return {
    id: pokemon.id,
    name: pokemon.name,
    type: pokemon.type,
    hp: pokemon.hp,
    attack: pokemon.attack,
    defense: pokemon.defense,
  };
}

export class PokemonController {
  constructor(
    private listPokemonsUseCase: ListPokemonsUseCase,
    private getPokemonByIdUseCase: GetPokemonByIdUseCase,
    private createPokemonUseCase: CreatePokemonUseCase,
    private updatePokemonUseCase: UpdatePokemonUseCase,
    private deletePokemonUseCase: DeletePokemonUseCase,
  ) {}

  async list(req: Request, res: Response): Promise<Response> {
    const { type } = req.query;

    const pokemons = await this.listPokemonsUseCase.execute({
      type: typeof type === 'string' ? type : undefined,
    });

    return res.status(200).json({ data: pokemons.map(formatPokemon) });
  }

  async getById(req: Request, res: Response): Promise<Response> {
    const id = String(req.params.id);
    const pokemon = await this.getPokemonByIdUseCase.execute(id);

    return res.status(200).json({ data: formatPokemon(pokemon) });
  }

  async create(req: Request, res: Response): Promise<Response> {
    const { id, name, type, hp, attack, defense } = req.body;

    const pokemon = await this.createPokemonUseCase.execute({
      id,
      name,
      type,
      hp,
      attack,
      defense,
    });

    return res.status(201).json({
      message: 'Pokémon cadastrado com sucesso!',
      data: formatPokemon(pokemon),
    });
  }

  async update(req: Request, res: Response): Promise<Response> {
    const id = String(req.params.id);
    const { name, type, hp, attack, defense } = req.body;

    const pokemon = await this.updatePokemonUseCase.execute(id, {
      name,
      type,
      hp,
      attack,
      defense,
    });

    return res.status(200).json({
      message: 'Pokémon atualizado com sucesso!',
      data: formatPokemon(pokemon),
    });
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const id = String(req.params.id);
    await this.deletePokemonUseCase.execute(id);

    return res.status(204).send();
  }
}
