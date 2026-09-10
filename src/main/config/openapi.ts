/**
 * Especificação OpenAPI 3.0 escrita à mão.
 *
 * Optamos por declarar o documento manualmente (em vez de gerar via
 * swagger-autogen) para ter controle total sobre o schema dos parâmetros —
 * isso evita o bug de path param virar "object" e habilita os campos de
 * seleção (enum) na aba "Try it out".
 */

export const POKEMON_TYPES = [
  'Normal',
  'Fire',
  'Water',
  'Electric',
  'Grass',
  'Ice',
  'Fighting',
  'Poison',
  'Ground',
  'Flying',
  'Psychic',
  'Bug',
  'Rock',
  'Ghost',
  'Dragon',
  'Dark',
  'Steel',
  'Fairy',
] as const;

const pokemonProperties = {
  id: { type: 'string', example: '25' },
  name: { type: 'string', example: 'Pikachu' },
  type: { type: 'string', enum: POKEMON_TYPES, example: 'Electric' },
  hp: { type: 'integer', minimum: 0, example: 35 },
  attack: { type: 'integer', minimum: 0, example: 55 },
  defense: { type: 'integer', minimum: 0, example: 40 },
};

const idParameter = {
  name: 'id',
  in: 'path',
  required: true,
  description: 'Identificador do Pokémon no catálogo local.',
  schema: { type: 'string', example: '25' },
};

export const openapiDocument = {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'PokéManager API',
    description:
      'API RESTful para gerenciamento do catálogo local de Pokémons — Módulo 1 ' +
      '(Clean Architecture + Repositório In-Memory). ' +
      'Disciplina de Desenvolvimento de APIs Modernas (UFF / ICT / RCM).',
  },
  servers: [{ url: 'http://localhost:3333', description: 'Servidor local' }],
  tags: [
    {
      name: 'Pokemons',
      description: 'Endpoints de gerenciamento do catálogo local de Pokémons',
    },
  ],
  paths: {
    '/api/v1/pokemons': {
      get: {
        tags: ['Pokemons'],
        summary: 'Lista os Pokémons do catálogo local',
        description:
          'Retorna todos os Pokémons cadastrados. Use o parâmetro `type` para ' +
          'filtrar por tipo elemental (selecione uma opção na lista).',
        parameters: [
          {
            name: 'type',
            in: 'query',
            required: false,
            description: 'Filtra os Pokémons pelo tipo elemental.',
            schema: { type: 'string', enum: POKEMON_TYPES },
          },
        ],
        responses: {
          '200': {
            description: 'Lista de Pokémons retornada com sucesso.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Pokemon' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Pokemons'],
        summary: 'Cadastra um novo Pokémon no catálogo local',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreatePokemonInput' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Pokémon cadastrado com sucesso.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Pokémon cadastrado com sucesso!',
                    },
                    data: { $ref: '#/components/schemas/Pokemon' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Regra de negócio violada (ex: nome/tipo vazio).',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '409': {
            description: 'Já existe um Pokémon cadastrado com este ID.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/v1/pokemons/{id}': {
      get: {
        tags: ['Pokemons'],
        summary: 'Busca uma espécie local por ID',
        parameters: [idParameter],
        responses: {
          '200': {
            description: 'Pokémon encontrado.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { $ref: '#/components/schemas/Pokemon' },
                  },
                },
              },
            },
          },
          '404': {
            description: 'Pokémon não encontrado no catálogo.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      put: {
        tags: ['Pokemons'],
        summary: 'Atualiza os dados de um Pokémon no catálogo local',
        parameters: [idParameter],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdatePokemonInput' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Pokémon atualizado com sucesso.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Pokémon atualizado com sucesso!',
                    },
                    data: { $ref: '#/components/schemas/Pokemon' },
                  },
                },
              },
            },
          },
          '404': {
            description: 'Pokémon não encontrado no catálogo.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Pokemons'],
        summary: 'Remove um Pokémon do catálogo local',
        parameters: [idParameter],
        responses: {
          '204': {
            description: 'Pokémon removido com sucesso (sem conteúdo).',
          },
          '404': {
            description: 'Pokémon não encontrado no catálogo.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Pokemon: {
        type: 'object',
        properties: pokemonProperties,
      },
      CreatePokemonInput: {
        type: 'object',
        required: ['id', 'name', 'type', 'hp', 'attack', 'defense'],
        properties: pokemonProperties,
      },
      UpdatePokemonInput: {
        type: 'object',
        description: 'Todos os campos são opcionais; envie apenas o que mudar.',
        properties: {
          name: { type: 'string', example: 'Raichu' },
          type: { type: 'string', enum: POKEMON_TYPES, example: 'Electric' },
          hp: { type: 'integer', minimum: 0, example: 60 },
          attack: { type: 'integer', minimum: 0, example: 90 },
          defense: { type: 'integer', minimum: 0, example: 55 },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'error' },
          statusCode: { type: 'integer', example: 404 },
          message: {
            type: 'string',
            example: 'Pokémon não encontrado no catálogo.',
          },
        },
      },
    },
  },
};
