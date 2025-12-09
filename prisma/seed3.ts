import {
  PrismaClient,
  Role,
  MerchantStatus,
  MenuItemStatus,
  OrderPreference,
} from "@prisma/client";
import { Prisma } from "@prisma/client";

const prisma = new PrismaClient();

/* ----------------------------- helpers ----------------------------- */

const d = (v: string | number) => new Prisma.Decimal(v);

const hoursFromNow = (h: number) => new Date(Date.now() + h * 60 * 60 * 1000);

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickMany<T>(arr: T[], count: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  while (copy.length && out.length < count) {
    const i = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(i, 1)[0]);
  }
  return out;
}

function openHoursTemplate(type: "cafe" | "street" | "allweek") {
  if (type === "cafe") {
    return {
      timezone: "Asia/Bangkok",
      weekly: {
        mon: [{ open: "08:00", close: "18:00" }],
        tue: [{ open: "08:00", close: "18:00" }],
        wed: [{ open: "08:00", close: "18:00" }],
        thu: [{ open: "08:00", close: "18:00" }],
        fri: [{ open: "08:00", close: "20:00" }],
        sat: [{ open: "09:00", close: "20:00" }],
        sun: [{ open: "09:00", close: "18:00" }],
      },
      exceptions: [],
    };
  }

  if (type === "street") {
    return {
      timezone: "Asia/Bangkok",
      weekly: {
        mon: [{ open: "17:00", close: "23:30" }],
        tue: [{ open: "17:00", close: "23:30" }],
        wed: [{ open: "17:00", close: "23:30" }],
        thu: [{ open: "17:00", close: "23:30" }],
        fri: [{ open: "17:00", close: "00:30" }],
        sat: [{ open: "12:00", close: "00:30" }],
        sun: [{ open: "12:00", close: "23:00" }],
      },
      exceptions: [],
    };
  }

  return {
    timezone: "Asia/Bangkok",
    weekly: {
      mon: [{ open: "10:00", close: "22:00" }],
      tue: [{ open: "10:00", close: "22:00" }],
      wed: [{ open: "10:00", close: "22:00" }],
      thu: [{ open: "10:00", close: "22:00" }],
      fri: [{ open: "10:00", close: "22:00" }],
      sat: [{ open: "10:00", close: "22:00" }],
      sun: [{ open: "10:00", close: "22:00" }],
    },
    exceptions: [],
  };
}

/* ----------------------------- cleanup ----------------------------- */

/* ----------------------------- seed steps ----------------------------- */

async function seedCategories() {
  const names = [
    "Thai Food",
    "Japanese",
    "Chinese",
    "Korean",
    "Vietnamese",
    "Cafe",
    "Bakery",
    "Vegetarian",
    "Vegan",
    "Halal",
    "Seafood",
    "Fast Food",
    "Dessert",
    "Street Food",
    "Italian",
  ];

  const categories = [];
  for (const name of names) {
    const c = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    categories.push(c);
  }
  return categories;
}

async function seedUsers() {
  const time = Date.now();

  const customers = await Promise.all(
    ["Alice", "Ben"].map((n, i) =>
      prisma.user.create({
        data: {
          role: Role.CUSTOMER,
          name: `${n} Customer`,
          email: `${n.toLowerCase()}_${time}_${i}@demo.com`,
          phone: `08${Math.floor(10000000 + Math.random() * 89999999)}`,
          avatarUrl: `https://i.pravatar.cc/150?img=${i + 1}`,
          dob: new Date(2001, i, i + 1),
        },
      })
    )
  );

  const merchantOwners = await Promise.all(
    ["Bob", "Ong", "Mina"].map((n, i) =>
      prisma.user.create({
        data: {
          role: Role.MERCHANT,
          name: `${n} Merchant`,
          email: `${n.toLowerCase()}_${time}_${i}@merchant.demo.com`,
          phone: `08${Math.floor(10000000 + Math.random() * 89999999)}`,
          avatarUrl: `https://i.pravatar.cc/150?img=${i + 10}`,
          dob: new Date(1996, i, i + 10),
        },
      })
    )
  );

  return { customers, merchantOwners };
}

