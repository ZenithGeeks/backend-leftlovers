FROM oven/bun:1

WORKDIR /app

# 1) Install dependencies (let Bun update lockfile as needed)
COPY package.json package-lock.json ./
RUN bun install

# 2) Copy rest of the source
COPY . .

# 3) Generate Prisma client
RUN bunx prisma generate --schema=./prisma/schema.prisma

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["bun", "run", "src/index.ts"]
