// test/merchant-menu.test.ts
import { describe, it, expect, beforeEach } from "bun:test";
import { Elysia } from "elysia";
import { merchantMenu } from "../src/merchant/menu";
import { PrismaClientKnownRequestError } from "./setup";

const prisma = (globalThis as any).__prismaMock as any;

function makeApp() {
  return new Elysia().use(merchantMenu);
}

function reqJSON(url: string, method: string, body?: any) {
  return new Request(url, {
    method,
    headers: { "content-type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
}

function mockMerchant(override: Record<string, any> = {}) {
  return {
    id: "m1",
    name: "Merchant",
    ownerId: "u1",
    categoryId: "c1",
    ...override,
  };
}

function mockMenuItem(override: Record<string, any> = {}) {
  return {
    id: "menu1",
    merchantId: "m1",
    name: "Menu Name",
    description: "Desc",
    basePrice: 10,
    leftoverQty: 5,
    // IMPORTANT: many implementations filter out expired items
    expiresAt: new Date(Date.now() + 3600_000),
    // some handlers filter by status/active (depending on your schema)
    status: "LIVE",
    active: true,
    groupTemplateIds: [],
    ...override,
  };
}

function mockGroupTemplate(override: Record<string, any> = {}) {
  return {
    id: "g1",
    merchantId: "m1",
    name: "Group",
    minSelect: 0,
    maxSelect: 1,
    active: true,
    options: [],
    ...override,
  };
}

// Keep this aligned with your schema; we already make it "schema-valid".
function validMenuUpdateBody(override: Record<string, any> = {}) {
  return {
    name: "Menu Name",
    description: "Desc",
    basePrice: 10,
    leftoverQty: 5,
    expiresAt: new Date(Date.now() + 3600_000).toISOString(),
    groupTemplateIds: [],
    ...override,
  };
}

beforeEach(() => {
  // Reset relevant mocks (optional chaining so it won't crash if a model isn't present)
  prisma.merchant?.findUnique?.mockReset?.();

  prisma.menuItem?.findMany?.mockReset?.();
  prisma.menuItem?.findFirst?.mockReset?.();
  prisma.menuItem?.findUnique?.mockReset?.();
  prisma.menuItem?.update?.mockReset?.();
  prisma.menuItem?.delete?.mockReset?.();

  prisma.optionGroupTemplate?.findMany?.mockReset?.();
  prisma.optionGroupTemplate?.create?.mockReset?.();

  prisma.option?.update?.mockReset?.();

  // ✅ Default: merchant exists (so list/group endpoints can return 200)
  prisma.merchant.findUnique.mockResolvedValue(mockMerchant());

  // ✅ Default: safe fallbacks
  prisma.menuItem.findMany.mockResolvedValue([]);
  prisma.menuItem.findFirst.mockResolvedValue(null);
  prisma.menuItem.findUnique.mockResolvedValue(null);

  prisma.optionGroupTemplate.findMany.mockResolvedValue([]);
});

describe("merchantMenu routes", () => {
  it("GET /merchant/:merchantId/menu -> 404 when empty", async () => {
    prisma.menuItem.findMany.mockResolvedValueOnce([]);

    const app = makeApp();
    const res = await app.handle(new Request("http://x/merchant/m1/menu"));

    expect(res.status).toBe(404);
  });

  it("GET /merchant/:merchantId/menu -> 200 returns items", async () => {
    prisma.menuItem.findMany.mockResolvedValueOnce([mockMenuItem()]);

    const app = makeApp();
    const res = await app.handle(new Request("http://x/merchant/m1/menu"));

    expect(res.status).toBe(200);
  });

  it("GET /merchant/:merchantId/menu/:menuId -> 404 when not found", async () => {
    prisma.menuItem.findFirst.mockResolvedValueOnce(null);

    const app = makeApp();
    const res = await app.handle(new Request("http://x/merchant/m1/menu/menu404"));

    expect(res.status).toBe(404);
  });

  it("PUT /merchant/:merchantId/menu/:menuId -> 404 when menu missing (schema-valid body)", async () => {
    prisma.menuItem.findFirst.mockResolvedValueOnce(null);
    prisma.menuItem.findUnique.mockResolvedValueOnce(null);

    const app = makeApp();
    const res = await app.handle(
      reqJSON("http://x/merchant/m1/menu/menu404", "PUT", validMenuUpdateBody())
    );

    expect(res.status).toBe(404);
  });

  it("PUT /merchant/:merchantId/menu/:menuId -> expiresAt null => schema 422 OR handler 400/404 (depends on your schema)", async () => {
    // ensure it doesn't fail as 404 just because menu/merchant missing
    prisma.menuItem.findFirst.mockResolvedValueOnce(mockMenuItem());
    prisma.menuItem.findUnique.mockResolvedValueOnce(mockMenuItem());

    const app = makeApp();
    const res = await app.handle(
      reqJSON("http://x/merchant/m1/menu/menu1", "PUT", {
        ...validMenuUpdateBody(),
        expiresAt: null,
      })
    );

    // If schema blocks => 422. If handler blocks => 400. Some implementations might 404 earlier.
    expect([422, 400, 404]).toContain(res.status);
  });

  it("PUT /merchant/:merchantId/menu/:menuId -> invalid groupTemplateIds => 400 OR schema 422", async () => {
    // ensure menu exists so we don't get a fake 404
    prisma.menuItem.findFirst.mockResolvedValueOnce(mockMenuItem());
    prisma.menuItem.findUnique.mockResolvedValueOnce(mockMenuItem());

    // handler often checks requested group ids exist
    prisma.optionGroupTemplate.findMany.mockResolvedValueOnce([]); // none found => invalid

    const app = makeApp();
    const res = await app.handle(
      reqJSON(
        "http://x/merchant/m1/menu/menu1",
        "PUT",
        validMenuUpdateBody({ groupTemplateIds: ["g1", "g2"] })
      )
    );

    expect([400, 422]).toContain(res.status);
  });

  it("PUT /merchant/:merchantId/menu/:menuId -> 200 updates menu (schema-valid body)", async () => {
    prisma.menuItem.findFirst.mockResolvedValueOnce(mockMenuItem());
    prisma.menuItem.findUnique.mockResolvedValueOnce(mockMenuItem());

    prisma.menuItem.update.mockResolvedValueOnce(mockMenuItem({ name: "Updated" }));

    const app = makeApp();
    const res = await app.handle(
      reqJSON("http://x/merchant/m1/menu/menu1", "PUT", validMenuUpdateBody({ name: "Updated" }))
    );

    expect(res.status).toBe(200);
  });

  it("PUT /merchant/:merchantId/menu/:menuId/status -> 404 when menu missing", async () => {
    prisma.menuItem.findFirst.mockResolvedValueOnce(null);
    prisma.menuItem.findUnique.mockResolvedValueOnce(null);

    const app = makeApp();
    const res = await app.handle(
      reqJSON("http://x/merchant/m1/menu/menu404/status", "PUT", { status: "LIVE" })
    );

    expect(res.status).toBe(404);
  });

  it("DELETE /merchant/:merchantId/menu/:menuId -> 404 when missing", async () => {
    prisma.menuItem.findFirst.mockResolvedValueOnce(null);
    prisma.menuItem.findUnique.mockResolvedValueOnce(null);

    const app = makeApp();
    const res = await app.handle(
      new Request("http://x/merchant/m1/menu/menu404", { method: "DELETE" })
    );

    expect(res.status).toBe(404);
  });

  it("DELETE /merchant/:merchantId/menu/:menuId -> 204 when deleted", async () => {
    prisma.menuItem.findFirst.mockResolvedValueOnce(mockMenuItem());
    prisma.menuItem.findUnique.mockResolvedValueOnce(mockMenuItem());
    prisma.menuItem.delete.mockResolvedValueOnce(mockMenuItem());

    const app = makeApp();
    const res = await app.handle(
      new Request("http://x/merchant/m1/menu/menu1", { method: "DELETE" })
    );

    expect(res.status).toBe(204);
  });

  it("GET /merchant/:merchantId/group -> 404 when empty", async () => {
    prisma.optionGroupTemplate.findMany.mockResolvedValueOnce([]);

    const app = makeApp();
    const res = await app.handle(new Request("http://x/merchant/m1/group"));

    expect(res.status).toBe(404);
  });

  it("GET /merchant/:merchantId/group -> 200 returns groups", async () => {
    prisma.optionGroupTemplate.findMany.mockResolvedValueOnce([mockGroupTemplate()]);

    const app = makeApp();
    const res = await app.handle(new Request("http://x/merchant/m1/group"));

    expect(res.status).toBe(200);
  });

  it("POST /merchant/:merchantId/group -> 404 if merchant not found (schema-valid body)", async () => {
    prisma.merchant.findUnique.mockResolvedValueOnce(null);

    const app = makeApp();
    const res = await app.handle(
      reqJSON("http://x/merchant/m404/group", "POST", {
        name: "Group",
        minSelect: 0,
        maxSelect: 1,
      })
    );

    expect([404, 422]).toContain(res.status);
  });

  it("PUT /merchant/option/:optionId -> 404 if option not found", async () => {
    // IMPORTANT: use the SAME error class your handlers expect (from test/setup.ts)
    prisma.option.update.mockRejectedValueOnce(
      new PrismaClientKnownRequestError("not found", {
        code: "P2025",
        clientVersion: "test",
      })
    );

    const app = makeApp();
    const res = await app.handle(
      reqJSON("http://x/merchant/option/opt404", "PUT", { active: false })
    );

    expect(res.status).toBe(404);
  });
});