async function seedAddresses() {
  const base = [
    {
      label: "Storefront",
      line1: "123 Sukhumvit Rd",
      city: "Bangkok",
      province: "Bangkok",
      postalCode: "10110",
      lat: "13.7563",
      lng: "100.5018",
    },
    {
      label: "Mall Branch",
      line1: "99 Rama 9 Rd",
      city: "Bangkok",
      province: "Bangkok",
      postalCode: "10310",
      lat: "13.7480",
      lng: "100.5660",
    },
    {
      label: "Old Town",
      line1: "18 Yaowarat",
      city: "Bangkok",
      province: "Bangkok",
      postalCode: "10100",
      lat: "13.7410",
      lng: "100.5090",
    },
  ];

  const addresses = [];
  for (let i = 0; i < 3; i++) {
    const b = base[i];
    addresses.push(
      await prisma.address.create({
        data: {
          label: b.label,
          line1: `${b.line1} #${i + 1}`,
          city: b.city,
          province: b.province,
          postalCode: b.postalCode,
          lat: d(b.lat),
          lng: d(b.lng),
        },
      })
    );
  }
  return addresses;
}

async function seedMerchants(
  owners: { id: string; name: string }[],
  categories: { id: string }[],
  addresses: { id: string }[]
) {
  const specs = [
    {
      displayName: "Bob’s Bento Shop",
      description: "Bento, rice bowls, quick meals",
      hours: openHoursTemplate("allweek"),
      listImageUrl: "https://picsum.photos/400?bento",
      StoreImageUrl: "https://picsum.photos/800?restaurant",
    },
    {
      displayName: "Roti Ong Halal Food",
      description: "Halal street food and roti",
      hours: openHoursTemplate("street"),
      listImageUrl: "https://picsum.photos/400?roti",
      StoreImageUrl: "https://picsum.photos/800?streetfood",
    },
    {
      displayName: "Mina Matcha Cafe",
      description: "Matcha + desserts",
      hours: openHoursTemplate("cafe"),
      listImageUrl: "https://picsum.photos/400?cafe",
      StoreImageUrl: "https://picsum.photos/800?matcha",
    },
  ];

  const merchants = [];

  for (let i = 0; i < specs.length; i++) {
    const owner = owners[i];
    const category = pick(categories);
    const address = addresses[i];
    const s = specs[i];

    const m = await prisma.merchant.create({
      data: {
        ownerUserId: owner.id,
        displayName: s.displayName,
        description: s.description,
        categoryId: category.id,
        addressId: address.id,
        status: MerchantStatus.APPROVED,
        openHours: s.hours,
        listImageUrl: s.listImageUrl,
        StoreImageUrl: s.StoreImageUrl,
      },
    });

    merchants.push(m);
  }

  return merchants;
}

async function seedMenuAndOptions(merchants: { id: string; displayName: string }[]) {
  const menuItems: any[] = [];
  const optionsByMenuItem = new Map<string, any[]>();

  for (const m of merchants) {
    const items = [
      {
        name: "Signature Set",
        description: `Popular item from ${m.displayName}`,
        basePrice: d("79.00"),
        originalPrice: d("99.00"),
      },
      {
        name: "Snack Box",
        description: "Quick bite",
        basePrice: d("49.00"),
        originalPrice: d("69.00"),
      },
    ];

    for (const it of items) {
      const mi = await prisma.menuItem.create({
        data: {
          merchantId: m.id,
          name: it.name,
          description: it.description,
          basePrice: it.basePrice,
          originalPrice: it.originalPrice,
          leftoverQty: Math.floor(5 + Math.random() * 20),
          expiresAt: hoursFromNow(3),
          status: MenuItemStatus.LIVE,
          photoUrl: `https://picsum.photos/seed/${encodeURIComponent(
            it.name + m.displayName
          )}/400`,
          expireLabelUrl: "",
        },
      });

      const og = await prisma.optionGroup.create({
        data: {
          name: "Add-ons",
          merchantId: m.id,
          minSelect: 0,
          maxSelect: 2,
          menu: { connect: { id: mi.id } },
          options: {
            create: [
              { name: "Extra Rice", priceDelta: d("10.00") },
              { name: "Extra Sauce", priceDelta: d("5.00") },
              { name: "Cheese", priceDelta: d("15.00") },
            ],
          },
        },
        include: { options: true },
      });

      menuItems.push(mi);
      optionsByMenuItem.set(mi.id, og.options);
    }
  }

  return { menuItems, optionsByMenuItem };
}

