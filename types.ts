// src/types.ts
import { t } from 'elysia'
import type { Decimal } from '@prisma/client/runtime/library'
import {
    MenuItemStatus,
    PaymentStatus,
    OrderPreference,
    Prisma
} from '@prisma/client'
import type { Static } from '@sinclair/typebox';

/* ========================= Re-exports (Enums) ========================= */
export { MenuItemStatus, PaymentStatus, OrderPreference }

/* ============================== Common ============================== */
export const UUID = t.String({ format: 'uuid' })
export const MerchantParamSchema = t.Object({ merchantId: UUID })

/* =========================== Order (Customer) =========================== */
export const OrderItemInputSchema = t.Object({
    menuItemId: UUID,
    quantity: t.Integer({ minimum: 1 }),
    optionIds: t.Optional(t.Array(UUID))
})

export const OrderCreateSchema = t.Object({
    customerId: UUID,
    preference: t.Optional(t.Enum(OrderPreference)),
    note: t.Optional(t.String({ maxLength: 1000 })),
    items: t.Array(OrderItemInputSchema, { minItems: 1 })
})

export const ErrorSchema = t.Object({ message: t.String() })

export const SuccessCreatedOrderSchema = t.Object({
    message: t.Literal('Order created'),
    order: t.Any()
})

/* ============================== Types ============================== */
export type MenuWithGroups = Prisma.MenuItemGetPayload<{
    include: { optionGroups: { include: { options: true } } }
}>

export type PriceLine = {
    menuId: string
    qty: number
    unit: Prisma.Decimal
    line: Prisma.Decimal
    optionIds: string[]
}
/* ============================== DTOs (TS) ============================== */
/** Common ID shapes */
export interface MerchantParam { merchantId: string }
export interface MenuParam { merchantId: string; menuId: string }
export interface GroupParam { merchantId: string; groupId: string }
export interface OptionParam { merchantId: string; groupId: string; optionId: string }

/** Option */
export interface OptionCreateDTO {
    name: string
    priceDelta: number
    active?: boolean
}
export type OptionUpdateDTO = Partial<OptionCreateDTO>

/** OptionGroup */
export interface GroupCreateDTO {
    name: string
    merchantId: string
    minSelect?: number
    maxSelect?: number
    options?: OptionCreateDTO[]
}
export type GroupUpdateDTO = Partial<Pick<GroupCreateDTO, 'name' | 'minSelect' | 'maxSelect'>>

/** Menu */
export interface MenuCreateDTO {
    name: string
    basePrice: number
    description?: string
    originalPrice?: number
    leftoverQty?: number
    expiresAt?: string          // ISO string
    status?: keyof typeof MenuItemStatus | MenuItemStatus
    photoUrl?: string
    expireLabelUrl?: string     // DB requires non-null string; default to ''
    groupTemplates?: GroupCreateDTO[]
}
export type MenuUpdateDTO = Partial<MenuCreateDTO>

/** Generic API wrappers */
export interface ApiError { message: string }
export interface ApiSuccess<T> { data: T }

export const Money = t.Number()

export const OptionCreateSchema = t.Object({
    name: t.String(),
    priceDelta: Money,
    active: t.Optional(t.Boolean())
})
export const OptionUpdateSchema = t.Partial(OptionCreateSchema)

export const GroupCreateSchema = t.Object({
    name: t.String(),
    merchantId: UUID,
    minSelect: t.Optional(t.Number()),
    maxSelect: t.Optional(t.Number()),
    options: t.Optional(t.Array(OptionCreateSchema))
})
export const GroupUpdateSchema = t.Partial(
    t.Object({
        name: t.String(),
        minSelect: t.Number(),
        maxSelect: t.Number()
    })
)

