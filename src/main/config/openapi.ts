/**
 * Especificação OpenAPI 3.0 escrita à mão.
 *
 * Optamos por declarar o documento manualmente (em vez de gerar via
 * swagger-autogen) para ter controle total sobre o schema dos parâmetros —
 * isso evita o bug de path param virar "object" e habilita os campos de
 * seleção (enum) na aba "Try it out".
 */

import { POKEMON_TYPES } from '@infrastructure/http/schemas/pokemon.schemas';

export { POKEMON_TYPES };

const pokemonProperties = {
  id: { type: 'string', example: '25' },
  name: { type: 'string', example: 'Pikachu' },
  type: { type: 'string', enum: POKEMON_TYPES, example: 'ELECTRIC' },
  hp: { type: 'integer', minimum: 0, example: 35 },
  attack: { type: 'integer', minimum: 0, example: 55 },
  defense: { type: 'integer', minimum: 0, example: 40 },
  level: { type: 'integer', minimum: 1, maximum: 100, example: 5 },
  trainerId: {
    type: 'string',
    format: 'uuid',
    nullable: true,
    description: 'Treinador dono do Pokémon (opcional).',
  },
};

const trainerProperties = {
  id: { type: 'string', format: 'uuid' },
  name: { type: 'string', example: 'Ash Ketchum' },
  email: { type: 'string', format: 'email', example: 'ash@pallet.com' },
  city: { type: 'string', example: 'Pallet Town' },
};

const idParameter = {
  name: 'id',
  in: 'path',
  required: true,
  description: 'Identificador do Pokémon no catálogo local.',
  schema: { type: 'string', example: '25' },
};

const trainerIdPathParameter = {
  name: 'trainerId',
  in: 'path',
  required: true,
  description: 'Identificador (UUID) do Treinador.',
  schema: { type: 'string', format: 'uuid' },
};

const errorContent = (example?: object) => ({
  'application/json': {
    schema: { $ref: '#/components/schemas/ErrorResponse' },
    ...(example && { example }),
  },
});

const pokemonStatsProperties = {
  hp: { type: 'integer', example: 35 },
  attack: { type: 'integer', example: 55 },
  defense: { type: 'integer', example: 40 },
  speed: { type: 'integer', example: 90 },
};

const trainerIdParameter = {
  name: 'id',
  in: 'path',
  required: true,
  description: 'Identificador (UUID) do Treinador.',
  schema: { type: 'string', format: 'uuid' },
};

