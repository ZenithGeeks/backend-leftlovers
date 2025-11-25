# 1. Use official Bun base image
FROM oven/bun:1

WORKDIR /app

# 2. Copy package manifest files (you don't have bun.lockb yet)
COPY package.json package-lock.json ./

# 3. Install ALL dependencies (including devDeps for Prisma CLI)
RUN bun install

# 4. Copy entire project (src/, prisma/, .env, etc.)
COPY . .

# 5. Generate Prisma Client (schema is in prisma/schema.prisma)
RUN bunx prisma generate --schema ./prisma/schema.prisma

# 6. Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# 7. Expose port
EXPOSE 3000

# 8. Start the Bun + Elysia server
CMD ["bun", "run", "src/index.ts"]
