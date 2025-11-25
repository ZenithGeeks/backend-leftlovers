# Use official Bun image
FROM oven/bun:1 AS base

WORKDIR /app

# Install deps
COPY package.json ./
RUN bun install --production
COPY . .
RUN bunx prisma generate

ENV NODE_ENV=production
ENV PORT=3000

# Start server
CMD ["bun", "run", "src/index.ts"]
