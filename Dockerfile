FROM oven/bun:1.3.4

WORKDIR /app

ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true

COPY package.json bun.lock ./
COPY prisma ./prisma

RUN rm -rf /root/.bun/install/cache
RUN bun install --frozen-lockfile --ignore-scripts

COPY . .

# ✅ Add Node only for Prisma generate
RUN apt-get update \
  && apt-get install -y nodejs npm \
  && rm -rf /var/lib/apt/lists/*

# ✅ Use npx instead of bunx here
RUN npx prisma generate --schema=./prisma/schema.prisma

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["bun", "run", "src/index.ts"]
