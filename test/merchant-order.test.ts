// test/merchant-order.test.ts
import { beforeEach, describe, expect, it } from "bun:test";
import { Elysia } from "elysia";

// ✅ adjust this import if your path differs
// If your file is: src/merchant/order/index.ts
import { merchantOrder } from "../src/merchant/order";

type PrismaMock = {
  order: {
    findMany: any;
    findUnique: any;
    findFirst: any;
    update: any;
  };
};

function setMockImpl(fn: any, impl: (...args: any[]) => any) {
  fn?.mockReset?.();
  fn?.mockClear?.();
  fn?.mockImplementation?.(impl);
  // Fallback (if your mock doesn't support mockImplementation for any reason)
  if (!fn?.mockImplementation) {
    // do nothing; bun mock should support it
  }
}

describe("merchantOrder routes", () => {
  const app = new Elysia().use(merchantOrder);

  const prisma = (globalThis as any).__prismaMock as PrismaMock;

  beforeEach(() => {
    // default safe implementations (so tests never touch real DB)
    setMockImpl(prisma.order.findMany, async () => []);
    setMockImpl(prisma.order.findUnique, async () => null);
    setMockImpl(prisma.order.findFirst, async () => null);
    setMockImpl(prisma.order.update, async () => null);
  });

  it("GET /merchant/:merchantId/order -> 404 when no orders", async () => {
    setMockImpl(prisma.order.findMany, async () => []);

    const res = await app.handle(
      new Request("http://localhost/merchant/m1/order")
    );

    expect(res.status).toBe(404);

    const body = await res.json();
    expect(body).toEqual({ message: "No orders found" });
  });

  it("GET /merchant/:merchantId/order -> 200 returns orders", async () => {
    const fakeOrders = [
      {
        id: "o1",
        merchantId: "m1",
        status: "PENDING",
        items: [],
        customer: { id: "c1", name: "Alice" },
        createdAt: new Date().toISOString(),
      },
    ];

    setMockImpl(prisma.order.findMany, async () => fakeOrders);

    const res = await app.handle(
      new Request("http://localhost/merchant/m1/order")
    );

    expect(res.status).toBe(200);

    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body[0].id).toBe("o1");
  });

  it("GET /merchant/order/:orderId -> 404 when not found", async () => {
    setMockImpl(prisma.order.findUnique, async () => null);

    const res = await app.handle(
      new Request("http://localhost/merchant/order/o404")
    );

    expect(res.status).toBe(404);

    const body = await res.json();
    expect(body).toEqual({ message: "No orders found" });
  });

  it("GET /merchant/order/:orderId -> 200 returns order", async () => {
    const fakeOrder = {
      id: "o1",
      merchantId: "m1",
      status: "PENDING",
      items: [],
      customer: { id: "c1", name: "Alice" },
    };

    setMockImpl(prisma.order.findUnique, async () => fakeOrder);

    const res = await app.handle(
      new Request("http://localhost/merchant/order/o1")
    );

    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.id).toBe("o1");
  });

  it("PUT /merchant/:merchantId/order/:orderId -> 404 when order not found", async () => {
    setMockImpl(prisma.order.findFirst, async () => null);

    const res = await app.handle(
      new Request("http://localhost/merchant/m1/order/o404", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: "READY" }),
      })
    );

    expect(res.status).toBe(404);

    const body = await res.json();
    expect(body).toEqual({ message: "order not found" });
  });

  it("PUT /merchant/:merchantId/order/:orderId -> 200 updates status", async () => {
    setMockImpl(prisma.order.findFirst, async () => ({
      id: "o1",
      merchantId: "m1",
      status: "PENDING",
    }));

    setMockImpl(prisma.order.update, async (_args: any) => ({
      id: "o1",
      merchantId: "m1",
      status: "READY",
    }));

    const res = await app.handle(
      new Request("http://localhost/merchant/m1/order/o1", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: "READY" }),
      })
    );

    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.id).toBe("o1");
    expect(body.status).toBe("READY");

    // Optional: verify prisma.update was called
    if (prisma.order.update?.mock?.calls) {
      expect(prisma.order.update.mock.calls.length).toBe(1);
    }
  });
});
