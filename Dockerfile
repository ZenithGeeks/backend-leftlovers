FROM oven/bun:1

WORKDIR /app

# 1. เอาไฟล์ manifest เข้าไปก่อน (สำหรับ cache)
COPY package.json package-lock.json ./

# 2. ติดตั้ง dependency โดยไม่รัน postinstall / scripts
RUN bun install --ignore-scripts

# 3. ค่อย copy โค้ดทั้งหมดเข้าไป (รวม prisma/, src/, .env)
COPY . .

# 4. สร้าง Prisma Client จาก prisma/schema.prisma
RUN bunx prisma generate --schema ./prisma/schema.prisma

# 5. ตั้งค่า env ทั่วไป
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# 6. รัน server Bun + Elysia
CMD ["bun", "run", "src/index.ts"]
