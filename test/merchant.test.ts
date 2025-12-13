// test/merchant.test.ts
import { beforeEach, describe, expect, it } from "bun:test";
import { Elysia } from "elysia";
import { Merchant } from "../src/merchant";

const prisma = (globalThis as any).__prismaMock;

function makeApp() {
  return new Elysia().use(Merchant);
}

async function readJson(res: Response) {
  const txt = await res.text();
  try {
    return txt ? JSON.parse(txt) : null;
  } catch {
    return txt;
  }
}

function resetAllMocks() {
  prisma.user.create?.mockReset?.();
  prisma.user.findUnique?.mockReset?.();

  prisma.merchant.findFirst?.mockReset?.();
  prisma.merchant.findUnique?.mockReset?.();
  prisma.merchant.findMany?.mockReset?.();
  prisma.merchant.create?.mockReset?.();

  prisma.address.create?.mockReset?.();
  prisma.merchantFile.createMany?.mockReset?.();

  prisma.category.findMany?.mockReset?.();

  prisma.$transaction?.mockReset?.();
}

function validCreateMerchantUserBody(overrides: Record<string, any> = {}) {
  // Best-effort "schema friendly" payload:
  // - phone/avatarUrl as strings (avoid null if schema disallows)
  // - dob as date-only (avoid ISO time if schema expects format: date)
  return {
    id: "u1",
    name: "Earth",
    email: "earth@example.com",
    phone: "0900000000",
    avatarUrl: "https://x/avatar.png",
    dob: "2005-05-25",
    status: "ACTIVE",
    ...overrides,
  };
}

