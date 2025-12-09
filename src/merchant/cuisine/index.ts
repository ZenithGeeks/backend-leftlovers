// src/merchant/cuisine/index.ts
import { Elysia, t } from 'elysia';
import { PrismaClient, FileKind } from '@prisma/client';

const prisma = new PrismaClient();

const paramsMerchant = t.Object({
  merchantId: t.String({ minLength: 1 }),
});

const updateBody = t.Object({
  categoryId: t.Optional(t.String()),
  certificationUrl: t.Optional(t.Union([t.String(), t.Null()])),
  certificationLabel: t.Optional(t.String()),
});

export const MerchantCuisine = new Elysia({ prefix: '/merchant' })

  /**
   * GET /api/merchant/:merchantId/cuisine
   * Returns current cuisine category + certification file (if exists)
   */
  .get(
    '/:merchantId/cuisine',
    async ({ params, set }) => {
      const merchant = await prisma.merchant.findUnique({
        where: { id: params.merchantId },
        include: {
          category: true,
          merchantFiles: true,
        },
      });

      if (!merchant) {
        set.status = 404;
        return { message: 'Merchant not found' };
      }

      const certFile = merchant.merchantFiles.find(
        (f) => f.kind === FileKind.OTHER && f.label === 'CUISINE_CERT'
      );

      return {
        categoryId: merchant.categoryId ?? null,
        categoryName: merchant.category?.name ?? null,
        certificationFile: certFile
          ? {
              id: certFile.id,
              url: certFile.url,
              label: certFile.label ?? null,
            }
          : null,
      };
    },
    {
      params: paramsMerchant,
      detail: { tags: ['Cuisine'], summary: 'Get cuisine & certification' },
    }
  )

  /**
   * PUT /api/merchant/:merchantId/cuisine
   * - updates merchant.categoryId
   * - upserts MerchantFile(kind=OTHER,label='CUISINE_CERT')
   */
  .put(
    '/:merchantId/cuisine',
    async ({ params, body, set }) => {
      const merchant = await prisma.merchant.findUnique({
        where: { id: params.merchantId },
        include: {
          category: true,
          merchantFiles: true,
        },
      });

      if (!merchant) {
        set.status = 404;
        return { message: 'Merchant not found' };
      }

      // Validate category if provided
      if (body.categoryId) {
        const cat = await prisma.category.findUnique({
          where: { id: body.categoryId },
        });
        if (!cat) {
          set.status = 400;
          return { message: 'Invalid categoryId' };
        }
      }

      // 1) Update merchant category if changed
      if (body.categoryId && body.categoryId !== merchant.categoryId) {
        await prisma.merchant.update({
          where: { id: merchant.id },
          data: { categoryId: body.categoryId },
        });
      }

      // 2) Upsert MerchantFile for certification
      const existingCert = merchant.merchantFiles.find(
        (f) => f.kind === FileKind.OTHER && f.label === 'CUISINE_CERT'
      );

      if (body.certificationUrl !== undefined) {
        if (!body.certificationUrl) {
          // remove existing cert file if any
          if (existingCert) {
            await prisma.merchantFile.delete({
              where: { id: existingCert.id },
            });
          }
        } else {
          if (existingCert) {
            await prisma.merchantFile.update({
              where: { id: existingCert.id },
              data: {
                url: body.certificationUrl,
                label: body.certificationLabel ?? 'CUISINE_CERT',
              },
            });
          } else {
            await prisma.merchantFile.create({
              data: {
                merchantId: merchant.id,
                kind: FileKind.OTHER,
                url: body.certificationUrl,
                label: body.certificationLabel ?? 'CUISINE_CERT',
              },
            });
          }
        }
      }

      // reload to return latest
      const updated = await prisma.merchant.findUnique({
        where: { id: merchant.id },
        include: {
          category: true,
          merchantFiles: true,
        },
      });

      const certFile = updated?.merchantFiles.find(
        (f) => f.kind === FileKind.OTHER && f.label === 'CUISINE_CERT'
      );

      return {
        categoryId: updated?.categoryId ?? null,
        categoryName: updated?.category?.name ?? null,
        certificationFile: certFile
          ? {
              id: certFile.id,
              url: certFile.url,
              label: certFile.label ?? null,
            }
          : null,
      };
    },
    {
      params: paramsMerchant,
      body: updateBody,
      detail: { tags: ['Cuisine'], summary: 'Update cuisine & certification' },
    }
  );
