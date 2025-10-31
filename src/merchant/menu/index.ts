import { Elysia, t } from 'elysia'
import { PrismaClient, MenuItemStatus } from '@prisma/client'

const prisma = new PrismaClient()

/* ------------------- 🧩 Reusable Validation Schemas ------------------- */





const GroupCreate = t.Object({
  name: t.String(),
  merchantId: t.String(),
  minSelect: t.Optional(t.Number()),
  maxSelect: t.Optional(t.Number()),
  options: t.Optional(
    t.Array(
      t.Object({
        name: t.String(),
        priceDelta: t.Number(),
        active: t.Optional(t.Boolean())
      })
    )
  )
})

const MenuCreate = t.Object({
  name: t.String(),
  description: t.Optional(t.String()),
  basePrice: t.Number(),
  originalPrice: t.Optional(t.Number()),
  leftoverQty: t.Optional(t.Number()),
  expiresAt: t.Optional(t.String()),
  status: t.Optional(
    t.Union([
      t.Literal('DRAFT'),
      t.Literal('LIVE'),
      t.Literal('SOLD_OUT'),
      t.Literal('EXPIRED')
    ])
  ),
  photoUrl: t.Optional(t.String()),
  // DB requires String (non-null). Accept optional in API, default to "" when writing.
  expireLabelUrl: t.Optional(t.String()),
  groupTemplates: t.Optional(t.Array(GroupCreate))
})


const MenuUpdate = t.Partial(MenuCreate)

const GroupUpdate = t.Partial(
  t.Object({
    name: t.String(),
    minSelect: t.Number(),
    maxSelect: t.Number()
  })
)

const OptionCreate = t.Object({
  name: t.String(),
  priceDelta: t.Number(),
  active: t.Optional(t.Boolean())
})

const OptionUpdate = t.Partial(OptionCreate)

/* ------------------- 🧠 Helper Functions ------------------- */

