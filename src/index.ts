import { Elysia, t } from 'elysia'
import openapi from '@elysiajs/openapi'
import { PrismaClient } from '@prisma/client'
import { merchantMenu } from './merchant/menu'
import { Merchant } from './merchant/index'
import { Customer } from './customer/index'
import { swagger } from '@elysiajs/swagger'
import { uploadRoutes } from './minio'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
  })

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma
}

const app = new Elysia({ prefix: '/api' })
  .use(openapi())
  .use(merchantMenu)
  .use(Merchant)
  .use(Customer)
  .use(uploadRoutes)

// ✅ Export Elysia app as default for Vercel
export default app
