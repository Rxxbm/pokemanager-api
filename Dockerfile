# ==========================================
# Estágio 1: Build (Compilação do TypeScript)
# ==========================================
FROM node:26-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

# Instala todas as dependências (incluindo devDependencies para compilar)
RUN npm ci

COPY . .

# Compila o TypeScript e resolve os aliases (tsc + tsc-alias)
RUN npm run build

# ==========================================
# Estágio 2: Runner (Ambiente de Execução)
# ==========================================
FROM node:26-alpine AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package*.json ./

# Instala APENAS as dependências de produção
RUN npm ci --omit=dev

# Copia a pasta /dist gerada no estágio de build
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3333

# O rootDir do tsconfig é "./", então o build gera dist/src/...
CMD ["node", "dist/src/main/server.js"]
