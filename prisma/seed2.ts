import { PrismaClient, MenuItemStatus, Role, MerchantStatus, PaymentStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding data...')
  const customer = await prisma.user.create({
    data: {
      role: Role.CUSTOMER,
      name: 'Alice Customer',
      email: 'alice@example.com',
      phone: '0812345672',
      avatarUrl: 'https://i.pravatar.cc/150?img=3',
      dob: new Date()
    }
  })
  const owner = await prisma.user.create({
    data: {
      role: Role.MERCHANT,
      name: 'Bob Merchant',
      email: 'merchant2@example.com',
      phone: '0899999993',
      avatarUrl: 'https://i.pravatar.cc/150?img=3',
      dob: new Date()
    }
  })

  // 3️⃣ Create a Category
  const category = await prisma.category.create({
    data: { name: 'Thai Food' }
  })

  // 4️⃣ Create an Address for merchant
  const address = await prisma.address.create({
    data: {
      userId: owner.id,
      label: 'Storefront',
      line1: '123 Sukhumvit Rd',
      city: 'Bangkok',
      province: 'Bangkok',
      postalCode: '10110',
      lat: 13.7563,
      lng: 100.5018
    }
  })

  // 5️⃣ Create a Merchant
  const merchant = await prisma.merchant.create({
    data: {
      ownerUserId: owner.id,
      displayName: 'Bob’s Bento Shop',
      description: 'Delicious Bento Boxes and Thai-style rice dishes',
      categoryId: category.id,
      addressId: address.id,
      status: MerchantStatus.APPROVED,
      listImageUrl: 'https://picsum.photos/400?bento',
      StoreImageUrl: 'https://picsum.photos/800?restaurant'
    }
  })

  // 6️⃣ Create a Menu Item
  const menuItem = await prisma.menuItem.create({
    data: {
      merchantId: merchant.id,
      name: 'Fried Chicken Bento',
      description: 'Crispy fried chicken with rice and salad',
      basePrice: 80.0,
      originalPrice: 100.0,
      leftoverQty: 15,
      expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000), // expires in 3 hours
      status: MenuItemStatus.LIVE,
      photoUrl: 'https://picsum.photos/seed/friedchicken/400',
      expireLabelUrl: 'https://picsum.photos/seed/label/200'
    }
  })

  // 7️⃣ Create an OptionGroup + Option
  const optionGroup = await prisma.optionGroup.create({
  data: {
    name: 'Add-ons',
    merchantId: merchant.id,
    minSelect: 0,
    maxSelect: 2,
    menu: {
      connect: { id: menuItem.id }
    },
    options: {
      create: [
        { name: 'Extra Rice',  priceDelta: 10.0 },
        { name: 'Extra Sauce', priceDelta: 5.0  }
      ]
    }
  },
  include: { options: true } // 👈 return related options
})

  console.log('✅ Seed completed!\n')
  console.log('customerId:', customer.id)
  console.log('merchantId:', merchant.id)
  console.log('menuItemId:', menuItem.id)
  const firstOptionId = optionGroup.options[0]?.id
console.log('optionId:', firstOptionId)
  
  console.log('\nUse these values in your POST /customer/:merchantId/order test.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
