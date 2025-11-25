import { Elysia } from "elysia";
import {
  PrismaClient,
  Prisma,
  MenuItemStatus,
  PaymentStatus,
  OrderPreference,
  Role,
  UserStatus,
} from "@prisma/client";

import {
  MerchantParamSchema,
  OrderCreateSchema,
  ErrorSchema,
  SuccessCreatedOrderSchema,
  type MenuWithGroups,
  type PriceLine,
  UserCreateSchema,
  SuccessCreatedUserSchema,
} from "../../types";

const prisma = new PrismaClient();

/* ============================== Helpers ============================== */
class OrderError extends Error {
  http: number;
  constructor(http: number, msg: string) {
    super(msg);
    this.http = http;
  }
}

const D = (n: number | string | Prisma.Decimal) => new Prisma.Decimal(n);
const sum = (arr: Prisma.Decimal[]) => arr.reduce((a, b) => a.plus(b), D(0));
const now = () => new Date();
const TWO_HOURS_MS = 2 * 60 * 60 * 1000;
const genPickupCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

function computePickupDeadline(menus: MenuWithGroups[]): Date {
  const n = now();
  const plus2h = new Date(n.getTime() + TWO_HOURS_MS);
  const earliest = menus
    .map((m) => m.expiresAt)
    .reduce((min, cur) => (cur < min ? cur : min), menus[0].expiresAt);
  return earliest < plus2h ? earliest : plus2h;
}

function validateOptionsOrThrow(
  items: Array<{ menuItemId: string; optionIds?: string[] }>,
  menuMap: Map<string, MenuWithGroups>
) {
  for (const it of items) {
    const menu = menuMap.get(it.menuItemId)
    if (!menu) throw new OrderError(400, `Menu ${it.menuItemId} not found`)

    const chosen = new Set(it.optionIds ?? [])

    // Only consider ACTIVE options for both existence and group rules
    const activeOptionIds = new Set(
      menu.optionGroups.flatMap(g => g.options.filter(o => o.active).map(o => o.id))
    )

    // 1) Every chosen option must be an active option of this menu
    for (const oid of chosen) {
      if (!activeOptionIds.has(oid))
        throw new OrderError(400, `Invalid or inactive option ${oid} for "${menu.name}"`)
    }

    // 2) Group min/max over ACTIVE options only
    for (const g of menu.optionGroups) {
      const activeIdsInGroup = new Set(g.options.filter(o => o.active).map(o => o.id))
      const pickedInGroup = (it.optionIds ?? []).filter(oid => activeIdsInGroup.has(oid))
      if (pickedInGroup.length < g.minSelect || pickedInGroup.length > g.maxSelect) {
        throw new OrderError(
          400,
          `OptionGroup "${g.name}" requires between ${g.minSelect} and ${g.maxSelect}`
        )
      }
    }
  }
}

function buildPriceBreakdown(
  items: Array<{ menuItemId: string; quantity: number; optionIds?: string[] }>,
  menuMap: Map<string, MenuWithGroups>
): PriceLine[] {
  return items.map(it => {
    const menu = menuMap.get(it.menuItemId)!
    const base = D(menu.basePrice)

    const chosen = new Set(it.optionIds ?? [])

    // Only active options contribute to price
    const optionSum = sum(
      menu.optionGroups
        .flatMap(g => g.options.filter(o => o.active))
        .filter(o => chosen.has(o.id))
        .map(o => D(o.priceDelta))
    )

    const unit = base.plus(optionSum)       // per-unit price (base + chosen options)
    const line = unit.mul(it.quantity)      // extended line total

    return {
      menuId: it.menuItemId,
      qty: it.quantity,
      unit,
      line,
      optionIds: [...chosen]
    }
  })
}

export function parseDOB(input?: string | Date): Date{
  if (!input) {
    throw new Error("Date of birth is required");
  };
  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) throw new Error("Invalid date of birth");
  const now = new Date();
  const min = new Date(now.getFullYear() - 15, now.getMonth(), now.getDate());
  if (d > min) throw new Error("You must be at least 15 years old");
  return d;
}

function normEmail(e: string) {
  return e.trim().toLowerCase();
}


