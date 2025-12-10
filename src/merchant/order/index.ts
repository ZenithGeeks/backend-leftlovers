// src/routes/merchant.order
import { Elysia } from 'elysia'
import { PrismaClient } from '@prisma/client'
import {
  OrderStatusUpdateSchema

} from '../../../types'

const prisma = new PrismaClient()
export const merchantOrder = new Elysia({ prefix: '/merchant' })
   .get('/order/:orderId', async ({ params, set }) => {
    const orders = await prisma.order.findUnique({
      where: { id: params.orderId },
      include: {
        items: {
          include: { 
            options: {
              include: { option: true}
            },
            menu: true  },
        },
        merchant:{
          include:{
            address: true
          }
        },
        customer: true,
      },
    })

    if (!orders) {
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