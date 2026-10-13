import express from 'express';
import { setupSwagger } from '@main/config/swagger';
import { pokemonRoutes } from '@infrastructure/http/routes/pokemon.routes';
import { trainerRoutes } from '@infrastructure/http/routes/trainer.routes';
import { pokedexRoutes } from '@infrastructure/http/routes/pokedex.routes';
import { errorHandler } from '@infrastructure/http/middlewares/errorHandler';

const app = express();

app.use(express.json());

// 1. Documentação Swagger
setupSwagger(app);

// 2. Rotas dos Módulos
app.use('/api/v1/pokemons', pokemonRoutes);
app.use('/api/v1/trainers', trainerRoutes);
app.use('/api/v1/pokedex', pokedexRoutes);

// 3. Middleware Global de Erros (OBRIGATORIAMENTE NO FINAL)
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 3333;

app.listen(PORT, () => {
  console.log(`🚀 [server]: Servidor rodando em http://localhost:${PORT}`);
  console.log(
    `📖 [docs]: Swagger rodando em http://localhost:${PORT}/api/docs`,
  );
});