/* ================================= Route ================================= */
export const Customer = new Elysia({ prefix: "/customer" })
  .post(
    "/:merchantId/order",
    async ({ params, body, set }) => {
      try {
        const { merchantId } = params as { merchantId: string };
        const { customerId, items, preference, note } = body as {
          customerId: string;
          items: Array<{
            menuItemId: string;
            quantity: number;
            optionIds?: string[];
          }>;
          preference?: OrderPreference;
          note?: string;
        };

        const merchant = await prisma.merchant.findUnique({
          where: { id: merchantId },
          select: { id: true },
        });
        if (!merchant) throw new OrderError(404, "Merchant not found");

        const menuIds = [...new Set(items.map((i) => i.menuItemId))];
        const menuList = (await prisma.menuItem.findMany({
          where: { id: { in: menuIds }, merchantId },
          include: { optionGroups: { include: { options: true } } },
        })) as MenuWithGroups[];

        if (menuList.length !== menuIds.length) {
          throw new OrderError(400, "Invalid or unavailable menu items");
        }

        const menuMap = new Map<string, MenuWithGroups>(
          menuList.map((m) => [m.id, m])
        );
        validateOptionsOrThrow(items, menuMap);

        const pickupDeadline = computePickupDeadline(menuList);
        const lines = buildPriceBreakdown(items, menuMap);
        const subtotal = sum(lines.map((l) => l.line));
        const discountTotal = D(0);
        const totalAmount = subtotal;
        const result = await prisma.$transaction(
          async (tx: Prisma.TransactionClient) => {
            const order = await tx.order.create({
              data: {
                customerId,
                merchantId,
                status: "PENDING",
                subtotal,
                discountTotal,
                totalAmount,
                paymentStatus: PaymentStatus.PAID,
                pickupCode: genPickupCode(),
                pickupDeadline,
                preference: preference ?? OrderPreference.CONTACT,
                note,
              },
            });

            const ts = now();
            for (const line of lines) {
              const ok = await tx.menuItem.updateMany({
                where: {
                  id: line.menuId,
                  merchantId,
                  status: MenuItemStatus.LIVE,
                  expiresAt: { gt: ts },
                  leftoverQty: { gte: line.qty },
                },
                data: { leftoverQty: { decrement: line.qty } },
              });
              if (ok.count === 0)
                throw new OrderError(409, "One or more items are out of stock");

              const item = await tx.orderItem.create({
                data: {
                  orderId: order.id,
                  menuItemId: line.menuId,
                  quantity: line.qty,
                },
              });

              if (line.optionIds.length) {
                const opts = await tx.option.findMany({
                  where: { id: { in: line.optionIds } },
                  select: { id: true, priceDelta: true },
                });
                if (opts.length) {
                  await tx.orderItemOption.createMany({
                    data: opts.map((o) => ({
                      orderItemId: item.id,
                      optionId: o.id,
                      priceDelta: o.priceDelta,
                    })),
                  });
                }
              }

              await tx.inventoryLog.create({
                data: {
                  menuItemId: line.menuId,
                  orderId: order.id,
                  change: -line.qty,
                  reason: "ORDER_PLACED",
                },
              });
            }

            await tx.payment.create({
              data: {
                orderId: order.id,
                merchantId,
                provider: "manual",
                providerChargeId: "",
                amount: totalAmount,
                currency: "THB",
                status: PaymentStatus.PAID,
                paidAt: new Date(now())
              },
            });

            return tx.order.findUnique({
              where: { id: order.id },
              include: {
                items: {
                  include: {
                    options: { include: { option: true } },
                  },
                },
                payment: true,
              },
            });
          }
        );

        set.status = 201;
        return { message: "Order created", order: result };
      } catch (e) {
        const err = e as Error;
        if (err instanceof OrderError) {
          set.status = err.http;
          return { message: err.message };
        }
        console.error("[Order Error]", err);
        set.status = 500;
        return { message: "Failed to create order" };
      }
    },
    {
      params: MerchantParamSchema,
      body: OrderCreateSchema,
      response: {
        201: SuccessCreatedOrderSchema,
        400: ErrorSchema,
        404: ErrorSchema,
        409: ErrorSchema,
        500: ErrorSchema,
      },
      detail: {
        tags: ["Customer", "Order"],
        summary: "Create new order for merchant",
      },
    }
  )

  .get(
    "/:merchantId/order/:orderId",
    async ({ params, set }) => {
      const order = await prisma.order.findFirst({
        where: { id: params.orderId, merchantId: params.merchantId },
      });
      if (!order) {
        set.status = 404;
        return { message: "Menu not found" };
      }
      return order;
    },
    { tags: ["Order"] }
  )
  .get(
    "/:merchantId/order/:orderId",
    async ({ params, set }) => {
      const order = await prisma.order.findFirst({
        where: { id: params.orderId, merchantId: params.merchantId },
        include: {
          items: {
            include: {
              options: true
            },
          },
          merchant: {
            include: { address: true },
          },
        },
      });

      if (!order) {
        set.status = 404;
        return { message: "Order not found" };
      }

      return order;
    },
    { tags: ["Order"] }
  )

  .get(
    "/address/:addressId",
    async ({ params, set }) => {
      const order = await prisma.address.findFirst({
        where: { id: params.addressId },
      });
      if (!order) {
        set.status = 404;
        return { message: "Menu not found" };
      }
      return order;
    },
    { tags: ["Order"] }
  )
.post(
  '/',
  async ({ body, set }) => {
    try {
      const rawName = body.name
      if (!rawName || typeof rawName !== 'string' || !rawName.trim()) {
        set.status = 400
        return { message: 'Name is required' }
      }
      const name = rawName.trim()
      const email = normEmail(body.email)
      const phone = body.phone?.trim() || null
      const avatarUrl = body.avatarUrl ?? null
      const dobDate = parseDOB(body.dob)
      const role = (body.role as Role) ?? Role.CUSTOMER
      const status = (body.status as UserStatus) ?? UserStatus.ACTIVE

      
      const user = await prisma.user.create({
        data: {
          name,
          email,
          phone,
          avatarUrl,
          dob: dobDate, 
          role,
          status,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          dob: true,
          avatarUrl: true,
          role: true,
          status: true,
          createdAt: true,
        },
      })

      set.status = 201
      return {
        message: 'User created',
        user: {
          ...user,
          createdAt: user.createdAt.toISOString(),
        }
      }
    } catch (err: any) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          set.status = 409
          return { message: 'Duplicate email' }
        }
      }
      console.error('[User Create Error]', err)
      set.status = 500
      return { message: err }
    }
  },
  {
    body: UserCreateSchema,
    response: {
      201: SuccessCreatedUserSchema,
      400: ErrorSchema,
      409: ErrorSchema,
      500: ErrorSchema,
    },
    detail: {
      tags: ['Users'],
      summary: 'Create a new user',
    },
  }
)
