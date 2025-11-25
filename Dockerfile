# 1. Use official Bun image
FROM oven/bun:1 AS base

WORKDIR /app

# 2. Copy only package.json (no bun.lockb)
COPY package.json ./

# 3. Install all dependencies (including devDependencies for Prisma CLI)
RUN bun install

# 4. Copy the rest of the project
COPY . .

# 5. Generate Prisma Client inside container
RUN bunx prisma generate

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# 6. Start server
CMD ["bun", "run", "src/index.ts"]
