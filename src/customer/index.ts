import { Elysia, t } from 'elysia'
import {
  PrismaClient,
  Prisma,
  MenuItemStatus,
  PaymentStatus,
  OrderPreference
} from '@prisma/client'

const prisma = new PrismaClient()

/* ============================== Types & Utils ============================= */
type MenuWithGroups = Prisma.MenuItemGetPayload<{
  include: { optionGroups: { include: { options: true } } }
}>

type PriceLine = {
  menuId: string
  qty: number
  unit: Prisma.Decimal
  line: Prisma.Decimal
  optionIds: string[]
}

class OrderError extends Error {
  http: number
  constructor(http: number, msg: string) {
    super(msg)
    this.http = http
  }
}

const D = (n: number | string | Prisma.Decimal) => new Prisma.Decimal(n)
const sum = (arr: Prisma.Decimal[]) => arr.reduce((a, b) => a.plus(b), D(0))
const now = () => new Date()
const TWO_HOURS_MS = 2 * 60 * 60 * 1000
const genPickupCode = () => Math.floor(100000 + Math.random() * 900000).toString()

/* Compute pickup deadline = min(soonest expiresAt, now + 2h) */
function computePickupDeadline(menus: MenuWithGroups[]): Date {
  const n = now()
  const plus2h = new Date(n.getTime() + TWO_HOURS_MS)
  const earliest = menus
    .map(m => m.expiresAt)
    .reduce((min, cur) => (cur < min ? cur : min), menus[0].expiresAt)
  return earliest < plus2h ? earliest : plus2h
}

/* Validate that chosen options belong to the menu and obey each group's min/max */
function validateOptionsOrThrow(
  items: Array<{ menuItemId: string; optionIds?: string[] }>,
  menuMap: Map<string, MenuWithGroups>
) {
  for (const it of items) {
    const menu = menuMap.get(it.menuItemId)
    if (!menu) throw new OrderError(400, `Menu ${it.menuItemId} not found`)

    const chosen = new Set(it.optionIds ?? [])
    const allIds = new Set(menu.optionGroups.flatMap(g => g.options.map(o => o.id)))

    for (const oid of chosen) {
      if (!allIds.has(oid)) throw new OrderError(400, `Invalid option ${oid} for "${menu.name}"`)
    }

    for (const g of menu.optionGroups) {
      const inGroup = (it.optionIds ?? []).filter(oid => g.options.some(o => o.id === oid))
      if (inGroup.length < g.minSelect || inGroup.length > g.maxSelect) {
        throw new OrderError(400, `OptionGroup "${g.name}" requires between ${g.minSelect} and ${g.maxSelect}`)
      }
    }
  }
}

/* Price lines per item (unit with option deltas, line total, selected option ids) */
function buildPriceBreakdown(
  items: Array<{ menuItemId: string; quantity: number; optionIds?: string[] }>,
  menuMap: Map<string, MenuWithGroups>
): PriceLine[] {
  return items.map(it => {
    const menu = menuMap.get(it.menuItemId)!
    const base = D(menu.basePrice)
    const chosen = new Set(it.optionIds ?? [])
    const optionSum = sum(
      menu.optionGroups
        .flatMap(g => g.options)
        .filter(o => chosen.has(o.id))
        .map(o => D(o.priceDelta))
    )
    const unit = base.plus(optionSum)
    const line = unit.mul(it.quantity)
    return { menuId: it.menuItemId, qty: it.quantity, unit, line, optionIds: [...chosen] }
  })
}

/* ================================ Schemas ================================ */
const ParamsSchema = t.Object({ merchantId: t.String({ format: 'uuid' }) })

const OrderItemInput = t.Object({
  menuItemId: t.String({ format: 'uuid' }),
  quantity: t.Integer({ minimum: 1 }),
  optionIds: t.Optional(t.Array(t.String({ format: 'uuid' })))
})

const PostOrderSchema = t.Object({
  customerId: t.String({ format: 'uuid' }),
  preference: t.Optional(t.Enum(OrderPreference)),
  note: t.Optional(t.String({ maxLength: 1000 })),
  items: t.Array(OrderItemInput, { minItems: 1 })
})

