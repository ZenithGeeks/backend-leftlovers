# syntax=docker/dockerfile:1

ARG BUN_VERSION=1.3.4

# -----------------------------
# 1) deps with Bun
# -----------------------------
FROM oven/bun:${BUN_VERSION} AS deps
WORKDIR /app

ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true

COPY package.json bun.lockb* bun.lock* ./
COPY prisma ./prisma

# helps with occasional bun integrity issues
RUN rm -rf /root/.bun/install/cache

# IMPORTANT: don't use --ignore-scripts
RUN bun install --frozen-lockfile

# -----------------------------
# 2) prisma generate with Node
# -----------------------------
FROM node:20-bookworm-slim AS prisma
WORKDIR /app

# bring bun-installed deps
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=deps /app/package.json /app/package.json
COPY --from=deps /app/bun.lockb* /app/

# bring source + prisma schema
COPY . .
COPY prisma ./prisma

RUN npx prisma generate --schema=./prisma/schema.prisma

# -----------------------------
# 3) runtime with Bun
# -----------------------------
FROM oven/bun:${BUN_VERSION} AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=prisma /app /app

EXPOSE 3000
CMD ["bun", "run", "src/index.ts"]
