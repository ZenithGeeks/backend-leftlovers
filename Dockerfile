# syntax=docker/dockerfile:1.6
FROM oven/bun:1
WORKDIR /app

ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true

COPY package.json bun.lock ./
COPY prisma ./prisma

RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile --ignore-scripts

COPY . .

# (If you still hit the Prisma WASM issue, use npx here)
RUN apt-get update \
  && apt-get install -y nodejs npm \
  && rm -rf /var/lib/apt/lists/*

RUN npx prisma generate --schema=./prisma/schema.prisma

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["bun", "run", "src/index.ts"]
