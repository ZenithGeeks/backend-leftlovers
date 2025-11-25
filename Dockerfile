FROM oven/bun:1

WORKDIR /app

COPY package.json package-lock.json ./

RUN bun install --ignore-scripts

COPY . .

RUN bunx prisma generate --schema ./prisma/schema.prisma

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["bun", "run", "src/index.ts"]
