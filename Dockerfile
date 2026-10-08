# ==========================================
# Estágio 1: Build (Compilação do TypeScript)
# ==========================================
FROM node:26-alpine AS builder

WORKDIR /usr/src/app

# O Prisma precisa do OpenSSL no Alpine
RUN apk add --no-cache openssl

COPY package*.json ./

# Instala todas as dependências (incluindo devDependencies para compilar)
RUN npm ci

COPY . .

# Gera o Prisma Client, compila o TypeScript e resolve os aliases
# (prisma generate + tsc + tsc-alias)
RUN npm run build

# ==========================================
# Estágio 2: Runner (Ambiente de Execução)
# ==========================================
FROM node:26-alpine AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production

RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma

# Instala APENAS as dependências de produção (prisma CLI incluso para o migrate deploy)
RUN npm ci --omit=dev

# Gera o Prisma Client no ambiente de execução
RUN npx prisma generate

# Copia a pasta /dist gerada no estágio de build
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3333

# O rootDir do tsconfig é "./", então o build gera dist/src/...
CMD ["node", "dist/src/main/server.js"]