const toMenuCreate = (merchantId: string, body: any) => ({
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

const toMenuUpdate = (body: any) => ({
  ...(body.name !== undefined && { name: body.name }),
  ...(body.description !== undefined && { description: body.description ?? null }),
  ...(body.basePrice !== undefined && { basePrice: body.basePrice }),
  ...(body.originalPrice !== undefined && { originalPrice: body.originalPrice ?? null }),
  ...(body.leftoverQty !== undefined && { leftoverQty: body.leftoverQty }),
  ...(body.expiresAt !== undefined && { expiresAt: body.expiresAt ? new Date(body.expiresAt) : new Date() }),
  ...(body.status !== undefined && { status: body.status as MenuItemStatus }),
  ...(body.photoUrl !== undefined && { photoUrl: body.photoUrl ?? null }),
  // keep non-null string
  ...(body.expireLabelUrl !== undefined && { expireLabelUrl: body.expireLabelUrl ?? '' })
})

/* small caster for nested reads */
const castMenuItem = (m: any) => ({
  ...m,
  basePrice: Number(m.basePrice),
  originalPrice: m.originalPrice === null ? null : Number(m.originalPrice),
  // include nested groups+options if present
  optionGroups: (m.optionGroups ?? []).map((g: any) => ({
    ...g,
    options: (g.options ?? []).map((o: any) => ({
      ...o,
      priceDelta: Number(o.priceDelta)
    }))
  }))
})

export const merchantMenu = new Elysia({ prefix: '/merchant' })

  /* ===================== MENU ===================== */

  // Get all menu items (now returns nested groups + options, casted)
  .get('/:merchantId/menu', async ({ params, set }) => {
    const items = await prisma.menuItem.findMany({
      where: { merchantId: params.merchantId },
      include: {
        optionGroups: {
          include: { options: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    if (!items.length) {
      set.status = 404
      return { message: 'No menu found' }
    }

    return items.map(castMenuItem)
  })

  // Get single menu (now returns nested groups + options, casted)
  .get('/:merchantId/menu/:menuId', async ({ params, set }) => {
    const item = await prisma.menuItem.findFirst({
      where: { id: params.menuId, merchantId: params.merchantId },
      include: {
        optionGroups: {
          include: { options: true }
        }
      }
    })

    if (!item) {
      set.status = 404
      return { message: 'Menu not found' }
    }

    return castMenuItem(item)
  })

  // Create menu
  .post('/:merchantId/menu', async ({ params, body, set }) => {
    const data = toMenuCreate(params.merchantId, body)

    const created = await prisma.menuItem.create({
      data: {
        ...data,
        optionGroups: body.groupTemplates
          ? {
            create: body.groupTemplates.map((g: any) => ({
              name: g.name,
              merchantId: params.merchantId,
              minSelect: g.minSelect ?? 0,
              maxSelect: g.maxSelect ?? 1,
              options: g.options
                ? {
                  create: g.options.map((o: any) => ({
                    name: o.name,
                    priceDelta: o.priceDelta,
                    active: o.active ?? true
                  }))
                }
                : undefined
            }))
          }
          : undefined
      },
      include: {
        optionGroups: {
          include: { options: true }
        }
      }
    })

    set.status = 201
    return castMenuItem(created)
  }, { body: MenuCreate })

  // Update menu
  .put('/:merchantId/menu/:menuId', async ({ params, body, set }) => {
    const exists = await prisma.menuItem.findFirst({
      where: { id: params.menuId, merchantId: params.merchantId }
    })
    if (!exists) {
      set.status = 404
      return { message: 'Menu not found' }
    }

    const updated = await prisma.menuItem.update({
      where: { id: params.menuId },
      data: toMenuUpdate(body),
      include: {
        optionGroups: { include: { options: true } }
      }
    })

    return castMenuItem(updated)
  }, { body: MenuUpdate })
  // Delete menu
  .delete('/:merchantId/menu/:menuId', async ({ params, set }) => {
    const exists = await prisma.menuItem.findFirst({
      where: { id: params.menuId, merchantId: params.merchantId }
    })
    if (!exists) {
      set.status = 404
      return { message: 'Menu not found' }
    }

    await prisma.menuItem.delete({ where: { id: params.menuId } })
    set.status = 204
    return null
  })

  /* ===================== GROUPS ===================== */

  .get('/:merchantId/group', async ({ params, set }) => {
  const groups = await prisma.optionGroup.findMany({
    where: { menu: { some: { merchantId: params.merchantId } } },
    include: { options: true }
  })

  if (!groups.length) {
    set.status = 404
    return { message: 'No groups found' }
  }

  return groups.map(g => ({
    ...g,
    options: g.options.map(o => ({ ...o, priceDelta: Number(o.priceDelta) }))
  }))
})

  // Create group (with options)
  .post('/:merchantId/group', async ({ params, body, set }) => {
  // body.menuId is only for linking; it's not stored in OptionGroup
  const menu = await prisma.merchant.findFirst({
    where: { id: params.merchantId }
  })
  if (!menu) {
    set.status = 404
    return { message: 'Merchant not found' }
  }

  const created = await prisma.optionGroup.create({
    data: {
      name: body.name,
      merchantId: params.merchantId,
      minSelect: body.minSelect ?? 0,
      maxSelect: body.maxSelect ?? 1,
      options: body.options
        ? {
            create: body.options.map((o: any) => ({
              name: o.name,
              priceDelta: o.priceDelta,
              active: o.active ?? true
            }))
          }
        : undefined,
    },
    include: { options: true }
  })

  set.status = 201
  return {
    ...created,
    options: created.options.map(o => ({ ...o, priceDelta: Number(o.priceDelta) }))
  }
}, { body: GroupCreate })

  // Update group
  .put('/:merchantId/group/:groupId', async ({ params, body, set }) => {
  const group = await prisma.optionGroup.findFirst({
    where: {
      id: params.groupId,
      menu: { some: { merchantId: params.merchantId } }
    }
  })
  if (!group) {
    set.status = 404
    return { message: 'Group not found' }
  }

  const updated = await prisma.optionGroup.update({
    where: { id: params.groupId },
    data: body
  })

  return updated
}, { body: GroupUpdate })

  // Create option in group
.post('/:merchantId/group/:groupId/options', async ({ params, body, set }) => {
  const group = await prisma.optionGroup.findFirst({
    where: {
      id: params.groupId,
      menu: { some: { merchantId: params.merchantId } } 
    }
  })
  if (!group) {
    set.status = 404
    return { message: 'Group not found' }
  }

  const created = await prisma.option.create({
    data: {
      optionGroupId: params.groupId,
      name: body.name,
      priceDelta: body.priceDelta,
      active: body.active ?? true
    }
  })

  set.status = 201
  return { ...created, priceDelta: Number(created.priceDelta) }
}, { body: OptionCreate })

.put('/:merchantId/group/:groupId/options/:optionId', async ({ params, body, set }) => {
  const option = await prisma.option.findFirst({
    where: {
      id: params.optionId,
      optionGroup: { menu: { some: { merchantId: params.merchantId } } }
    }
  })
  if (!option) {
    set.status = 404
    return { message: 'Option not found' }
  }

  const updated = await prisma.option.update({
    where: { id: params.optionId },
    data: body
  })

  return { ...updated, priceDelta: Number(updated.priceDelta) }
}, { body: OptionUpdate })

// Delete option
.delete('/:merchantId/group/:groupId/options/:optionId', async ({ params, set }) => {
  const option = await prisma.option.findFirst({
    where: {
      id: params.optionId,
      optionGroup: { menu: { some: { merchantId: params.merchantId } } }
    }
  })
  if (!option) {
    set.status = 404
    return { message: 'Option not found' }
  }

  await prisma.option.delete({ where: { id: params.optionId } })
  set.status = 204
  return null
})

  .delete('/:merchantId/group/:groupId', async ({ params, set }) => {
  const group = await prisma.optionGroup.findFirst({
    where: {
      id: params.groupId,
      menu: { some: { merchantId: params.merchantId } }
    }
  })
  if (!group) {
    set.status = 404
    return { message: 'Group not found' }
  }

  await prisma.optionGroup.delete({ where: { id: params.groupId } })
  set.status = 204
  return null
})
