import { Elysia, t } from 'elysia'
import { PrismaClient, MenuItemStatus } from '@prisma/client'

const prisma = new PrismaClient()

export const Merchant = new Elysia({ prefix: '/merchant' })
  .get('/merchants', async ({ params, set }) => {
    const merchants = await prisma.merchant.findMany({
      orderBy: { createdAt: 'desc' }
    })
    if (!merchants.length) {
      set.status = 404
      return { message: 'No menu found' }
    }
    return merchants
  }, { tags: ['Merchant'] })
  .get('/categories', async ({ params, set }) => {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'desc' }
    })
    if (!categories.length) {
      set.status = 404
      return { message: 'No menu found' }
    }
    return categories
  }, { tags: ['Merchant'] })
