FROM oven/bun:1

WORKDIR /app

# Skip postinstall Prisma generate during bun install
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true

COPY package.json bun.lock ./
COPY prisma ./prisma

RUN bun install

COPY . .

# Explicit generate after full source is present
RUN bunx --bun prisma generate --schema=./prisma/schema.prisma

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["bun", "run", "src/index.ts"]
