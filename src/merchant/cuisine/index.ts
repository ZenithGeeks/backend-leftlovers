// src/merchant/cuisine/index.ts
import { Elysia, t } from 'elysia';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const MerchantCuisine = new Elysia({ prefix: '/merchant' })
  // GET /api/merchant/:merchantId/cuisine
  .get(
    '/:merchantId/cuisine',
    async ({ params, set }) => {
      const merchant = await prisma.merchant.findUnique({
        where: { id: params.merchantId },
        select: {
          id: true,
          categoryId: true,
        },
      });

      if (!merchant) {
        set.status = 404;
        return { message: 'Merchant not found' };
      }

      return {
        merchantId: merchant.id,
        categoryId: merchant.categoryId, // can be null
        // you can add more fields later if you want
      };
    },
    {
      params: t.Object({
        merchantId: t.String({ minLength: 1 }),
      }),
      detail: {
        tags: ['Cuisine'],
        summary: 'Get cuisine settings (category) for a merchant',
      },
    }
  )

  // PUT /api/merchant/:merchantId/cuisine
  .put(
    '/:merchantId/cuisine',
    async ({ params, body, set }) => {
      const merchant = await prisma.merchant.findUnique({
        where: { id: params.merchantId },
        select: { id: true },
      });

      if (!merchant) {
        set.status = 404;
        return { message: 'Merchant not found' };
      }

      const updated = await prisma.merchant.update({
        where: { id: params.merchantId },
        data: {
          categoryId: body.categoryId,
        },
        select: {
          id: true,
          categoryId: true,
        },
      });

      return {
        merchantId: updated.id,
        categoryId: updated.categoryId,
      };
    },
    {
      params: t.Object({
        merchantId: t.String({ minLength: 1 }),
      }),
      body: t.Object({
        categoryId: t.String({ minLength: 1 }),
      }),
      detail: {
        tags: ['Cuisine'],
        summary: 'Update cuisine settings (category) for a merchant',
      },
    }
  );