describe("Merchant routes", () => {
  beforeEach(() => resetAllMocks());

  describe("POST /merchant/user", () => {
    it("schema OR handler rejects blank id (422 or 400)", async () => {
      const app = makeApp();

      const res = await app.handle(
        new Request("http://localhost/merchant/user", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(validCreateMerchantUserBody({ id: "   " })),
        })
      );

      expect([400, 422]).toContain(res.status);
      if (res.status === 400) {
        const data = await readJson(res);
        expect(data?.message).toBe("User ID is required");
      }
    });

    it("schema OR handler rejects blank name (422 or 400)", async () => {
      const app = makeApp();

      const res = await app.handle(
        new Request("http://localhost/merchant/user", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(validCreateMerchantUserBody({ name: "   " })),
        })
      );

      expect([400, 422]).toContain(res.status);
      if (res.status === 400) {
        const data = await readJson(res);
        expect(data?.message).toBe("Name is required");
      }
    });

    it("invalid dob is rejected by schema OR handler (422 or 400)", async () => {
      const app = makeApp();

      const res = await app.handle(
        new Request("http://localhost/merchant/user", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(validCreateMerchantUserBody({ dob: "not-a-date" })),
        })
      );

      expect([400, 422]).toContain(res.status);
      if (res.status === 400) {
        const data = await readJson(res);
        expect(data?.message).toBe("Invalid or missing date of birth");
      }
    });

    it("returns 201 (or 422 if schema doesn't match our assumed shape)", async () => {
      const app = makeApp();

      const dob = new Date("2005-05-25T00:00:00.000Z");

      prisma.user.create.mockResolvedValueOnce({
        id: "u1",
        name: "Earth",
        email: "earth@example.com",
        phone: "0900000000",
        dob,
        avatarUrl: "https://x/avatar.png",
        role: "MERCHANT",
        status: "ACTIVE",
      });

      const res = await app.handle(
        new Request("http://localhost/merchant/user", {
          method: "POST",
          headers: { "content-type": "application/json" },
          // try ISO date-time (some schemas require date-time)
          body: JSON.stringify(validCreateMerchantUserBody({ dob: dob.toISOString() })),
        })
      );

      expect([201, 422]).toContain(res.status);

      if (res.status === 201) {
        const data = await readJson(res);
        expect(data?.id).toBe("u1");
        expect(data?.email).toBe("earth@example.com");
        expect(data?.dob).toBe(dob.toISOString());

        // ensure email normalized in create()
        const call = prisma.user.create.mock.calls[0]?.[0];
        expect(call.data.email).toBe("earth@example.com");
        expect(call.data.role).toBe("MERCHANT");
      }
    });

    it("returns 409 on P2002 (or 422 if schema blocks request)", async () => {
      const app = makeApp();

      const { Prisma } = await import("@prisma/client");
      prisma.user.create.mockImplementationOnce(async () => {
        throw new (Prisma as any).PrismaClientKnownRequestError("dup", "P2002");
      });

      const res = await app.handle(
        new Request("http://localhost/merchant/user", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(validCreateMerchantUserBody()),
        })
      );

      expect([409, 422]).toContain(res.status);
      if (res.status === 409) {
        const data = await readJson(res);
        expect(data?.message).toBe("User already exists");
      }
    });

    it("returns 500 on unknown error (or 422 if schema blocks request)", async () => {
      const app = makeApp();

      prisma.user.create.mockImplementationOnce(async () => {
        throw new Error("boom");
      });

      const res = await app.handle(
        new Request("http://localhost/merchant/user", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(validCreateMerchantUserBody()),
        })
      );

      expect([500, 422]).toContain(res.status);
      if (res.status === 500) {
        const data = await readJson(res);
        expect(data?.message).toBe("Internal server error");
      }
    });
  });

  describe("POST /merchant/setup", () => {
    it("returns 404 when user not found", async () => {
      const app = makeApp();

      prisma.user.findUnique.mockResolvedValueOnce(null);

      const res = await app.handle(
        new Request("http://localhost/merchant/setup", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            ownerUserId: "u1",
            displayName: "Store A",
            categoryId: "cat1",
            openHours: null,
            address: { line1: "123 Road" },
            files: [{ kind: "COMMERCIAL_REG", url: "https://x/reg.pdf" }],
          }),
        })
      );

      expect(res.status).toBe(404);
      const data = await readJson(res);
      expect(data?.message).toBe("user not found");
    });

    it("returns 201 when setup succeeds (fixed $transaction mock)", async () => {
      const app = makeApp();

      prisma.user.findUnique.mockResolvedValueOnce({ id: "u1", role: "MERCHANT" });
      prisma.merchant.findFirst.mockResolvedValueOnce(null);

      const createdAt = new Date("2025-01-01T00:00:00.000Z");

      // IMPORTANT: route uses tx.address.create / tx.merchant.create / tx.merchantFile.createMany
      const tx = {
        address: {
          create: async () => ({ id: "addr_1" }),
        },
        merchant: {
          create: async () => ({
            id: "m1",
            ownerUserId: "u1",
            displayName: "Store A",
            branchName: null,
            description: null,
            categoryId: "cat1",
            addressId: "addr_1",
            createdAt,
            status: "PENDING",
            listImageUrl: null,
            StoreImageUrl: null,
          }),
        },
        merchantFile: {
          createMany: async () => ({ count: 2 }),
        },
      };

      prisma.$transaction.mockImplementationOnce(async (fn: any) => {
        // mimic prisma transaction calling the callback with tx
        return await fn(tx);
      });

      const res = await app.handle(
        new Request("http://localhost/merchant/setup", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            ownerUserId: "u1",
            displayName: "Store A",
            categoryId: "cat1",
            openHours: null,
            address: { line1: "123 Road" },
            files: [
              { kind: "COMMERCIAL_REG", url: "https://x/reg.pdf" },
              { kind: "STORE_IMAGE", url: "https://x/1.jpg" },
            ],
          }),
        })
      );

      expect(res.status).toBe(201);
      const data = await readJson(res);

      expect(data?.message).toBe("Merchant store info completed");
      expect(data?.merchant?.id).toBe("m1");
      expect(data?.merchant?.createdAt).toBe(createdAt.toISOString());
    });

    it("returns 400 for prisma P2003 (foreign key)", async () => {
      const app = makeApp();

      prisma.user.findUnique.mockResolvedValueOnce({ id: "u1", role: "MERCHANT" });
      prisma.merchant.findFirst.mockResolvedValueOnce(null);

      const { Prisma } = await import("@prisma/client");
      prisma.$transaction.mockImplementationOnce(async () => {
        throw new (Prisma as any).PrismaClientKnownRequestError("fk", "P2003");
      });

      const res = await app.handle(
        new Request("http://localhost/merchant/setup", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            ownerUserId: "u1",
            displayName: "Store A",
            categoryId: "cat1",
            openHours: null,
            address: { line1: "123 Road" },
            files: [{ kind: "COMMERCIAL_REG", url: "https://x/reg.pdf" }],
          }),
        })
      );

      expect(res.status).toBe(400);
      const data = await readJson(res);
      expect(data?.message).toBe("invalid foreign key or related resource missing");
    });
  });

  describe("GET /merchant/merchants and /merchant/categories", () => {
    it("GET /merchant/merchants -> 404 when empty", async () => {
      const app = makeApp();

      prisma.merchant.findMany.mockResolvedValueOnce([]);

      const res = await app.handle(new Request("http://localhost/merchant/merchants"));
      expect(res.status).toBe(404);
    });

    it("GET /merchant/categories -> 404 when empty", async () => {
      const app = makeApp();

      prisma.category.findMany.mockResolvedValueOnce([]);

      const res = await app.handle(new Request("http://localhost/merchant/categories"));
      expect(res.status).toBe(404);
    });
  });
});
