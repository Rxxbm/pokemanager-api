import path from 'path';
import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    version: '1.0.0',
    title: 'PokéManager API',
    description:
      'API RESTful para gerenciamento do catálogo local de Pokémons — Módulo 1 (Clean Architecture + Repositório In-Memory). Disciplina de Desenvolvimento de APIs Modernas (UFF / ICT / RCM).',
  },
  host: 'localhost:3333',
  basePath: '/',
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
      name: 'Pokemons',
      description: 'Endpoints de gerenciamento do catálogo local de Pokémons',
    },
  ],
  definitions: {
    Pokemon: {
      id: '25',
      name: 'Pikachu',
      type: 'Electric',
      hp: 35,
      attack: 55,
      defense: 40,
    },
    CreatePokemonDto: {
      $id: '25',
      $name: 'Pikachu',
      $type: 'Electric',
      $hp: 35,
      $attack: 55,
      $defense: 40,
    },
    UpdatePokemonDto: {
      name: 'Raichu',
      type: 'Electric',
      hp: 60,
      attack: 90,
      defense: 55,
    },
    ErrorResponse: {
      status: 'error',
      statusCode: 404,
      message: 'Pokémon não encontrado no catálogo.',
    },
  },
};

const outputFile = path.resolve(__dirname, 'swagger-output.json');

const endpointsFiles = [path.resolve(__dirname, '../server.ts')];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc);
