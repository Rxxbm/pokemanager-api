import { Router } from 'express';
import { makePokemonController } from '@main/factories/makePokemonController.factory';

const pokemonRoutes = Router();
const pokemonController = makePokemonController();

pokemonRoutes.get('/', (req, res) => {
  /*
    #swagger.tags = ['Pokemons']
    #swagger.summary = 'Lista os Pokémons do catálogo local'
    #swagger.description = 'Retorna todos os Pokémons cadastrados. Suporta filtro por tipo via query string (?type=Electric).'
    #swagger.parameters['type'] = {
      in: 'query',
      description: 'Filtra os Pokémons pelo tipo.',
      required: false,
      schema: { type: 'string', example: 'Electric' }
    }
    #swagger.responses[200] = {
      description: 'Lista de Pokémons retornada com sucesso.',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              data: {
                type: 'array',
                items: { $ref: '#/components/schemas/Pokemon' }
              }
            }
          }
        }
      }
    }
  */
  return pokemonController.list(req, res);
});

pokemonRoutes.get('/:id', (req, res) => {
  /*
    #swagger.tags = ['Pokemons']
    #swagger.summary = 'Busca uma espécie local por ID'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID do Pokémon.',
      required: true,
      schema: { type: 'string', example: '25' }
    }
    #swagger.responses[200] = {
      description: 'Pokémon encontrado.',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              data: { $ref: '#/components/schemas/Pokemon' }
            }
          }
        }
      }
    }
    #swagger.responses[404] = {
      description: 'Pokémon não encontrado no catálogo.',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ErrorResponse' }
        }
      }
    }
  */
  return pokemonController.getById(req, res);
});

pokemonRoutes.post('/', (req, res) => {
  /*
    #swagger.tags = ['Pokemons']
    #swagger.summary = 'Cadastra um novo Pokémon no catálogo local'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/CreatePokemonDto' }
        }
      }
    }
    #swagger.responses[201] = {
      description: 'Pokémon cadastrado com sucesso.',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: { type: 'string', example: 'Pokémon cadastrado com sucesso!' },
              data: { $ref: '#/components/schemas/Pokemon' }
            }
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: 'Regra de negócio violada (ex: atributo inválido).',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ErrorResponse' }
        }
      }
    }
    #swagger.responses[409] = {
      description: 'Já existe um Pokémon cadastrado com este ID.',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ErrorResponse' }
        }
      }
    }
  */
  return pokemonController.create(req, res);
});

pokemonRoutes.put('/:id', (req, res) => {
  /*
    #swagger.tags = ['Pokemons']
    #swagger.summary = 'Atualiza os dados de um Pokémon no catálogo local'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID do Pokémon.',
      required: true,
      schema: { type: 'string', example: '25' }
    }
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/UpdatePokemonDto' }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Pokémon atualizado com sucesso.',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: { type: 'string', example: 'Pokémon atualizado com sucesso!' },
              data: { $ref: '#/components/schemas/Pokemon' }
            }
          }
        }
      }
    }
    #swagger.responses[404] = {
      description: 'Pokémon não encontrado no catálogo.',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ErrorResponse' }
        }
      }
    }
  */
  return pokemonController.update(req, res);
});

pokemonRoutes.delete('/:id', (req, res) => {
  /*
    #swagger.tags = ['Pokemons']
    #swagger.summary = 'Remove um Pokémon do catálogo local'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID do Pokémon.',
      required: true,
      schema: { type: 'string', example: '25' }
    }
    #swagger.responses[204] = {
      description: 'Pokémon removido com sucesso (sem conteúdo).'
    }
    #swagger.responses[404] = {
      description: 'Pokémon não encontrado no catálogo.',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ErrorResponse' }
        }
      }
    }
  */
  return pokemonController.delete(req, res);
});

export { pokemonRoutes };
