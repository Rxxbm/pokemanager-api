# 🎮 PokéManager API — Módulo 1

![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)
![Clean Architecture](https://img.shields.io/badge/Clean%20Architecture-✔-blue)
![Swagger](https://img.shields.io/badge/OpenAPI-3.0-85EA2D?logo=swagger&logoColor=black)

API RESTful para gerenciamento do catálogo e times de Pokémons desenvolvida na disciplina de **Desenvolvimento de APIs Modernas**.

> Universidade Federal Fluminense — Instituto de Ciência e Tecnologia (ICT) — Departamento de Ciência da Computação (RCM)

Este repositório contempla a **Entrega 1 (Módulo 1)**, focada no desacoplamento de código via Clean Architecture, repositório em memória (In-Memory), documentação interativa com Swagger e tratamento global de erros, e a **Entrega 2 (Módulo 2)**, com persistência em PostgreSQL via Prisma, validação com Zod e integração com a [PokéAPI](https://pokeapi.co).

---

## 🏛️ Arquitetura do Projeto

O projeto segue os princípios da **Clean Architecture** (Arquitetura Limpa), garantindo independência de frameworks, testabilidade e separação clara de responsabilidades:

```
src/
├── domain/                  # [Camada 1] Entidades de negócio e contratos (Interfaces)
│   ├── entities/            # Regras de negócio puras (ex: Pokemon)
│   ├── errors/              # Exceção de domínio (AppError)
│   └── repositories/        # Contrato IPokemonRepository
│
├── application/             # [Camada 2] Casos de Uso (Lógica de Aplicação)
│   └── useCases/            # CreatePokemon, ListPokemons, GetPokemonById, UpdatePokemon, DeletePokemon
│
├── infrastructure/          # [Camada 3] Frameworks, Banco de Dados e HTTP
│   ├── database/            # Repositório em memória (InMemoryPokemonRepository)
│   └── http/                # Controllers, Routers e Middlewares do Express
│
└── main/                    # [Camada 4] Ponto de Composição (Setup da Aplicação)
    ├── config/              # Configurações gerais e especificação Swagger/OpenAPI
    ├── factories/           # Instanciação e Injeção de Dependências
    └── server.ts            # Inicialização do Servidor HTTP
```

### Fluxo de uma requisição

```
HTTP → Router → Controller → Use Case → IPokemonRepository ← InMemoryPokemonRepository
                     ↑ (injeção de dependência via Factory)
```

O domínio **não conhece** o Express nem o mecanismo de persistência: ele apenas define
a entidade `Pokemon` e o contrato `IPokemonRepository`. A camada `main` é a única que
"enxerga" todas as demais e faz a composição (wiring) da aplicação.

---

## 🛠️ Tecnologias Utilizadas

| Categoria           | Ferramenta                                       |
| ------------------- | ------------------------------------------------ |
| Runtime             | Node.js (v20+)                                   |
| Linguagem           | TypeScript (modo `strict`, com path aliases)     |
| Framework Web       | Express 5                                        |
| Execução em Dev     | tsx (`tsx watch`)                                |
| Documentação        | Swagger UI Express + OpenAPI 3.0 (escrito à mão) |
| Qualidade / Padrões | ESLint & Prettier                                |

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos

- Node.js (v18 ou superior)
- npm instalado

### Passo a Passo

```bash
# 1. Clonar o repositório
git clone https://github.com/Rxxbm/pokemanager-api.git

# 2. Acessar a pasta do projeto
cd pokemanager-api

# 3. Instalar as dependências
npm install

# 4. Executar o projeto em modo de desenvolvimento
npm run start
```

O servidor iniciará na porta **3333** com hot reload:

- 🚀 **API Base URL:** http://localhost:3333/api/v1
- 📖 **Documentação Swagger:** http://localhost:3333/api/docs

A especificação OpenAPI é declarada em código (`src/main/config/openapi.ts`) e
servida diretamente pelo Swagger UI — não há etapa de geração de arquivo.

### Scripts disponíveis

| Script             | Descrição                                      |
| ------------------ | ---------------------------------------------- |
| `npm run start`    | Inicia o servidor com hot reload (`tsx watch`) |
| `npm run dev`      | Alias de `npm run start`                       |
| `npm run build`    | Compila o TypeScript (`tsc`)                   |
| `npm run lint`     | Executa o ESLint                               |
| `npm run lint:fix` | Executa o ESLint corrigindo o que for possível |
| `npm run format`   | Formata o código com o Prettier                |

---

## 🐳 Executando com Docker

```bash
cp .env.example .env
docker compose up -d --build   # sobe api, postgres e pgadmin
docker compose logs -f api     # acompanha os logs da API
docker compose down            # para tudo (use -v para apagar os volumes)
```

| Serviço  | URL / Porta                       |
| -------- | --------------------------------- |
| API      | http://localhost:3333             |
| Swagger  | http://localhost:3333/api/docs    |
| pgAdmin  | http://localhost:5050             |
| Postgres | localhost:`${POSTGRES_PORT}` (padrão 5432) |

---

## 🐘 Persistência com PostgreSQL + Prisma ORM

Os dados são gravados no PostgreSQL. Existem duas implementações de repositório, ambas sobre as mesmas interfaces do domínio
(`IPokemonRepository` e `ITrainerRepository`):

| Implementação                                  | Local                                   | Uso                                 |
| ---------------------------------------------- | --------------------------------------- | ----------------------------------- |
| Driver nativo `pg` (SQL puro, parâmetros `$1`) | `src/infrastructure/database/postgres/` | Aula 8 (referência)                 |
| **Prisma Client**                              | `src/infrastructure/database/prisma/`   | **Ativa** (injetada nas factories)  |

O schema fica em [`prisma/schema.prisma`](prisma/schema.prisma) (modelos `Pokemon` e `Trainer`) e as migrations versionadas em
`prisma/migrations/`. No Docker, a API executa `npx prisma migrate deploy` antes de iniciar o servidor.

```bash
npx prisma migrate dev --name <nome>   # cria/aplica uma migration (dev)
npx prisma generate                    # regenera o Prisma Client
npx prisma studio                      # painel gráfico em http://localhost:5555
npx prisma migrate reset               # recria o banco do zero
```

> Rodando fora do Docker, suba apenas o banco (`docker compose up -d postgres`) e use `localhost` no `DATABASE_URL` do `.env`.

### Rotas adicionadas

| Método  | Rota                              | Descrição                                          |
| ------- | --------------------------------- | -------------------------------------------------- |
| `PATCH` | `/api/v1/pokemons/:id/level`      | Atualiza o nível (`{ "level": 36 }`, de 1 a 100)   |
| `GET`   | `/api/v1/pokemons/search?name=`   | Busca parcial por nome, ignorando maiúsculas       |
| `GET`   | `/api/v1/pokemons/count`          | Total de Pokémons no catálogo                      |
| `*`     | `/api/v1/trainers`                | Cadastro, listagem, busca e atualização de Treinadores |

E-mail de Treinador duplicado retorna `409 Conflict` (violação `23505` no `pg` / `P2002` no Prisma, convertida em `AppError`).

---

## 🛡️ Validação de Entrada com Zod

Os dados são validados na borda HTTP (princípio *Fail-Fast*) pelo middleware genérico
[`validateRequest`](src/infrastructure/http/middlewares/validateRequest.ts), que aceita schemas para `body`, `query` e `params`.
Os schemas ficam em `src/infrastructure/http/schemas/` (`pokemon.schemas.ts` e `trainer.schemas.ts`) e os tipos são inferidos com `z.infer`.
Campos não declarados no schema (ex: `isAdmin`) são descartados, evitando *mass assignment*.

| Recurso      | Regras principais                                                                                                 |
| ------------ | ----------------------------------------------------------------------------------------------------------------- |
| Pokémon      | `name` ≥ 2 caracteres; `type` em enum (`FIRE`, `WATER`, `GRASS`, `ELECTRIC`, `POISON`, `FLYING`, ...); `level` inteiro 1–100; `trainerId` UUID opcional |
| Treinador    | `name` ≥ 3 (com `trim`); `email` válido em minúsculas; `city` ≥ 2                                                  |
| Listagem     | `GET /pokemons?type=&minLevel=&maxLevel=` — níveis chegam como string e são convertidos (padrão 1 e 100)          |

Exemplo de resposta para `POST /api/v1/pokemons` com `{ "name": "P", "type": "DIGIMON", "level": 999 }`:

```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Dados de entrada inválidos",
  "details": [
    { "field": "name", "message": "O nome deve ter no mínimo 2 caracteres" },
    { "field": "type", "message": "Invalid enum value. Expected 'FIRE' | 'WATER' | ..." },
    { "field": "level", "message": "O nível deve ser no máximo 100" }
  ]
}
```

> Regras que dependem do banco (ex: e-mail já cadastrado, `trainerId` existente) **não** são do Zod: ficam nos casos de uso / domínio.

---

## 🌐 Integração com a PokéAPI (Entrega 2)

O contrato `IPokeApiGateway` fica no domínio (`src/domain/providers/pokeApi.gateway.ts`) e a implementação com `fetch` nativo
em [`src/infrastructure/providers/fetchPokeApi.gateway.ts`](src/infrastructure/providers/fetchPokeApi.gateway.ts)
(timeout de 5s, 404 vira `null`, falhas de rede viram `502`/`504`). A URL base vem de `POKEAPI_BASE_URL`.

| Método | Rota                                       | Descrição                                                                 | Sucesso |
| ------ | ------------------------------------------ | ------------------------------------------------------------------------- | ------- |
| `GET`  | `/api/v1/pokedex/search?name=pikachu`      | Consulta direto na PokéAPI e retorna o DTO formatado (nada é salvo)       | `200`   |
| `POST` | `/api/v1/trainers`                         | Cadastra um Treinador no banco                                            | `201`   |
| `POST` | `/api/v1/trainers/:trainerId/captures`     | Captura: `{ "pokemonName": "pikachu" }` → busca na PokéAPI e salva        | `201`   |
| `GET`  | `/api/v1/trainers/:trainerId/team`         | Lista o time ativo do Treinador                                           | `200`   |

**Regra de negócio:** o Treinador pode ter no máximo **6** Pokémons no time ativo (`MAX_TEAM_SIZE`). A 7ª captura retorna
`422` (`TeamFullError`). A regra é validada **antes** de chamar a PokéAPI. As capturas ficam na tabela `captures`
(modelo `Capture`, com `ON DELETE CASCADE` para o Treinador).

### Exceções de domínio

Em `src/domain/errors/domain.errors.ts`, todas estendem `AppError` e são tratadas pelo middleware global:

| Exceção                | Status | Uso                                          |
| ---------------------- | ------ | -------------------------------------------- |
| `NotFoundError`        | `404`  | Treinador ou Pokémon inexistente             |
| `ConflictError`        | `409`  | Conflito de dados                            |
| `BusinessRuleError`    | `422`  | Regra de negócio violada                     |
| `TeamFullError`        | `422`  | Time ativo já tem 6 Pokémons                 |
| `ExternalServiceError` | `502`/`504` | PokéAPI fora do ar / timeout            |

---

## 📖 Documentação dos Endpoints (RESTful)

A documentação interativa completa está acessível via Swagger no navegador em **`/api/docs`**.

| Método   | Endpoint               | Descrição                                       | Status de Sucesso |
| -------- | ---------------------- | ----------------------------------------------- | ----------------- |
| `POST`   | `/api/v1/pokemons`     | Cadastra um novo Pokémon no catálogo            | `201 Created`     |
| `GET`    | `/api/v1/pokemons`     | Lista Pokémons (com suporte a `?type=Electric`) | `200 OK`          |
| `GET`    | `/api/v1/pokemons/:id` | Busca um Pokémon pelo ID                        | `200 OK`          |
| `PUT`    | `/api/v1/pokemons/:id` | Atualiza os dados de um Pokémon                 | `200 OK`          |
| `DELETE` | `/api/v1/pokemons/:id` | Remove um Pokémon do catálogo                   | `204 No Content`  |

### Modelo de Pokémon

```json
{
  "id": "25",
  "name": "Pikachu",
  "type": "Electric",
  "hp": 35,
  "attack": 55,
  "defense": 40
}
```

---

## 🧪 Exemplos de Requisições (cURL)

### Cadastrar Pokémon

```bash
curl --request POST \
  --url http://localhost:3333/api/v1/pokemons \
  --header 'Content-Type: application/json' \
  --data '{
    "id": "25",
    "name": "Pikachu",
    "type": "Electric",
    "hp": 35,
    "attack": 55,
    "defense": 40
  }'
```

### Listar com Filtro de Tipo

```bash
curl --request GET \
  --url 'http://localhost:3333/api/v1/pokemons?type=Electric'
```

### Buscar por ID

```bash
curl --request GET \
  --url http://localhost:3333/api/v1/pokemons/25
```

### Atualizar Pokémon

```bash
curl --request PUT \
  --url http://localhost:3333/api/v1/pokemons/25 \
  --header 'Content-Type: application/json' \
  --data '{ "attack": 90, "defense": 55 }'
```

### Remover Pokémon

```bash
curl --request DELETE \
  --url http://localhost:3333/api/v1/pokemons/25
```

---

## 🛡️ Padronização de Erros

A API utiliza a classe `AppError` (camada de domínio) e um **Middleware Global de Erros**,
garantindo respostas estruturadas e previsíveis:

```json
{
  "status": "error",
  "statusCode": 404,
  "message": "Pokémon não encontrado no catálogo."
}
```

| Código | Quando ocorre                                                     |
| ------ | ----------------------------------------------------------------- |
| `400`  | Regra de negócio violada (ex: nome/tipo vazio, atributo negativo) |
| `404`  | Pokémon não encontrado no catálogo                                |
| `409`  | Já existe um Pokémon cadastrado com o ID informado                |
| `500`  | Erro interno não mapeado                                          |

---

## ✅ Checklist da Entrega 1

- [x] Estrutura base com Clean Architecture (domain / application / infrastructure / main)
- [x] `tsconfig.json` rigoroso (`strict`) com path aliases (`@domain/*`, `@application/*`, `@infrastructure/*`, `@main/*`)
- [x] ESLint e Prettier integrados e sem alertas
- [x] Interface `IPokemonRepository` na camada de Domínio
- [x] Implementação `InMemoryPokemonRepository`
- [x] Endpoints `GET` / `POST` / `PUT` / `DELETE` de `/api/v1/pokemons`
- [x] Filtro por tipo via `req.query` (`?type=`)
- [x] Rota `/api/docs` com Swagger / OpenAPI 3.0
- [x] Tratamento global de erros com `AppError`

## ✅ Checklist da Entrega 2

- [x] `PrismaPokemonRepository` (e `PrismaTrainerRepository` / `PrismaCaptureRepository`) substituindo o InMemory sem alterar o domínio
- [x] Interface `IPokeApiGateway` + implementação com `fetch` em `infrastructure/providers/`
- [x] `GET /api/v1/pokedex/search?name=` consultando a PokéAPI
- [x] `POST /api/v1/trainers`
- [x] `POST /api/v1/trainers/:trainerId/captures` com limite de 6 Pokémons no time ativo
- [x] `GET /api/v1/trainers/:trainerId/team`
- [x] Validação de `body`, `query` e `params` com Zod em todas as rotas
- [x] Middleware global de erros + exceções customizadas do domínio

---

## 👤 Autor

Desenvolvido por **Rubem Corrêa**

Estudante de Ciência da Computação — UFF / ICT.