export const MenuCreateSchema = t.Object({
    name: t.String(),
    basePrice: Money,
    description: t.Optional(t.String()),
    originalPrice: t.Optional(Money),
    leftoverQty: t.Optional(t.Number()),
    expiresAt: t.Optional(t.String()), // ISO
    status: t.Optional(
        t.Union([
            t.Literal('DRAFT'),
            t.Literal('LIVE'),
            t.Literal('SOLD_OUT'),
            t.Literal('EXPIRED')
        ])
    ),
    photoUrl: t.Optional(t.String()),
    expireLabelUrl: t.Optional(t.String()),
    groupTemplates: t.Optional(t.Array(GroupCreateSchema))
})
export const MenuUpdateSchema = t.Intersect([
  t.Partial(MenuCreateSchema),
  t.Object({
    groupTemplateIds: t.Optional(t.Array(UUID)) // <— NEW, relation-only field
  })
])

/* ============================== Helpers ============================== */
export const toNumber = (x: Decimal | number | null | undefined) =>
    x == null ? null : Number(x as any)

/** Normalize menu body → DB create payload */
export const toMenuCreate = (merchantId: string, body: MenuCreateDTO) => ({
    merchantId,
    name: body.name,
    description: body.description ?? null,
    basePrice: body.basePrice,
    originalPrice: body.originalPrice ?? null,
    leftoverQty: body.leftoverQty ?? 0,
    expiresAt: body.expiresAt ? new Date(body.expiresAt) : new Date(),
    status: (body.status as MenuItemStatus) ?? MenuItemStatus.DRAFT,
    photoUrl: body.photoUrl ?? null,
    expireLabelUrl: body.expireLabelUrl ?? ''
})

/** Normalize partial menu update */
export const toMenuUpdate = (body: MenuUpdateDTO) => {
  const out: Record<string, unknown> = {}
  if (body.name !== undefined) out.name = body.name
  if (body.description !== undefined) out.description = body.description ?? null
  if (body.basePrice !== undefined) out.basePrice = body.basePrice
  if (body.originalPrice !== undefined) out.originalPrice = body.originalPrice ?? null
  if (body.leftoverQty !== undefined) out.leftoverQty = body.leftoverQty
  if (body.expiresAt !== undefined) {
    if (body.expiresAt === null) {
      // choose: either omit to avoid touching DB, or throw 400 in the route
      // here we omit; route can enforce non-null if needed
    } else {
      out.expiresAt = new Date(body.expiresAt)
    }
  }
  if (body.status !== undefined) out.status = body.status as MenuItemStatus
  if (body.photoUrl !== undefined) out.photoUrl = body.photoUrl ?? null
  if (body.expireLabelUrl !== undefined) out.expireLabelUrl = body.expireLabelUrl ?? ''
  return out
}


/** Cast Prisma result → plain numbers for prices */
export const castMenuItem = (m: any) => ({
    ...m,
    basePrice: Number(m.basePrice),
    originalPrice: m.originalPrice == null ? null : Number(m.originalPrice),
    optionGroups: (m.optionGroups ?? []).map((g: any) => ({
        ...g,
        options: (g.options ?? []).map((o: any) => ({
            ...o,
            priceDelta: Number(o.priceDelta)
        }))
    }))
})

// -- Create (User) --
export const UserCreateSchema = t.Object({
  name: t.Optional(t.String({ minLength: 0 })),   // name is optional now
  email: t.String({ format: "email" }),
  phone: t.Optional(t.String({ minLength: 8 })),     // optional to match model
  dob: t.Optional(t.Union([t.String(), t.Date()])),  // <- made Optional
  avatarUrl: t.Optional(t.String()),
  role: t.Optional(t.Union([
    t.Literal("CUSTOMER"),
    t.Literal("MERCHANT"),
    t.Literal("ADMIN"),
    t.Literal("STAFF"),
  ])),
  status: t.Optional(t.Union([
    t.Literal("ACTIVE"),
    t.Literal("SUSPENDED"),
    t.Literal("DELETED"),
  ])),
})

// -- Success (User) --
export const SuccessCreatedUserSchema = t.Object({
  message: t.Literal('User created'),
  user: t.Object({
    id: t.String(),
    name: t.Union([t.String(), t.Null()]), 
    email: t.String(),
    phone: t.Union([t.String(), t.Null()]),
    dob: t.Union([t.String(), t.Null()]),   // <- was t.String(); now nullable
    avatarUrl: t.Union([t.String(), t.Null()]),
    role: t.String(),
    status: t.String(),
    createdAt: t.String(),
  })
})

