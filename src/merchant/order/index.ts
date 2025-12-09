// src/routes/merchant.order
import { Elysia } from 'elysia'
import { PrismaClient } from '@prisma/client'
import {
  OrderStatusUpdateSchema

} from '../../../types'

const prisma = new PrismaClient()
export const merchantOrder = new Elysia({ prefix: '/merchant' })
   .get('/:merchantId/order', async ({ params, set }) => {
    const orders = await prisma.order.findMany({
      where: { merchantId: params.merchantId },
      include: {
        items: {
          include: { 
            options: {
              include: { option: true}
            },
            menu: true  },
        },
        customer: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!orders.length) {
      set.status = 404
      return { message: 'No orders found' }
    }
    return orders
  }, { tags: ['Merchant'] })


    .put('/:merchantId/order/:orderId', async ({ params, body, set }) => {
      const order = await prisma.order.findFirst({
        where: { id: params.orderId, merchantId: params.merchantId },
      })
      if (!order) {
        set.status = 404
        return { message: 'order not found' }
      }
  
      const orderUpdated = await prisma.order.update({
        where: { id: order.id },
        data: {status: body.status}
      })
  
      return orderUpdated
    }, { body: OrderStatusUpdateSchema, tags: ['Merchant'] })