/* ----------------------------- order creation ----------------------------- */

function calcItemTotal(
  basePrice: Prisma.Decimal,
  quantity: number,
  optionDeltas: Prisma.Decimal[]
) {
  const basePart = basePrice.mul(quantity);
  const optionsPart = optionDeltas.reduce((acc, x) => acc.add(x), d(0)).mul(quantity);
  return basePart.add(optionsPart);
}

async function seedOrders(
  customers: { id: string }[],
  merchants: { id: string }[],
  menuItems: {
    id: string;
    merchantId: string;
    basePrice: Prisma.Decimal;
  }[],
  optionsByMenuItem: Map<string, { id: string; priceDelta: Prisma.Decimal }[]>
) {
  const orders = [];

  // create 2 orders
  for (let i = 0; i < 2; i++) {
    const customer = pick(customers);

    // pick a merchant then pick its menu items
    const merchant = pick(merchants);
    const merchantMenus = menuItems.filter((m) => m.merchantId === merchant.id);
    const chosenMenu = pick(merchantMenus);

    const quantity = pick([1, 2, 3]);

    // pick 0-2 options from that menu item's option group
    const opts = optionsByMenuItem.get(chosenMenu.id) ?? [];
    const selectedOptions =
      opts.length === 0 ? [] : pickMany(opts, Math.min(2, opts.length));

    const optionDeltas = selectedOptions.map((o) => o.priceDelta);
    const itemTotal = calcItemTotal(chosenMenu.basePrice, quantity, optionDeltas);

    const subtotal = itemTotal;
    const totalAmount = subtotal; // no promo in seed

    const order = await prisma.order.create({
      data: {
        customerId: customer.id,
        merchantId: merchant.id,
        subtotal,
        totalAmount,
        preference: OrderPreference.CONTACT,
        note: "Seed order",
        items: {
          create: [
            {
              menuItemId: chosenMenu.id,
              quantity,
              options: {
                create: selectedOptions.map((o) => ({
                  optionId: o.id,
                  priceDelta: o.priceDelta,
                })),
              },
            },
          ],
        },
      },
      include: {
        items: { include: { options: true } },
        customer: true,
        merchant: true,
      },
    });

    orders.push(order);
  }

  return orders;
}

/* ----------------------------- main ----------------------------- */

async function main() {
  console.log("🧹 Cleaning...");

  console.log("🍱 Seeding categories...");
  const categories = await seedCategories();

  console.log("👤 Seeding users...");
  const { customers, merchantOwners } = await seedUsers();

  console.log("📍 Seeding addresses...");
  const addresses = await seedAddresses();

  console.log("🏪 Seeding merchants...");
  const merchants = await seedMerchants(merchantOwners, categories, addresses);

  console.log("📜 Seeding menu + options...");
  const { menuItems, optionsByMenuItem } = await seedMenuAndOptions(merchants);

  console.log("🧾 Seeding orders...");
  const orders = await seedOrders(customers, merchants, menuItems, optionsByMenuItem);

  console.log("✅ Seed completed!");

  console.log("\n--- Quick IDs for testing ---");
  console.log("Customers:", customers.map((c) => c.id));
  console.log("Merchants:", merchants.map((m) => m.id));
  console.log("Menu items:", menuItems.map((m) => m.id));
  console.log("Orders:", orders.map((o) => o.id));

  console.log("\nExample order payload shape you can test with:");
  console.log({
    customerId: customers[0]?.id,
    preference: "CONTACT",
    note: "test",
    items: [
      {
        menuItemId: menuItems[0]?.id,
        quantity: 1,
        optionIds: (optionsByMenuItem.get(menuItems[0]?.id) ?? [])
          .slice(0, 1)
          .map((o) => o.id),
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
