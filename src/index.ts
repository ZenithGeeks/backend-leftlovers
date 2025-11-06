import { Elysia, t } from 'elysia'
import openapi from '@elysiajs/openapi'
import { PrismaClient } from '@prisma/client'
import { merchantMenu } from './merchant/menu'
import { Merchant } from './merchant/index'
import { Customer } from './customer/index'
import { swagger } from '@elysiajs/swagger'
import { uploadRoutes } from './minio'

const prisma = new PrismaClient()
const app = new Elysia({ prefix: '/api' })
    .use(openapi())
    .use(swagger())
    .use(merchantMenu)
    .use(Merchant)
    .use(Customer)
    .use(uploadRoutes)
    .listen(3000)
console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)