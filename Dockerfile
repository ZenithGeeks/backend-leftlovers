# ========= deps (Node) =========
FROM node:22-slim AS deps
WORKDIR /app

# If you later add package-lock.json, prefer:
# COPY package.json package-lock.json ./
# RUN npm ci

COPY package.json ./
RUN npm install

# ========= builder (Bun) =========
FROM oven/bun:1 AS builder
WORKDIR /app

ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true

# Bring node_modules from Node stage
COPY --from=deps /app/node_modules ./node_modules

# Copy Bun lock for reference + rest of the app
COPY package.json bun.lock ./
COPY prisma ./prisma
COPY . .

# Install Node+npm just for Prisma generate stability in Docker
RUN apt-get update \
  && apt-get install -y nodejs npm \
  && rm -rf /var/lib/apt/lists/*

RUN npx prisma generate --schema=./prisma/schema.prisma

# ========= runner =========
FROM oven/bun:1 AS runner
WORKDIR /app

COPY --from=builder /app /app

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["bun", "run", "src/index.ts"]
