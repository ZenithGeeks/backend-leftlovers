import { PrismaClient, MerchantStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Step 1: Create a fake user (merchant owner)
  const user = await prisma.user.create({
    data: {
      role: 'MERCHANT',
      name: 'John Merchant',
      email: 'merchant@example.com',
      phone: '0812345678',
      avatarUrl: 'https://i.pravatar.cc/150?img=3'
    }
  })

  // Step 2: Create a fake category (if needed)
  const category = await prisma.category.create({
    data: { name: 'Thai Food' }
  })

  // Step 3: Create a fake address
  const address = await prisma.address.create({
    data: {
      userId: user.id,
      label: 'Storefront',
      line1: '123 Sukhumvit Road',
      city: 'Bangkok',
      province: 'Bangkok',
      postalCode: '10110',
      lat: 13.7563,
      lng: 100.5018
    }
  })

  // Step 4: Create a fake merchant
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
        sunday: null
      }
    }
  })

  console.log('✅ Created Merchant:')
  console.table(merchant)
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