const ErrorSchema = t.Object({ message: t.String() })
const SuccessSchema = t.Object({
  message: t.Literal('Order created'),
  order: t.Any()
})

/* ================================= Route ================================= */
export const Customer = new Elysia({ prefix: '/customer' }).post(
  '/:merchantId/order',
  async ({ params, body, set }) => {
    try {
      const { merchantId } = params
      const { customerId, items, preference, note } = body

      const merchant = await prisma.merchant.findUnique({
        where: { id: merchantId },
        select: { id: true }
      })
      if (!merchant) throw new OrderError(404, 'Merchant not found')

      const menuIds = [...new Set(items.map(i => i.menuItemId))]
      const menuList = (await prisma.menuItem.findMany({
        where: { id: { in: menuIds }, merchantId },
        include: { optionGroups: { include: { options: true } } }
      })) as MenuWithGroups[]

      if (menuList.length !== menuIds.length) {
        throw new OrderError(400, 'Invalid or unavailable menu items')
      }

      const menuMap = new Map<string, MenuWithGroups>(menuList.map(m => [m.id, m]))
      validateOptionsOrThrow(items, menuMap)

      const pickupDeadline = computePickupDeadline(menuList)
      const lines = buildPriceBreakdown(items, menuMap)
      const subtotal = sum(lines.map(l => l.line))
      const discountTotal = D(0)
      const totalAmount = subtotal

      const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const order = await tx.order.create({
          data: {
            customerId,
            merchantId,
            status: 'PENDING',
            subtotal,
            discountTotal,
            totalAmount,
            paymentStatus: PaymentStatus.UNPAID,
            pickupCode: genPickupCode(),
            pickupDeadline,
            preference: preference ?? OrderPreference.CONTACT,
            note
          }
        })

        const ts = now()
        for (const line of lines) {
          const ok = await tx.menuItem.updateMany({
            where: {
              id: line.menuId,
              merchantId,
              status: MenuItemStatus.LIVE,
              expiresAt: { gt: ts },
              leftoverQty: { gte: line.qty }
            },
            data: { leftoverQty: { decrement: line.qty } }
          })
          if (ok.count === 0) throw new OrderError(409, 'One or more items are out of stock')

          const item = await tx.orderItem.create({
            data: { orderId: order.id, menuItemId: line.menuId, quantity: line.qty }
          })

          if (line.optionIds.length) {
            const opts = await tx.option.findMany({
              where: { id: { in: line.optionIds } },
              select: { id: true, priceDelta: true }
            })
            if (opts.length) {
              await tx.orderItemOption.createMany({
                data: opts.map(o => ({
                  orderItemId: item.id,
                  optionId: o.id,
                  priceDelta: o.priceDelta
                }))
              })
            }
          }

          await tx.inventoryLog.create({
            data: {
              menuItemId: line.menuId,
              orderId: order.id,
              change: -line.qty,
              reason: 'ORDER_PLACED'
            }
          })
        }

        await tx.payment.create({
          data: {
            orderId: order.id,
            merchantId,
            provider: 'manual',
            amount: totalAmount,
            currency: 'THB',
            status: PaymentStatus.UNPAID
          }
        })

        return tx.order.findUnique({
          where: { id: order.id },
          include: {
            items: { include: { menu: true, options: { include: { option: true } } } },
            payment: true
          }
        })
      })

      set.status = 201
      return { message: 'Order created', order: result }
    } catch (e) {
      const err = e as Error
      if (err instanceof OrderError) {
        set.status = err.http
        return { message: err.message }
      }
      console.error('[Order Error]', err)
      set.status = 500
      return { message: 'Failed to create order' }
    }
  },
  {
    params: ParamsSchema,
    body: PostOrderSchema,
    response: {
      201: SuccessSchema,
      400: ErrorSchema,
      404: ErrorSchema,
      409: ErrorSchema,
      500: ErrorSchema
    },
    detail: {
      tags: ['Customer', 'Order'],
      summary: 'Create new order for merchant'
    }
  }
)
