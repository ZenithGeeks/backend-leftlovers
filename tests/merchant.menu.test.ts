import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Elysia } from 'elysia'
import { merchantMenu } from '../src/merchant/menu'

// We will mock PrismaClient methods used within routes to avoid DB access
vi.mock('@prisma/client', () => {
  const menuItem = {
    findMany: vi.fn(),
    create: vi.fn(),
    findFirst: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  }
  const optionGroupTemplate = {
    findMany: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    delete: vi.fn()
  }
  const optionTemplate = {
    update: vi.fn(),
    delete: vi.fn()
  }
  return { PrismaClient: vi.fn(() => ({ menuItem, optionGroupTemplate, optionTemplate })) }
})

// helper to spin up app per test
const createApp = () => new Elysia().use(merchantMenu)

// Reset mocks between tests
beforeEach(() => {
  vi.clearAllMocks()
})

describe('merchantMenu routes', () => {
  it('Should return 404 when no menu found for restaurant', async () => {
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient() as any
    prisma.menuItem.findMany.mockResolvedValueOnce([])

    const app = createApp()
    const res = await app.handle(new Request('http://localhost/merchant/abc/menu'))
    expect(res.status).toBe(404)
    expect(await res.text()).toBe('No menu found')
  })

  it('Should return menu items ordered by createdAt desc', async () => {
    const rows = [{ id: '2', createdAt: new Date('2024-01-02') }, { id: '1', createdAt: new Date('2024-01-01') }]
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient() as any
    prisma.menuItem.findMany.mockResolvedValueOnce(rows)

    const app = createApp()
    const res = await app.handle(new Request('http://localhost/merchant/r1/menu'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual(rows)
    expect(prisma.menuItem.findMany).toHaveBeenCalledWith({
      where: { merchantId: 'r1' },
      orderBy: { createdAt: 'desc' }
    })
  })

  it('Should create a new menu item and return 201', async () => {
    const created = { id: 'new1', merchantId: 'r1', name: 'Pizza' }
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient() as any
    prisma.menuItem.create.mockResolvedValueOnce(created)

    const app = createApp()
    const res = await app.handle(new Request('http://localhost/merchant/r1/menu', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'Pizza' })
    }))
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body).toEqual(created)
    expect(prisma.menuItem.create).toHaveBeenCalledWith({ data: { name: 'Pizza', merchantId: 'r1' } })
  })

  it('Should 404 when updating a non-existing menu item', async () => {
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient() as any
    prisma.menuItem.findFirst.mockResolvedValueOnce(null)

    const app = createApp()
    const res = await app.handle(new Request('http://localhost/merchant/r1/menu/m1', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'Updated' })
    }))
    expect(res.status).toBe(404)
    expect(await res.text()).toBe('Menu not found')
  })

  it('Should update an existing menu item', async () => {
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient() as any
    prisma.menuItem.findFirst.mockResolvedValueOnce({ id: 'm1', merchantId: 'r1' })
    prisma.menuItem.update.mockResolvedValueOnce({ id: 'm1', name: 'Updated' })

    const app = createApp()
    const res = await app.handle(new Request('http://localhost/merchant/r1/menu/m1', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'Updated' })
    }))

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({ id: 'm1', name: 'Updated' })
    expect(prisma.menuItem.update).toHaveBeenCalledWith({ where: { id: 'm1' }, data: { name: 'Updated' } })
  })

  it('Should delete a menu item returning 204', async () => {
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient() as any
    prisma.menuItem.findFirst.mockResolvedValueOnce({ id: 'm1', merchantId: 'r1' })
    prisma.menuItem.delete.mockResolvedValueOnce(undefined)

    const app = createApp()
    const res = await app.handle(new Request('http://localhost/merchant/r1/menu/m1', { method: 'DELETE' }))
    expect(res.status).toBe(204)
    expect(await res.text()).toBe('null')
  })

  it('Should return 404 when no groups found', async () => {
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient() as any
    prisma.optionGroupTemplate.findMany.mockResolvedValueOnce([])

    const app = createApp()
    const res = await app.handle(new Request('http://localhost/merchant/r1/group'))
    expect(res.status).toBe(404)
    expect(await res.text()).toBe('No groups found')
  })

  it('Should create a group with nested options and return it including options', async () => {
    const created = { id: 'g1', merchantId: 'r1', name: 'Sizes', options: [{ id: 'o1', name: 'Small' }] }
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient() as any
    prisma.optionGroupTemplate.create.mockResolvedValueOnce(created)

    const app = createApp()
    const res = await app.handle(new Request('http://localhost/merchant/r1/group', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'Sizes', options: [{ name: 'Small' }] })
    }))

    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body).toEqual(created)
    expect(prisma.optionGroupTemplate.create).toHaveBeenCalled()
  })

  it('Should 404 when editing option for non-existing group', async () => {
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient() as any
    prisma.optionGroupTemplate.findFirst.mockResolvedValueOnce(null)

    const app = createApp()
    const res = await app.handle(new Request('http://localhost/merchant/r1/group/g1/options/o1', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'XL' })
    }))

    expect(res.status).toBe(404)
    expect(await res.text()).toBe('Group not found')
  })

  it('Should update option in existing group', async () => {
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient() as any
    prisma.optionGroupTemplate.findFirst.mockResolvedValueOnce({ id: 'g1', merchantId: 'r1' })
    prisma.optionTemplate.update.mockResolvedValueOnce({ id: 'o1', name: 'XL' })

    const app = createApp()
    const res = await app.handle(new Request('http://localhost/merchant/r1/group/g1/options/o1', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'XL' })
    }))

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({ id: 'o1', name: 'XL' })
  })

  it('Should delete option in group and return 204', async () => {
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient() as any
    prisma.optionGroupTemplate.findFirst.mockResolvedValueOnce({ id: 'g1', merchantId: 'r1' })
    prisma.optionTemplate.delete.mockResolvedValueOnce(undefined)

    const app = createApp()
    const res = await app.handle(new Request('http://localhost/merchant/r1/group/g1/options/o1', { method: 'DELETE' }))
    expect(res.status).toBe(204)
    expect(await res.text()).toBe('null')
  })

  it('Should delete group and return 204', async () => {
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient() as any
    prisma.optionGroupTemplate.findFirst.mockResolvedValueOnce({ id: 'g1', merchantId: 'r1' })
    prisma.optionGroupTemplate.delete.mockResolvedValueOnce(undefined)

    const app = createApp()
    const res = await app.handle(new Request('http://localhost/merchant/r1/group/g1', { method: 'DELETE' }))
    expect(res.status).toBe(204)
    expect(await res.text()).toBe('null')
  })
})
