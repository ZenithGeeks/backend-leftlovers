// routes/merchant.menu.ts
import { Elysia, t } from 'elysia'
import { Prisma, PrismaClient } from '@prisma/client'
import { MenuItemInputCreate, MenuItemPlain } from '../../../generated/prismabox/MenuItem'
import { OptionGroupTemplatePlain } from '../../../generated/prismabox/OptionGroupTemplate'
import { OptionGroupInputCreate } from '../../../generated/prismabox/OptionGroup'
import { OptionTemplateInputUpdate, OptionTemplatePlain } from '../../../generated/prismabox/OptionTemplate'

const prisma = new PrismaClient().$extends({
  result: {
    menuItem: {
      basePrice: {
        needs: { basePrice: true },
        compute: ({ basePrice }) => Number(basePrice)
      },
      originalPrice: {
        needs: { originalPrice: true },
        compute: ({ originalPrice }) =>
          originalPrice === null ? null : Number(originalPrice)
      }
    },
    optionTemplate: {
      priceDelta: {
        needs: { priceDelta: true },
        compute: ({ priceDelta }) => Number(priceDelta)
      }
    },
    option: {
      priceDelta: {
        needs: { priceDelta: true },
        compute: ({ priceDelta }) => Number(priceDelta)
      }
    },
    payment: {
      amount: {
        needs: { amount: true },
        compute: ({ amount }) => Number(amount)
      }
    },
    promotion: {
      value: {
        needs: { value: true },
        compute: ({ value }) => Number(value)
      },
      minOrder: {
        needs: { minOrder: true },
        compute: ({ minOrder }) =>
          minOrder === null ? null : Number(minOrder)
      }
    }
  }
})

