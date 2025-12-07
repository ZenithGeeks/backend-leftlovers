FROM oven/bun:1

WORKDIR /app

ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true

COPY package.json bun.lock ./
# If your prisma folder is needed early for caching:
COPY prisma ./prisma

RUN bun install --frozen-lockfile --ignore-scripts

COPY . .

RUN bunx --bun prisma generate --schema=./prisma/schema.prisma

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["bun", "run", "src/index.ts"]
