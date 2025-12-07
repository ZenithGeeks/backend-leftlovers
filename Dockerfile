FROM oven/bun:1

WORKDIR /app

# 1. Install dependencies (allow scripts so Prisma can set up)
COPY package.json package-lock.json ./
RUN bun install --frozen-lockfile

# 2. Copy the rest of the app
COPY . .

# 3. Generate Prisma client
RUN bunx prisma generate --schema ./prisma/schema.prisma

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["bun", "run", "src/index.ts"]
