// src/routes/merchant/editstore.ts
import { Elysia, t } from 'elysia';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const MerchantEditStore = new Elysia({ prefix: '/merchant' })

  /* ===========================================================
     GET /merchant/:merchantId/editstore
     =========================================================== */
  .get(
    '/:merchantId/editstore',
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

      const addr = merchant.address;

      return {
        id: merchant.id,
        name: merchant.displayName,
        storeImage: merchant.StoreImageUrl,
        listImage: merchant.listImageUrl,
        cuisine: {
          categoryId: merchant.categoryId,
          type: merchant.category?.name ?? null,
          certification: null,
        },
        businessHours: merchant.openHours,
        owner: {
          name: merchant.owner.name,
          phone: merchant.owner.phone,
          email: merchant.owner.email,
        },
        address: {
          line1: addr.line1,
          line2: addr.line2,
          city: addr.city,
          province: addr.province,
          postalCode: addr.postalCode,
          // Prisma Decimal -> number (or null)
          lat:
            addr.lat !== null && addr.lat !== undefined
              ? Number(addr.lat)
              : null,
          lng:
            addr.lng !== null && addr.lng !== undefined
              ? Number(addr.lng)
              : null,
        },
        storeId: merchant.id,
      };
    },
    {
      response: {
        200: t.Any(),
        404: t.Object({ message: t.String() }),
      },
      detail: {
        tags: ['Merchant'],
        summary: 'Get Edit-Store page data',
      },
    }
  )
  .put(
    "/:merchantId/store-open-status",
    async ({ params, body, set }) => {
      try {
        const merchant = await prisma.merchant.update({
          where: { id: params.merchantId },
          data: { openStatus: body.openStatus },
        });

        return merchant;
      } catch (err: any) {
        if (err?.code === "P2025") {
          set.status = 404;
          return { message: "merchant not found" };
        }
        set.status = 500;
        return { message: "failed to update open status" };
      }
    },
    {
      body: t.Object({
        openStatus: t.Union([
          t.Literal("CLOSED"),
          t.Literal("PAUSE"),
          t.Literal("BUSY"),
          t.Literal("OPEN"),
        ]),
      }),
        detail: {
        tags: ['Merchant'],
        summary: 'Edit Open Status of store',
      },
    }
  )
  /* ===========================================================
     PUT /merchant/:merchantId/editstore
     =========================================================== */
  .put(
    '/:merchantId/editstore',
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

      /* ========== Merchant fields ========== */
      if (body.name !== undefined) merchantUpdate.displayName = body.name.trim();
      if (body.storeImage !== undefined) merchantUpdate.StoreImageUrl = body.storeImage;
      if (body.listImage !== undefined) merchantUpdate.listImageUrl = body.listImage;

      if (body.categoryId !== undefined) {
        merchantUpdate.category = { connect: { id: body.categoryId } };
      }

      if (body.businessHours !== undefined) {
        merchantUpdate.openHours = body.businessHours;
      }

      /* ========== Owner fields ========== */
      if (body.ownerName !== undefined) ownerUpdate.name = body.ownerName.trim();
      if (body.ownerPhone !== undefined) ownerUpdate.phone = body.ownerPhone.trim();
      if (body.ownerEmail !== undefined)
        ownerUpdate.email = body.ownerEmail.trim().toLowerCase();

      /* ========== Address fields ========== */
      if (body.address) {
        if (body.address.line1 !== undefined) addressUpdate.line1 = body.address.line1;
        if (body.address.line2 !== undefined) addressUpdate.line2 = body.address.line2;
        if (body.address.city !== undefined) addressUpdate.city = body.address.city;
        if (body.address.province !== undefined)
          addressUpdate.province = body.address.province;
        if (body.address.postalCode !== undefined)
          addressUpdate.postalCode = body.address.postalCode;

        // new: lat / lng (numbers; Prisma will map to Decimal)
        if (body.address.lat !== undefined) addressUpdate.lat = body.address.lat;
        if (body.address.lng !== undefined) addressUpdate.lng = body.address.lng;
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

        const addr = result.updatedAddress;

        return {
          id: result.updatedMerchant.id,
          name: result.updatedMerchant.displayName,
          storeImage: result.updatedMerchant.StoreImageUrl,
          listImage: result.updatedMerchant.listImageUrl,
          cuisine: {
            categoryId: result.updatedMerchant.categoryId,
            type: result.updatedMerchant.category?.name ?? null,
            certification: null,
          },
          businessHours: result.updatedMerchant.openHours,
          owner: {
            name: result.updatedOwner.name,
            phone: result.updatedOwner.phone,
            email: result.updatedOwner.email,
          },
          address: {
            line1: addr.line1,
            line2: addr.line2,
            city: addr.city,
            province: addr.province,
            postalCode: addr.postalCode,
            lat:
              addr.lat !== null && addr.lat !== undefined
                ? Number(addr.lat)
                : null,
            lng:
              addr.lng !== null && addr.lng !== undefined
                ? Number(addr.lng)
                : null,
          },
          storeId: result.updatedMerchant.id,
        };
      } catch (err) {
        console.error('[EditStore Update Error]', err);
        set.status = 500;
        return { message: 'Internal server error' };
      }
    },
    {
      body: t.Object({
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
            lat: t.Optional(t.Number()),   // 👈 new
            lng: t.Optional(t.Number()),   // 👈 new
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
        summary: 'Update Edit-Store settings',
      },
    }
  );