// ---------- Router ----------
export const merchantMenu = new Elysia({ prefix: '/merchant' })

  /* ===================== MENU ===================== */

  // Get Menu by RestaurantID
  // GET /api/merchant/:restaurant_id/menu
  .get(
    '/:restaurant_id/menu',
    async ({ params: { restaurant_id }, set }) => {
      const rows = await prisma.menuItem.findMany({
        where: { merchantId: restaurant_id },
        orderBy: { createdAt: 'desc' }
      })
      if (!rows.length) { set.status = 404; return 'No menu found' }
      return rows // numbers already computed by $extends
    },
    {
      detail: { tags: ['Menu'], summary: 'Get Menu by RestaurantID' },
      params: t.Object({ restaurant_id: t.String() }),
      response: { 200: t.Array(MenuItemPlain), 404: t.String() }
    }
  )

  // Post new Menu by RestaurantID
  // POST /api/merchant/:restaurant_id/menu
  .post(
    '/:restaurant_id/menu',
    async ({ params: { restaurant_id }, body, set }) => {
      // Build Unchecked create input (FKs only). Do NOT include nested relations.
      const categoryId =
        'categoryId' in body
          ? (body as any).categoryId ?? null
          : (body as any).category?.connect?.id ?? null

      const data: Prisma.MenuItemUncheckedCreateInput = {
        merchantId: restaurant_id,
        categoryId: categoryId,
        name: body.name,
        description: body.description ?? null,
        basePrice: body.basePrice,
        originalPrice: body.originalPrice ?? null,
        leftoverQty: body.leftoverQty ?? 0,
        expiresAt: body.expiresAt ? new Date((body as any).expiresAt as string) : null,
        status: (body.status as any) ?? 'DRAFT',
        photoUrl: body.photoUrl ?? null,
        expireLabelUrl: body.expireLabelUrl ?? null
      }

      const created = await prisma.menuItem.create({ data })
      set.status = 201
      return created
    },
    {
      detail: { tags: ['Menu'], summary: 'Post new Menu by RestaurantID' },
      params: t.Object({ restaurant_id: t.String() }),
      body: MenuItemInputCreate,
      response: { 201: MenuItemPlain }
    }
  )

  // Delete Menu by RestaurantID and MenuID
  // DELETE /api/merchant/:restaurant_id/menu/:menu_id
  .delete(
    '/:restaurant_id/menu/:menu_id',
    async ({ params: { restaurant_id, menu_id }, set }) => {
      const exists = await prisma.menuItem.findFirst({
        where: { id: menu_id, merchantId: restaurant_id }
      })
      if (!exists) { set.status = 404; return 'Menu not found' }

      await prisma.menuItem.delete({ where: { id: menu_id } })
      set.status = 204
      return null
    },
    {
      detail: { tags: ['Menu'], summary: 'Delete Menu by RestaurantID and MenuID' },
      params: t.Object({ restaurant_id: t.String(), menu_id: t.String() }),
      response: { 204: t.Null(), 404: t.String() }
    }
  )

  // Edit Menu by RestaurantID and MenuID
  // PUT /api/merchant/:restaurant_id/menu/:menu_id
  .put(
    '/:restaurant_id/menu/:menu_id',
    async ({ params: { restaurant_id, menu_id }, body, set }) => {
      const exists = await prisma.menuItem.findFirst({
        where: { id: menu_id, merchantId: restaurant_id }
      })
      if (!exists) { set.status = 404; return 'Menu not found' }

      const updated = await prisma.menuItem.update({
        where: { id: menu_id },
        data: body // Partial accepted by schema below
      })
      return updated
    },
    {
      detail: { tags: ['Menu'], summary: 'Edit Menu by RestaurantID and MenuID' },
      params: t.Object({ restaurant_id: t.String(), menu_id: t.String() }),
      body: t.Partial(MenuItemInputCreate),
      response: { 200: MenuItemPlain, 404: t.String() }
    }
  )

  /* ========== RESTAURANT-WIDE GROUPS & OPTIONS (TEMPLATES) ========== */

  // Get Options by RestaurantID
  // GET /api/merchant/:restaurant_id/group
  .get(
    '/:restaurant_id/group',
    async ({ params: { restaurant_id }, set }) => {
      const groups = await prisma.optionGroupTemplate.findMany({
        where: { merchantId: restaurant_id },
        include: { options: true },
        orderBy: { sortOrder: 'asc' }
      })
      if (!groups.length) { set.status = 404; return 'No groups found' }
      return groups
    },
    {
      detail: { tags: ['Options'], summary: 'Get Options by RestaurantID' },
      params: t.Object({ restaurant_id: t.String() }),
      response: {
        200: t.Array(
          t.Intersect([
            OptionGroupTemplatePlain,
            t.Object({ options: t.Array(OptionTemplatePlain) })
          ])
        ),
        404: t.String()
      }
    }
  )

  // Post new options by RestaurantID (create a group, optionally with options)
  // POST /api/merchant/:restaurant_id/group
  .post(
    '/:restaurant_id/group',
    async ({ params: { restaurant_id }, body, set }) => {
      const created = await prisma.optionGroupTemplate.create({
        data: {
          merchantId: restaurant_id,
          name: body.name,
          minSelect: body.minSelect ?? 0,
          maxSelect: body.maxSelect ?? 1,
          sortOrder: body.sortOrder ?? 0,
          options: body.options
            ? {
              create: body.options.map(o => ({
                name: o.name,
                priceDelta: o.priceDelta,
                sortOrder: o.sortOrder ?? 0,
                active: o.active ?? true
              }))
            }
            : undefined
        },
        include: { options: true }
      })
      set.status = 201
      return created
    },
    {
      detail: { tags: ['Options'], summary: 'Post new options by RestaurantID' },
      params: t.Object({ restaurant_id: t.String() }),
      body: t.Intersect([
        OptionGroupInputCreate,
        t.Object({ options: t.Optional(t.Array(OptionTemplatePlain)) })
      ]),
      response: t.Intersect([
        OptionGroupTemplatePlain,
        t.Object({ options: t.Array(OptionTemplatePlain) })
      ])
    }
  )

  // Edit Option by RestaurantID, GroupID and OptionID
  // PUT /api/merchant/:restaurant_id/group/:group_id/options/:option_id
  .put(
    '/:restaurant_id/group/:group_id/options/:option_id',
    async ({ params: { restaurant_id, group_id, option_id }, body, set }) => {
      const group = await prisma.optionGroupTemplate.findFirst({
        where: { id: group_id, merchantId: restaurant_id }
      })
      if (!group) { set.status = 404; return 'Group not found' }

      const updated = await prisma.optionTemplate.update({
        where: { id: option_id },
        data: body
      })
      return updated
    },
    {
      detail: { tags: ['Options'], summary: 'Edit Option by RestaurantID, GroupID and OptionID' },
      params: t.Object({
        restaurant_id: t.String(),
        group_id: t.String(),
        option_id: t.String()
      }),
      body: OptionTemplateInputUpdate,
      response: { 200: OptionTemplatePlain, 404: t.String() }
    }
  )

  // Delete Option by RestaurantID, GroupID and OptionID
  // DELETE /api/merchant/:restaurant_id/group/:group_id/options/:option_id
  .delete(
    '/:restaurant_id/group/:group_id/options/:option_id',
    async ({ params: { restaurant_id, group_id, option_id }, set }) => {
      const group = await prisma.optionGroupTemplate.findFirst({
        where: { id: group_id, merchantId: restaurant_id }
      })
      if (!group) { set.status = 404; return 'Group not found' }

      await prisma.optionTemplate.delete({ where: { id: option_id } })
      set.status = 204
      return null
    },
    {
      detail: { tags: ['Options'], summary: 'Delete Option by RestaurantID, GroupID and OptionID' },
      params: t.Object({
        restaurant_id: t.String(),
        group_id: t.String(),
        option_id: t.String()
      }),
      response: { 204: t.Null(), 404: t.String() }
    }
  )

  // Delete Group by RestaurantID, GroupID
  // DELETE /api/merchant/:restaurant_id/group/:group_id
  .delete(
    '/:restaurant_id/group/:group_id',
    async ({ params: { restaurant_id, group_id }, set }) => {
      const group = await prisma.optionGroupTemplate.findFirst({
        where: { id: group_id, merchantId: restaurant_id }
      })
      if (!group) { set.status = 404; return 'Group not found' }

      await prisma.optionGroupTemplate.delete({ where: { id: group_id } })
      set.status = 204
      return null
    },
    {
      detail: { tags: ['Options'], summary: 'Delete Group by RestaurantID, GroupID' },
      params: t.Object({ restaurant_id: t.String(), group_id: t.String() }),
      response: { 204: t.Null(), 404: t.String() }
    }
  )
