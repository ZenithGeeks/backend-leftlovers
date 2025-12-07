# syntax=docker/dockerfile:1

ARG BUN_VERSION=1.3.4

# -----------------------------
# Builder (runs prisma generate)
# -----------------------------
FROM oven/bun:${BUN_VERSION} AS builder
WORKDIR /app

# Avoid Prisma auto-generate during install (optional, but ok to keep)
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true

# Copy only deps first for better caching
COPY package.json bun.lockb* bun.lock* ./
COPY prisma ./prisma

# Workaround for Bun integrity/cache issues
RUN rm -rf /root/.bun/install/cache

# IMPORTANT: do NOT use --ignore-scripts
RUN bun install --frozen-lockfile

# Copy the rest of the app
COPY . .

# Install Node just for Prisma CLI in this build stage
RUN apt-get update \
  && apt-get install -y nodejs npm \
  && rm -rf /var/lib/apt/lists/*

# Use Node-based Prisma generate for reliability in Docker
RUN npx prisma generate --schema=./prisma/schema.prisma

# -----------------------------
# Runner (small runtime image)
# -----------------------------
FROM oven/bun:${BUN_VERSION} AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy the built app + node_modules from builder
COPY --from=builder /app /app

EXPOSE 3000
CMD ["bun", "run", "src/index.ts"]
