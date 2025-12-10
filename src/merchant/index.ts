import { Elysia, HTTPHeaders, StatusMap, t } from 'elysia'
import { PrismaClient, MenuItemStatus, Role, UserStatus, MerchantStatus, Prisma, } from '@prisma/client'
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

        // build next-url for frontend to continue merchant setup
        const nextUrl = `/merchant/setup?userId=${user.id}`

        // optional: set Location header (helps clients that follow Location)
        set.headers = { ...(set.headers as Record<string, string | number>), Location: nextUrl }
        set.status = 201

        return {
          message: 'Merchant user created',
          user: {
            ...user,
            createdAt: user.createdAt.toISOString(),
            userId: user.id,
          },
          nextUrl,
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
            userId: t.String(),      // <-- added
          }),
          nextUrl: t.String(),      // <-- added
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

   .post(
    "/setup",
    async ({ body, set }) => {
      try {
        const ownerUserId = body.ownerUserId;
        if (!ownerUserId) {
          set.status = 400;
          return { message: "ownerUserId is required" };
        }

        const displayName = body.displayName?.trim();
        const categoryId = body.categoryId;

        if (!displayName) {
          set.status = 400;
          return { message: "displayName is required" };
        }
        if (!categoryId) {
          set.status = 400;
          return { message: "categoryId is required" };
        }

        // Address validation
        const addressInput = body.address;
        if (!addressInput || !addressInput.line1) {
          set.status = 400;
          return { message: "address.line1 is required" };
        }

        // Validate merchant user exists
        const user = await prisma.user.findUnique({
          where: { id: ownerUserId }
        });
        if (!user) {
          set.status = 404;
          return { message: "user not found" };
        }
        if (user.role !== Role.MERCHANT) {
          set.status = 400;
          return { message: "user is not a MERCHANT" };
        }

        // Prevent duplicate merchant
        const exists = await prisma.merchant.findFirst({
          where: { ownerUserId }
        });
        if (exists) {
          set.status = 409;
          return { message: "merchant already exists for this user" };
        }

        const files = Array.isArray(body.files) ? body.files : [];

        // Validate file counts
        const counts = files.reduce((m: Record<string, number>, f) => {
          m[f.kind] = (m[f.kind] || 0) + 1;
          return m;
        }, {});

        if ((counts.COMMERCIAL_REG ?? 0) !== 1) {
          set.status = 400;
          return { message: "exactly one COMMERCIAL_REG required" };
        }
        if ((counts.STORE_IMAGE ?? 0) > 5) {
          set.status = 400;
          return { message: "up to 5 STORE_IMAGE allowed" };
        }

        // DB transaction
        const result = await prisma.$transaction(async (tx) => {
          const address = await tx.address.create({
            data: {
              label: addressInput.label ?? null,
              line1: addressInput.line1,
              line2: addressInput.line2 ?? null,
              city: addressInput.city ?? null,
              province: addressInput.province ?? null,
              postalCode: addressInput.postalCode ?? null,
              lat: addressInput.lat ?? undefined,
              lng: addressInput.lng ?? undefined
            },
            select: { id: true }
          });

          const merchant = await tx.merchant.create({
            data: {
              ownerUserId,
              displayName,
              branchName: body.branchName ?? null,
              description: body.description ?? null,
              categoryId,
              addressId: address.id,
              openHours: body.openHours ?? undefined,
              listImageUrl: body.listImageUrl ?? null,
              StoreImageUrl: body.storeImageUrl ?? null,
              status: MerchantStatus.PENDING
            },
            select: {
              id: true,
              ownerUserId: true,
              displayName: true,
              branchName: true,
              description: true,
              categoryId: true,
              addressId: true,
              createdAt: true,
              status: true,
              listImageUrl: true,
              StoreImageUrl: true
            }
          });

          if (files.length > 0) {
            await tx.merchantFile.createMany({
              data: files.map((f) => ({
                merchantId: merchant.id,
                kind: f.kind,
                url: f.url,
                label: f.label ?? null
              }))
            });
          }

          return { merchant };
        });

        set.status = 201;
        return {
          message: "Merchant store info completed",
          merchant: {
            ...result.merchant,
            createdAt: result.merchant.createdAt.toISOString()
          }
        };
      } catch (err: any) {
        console.error("[Merchant Setup Error]", err);

        if (
          err instanceof Prisma.PrismaClientKnownRequestError &&
          err.code === "P2003"
        ) {
          set.status = 400;
          return { message: "invalid foreign key or related resource missing" };
        }

        set.status = 500;
        return { message: "Internal server error" };
      }
    },
    {
      body: t.Object({
        ownerUserId: t.String(),
        displayName: t.String(),
        branchName: t.Optional(t.String()),
        description: t.Optional(t.String()),
        categoryId: t.String(),

        // FIX — allow null
        openHours: t.Nullable(t.Any()),

        listImageUrl: t.Optional(t.String()),
        storeImageUrl: t.Optional(t.String()),

        address: t.Object({
          label: t.Optional(t.String()),
          line1: t.String(),
          line2: t.Optional(t.String()),
          city: t.Optional(t.String()),
          province: t.Optional(t.String()),
          postalCode: t.Optional(t.String()),
          lat: t.Optional(t.Number()),
          lng: t.Optional(t.Number())
        }),

        files: t.Optional(
          t.Array(
            t.Object({
              kind: t.Union([
                t.Literal("COMMERCIAL_REG"),
                t.Literal("OWNER_ID"),
                t.Literal("STORE_IMAGE"),
                t.Literal("OTHER")
              ]),
              url: t.String(),
              label: t.Optional(t.String())
            })
          )
        )
      })
    }
  )

  .get('/merchants', async ({ params, set }) => {
    const merchants = await prisma.merchant.findMany({
      orderBy: { createdAt: 'desc' }
    })
    if (!merchants.length) {
      set.status = 404
      return { message: 'No menu found' }
    }
    return merchants
  }, { tags: ['Merchant'] })
  .get('/categories', async ({ params, set }) => {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'desc' }
    })
    if (!categories.length) {
      set.status = 404
      return { message: 'No menu found' }
    }
    return categories
  }, { tags: ['Merchant'] })
    .get('/:merchantId', async ({ params, set }) => {
      const item = await prisma.merchant.findFirst({
        where: { id: params.merchantId },
        include: {
          owner: true,
          orders: {
            include: {
              items: {
                include: {menu: true}
              },
              review: true
            }
          }

        }
      })
  
      if (!item) {
        set.status = 404
        return { message: 'Merchant not found' }
      }
      return item
    }, { tags: ['Merchant'] })