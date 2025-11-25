// src/routes/merchant.menu.ts
import { Elysia } from 'elysia'
import { PrismaClient } from '@prisma/client'
import {
  MenuCreateSchema,
  MenuUpdateSchema,
  GroupCreateSchema,
  GroupUpdateSchema,
  OptionCreateSchema,
  OptionUpdateSchema,
  castMenuItem,
  toMenuCreate,
  toMenuUpdate

} from '../../../types'

const prisma = new PrismaClient()

export const merchantMenu = new Elysia({ prefix: '/merchant' })

  /* ===================== MENU ===================== */

  .get('/:merchantId/menu', async ({ params, set }) => {
    const items = await prisma.menuItem.findMany({
      where: { merchantId: params.merchantId },
      include: { optionGroups: { include: { options: true } } },
      orderBy: { createdAt: 'desc' }
    })

    if (!items.length) {
      set.status = 404
      return { message: 'No menu found' }
    }
    return items.map(castMenuItem)
  }, { tags: ['Menu'] })

  .get('/:merchantId/menu/:menuId', async ({ params, set }) => {
    const item = await prisma.menuItem.findFirst({
      where: { id: params.menuId, merchantId: params.merchantId },
      include: {
          optionGroups: {
            include: {
              options: true,
            },
          },
        },
    })

    if (!item) {
      set.status = 404
      return { message: 'Menu not found' }
    }
    return castMenuItem(item)
  }, { tags: ['Menu'] })

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
      include: { optionGroups: { include: { options: true } } }
    })

    set.status = 201
    return castMenuItem(created)
  }, { body: MenuCreateSchema, tags: ['Menu'] })

  .put('/:merchantId/menu/:menuId', async ({ params, body, set }) => {
    const item = await prisma.menuItem.findFirst({
      where: { id: params.menuId, merchantId: params.merchantId }
    })
    if (!item) {
      set.status = 404
      return { message: 'Menu not found' }
    }

    if ('expiresAt' in body && body.expiresAt === null) {
      set.status = 400
      return { message: 'expiresAt cannot be null' }
    }

    const scalar = toMenuUpdate(body)

    let groups
    if (Array.isArray(body.groupTemplateIds)) {
      const ids = [...new Set(body.groupTemplateIds)]
      if (ids.length === 0) {
        groups = { set: [] }
      } else {
        const valid = await prisma.optionGroup.findMany({
          where: { id: { in: ids }, merchantId: params.merchantId },
          select: { id: true }
        })
        if (valid.length !== ids.length) {
          set.status = 400
          return { message: 'One or more option groups are invalid for this merchant' }
        }
        groups = { set: valid.map(g => ({ id: g.id })) }
      }
    }

    const updated = await prisma.menuItem.update({
      where: { id: params.menuId },
      data: { ...scalar, ...(groups ? { optionGroups: groups } : {}) },
      include: { optionGroups: { include: { options: true } } }
    })

    return castMenuItem(updated)
  }, { body: MenuUpdateSchema, tags: ['Menu'] })

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
  }, { tags: ['Menu'] })

  /* ===================== GROUPS ===================== */
  // (Use direct merchant ownership instead of nested menu.some filters)

  .get('/:merchantId/group', async ({ params, set }) => {
    const groups = await prisma.optionGroup.findMany({
      where: { merchantId: params.merchantId },
      include: { options: true },
      orderBy: { name: 'desc' }
    })

    if (!groups.length) {
      set.status = 404
      return { message: 'No groups found' }
    }

    return groups.map(g => ({
      ...g,
      options: g.options.map(o => ({ ...o, priceDelta: Number(o.priceDelta) }))
    }))
  }, { tags: ['Options'] })

  .post('/:merchantId/group', async ({ params, body, set }) => {
    const merchant = await prisma.merchant.findUnique({
      where: { id: params.merchantId },
      select: { id: true }
    })
    if (!merchant) {
      set.status = 404
      return { message: 'Merchant not found'}
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
          : undefined
      },
      include: { options: true }
    })

    set.status = 201
    return {
      ...created,
      options: created.options.map(o => ({ ...o, priceDelta: Number(o.priceDelta) }))
    }
  }, { body: GroupCreateSchema, tags: ['Options'] })

  .put('/:merchantId/group/:groupId', async ({ params, body, set }) => {
    const group = await prisma.optionGroup.findFirst({
      where: { id: params.groupId, merchantId: params.merchantId }
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
  }, { body: GroupUpdateSchema, tags: ['Options'] })

  .post('/:merchantId/group/:groupId/options', async ({ params, body, set }) => {
    const group = await prisma.optionGroup.findFirst({
      where: { id: params.groupId, merchantId: params.merchantId }
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
  }, { body: OptionCreateSchema, tags: ['Options'] })

  .put('/:merchantId/group/:groupId/options/:optionId', async ({ params, body, set }) => {
    const option = await prisma.option.findFirst({
      where: { id: params.optionId, optionGroup: { merchantId: params.merchantId } }
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
  }, { body: OptionUpdateSchema, tags: ['Options'] })

  .delete('/:merchantId/group/:groupId/options/:optionId', async ({ params, set }) => {
    const option = await prisma.option.findFirst({
      where: { id: params.optionId, optionGroup: { merchantId: params.merchantId } }
    })
    if (!option) {
      set.status = 404
      return { message: 'Option not found' }
    }

    await prisma.option.delete({ where: { id: params.optionId } })
    set.status = 204
    return null
  }, { tags: ['Options'] })

  .delete('/:merchantId/group/:groupId', async ({ params, set }) => {
    const group = await prisma.optionGroup.findFirst({
      where: { id: params.groupId, merchantId: params.merchantId }
    })
    if (!group) {
      set.status = 404
      return { message: 'Group not found' }
    }

    await prisma.optionGroup.delete({ where: { id: params.groupId } })
    set.status = 204
    return null
  }, { tags: ['Options'] })