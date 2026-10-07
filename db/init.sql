-- Tabela de Pokémons no PostgreSQL
-- O ID é informado pelo cliente (ex: número da Pokédex), por isso VARCHAR e não UUID.
CREATE TABLE IF NOT EXISTS pokemons (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  hp INTEGER NOT NULL CHECK (hp >= 0),
  attack INTEGER NOT NULL CHECK (attack >= 0),
  defense INTEGER NOT NULL CHECK (defense >= 0),
  level INTEGER NOT NULL DEFAULT 1 CHECK (level BETWEEN 1 AND 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pokemons_type ON pokemons (LOWER(type));
