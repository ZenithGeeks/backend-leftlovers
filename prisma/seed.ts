import { PrismaClient, MerchantStatus, MenuItemStatus, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  /* ------------------------- 1. Base user ------------------------- */
  const user = await prisma.user.create({
    data: {
      role: Role.MERCHANT,
      name: 'John Merchant',
      email: 'merchant@example.com',
      phone: '0812345678',
      avatarUrl: 'https://i.pravatar.cc/150?img=3',
    },
  });

  /* ------------------------- 2. Category -------------------------- */
  const category = await prisma.category.upsert({
    where: { name: 'Thai Food' },
    update: {},
    create: { name: 'Thai Food' },
  });

  /* -------------------------- 3. Address -------------------------- */
  const address = await prisma.address.create({
    data: {
      id: user.id,
      label: 'Storefront',
      line1: '123 Sukhumvit Road',
      city: 'Bangkok',
      province: 'Bangkok',
      postalCode: '10110',
      lat: 13.7563,
      lng: 100.5018,
    },
  });

  /* -------------------------- 4. Merchant -------------------------- */
  const merchant = await prisma.merchant.create({
    data: {
      ownerUserId: user.id,
      displayName: 'LeftLovers Cafe',
      description: 'Cozy cafe selling leftover food with love.',
      categoryId: category.id,
      addressId: address.id,
      status: MerchantStatus.APPROVED,
      openHours: {
        monday: { open: '08:00', close: '18:00' },
        tuesday: { open: '08:00', close: '18:00' },
        wednesday: { open: '08:00', close: '18:00' },
        thursday: { open: '08:00', close: '18:00' },
        friday: { open: '08:00', close: '18:00' },
        saturday: { open: '09:00', close: '17:00' },
        sunday: null,
      },
    },
  });

  console.log('✅ Merchant created:', merchant.displayName);

  /* -------------------------- 5. Option Groups -------------------------- */
  const sweetnessGroup = await prisma.optionGroup.create({
    data: {
      name: 'Sweetness Level',
      merchantId: merchant.id,
      minSelect: 0,
      maxSelect: 1,
      options: {
        create: [
          { name: '0%', priceDelta: 0 },
          { name: '50%', priceDelta: 0 },
          { name: '100%', priceDelta: 0 },
        ],
      },
    },
    include: { options: true },
  });

  const toppingsGroup = await prisma.optionGroup.create({
    data: {
      name: 'Extra Toppings',
      merchantId: merchant.id,
      minSelect: 0,
      maxSelect: 3,
      options: {
        create: [
          { name: 'Fried Egg', priceDelta: 10 },
          { name: 'Soup', priceDelta: 5 },
          { name: 'Rice', priceDelta: 5 },
        ],
      },
    },
    include: { options: true },
  });

  console.log('✅ Created Option Groups:', [sweetnessGroup.name, toppingsGroup.name]);

  /* -------------------------- 6. Menu Items -------------------------- */
  const padThai = await prisma.menuItem.create({
    data: {
      merchantId: merchant.id,
      name: 'Pad Thai',
      description: 'Classic Thai stir-fried noodles with tofu and peanuts.',
      basePrice: 50,
      originalPrice: 80,
      leftoverQty: 10,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 12), // expires in 12h
      status: MenuItemStatus.LIVE,
      photoUrl: 'https://images.unsplash.com/photo-1617196034796-8d8c4b9c28e0?w=800',
      expireLabelUrl: 'https://placehold.co/100x50?text=EXP+TODAY',
      optionGroups: {
        connect: [{ id: toppingsGroup.id }, { id: sweetnessGroup.id }], // attach groups
      },
    },
    include: {
      optionGroups: { include: { options: true } },
    },
  });

  const somtum = await prisma.menuItem.create({
    data: {
      merchantId: merchant.id,
      name: 'Som Tum (Papaya Salad)',
      description: 'Spicy papaya salad with lime, chili, and peanuts.',
      basePrice: 45,
      originalPrice: 70,
      leftoverQty: 5,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 8),
      status: MenuItemStatus.LIVE,
      photoUrl: 'https://images.unsplash.com/photo-1625944941431-77fc81d9fbd7?w=800',
      expireLabelUrl: 'https://placehold.co/100x50?text=EXP+TODAY',
      optionGroups: {
        connect: [{ id: toppingsGroup.id }], // attach one group
      },
    },
    include: {
      optionGroups: { include: { options: true } },
    },
  });

  console.log('✅ Menu Items created:', [padThai.name, somtum.name]);

  /* -------------------------- 7. Summary -------------------------- */
  console.log('🌸 Seed completed successfully!');
  console.table({
    Merchant: merchant.displayName,
    User: user.email,
    MenuCount: 2,
    OptionGroups: 2,
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });