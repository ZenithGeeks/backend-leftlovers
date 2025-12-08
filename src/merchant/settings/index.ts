// src/routes/merchant/settings.ts
import { Elysia, t } from 'elysia';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const MerchantSettings = new Elysia({ prefix: '/merchant' })

  /* ========= GET current store settings ========= */
  .get(
    '/:merchantId/settings',
    async ({ params, set }) => {
      const merchant = await prisma.merchant.findUnique({
        where: { id: params.merchantId },
        include: {
          owner: true,
          address: true,
          category: true,
        },
      });

      if (!merchant) {
        set.status = 404;
        return { message: 'Merchant not found' };
      }

      const settings = {
        id: merchant.id,
        name: merchant.displayName,
        storeImage: merchant.StoreImageUrl,
        listImage: merchant.listImageUrl,
        cuisine: {
          categoryId: merchant.categoryId,
          type: merchant.category?.name ?? null,
          // you can store something in a separate field later if needed
          certification: null as string | null,
        },
        businessHours: merchant.openHours, // JSON
        owner: {
          name: merchant.owner.name,
          phone: merchant.owner.phone,
          email: merchant.owner.email,
        },
        contact: {
          // you don’t have a dedicated store phone column yet,
          // so we just reuse owner.phone for now
          storePhone: merchant.owner.phone,
        },
        address: {
          line1: merchant.address.line1,
          line2: merchant.address.line2,
          city: merchant.address.city,
          province: merchant.address.province,
          postalCode: merchant.address.postalCode,
        },
        storeId: merchant.id,
      };

      return settings;
    },
    {
      response: {
        200: t.Any(),
        404: t.Object({ message: t.String() }),
      },
      detail: {
        tags: ['Merchant'],
        summary: 'Get store settings for edit-store page',
      },
    }
  )

  /* ========= PATCH update store settings ========= */
  .patch(
    '/:merchantId/settings',
    async ({ params, body, set }) => {
      const merchant = await prisma.merchant.findUnique({
        where: { id: params.merchantId },
        include: {
          owner: true,
          address: true,
          category: true,
        },
      });

      if (!merchant) {
        set.status = 404;
        return { message: 'Merchant not found' };
      }

      const merchantUpdate: Prisma.MerchantUpdateInput = {};
      const ownerUpdate: Prisma.UserUpdateInput = {};
      const addressUpdate: Prisma.AddressUpdateInput = {};

      // ---- Merchant basic info ----
      if (body.name !== undefined) {
        merchantUpdate.displayName = body.name.trim();
      }
      if (body.storeImage !== undefined) {
        merchantUpdate.StoreImageUrl = body.storeImage;
      }
      if (body.listImage !== undefined) {
        merchantUpdate.listImageUrl = body.listImage;
      }
      if (body.categoryId !== undefined) {
        // ✅ FIX: use nested relation instead of categoryId field
        merchantUpdate.category = {
          connect: { id: body.categoryId },
        };
      }
      if (body.businessHours !== undefined) {
        merchantUpdate.openHours = body.businessHours;
      }

      // ---- Owner contact (User) ----
      if (body.ownerName !== undefined) {
        ownerUpdate.name = body.ownerName.trim();
      }
      if (body.ownerPhone !== undefined) {
        ownerUpdate.phone = body.ownerPhone.trim();
      }
      if (body.ownerEmail !== undefined) {
        ownerUpdate.email = body.ownerEmail.trim().toLowerCase();
      }

      // ---- Address ----
      if (body.address) {
        if (body.address.line1 !== undefined) {
          addressUpdate.line1 = body.address.line1;
        }
        if (body.address.line2 !== undefined) {
          addressUpdate.line2 = body.address.line2;
        }
        if (body.address.city !== undefined) {
          addressUpdate.city = body.address.city;
        }
        if (body.address.province !== undefined) {
          addressUpdate.province = body.address.province;
        }
        if (body.address.postalCode !== undefined) {
          addressUpdate.postalCode = body.address.postalCode;
        }
      }

      const hasMerchantUpdate = Object.keys(merchantUpdate).length > 0;
      const hasOwnerUpdate = Object.keys(ownerUpdate).length > 0;
      const hasAddressUpdate = Object.keys(addressUpdate).length > 0;

      try {
        const result = await prisma.$transaction(async (tx) => {
          const updatedMerchant = hasMerchantUpdate
            ? await tx.merchant.update({
                where: { id: merchant.id },
                data: merchantUpdate,
                include: {
                  owner: true,
                  address: true,
                  category: true,
                },
              })
            : merchant;

          const updatedOwner = hasOwnerUpdate
            ? await tx.user.update({
                where: { id: merchant.ownerUserId },
                data: ownerUpdate,
              })
            : merchant.owner;

          const updatedAddress = hasAddressUpdate
            ? await tx.address.update({
                where: { id: merchant.addressId },
                data: addressUpdate,
              })
            : merchant.address;

          return { updatedMerchant, updatedOwner, updatedAddress };
        });

        const settings = {
          id: result.updatedMerchant.id,
          name: result.updatedMerchant.displayName,
          storeImage: result.updatedMerchant.StoreImageUrl,
          listImage: result.updatedMerchant.listImageUrl,
          cuisine: {
            categoryId: result.updatedMerchant.categoryId,
            type: result.updatedMerchant.category?.name ?? null,
            certification: null as string | null,
          },
          businessHours: result.updatedMerchant.openHours,
          owner: {
            name: result.updatedOwner.name,
            phone: result.updatedOwner.phone,
            email: result.updatedOwner.email,
          },
          contact: {
            storePhone: result.updatedOwner.phone,
          },
          address: {
            line1: result.updatedAddress.line1,
            line2: result.updatedAddress.line2,
            city: result.updatedAddress.city,
            province: result.updatedAddress.province,
            postalCode: result.updatedAddress.postalCode,
          },
          storeId: result.updatedMerchant.id,
        };

        return settings;
      } catch (err) {
        console.error('[Merchant Settings Update Error]', err);
        set.status = 500;
        return { message: 'Internal server error' };
      }
    },
    {
      body: t.Object({
        // all optional so you can send partial updates
        name: t.Optional(t.String()),
        storeImage: t.Optional(t.String()),
        listImage: t.Optional(t.String()),
        categoryId: t.Optional(t.String()),
        businessHours: t.Optional(t.Any()),
        ownerName: t.Optional(t.String()),
        ownerPhone: t.Optional(t.String()),
        ownerEmail: t.Optional(t.String()),
        address: t.Optional(
          t.Object({
            line1: t.Optional(t.String()),
            line2: t.Optional(t.String()),
            city: t.Optional(t.String()),
            province: t.Optional(t.String()),
            postalCode: t.Optional(t.String()),
          })
        ),
      }),
      response: {
        200: t.Any(),
        400: t.Object({ message: t.String() }),
        404: t.Object({ message: t.String() }),
        500: t.Object({ message: t.String() }),
      },
      detail: {
        tags: ['Merchant'],
        summary: 'Update store settings for edit-store page',
      },
    }
  );
