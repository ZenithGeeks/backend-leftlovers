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

      // build next-url for frontend to continue merchant setup
      const nextUrl = `/merchant/setup?userId=${user.id}`

      // optional: set Location header (helps clients that follow Location)
      set.headers = { ...(set.headers as Record<string, string | number>),Location: nextUrl}
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
      // required: userId (from previous step)
      const userId = body.userId;
      if (!userId) {
        set.status = 400;
        return { message: "userId is required" };
      }

      // merchant details
      const displayName = body.displayName?.trim();
      const branchName = body.branchName?.trim() ?? null;
      const description = body.description?.trim() ?? null;
      const categoryId = body.categoryId;
      const openHours = body.openHours ?? null;
      const listImageUrl = body.listImageUrl ?? null;
      const storeImageUrl = body.storeImageUrl ?? null;

      // address object (required)
      const addressInput = body.address ?? null;

      // files array optional but validate when present
      const files = Array.isArray(body.files) ? body.files : [];

      // basic validations
      if (!displayName) {
        set.status = 400;
        return { message: "displayName is required" };
      }
      if (!categoryId) {
        set.status = 400;
        return { message: "categoryId is required" };
      }
      if (!addressInput || !addressInput.line1) {
        set.status = 400;
        return { message: "address.line1 is required" };
      }

      // files counts validation
      const counts = files.reduce((acc: Record<string, number>, f: any) => {
        acc[f.kind] = (acc[f.kind] || 0) + 1;
        return acc;
      }, {});
      if ((counts.COMMERCIAL_REG ?? 0) !== 1) {
        set.status = 400;
        return { message: "exactly one COMMERCIAL_REG required" };
      }
      if ((counts.OWNER_ID ?? 0) !== 1) {
        set.status = 400;
        return { message: "exactly one OWNER_ID required" };
      }
      if ((counts.STORE_IMAGE ?? 0) > 5) {
        set.status = 400;
        return { message: "up to 5 STORE_IMAGE allowed" };
      }

      // Verify user exists and is MERCHANT role
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        set.status = 404;
        return { message: "user not found" };
      }
      if (user.role !== Role.MERCHANT) {
        set.status = 400;
        return { message: "user is not a MERCHANT" };
      }

      // Prevent creating a second merchant for same user
      const existingMerchant = await prisma.merchant.findFirst({ where: { ownerUserId: userId } });
      if (existingMerchant) {
        set.status = 409;
        return { message: "merchant already exists for this user" };
      }

      // Transaction: create address -> merchant -> merchantFiles
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
            lng: addressInput.lng ?? undefined,
          },
          select: { id: true },
        });

        const merchant = await tx.merchant.create({
          data: {
            ownerUserId: userId,
            displayName,
            branchName,
            description,
            categoryId,
            addressId: address.id,
            openHours: openHours ?? undefined,
            listImageUrl,
            StoreImageUrl: storeImageUrl,
            status: MerchantStatus.PENDING,
          },
          select: {
            id: true,
            ownerUserId: true,
            displayName: true,
            branchName: true,
            description: true,
            categoryId: true,
            addressId: true,
            status: true,
            createdAt: true,
            listImageUrl: true,
            StoreImageUrl: true,
          },
        });

        if (files.length > 0) {
          const rows = files.map((f: any) => ({
            merchantId: merchant.id,
            kind: f.kind,
            url: f.url,
            label: f.label ?? null,
          }));
          await tx.merchantFile.createMany({ data: rows });
        }

        return { merchant };
      });

      set.status = 201;
      return {
        message: "Merchant store info completed",
        merchant: {
          ...result.merchant,
          createdAt: result.merchant.createdAt.toISOString(),
        },
      };
    } catch (err: any) {
      console.error("[Merchant Setup Error]", err);
      // Prisma errors (if any)
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2003") {
        // foreign key constraint
        set.status = 400;
        return { message: "invalid foreign key or related resource missing" };
      }
      set.status = 500;
      return { message: "Internal server error" };
    }
  },
  {
    body: t.Object({
      userId: t.String(),
      displayName: t.String(),
      branchName: t.Optional(t.String()),
      description: t.Optional(t.String()),
      categoryId: t.String(),
      openHours: t.Optional(t.Any()),
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
        lng: t.Optional(t.Number()),
      }),
      files: t.Optional(
        t.Array(
          t.Object({
            kind: t.Union([
              t.Literal("COMMERCIAL_REG"),
              t.Literal("OWNER_ID"),
              t.Literal("STORE_IMAGE"),
              t.Literal("OTHER"),
            ]),
            url: t.String(),
            label: t.Optional(t.String()),
          })
        )
      ),
    }),
    response: {
      201: t.Object({
        message: t.Literal("Merchant store info completed"),
        merchant: t.Object({
          id: t.String(),
          ownerUserId: t.String(),
          displayName: t.Union([t.String(), t.Null()]),
          branchName: t.Union([t.String(), t.Null()]),
          description: t.Union([t.String(), t.Null()]),
          categoryId: t.String(),
          addressId: t.String(),
          status: t.Union([t.Literal("PENDING"), t.Literal("ACTIVE"), t.Literal("SUSPENDED")]),
          createdAt: t.String(),
          listImageUrl: t.Union([t.String(), t.Null()]),
          StoreImageUrl: t.Union([t.String(), t.Null()]),
        }),
      }),
      400: t.Object({ message: t.String() }),
      404: t.Object({ message: t.String() }),
      409: t.Object({ message: t.String() }),
      500: t.Object({ message: t.String() }),
    },
    detail: {
      tags: ["Merchants"],
      summary: "Complete merchant store information (address, merchant, files)",
    },
  }
)
