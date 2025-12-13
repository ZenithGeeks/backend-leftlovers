// test/editstore.test.ts
import "./setup";

import { describe, it, expect, beforeEach } from "bun:test";
import { Elysia } from "elysia";
import { MerchantEditStore } from "../src/merchant/editstore";

const prisma = (globalThis as any).__prismaMock;
const tx = (globalThis as any).__txMock;

async function readJson(res: Response) {
  const t = await res.text();
  try {
    return t ? JSON.parse(t) : null;
  } catch {
    return t;
  }
}

function resetAll() {
  // merchant
  prisma.merchant.findUnique?.mockReset?.();
  prisma.merchant.update?.mockReset?.();

  // transaction + tx models
  prisma.$transaction?.mockReset?.();
  prisma.$transaction?.mockImplementation?.(async (arg: any) => {
    if (typeof arg === "function") return await arg(tx);
    if (Array.isArray(arg)) return await Promise.all(arg);
    return arg;
  });

  tx.merchant.update?.mockReset?.();
  tx.user.update?.mockReset?.();
  tx.address.update?.mockReset?.();
}

describe("MerchantEditStore routes", () => {
  beforeEach(() => resetAll());

  it("GET /merchant/:merchantId/editstore -> 404 when merchant not found", async () => {
    const app = new Elysia().use(MerchantEditStore);

    prisma.merchant.findUnique.mockResolvedValue(null);

    const res = await app.handle(
      new Request("http://localhost/merchant/m1/editstore")
    );

    expect(res.status).toBe(404);
    const body = await readJson(res);
    expect(body.message).toBe("Merchant not found");
  });

  it("GET /merchant/:merchantId/editstore -> 200 maps response + converts lat/lng to number", async () => {
    const app = new Elysia().use(MerchantEditStore);

    prisma.merchant.findUnique.mockResolvedValue({
      id: "m1",
      displayName: "Store A",
      StoreImageUrl: "https://img/store.png",
      listImageUrl: "https://img/list.png",
      categoryId: "c1",
      openHours: { mon: "09:00-18:00" },
      owner: { name: "Owner Name", phone: "099", email: "x@y.com" },
      address: {
        line1: "L1",
        line2: "L2",
        city: "Bangkok",
        province: "Bangkok",
        postalCode: "10100",
        lat: "13.7",
        lng: "100.5",
      },
      category: { name: "Thai" },
    });

    const res = await app.handle(
      new Request("http://localhost/merchant/m1/editstore")
    );

    expect(res.status).toBe(200);
    const body = await readJson(res);

    expect(body.id).toBe("m1");
    expect(body.name).toBe("Store A");
    expect(body.address.lat).toBe(13.7);
    expect(body.address.lng).toBe(100.5);
  });

  it("PUT /merchant/:merchantId/store-open-status -> 200 updates openStatus", async () => {
    const app = new Elysia().use(MerchantEditStore);

    prisma.merchant.update.mockResolvedValue({ id: "m1", openStatus: "OPEN" });

    const res = await app.handle(
      new Request("http://localhost/merchant/m1/store-open-status", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ openStatus: "OPEN" }),
      })
    );

    expect(res.status).toBe(200);
    const body = await readJson(res);
    expect(body.openStatus).toBe("OPEN");
  });

  it("PUT /merchant/:merchantId/store-open-status -> 404 when prisma throws P2025", async () => {
    const app = new Elysia().use(MerchantEditStore);

    prisma.merchant.update.mockRejectedValue({ code: "P2025" });

    const res = await app.handle(
      new Request("http://localhost/merchant/m1/store-open-status", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ openStatus: "OPEN" }),
      })
    );

    expect(res.status).toBe(404);
    const body = await readJson(res);
    expect(body.message).toBe("merchant not found");
  });

  it("PUT /merchant/:merchantId/store-open-status -> 500 on unknown error", async () => {
    const app = new Elysia().use(MerchantEditStore);

    prisma.merchant.update.mockRejectedValue(new Error("boom"));

    const res = await app.handle(
      new Request("http://localhost/merchant/m1/store-open-status", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ openStatus: "OPEN" }),
      })
    );

    expect(res.status).toBe(500);
    const body = await readJson(res);
    expect(body.message).toBe("failed to update open status");
  });

  it("PUT /merchant/:merchantId/editstore -> 404 when merchant not found", async () => {
    const app = new Elysia().use(MerchantEditStore);

    prisma.merchant.findUnique.mockResolvedValue(null);

    const res = await app.handle(
      new Request("http://localhost/merchant/m1/editstore", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: "X" }),
      })
    );

    expect(res.status).toBe(404);
    const body = await readJson(res);
    expect(body.message).toBe("Merchant not found");
  });

  it("PUT /merchant/:merchantId/editstore -> 200 updates merchant + owner + address (trim + normalize)", async () => {
    const app = new Elysia().use(MerchantEditStore);

    const baseMerchant = {
      id: "m1",
      displayName: "Old",
      StoreImageUrl: null,
      listImageUrl: null,
      categoryId: "c1",
      openHours: null,
      ownerUserId: "u1",
      addressId: "a1",
      owner: { id: "u1", name: "Old Owner", phone: "0", email: "OLD@X.COM" },
      address: {
        id: "a1",
        line1: "Old L1",
        line2: null,
        city: null,
        province: null,
        postalCode: null,
        lat: null,
        lng: null,
      },
      category: { name: "Thai" },
    };

    prisma.merchant.findUnique.mockResolvedValue(baseMerchant);

    tx.merchant.update.mockResolvedValue({
      ...baseMerchant,
      displayName: "New Store",
      categoryId: "c2",
      StoreImageUrl: "s.png",
      listImageUrl: "l.png",
      openHours: { mon: "9-18" },
      category: { name: "Japanese" },
    });

    tx.user.update.mockResolvedValue({
      ...baseMerchant.owner,
      name: "Owner New",
      phone: "099",
      email: "new@email.com",
    });

    tx.address.update.mockResolvedValue({
      ...baseMerchant.address,
      line1: "LINE 1",
      city: "BKK",
      lat: "13.7",
      lng: "100.5",
    });

    const res = await app.handle(
      new Request("http://localhost/merchant/m1/editstore", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: "  New Store  ",
          storeImage: "s.png",
          listImage: "l.png",
          categoryId: "c2",
          businessHours: { mon: "9-18" },
          ownerName: "  Owner New  ",
          ownerPhone: "  099 ",
          ownerEmail: "  NEW@EMAIL.COM ",
          address: { line1: "LINE 1", city: "BKK", lat: 13.7, lng: 100.5 },
        }),
      })
    );

    expect(res.status).toBe(200);
    const body = await readJson(res);

    expect(body.name).toBe("New Store");
    expect(body.owner.email).toBe("new@email.com");
    expect(body.address.lat).toBe(13.7);
    expect(body.address.lng).toBe(100.5);

    expect(tx.merchant.update.mock.calls.length).toBe(1);
    expect(tx.user.update.mock.calls.length).toBe(1);
    expect(tx.address.update.mock.calls.length).toBe(1);
  });

  it("PUT /merchant/:merchantId/editstore -> 200 with empty body (no updates) returns original merchant data", async () => {
    const app = new Elysia().use(MerchantEditStore);

    const baseMerchant = {
      id: "m1",
      displayName: "Old",
      StoreImageUrl: "s.png",
      listImageUrl: "l.png",
      categoryId: "c1",
      openHours: { mon: "x" },
      ownerUserId: "u1",
      addressId: "a1",
      owner: { id: "u1", name: "Owner", phone: "0", email: "x@y.com" },
      address: {
        id: "a1",
        line1: "L1",
        line2: "L2",
        city: "BKK",
        province: "BKK",
        postalCode: "10100",
        lat: "13.7",
        lng: "100.5",
      },
      category: { name: "Thai" },
    };

    prisma.merchant.findUnique.mockResolvedValue(baseMerchant);

    const res = await app.handle(
      new Request("http://localhost/merchant/m1/editstore", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({}),
      })
    );

    expect(res.status).toBe(200);
    const body = await readJson(res);

    expect(body.name).toBe("Old");
    expect(body.address.lat).toBe(13.7);

    // no updates should occur
    expect(tx.merchant.update.mock.calls.length).toBe(0);
    expect(tx.user.update.mock.calls.length).toBe(0);
    expect(tx.address.update.mock.calls.length).toBe(0);
  });

  it("PUT /merchant/:merchantId/editstore -> 500 when transaction throws", async () => {
    const app = new Elysia().use(MerchantEditStore);

    prisma.merchant.findUnique.mockResolvedValue({
      id: "m1",
      displayName: "Old",
      StoreImageUrl: null,
      listImageUrl: null,
      categoryId: "c1",
      openHours: null,
      ownerUserId: "u1",
      addressId: "a1",
      owner: { id: "u1", name: "Owner", phone: "0", email: "x@y.com" },
      address: { id: "a1", line1: "L1" },
      category: { name: "Thai" },
    });

    prisma.$transaction.mockRejectedValueOnce(new Error("tx failed"));

    const res = await app.handle(
      new Request("http://localhost/merchant/m1/editstore", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: "X" }),
      })
    );

    expect(res.status).toBe(500);
    const body = await readJson(res);
    expect(body.message).toBe("Internal server error");
  });
});
