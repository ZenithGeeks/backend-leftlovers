# ========= Builder =========
FROM oven/bun:1 AS builder
WORKDIR /app

# Stop your package.json postinstall from firing in Docker
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true

# Copy only deps first for caching
COPY package.json bun.lock ./
COPY prisma ./prisma

# Avoid all install scripts during image build
RUN bun install --frozen-lockfile --ignore-scripts

# Copy the rest of the source
COPY . .

# Install Node + npm ONLY to run Prisma CLI reliably in Docker
RUN apt-get update \
  && apt-get install -y nodejs npm \
  && rm -rf /var/lib/apt/lists/*

# Generate Prisma Client using Node-backed CLI
RUN npx prisma generate --schema=./prisma/schema.prisma

# ========= Runner =========
FROM oven/bun:1 AS runner
WORKDIR /app

COPY --from=builder /app /app

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["bun", "run", "src/index.ts"]
