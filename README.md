# 🎮 PokéManager API — Módulo 1

![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)
![Clean Architecture](https://img.shields.io/badge/Clean%20Architecture-✔-blue)
![Swagger](https://img.shields.io/badge/OpenAPI-3.0-85EA2D?logo=swagger&logoColor=black)

API RESTful para gerenciamento do catálogo e times de Pokémons desenvolvida na disciplina de **Desenvolvimento de APIs Modernas**.

> Universidade Federal Fluminense — Instituto de Ciência e Tecnologia (ICT) — Departamento de Ciência da Computação (RCM)

Este repositório contempla a **Entrega 1 (Módulo 1)**, focada no desacoplamento de código via Clean Architecture, repositório em memória (In-Memory), documentação interativa com Swagger e tratamento global de erros.

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

---

## 👤 Autor

Desenvolvido por **Rubem Corrêa**

Estudante de Ciência da Computação — UFF / ICT.
