import { Request, Response } from 'express';
import { SearchPokedexUseCase } from '@application/useCases/searchPokedex';

export class PokedexController {
  constructor(private searchPokedexUseCase: SearchPokedexUseCase) {}

  async search(req: Request, res: Response): Promise<Response> {
    // A query já chega validada e normalizada (minúsculas) pelo Zod
    const { name } = req.query as unknown as { name: string };

    const pokemon = await this.searchPokedexUseCase.execute(name);

    return res.status(200).json({ data: pokemon });
  }
}