export const openapiDocument = {
  openapi: '3.0.0',
  info: {
    version: '2.0.0',
    title: 'PokéManager API',
    description:
      'API RESTful para gerenciamento do catálogo e times de Pokémons — Módulo 2 ' +
      '(PostgreSQL + Prisma, validação com Zod e integração com a PokéAPI). ' +
      'Disciplina de Desenvolvimento de APIs Modernas (UFF / ICT / RCM).',
  },
  servers: [{ url: 'http://localhost:3333', description: 'Servidor local' }],
  tags: [
    {
      name: 'Pokemons',
      description: 'Endpoints de gerenciamento do catálogo local de Pokémons',
    },
    {
      name: 'Trainers',
      description: 'Endpoints de gerenciamento de Treinadores',
    },
    {
      name: 'Pokedex',
      description: 'Consulta direta à PokéAPI oficial (https://pokeapi.co)',
    },
    {
      name: 'Captures',
      description:
        'Captura de Pokémons (dados da PokéAPI) e time ativo do Treinador',
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
          {
            name: 'minLevel',
            in: 'query',
            required: false,
            description: 'Nível mínimo (inteiro de 1 a 100). Padrão: 1.',
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 1 },
          },
          {
            name: 'maxLevel',
            in: 'query',
            required: false,
            description: 'Nível máximo (inteiro de 1 a 100). Padrão: 100.',
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 100 },
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
    '/api/v1/pokemons/search': {
      get: {
        tags: ['Pokemons'],
        summary: 'Busca Pokémons por nome (parcial, ignora maiúsculas)',
        description: 'Usa `ILIKE` no PostgreSQL. Ex: `pika` retorna Pikachu.',
        parameters: [
          {
            name: 'name',
            in: 'query',
            required: true,
            description: 'Trecho do nome do Pokémon.',
            schema: { type: 'string', example: 'pika' },
          },
        ],
        responses: {
          '200': {
            description: 'Lista de Pokémons que contêm o termo no nome.',
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
          '400': {
            description: 'Termo de busca ausente.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/v1/pokemons/count': {
      get: {
        tags: ['Pokemons'],
        summary: 'Conta o total de Pokémons do catálogo',
        responses: {
          '200': {
            description: 'Total de Pokémons cadastrados.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'object',
                      properties: { total: { type: 'integer', example: 3 } },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/pokemons/{id}/level': {
      patch: {
        tags: ['Pokemons'],
        summary: 'Atualiza o nível de um Pokémon',
        parameters: [idParameter],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['level'],
                properties: {
                  level: {
                    type: 'integer',
                    minimum: 1,
                    maximum: 100,
                    example: 36,
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Nível atualizado com sucesso.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Nível do Pokémon atualizado com sucesso!',
                    },
                    data: { $ref: '#/components/schemas/Pokemon' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Nível inválido (inteiro entre 1 e 100).',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
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
    '/api/v1/trainers': {
      get: {
        tags: ['Trainers'],
        summary: 'Lista os Treinadores cadastrados',
        responses: {
          '200': {
            description: 'Lista de Treinadores.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Trainer' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Trainers'],
        summary: 'Cadastra um novo Treinador',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateTrainerInput' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Treinador cadastrado com sucesso.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Treinador cadastrado com sucesso!',
                    },
                    data: { $ref: '#/components/schemas/Trainer' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Dados inválidos.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '409': {
            description: 'Já existe um Treinador cadastrado com este e-mail.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/v1/trainers/{id}': {
      get: {
        tags: ['Trainers'],
        summary: 'Busca um Treinador por ID',
        parameters: [trainerIdParameter],
        responses: {
          '200': {
            description: 'Treinador encontrado.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { $ref: '#/components/schemas/Trainer' },
                  },
                },
              },
            },
          },
          '404': {
            description: 'Treinador não encontrado.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      put: {
        tags: ['Trainers'],
        summary: 'Atualiza os dados de um Treinador',
        parameters: [trainerIdParameter],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateTrainerInput' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Treinador atualizado com sucesso.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Treinador atualizado com sucesso!',
                    },
                    data: { $ref: '#/components/schemas/Trainer' },
                  },
                },
              },
            },
          },
          '404': {
            description: 'Treinador não encontrado.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '409': {
            description: 'Já existe um Treinador cadastrado com este e-mail.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/v1/pokedex/search': {
      get: {
        tags: ['Pokedex'],
        summary: 'Consulta um Pokémon direto na PokéAPI oficial',
        description:
          'Busca o Pokémon pelo nome exato na PokéAPI e retorna um DTO ' +
          'formatado (tipos, imagem oficial, altura/peso e atributos base). ' +
          'Nada é gravado no banco.',
        parameters: [
          {
            name: 'name',
            in: 'query',
            required: true,
            description:
              'Nome do Pokémon na PokéAPI (ignora maiúsculas). Ex: pikachu, mr-mime.',
            schema: { type: 'string', example: 'pikachu' },
          },
        ],
        responses: {
          '200': {
            description: 'Pokémon encontrado na PokéAPI.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { $ref: '#/components/schemas/PokedexPokemon' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Parâmetro `name` ausente ou inválido (Zod).',
            content: errorContent(),
          },
          '404': {
            description: 'Pokémon não existe na PokéAPI.',
            content: errorContent({
              status: 'error',
              statusCode: 404,
              message: 'Pokémon "digimon" não encontrado na PokéAPI.',
            }),
          },
          '502': {
            description: 'Falha ao se comunicar com a PokéAPI.',
            content: errorContent(),
          },
        },
      },
    },
    '/api/v1/trainers/{trainerId}/captures': {
      post: {
        tags: ['Captures'],
        summary: 'Captura um Pokémon para o Treinador',
        description:
          'Consulta a PokéAPI (imagem, atributos base e tipos), valida a regra ' +
          'de negócio (máximo de **6** Pokémons no time ativo) e salva a ' +
          'captura no banco associada ao Treinador.',
        parameters: [trainerIdPathParameter],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CapturePokemonInput' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Pokémon capturado com sucesso.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Pokémon capturado com sucesso!',
                    },
                    data: { $ref: '#/components/schemas/CapturedPokemon' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Dados de entrada inválidos (Zod).',
            content: errorContent(),
          },
          '404': {
            description:
              'Treinador não encontrado ou Pokémon inexistente na PokéAPI.',
            content: errorContent(),
          },
          '422': {
            description: 'Regra de negócio: o time ativo já possui 6 Pokémons.',
            content: errorContent({
              status: 'error',
              statusCode: 422,
              message:
                'O treinador já possui 6 Pokémons no time ativo. Não é possível capturar mais.',
              details: { maxTeamSize: 6 },
            }),
          },
          '502': {
            description: 'Falha ao se comunicar com a PokéAPI.',
            content: errorContent(),
          },
        },
      },
    },
    '/api/v1/trainers/{trainerId}/team': {
      get: {
        tags: ['Captures'],
        summary: 'Lista o time ativo do Treinador',
        parameters: [trainerIdPathParameter],
        responses: {
          '200': {
            description: 'Time atual do Treinador (até 6 Pokémons).',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { $ref: '#/components/schemas/Team' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'trainerId não é um UUID válido (Zod).',
            content: errorContent(),
          },
          '404': {
            description: 'Treinador não encontrado.',
            content: errorContent(),
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
        required: ['id', 'name', 'type', 'hp', 'attack', 'defense', 'level'],
        description:
          'O campo `trainerId` é opcional (UUID de um Treinador existente).',
        properties: pokemonProperties,
      },
      UpdatePokemonInput: {
        type: 'object',
        description: 'Todos os campos são opcionais; envie apenas o que mudar.',
        properties: {
          name: { type: 'string', example: 'Raichu' },
          type: { type: 'string', enum: POKEMON_TYPES, example: 'ELECTRIC' },
          hp: { type: 'integer', minimum: 0, example: 60 },
          attack: { type: 'integer', minimum: 0, example: 90 },
          defense: { type: 'integer', minimum: 0, example: 55 },
          level: { type: 'integer', minimum: 1, maximum: 100, example: 36 },
          trainerId: pokemonProperties.trainerId,
        },
      },
      Trainer: {
        type: 'object',
        properties: trainerProperties,
      },
      CreateTrainerInput: {
        type: 'object',
        required: ['name', 'email', 'city'],
        properties: {
          name: trainerProperties.name,
          email: trainerProperties.email,
          city: trainerProperties.city,
        },
      },
      UpdateTrainerInput: {
        type: 'object',
        description: 'Todos os campos são opcionais; envie apenas o que mudar.',
        properties: {
          name: trainerProperties.name,
          email: trainerProperties.email,
          city: trainerProperties.city,
        },
      },
      PokedexPokemon: {
        type: 'object',
        properties: {
          pokedexNumber: { type: 'integer', example: 25 },
          name: { type: 'string', example: 'pikachu' },
          types: {
            type: 'array',
            items: { type: 'string' },
            example: ['ELECTRIC'],
          },
          imageUrl: {
            type: 'string',
            nullable: true,
            example:
              'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
          },
          heightMeters: { type: 'number', example: 0.4 },
          weightKg: { type: 'number', example: 6 },
          stats: {
            type: 'object',
            properties: {
              hp: { type: 'integer', example: 35 },
              attack: { type: 'integer', example: 55 },
              defense: { type: 'integer', example: 40 },
              specialAttack: { type: 'integer', example: 50 },
              specialDefense: { type: 'integer', example: 50 },
              speed: { type: 'integer', example: 90 },
            },
          },
        },
      },
      CapturePokemonInput: {
        type: 'object',
        required: ['pokemonName'],
        properties: {
          pokemonName: {
            type: 'string',
            example: 'pikachu',
            description: 'Nome do Pokémon na PokéAPI.',
          },
        },
      },
      CapturedPokemon: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          pokedexNumber: { type: 'integer', example: 25 },
          name: { type: 'string', example: 'pikachu' },
          types: {
            type: 'array',
            items: { type: 'string' },
            example: ['ELECTRIC'],
          },
          imageUrl: { type: 'string', nullable: true },
          stats: { type: 'object', properties: pokemonStatsProperties },
          capturedAt: { type: 'string', format: 'date-time' },
        },
      },
      Team: {
        type: 'object',
        properties: {
          trainerId: { type: 'string', format: 'uuid' },
          size: { type: 'integer', example: 1 },
          maxSize: { type: 'integer', example: 6 },
          pokemons: {
            type: 'array',
            items: { $ref: '#/components/schemas/CapturedPokemon' },
          },
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
          details: {
            type: 'array',
            description:
              'Presente em erros de validação (400) do Zod e em regras de negócio (422).',
            items: {
              type: 'object',
              properties: {
                field: { type: 'string', example: 'level' },
                message: {
                  type: 'string',
                  example: 'O nível deve ser no máximo 100',
                },
              },
            },
          },
        },
      },
    },
  },
};
