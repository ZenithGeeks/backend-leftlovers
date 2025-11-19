import { Elysia, HTTPHeaders, StatusMap, t } from 'elysia'
import { PrismaClient, MenuItemStatus, Role, UserStatus, MerchantStatus, Prisma,} from '@prisma/client'
import { ErrorSchema } from '../../types';
import { ElysiaCookie } from 'elysia/cookies';

const prisma = new PrismaClient()

function parseDOB(input?: string | null): Date | null {
  if (!input) return null;
  // Let Date parse both "YYYY-MM-DD" and ISO datetime; guard invalids
  const d = new Date(input);
  return isNaN(d.getTime()) ? null : d;
}

function normEmail(e: string) {
  return e.trim().toLowerCase();
}

export const Merchant = new Elysia({ prefix: '/merchant' })
  
  .post(
    '/user',
    async ({ body, set }) => {
      try {
        const name = body.name?.trim()
        const email = normEmail(body.email)
        const phone = body.phone?.trim() || null
        const avatarUrl = body.avatarUrl ?? null

        // Create user as MERCHANT
        const user = await prisma.user.create({
          data: {
            name,
            email,
            phone,
            avatarUrl,
            dob: null,
            role: Role.MERCHANT,
            status: UserStatus.ACTIVE,
          },
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatarUrl: true,
            role: true,
            status: true,
            createdAt: true,
          },
        })

        set.status = 201
        return {
          message: 'Merchant user created',
          user: {
            ...user,
            createdAt: user.createdAt.toISOString(),
            userId: user.id 
          },
        }
      } catch (err: any) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
          set.status = 409
          return { message: 'Duplicate email' }
        }
        console.error('[Merchant User Create Error]', err)
        set.status = 500
        return { message: 'Internal server error' }
      }
    },
    {
      body: t.Object({
        name: t.String(),
        email: t.String({ format: 'email' }),
        phone: t.Optional(t.String({ minLength: 8 })),
        avatarUrl: t.Optional(t.String()),
      }),
      response: {
        201: t.Object({
          message: t.Literal('Merchant user created'),
          user: t.Object({
            id: t.String(),
            name: t.Union([t.String(), t.Null()]),
            email: t.String(),
            phone: t.Union([t.String(), t.Null()]),
            avatarUrl: t.Union([t.String(), t.Null()]),
            role: t.Literal('MERCHANT'),
            status: t.Union([
              t.Literal('ACTIVE'),
              t.Literal('SUSPENDED'),
              t.Literal('DELETED'),
            ]),
            createdAt: t.String(),
          }),
        }),
        409: ErrorSchema,
        500: ErrorSchema,
      },
      detail: {
        tags: ['Users'],
        summary: 'Create a new merchant user',
      },
    }
  )

  