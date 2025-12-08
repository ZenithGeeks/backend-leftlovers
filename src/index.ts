import { Elysia } from 'elysia'
import openapi from '@elysiajs/openapi'
import { PrismaClient } from '@prisma/client'
import { merchantMenu } from './merchant/menu'
import { Merchant } from './merchant'
import { Customer } from './customer'
import { swagger } from '@elysiajs/swagger'
import { uploadRoutes } from './minio'
import { merchantOrder } from './merchant/order'

import { MerchantFinance } from './merchant/finance';
import { MerchantEmployees } from './merchant/employee';
import { MerchantEditStore } from './merchant/editstore';

// --------------------
// SAFE PRISMA CLIENT (Bun + Server)
// --------------------
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({})

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma
}

// --------------------
// ELYSIA APP
// --------------------
const app = new Elysia({ prefix: '/api' })
  .use(openapi())
  .use(swagger())
  .use(merchantMenu)
  .use(Merchant)
  .use(Customer)
  .use(uploadRoutes)
  .use(merchantOrder)

  .use(MerchantFinance)
  .use(MerchantEmployees)
  .use(MerchantEditStore)
  
  .listen(process.env.PORT ?? 3000) 
console.log(`🦊 Elysia running on http://localhost:3000`)
