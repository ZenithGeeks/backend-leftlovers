import { Elysia, t } from 'elysia'
import { PrismaClient, MenuItemStatus } from '@prisma/client'

const prisma = new PrismaClient()

/* ------------------- 🧩 Reusable Validation Schemas ------------------- */

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
  expireLabelUrl: t.Optional(t.String())
})

const MenuUpdate = t.Partial(MenuCreate)

const GroupCreate = t.Object({
  menuId: t.String(),
  name: t.String(),
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
  expireLabelUrl: body.expireLabelUrl ?? null
})

const toMenuUpdate = (body: any) => ({
  ...(body.name && { name: body.name }),
  ...(body.description !== undefined && { description: body.description ?? null }),
  ...(body.basePrice !== undefined && { basePrice: body.basePrice }),
  ...(body.originalPrice !== undefined && { originalPrice: body.originalPrice ?? null }),
  ...(body.leftoverQty !== undefined && { leftoverQty: body.leftoverQty }),
  ...(body.expiresAt && { expiresAt: new Date(body.expiresAt) }),
  ...(body.status && { status: body.status as MenuItemStatus }),
  ...(body.photoUrl !== undefined && { photoUrl: body.photoUrl ?? null }),
  ...(body.expireLabelUrl !== undefined && { expireLabelUrl: body.expireLabelUrl ?? null })
})

export const merchantMenu = new Elysia({ prefix: '/merchant' })

  /* ===================== MENU ===================== */

  // Get all menu items
  .get('/:merchantId/menu', async ({ params, set }) => {
    const items = await prisma.menuItem.findMany({
      where: { merchantId: params.merchantId },
      orderBy: { createdAt: 'desc' }
    })

    if (!items.length) {
      set.status = 404
      return { message: 'No menu found' }
    }

    return items.map(i => ({
      ...i,
      basePrice: Number(i.basePrice),
      originalPrice: i.originalPrice === null ? null : Number(i.originalPrice)
    }))
  })

  // Get single menu
  .get('/:merchantId/menu/:menuId', async ({ params, set }) => {
    const item = await prisma.menuItem.findFirst({
      where: { id: params.menuId, merchantId: params.merchantId }
    })

    if (!item) {
      set.status = 404
      return { message: 'Menu not found' }
    }

    return {
      ...item,
      basePrice: Number(item.basePrice),
      originalPrice: item.originalPrice ? Number(item.originalPrice) : null
    }
  })

  // Create menu
  .post('/:merchantId/menu', async ({ params, body, set }) => {
    const created = await prisma.menuItem.create({ data: toMenuCreate(params.merchantId, body) })
    set.status = 201
    return created
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
      data: toMenuUpdate(body)
    })

    return updated
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

  // Get groups by merchant (via menuId)
  .get('/:merchantId/group', async ({ params, set }) => {
    const menuIds = await prisma.menuItem.findMany({
      where: { merchantId: params.merchantId },
      select: { id: true }
    })

    const groups = await prisma.optionGroup.findMany({
      where: { menuId: { in: menuIds.map(m => m.id) } },
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
    const menu = await prisma.menuItem.findFirst({
      where: { id: body.menuId, merchantId: params.merchantId }
    })
    if (!menu) {
      set.status = 404
      return { message: 'Menu not found for this merchant' }
    }

    const created = await prisma.optionGroup.create({
      data: {
        menuId: body.menuId,
        name: body.name,
        minSelect: body.minSelect ?? 0,
        maxSelect: body.maxSelect ?? 1,
        options: body.options
          ? { create: body.options.map(o => ({
              name: o.name,
              priceDelta: o.priceDelta,
              active: o.active ?? true
            })) }
          : undefined
      },
      include: { options: true }
    })

    set.status = 201
    return created
  }, { body: GroupCreate })

  // Update group
  .put('/:merchantId/group/:groupId', async ({ params, body, set }) => {
    const group = await prisma.optionGroup.findFirst({
      where: { id: params.groupId }
    })
    if (!group) {
      set.status = 404
      return { message: 'Group not found' }
    }

    const menu = await prisma.menuItem.findFirst({
      where: { id: group.menuId, merchantId: params.merchantId }
    })
    if (!menu) {
      set.status = 403
      return { message: 'Group does not belong to this merchant' }
    }

    const updated = await prisma.optionGroup.update({
      where: { id: params.groupId },
      data: body
    })

    return updated
  }, { body: GroupUpdate })

  // Create option inside group
  .post('/:merchantId/group/:groupId/options', async ({ params, body, set }) => {
    const group = await prisma.optionGroup.findFirst({
      where: { id: params.groupId }
    })
    if (!group) {
      set.status = 404
      return { message: 'Group not found' }
    }

    const menu = await prisma.menuItem.findFirst({
      where: { id: group.menuId, merchantId: params.merchantId }
    })
    if (!menu) {
      set.status = 403
      return { message: 'Group does not belong to this merchant' }
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

  // Update option
  .put('/:merchantId/group/:groupId/options/:optionId', async ({ params, body, set }) => {
    const option = await prisma.option.findFirst({
      where: { id: params.optionId }
    })
    if (!option) {
      set.status = 404
      return { message: 'Option not found' }
    }

    const group = await prisma.optionGroup.findFirst({
      where: { id: option.optionGroupId }
    })
    if (!group) {
      set.status = 404
      return { message: 'Group not found' }
    }

    const menu = await prisma.menuItem.findFirst({
      where: { id: group.menuId, merchantId: params.merchantId }
    })
    if (!menu) {
      set.status = 403
      return { message: 'Option does not belong to this merchant' }
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
      where: { id: params.optionId }
    })
    if (!option) {
      set.status = 404
      return { message: 'Option not found' }
    }

    const group = await prisma.optionGroup.findFirst({
      where: { id: option.optionGroupId }
    })
    if (!group) {
      set.status = 404
      return { message: 'Group not found' }
    }

    const menu = await prisma.menuItem.findFirst({
      where: { id: group.menuId, merchantId: params.merchantId }
    })
    if (!menu) {
      set.status = 403
      return { message: 'Option does not belong to this merchant' }
    }

    await prisma.option.delete({ where: { id: params.optionId } })
    set.status = 204
    return null
  })

  // Delete group
  .delete('/:merchantId/group/:groupId', async ({ params, set }) => {
    const group = await prisma.optionGroup.findFirst({
      where: { id: params.groupId }
    })
    if (!group) {
      set.status = 404
      return { message: 'Group not found' }
    }

    const menu = await prisma.menuItem.findFirst({
      where: { id: group.menuId, merchantId: params.merchantId }
    })
    if (!menu) {
      set.status = 403
      return { message: 'Group does not belong to this merchant' }
    }

    await prisma.optionGroup.delete({ where: { id: params.groupId } })
    set.status = 204
    return null
  })