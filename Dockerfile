FROM oven/bun:1

WORKDIR /app

# If you have bun.lock, copy it; if not, skip that line
COPY package.json bun.lock ./
RUN bun install

COPY . .
RUN bunx prisma generate --schema=./prisma/schema.prisma

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["bun", "run", "src/index.ts"]
