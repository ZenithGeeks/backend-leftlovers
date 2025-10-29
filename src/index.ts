import { Elysia, t } from 'elysia'
import openapi from '@elysiajs/openapi'
import { PrismaClient } from '@prisma/client'
import { merchantMenu } from './merchant/menu'
const prisma = new PrismaClient()

const app = new Elysia({ prefix: '/api' })
    .use(openapi())
    .use(merchantMenu)
    .listen(3000)

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)