import { beforeAll, beforeEach, describe, expect, it } from "bun:test";
import { Elysia } from "elysia";

/**
 * IMPORTANT:
 * This test assumes `test/setup.ts` preloads and mocks @prisma/client
 * with:
 *   globalThis.__prismaMock.payment.findMany (mock fn)
 *   mocked PrismaClient exposes `payment`
 *   exports PaymentStatus enum-like object
 */

const prisma = (globalThis as any).__prismaMock;

let MerchantFinance: any;

beforeAll(async () => {
  const mod = await import("../src/merchant/finance");
  MerchantFinance = mod.MerchantFinance;
});

function makeApp() {
  return new Elysia().use(MerchantFinance);
}

beforeEach(() => {
  prisma.payment.findMany.mockReset();
  prisma.payment.findMany.mockResolvedValue([]);
});

function makePayment(p: Partial<any>) {
  return {
    id: "pay_1",
    orderId: "order_1",
    merchantId: "m1",
    provider: "OMISE",
    providerChargeId: null,
    currency: "THB",
    status: "PAID",
    amount: "100.50", // string to prove Decimal-safe conversion
    paidAt: "2025-01-01T10:15:00.000Z",
    ...p,
  };
}

describe("MerchantFinance routes", () => {
  it("GET /merchant/:merchantId/finance/transactions -> returns empty list", async () => {
    const app = makeApp();

    prisma.payment.findMany.mockResolvedValueOnce([]);

    const res = await app.handle(
      new Request("http://localhost/merchant/m1/finance/transactions")
    );

    expect(res.status).toBe(200);

    const json = await res.json();
    expect(Array.isArray(json.transactions)).toBe(true);
    expect(json.transactions.length).toBe(0);
  });

  it("GET .../transactions -> maps payments to txns (amountTHB number, date/time/title)", async () => {
    const app = makeApp();

    prisma.payment.findMany.mockResolvedValueOnce([
      makePayment({
        id: "payA",
        orderId: "oA",
        amount: "250.25",
        paidAt: "2025-01-01T10:15:00.000Z",
      }),
    ]);

    const res = await app.handle(
      new Request("http://localhost/merchant/m1/finance/transactions")
    );

    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.transactions.length).toBe(1);

    const t0 = json.transactions[0];
    expect(t0.paymentId).toBe("payA");
    expect(t0.orderId).toBe("oA");
    expect(t0.merchantId).toBe("m1");
    expect(t0.currency).toBe("THB");
    expect(t0.status).toBe("PAID");
    expect(t0.amountTHB).toBe(250.25);
    expect(t0.date).toBe("2025-01-01");
    expect(t0.time).toBe("10:15am");
    expect(t0.title).toBe("Order #oA");
  });

  it("GET .../transactions?range=Today -> adds paidAt gte/lte filter to prisma.findMany", async () => {
    const app = makeApp();

    prisma.payment.findMany.mockResolvedValueOnce([]);

    const res = await app.handle(
      new Request("http://localhost/merchant/m1/finance/transactions?range=Today")
    );

    expect(res.status).toBe(200);

    const callArg = prisma.payment.findMany.mock.calls[0][0];
    expect(callArg.where.merchantId).toBe("m1");
    expect(callArg.where.status).toBe("PAID");
    expect(callArg.where.paidAt).toBeTruthy();
    expect(callArg.where.paidAt.gte instanceof Date).toBe(true);
    expect(callArg.where.paidAt.lte instanceof Date).toBe(true);
  });

  it("GET .../payouts -> builds 1 payout per paid day, feeRate from query", async () => {
    const app = makeApp();

    prisma.payment.findMany.mockResolvedValueOnce([
      makePayment({
        id: "pay1",
        orderId: "o1",
        amount: 100,
        paidAt: "2025-01-01T10:00:00.000Z",
      }),
      makePayment({
        id: "pay2",
        orderId: "o2",
        amount: 50,
        paidAt: "2025-01-01T12:00:00.000Z",
      }),
    ]);

    const res = await app.handle(
      new Request("http://localhost/merchant/m1/finance/payouts?feeRate=0.10")
    );

    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.payouts.length).toBe(1);

    const p0 = json.payouts[0];
    expect(p0.id).toBe("payout-2025-01-01");
    expect(p0.detailDate).toBe("2025-01-02");
    expect(p0.feeTHB).toBe(15);
    expect(p0.amountTHB).toBe(135);
    expect(["Transferred", "Pending"]).toContain(p0.status);
  });

  it("GET .../summary -> computes totals", async () => {
    const app = makeApp();

    prisma.payment.findMany.mockResolvedValueOnce([
      makePayment({ amount: "100.00" }),
      makePayment({ amount: "50.00", id: "pay2", orderId: "o2" }),
    ]);

    const res = await app.handle(
      new Request("http://localhost/merchant/m1/finance/summary?feeRate=0.20")
    );

    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.summary.netSales).toBe(150);
    expect(json.summary.deduction).toBe(30);
    expect(json.summary.netEarnings).toBe(120);
    expect(json.summary.earnings).toBe(120);
  });

  it("GET .../all -> returns transactions + payouts + summary", async () => {
    const app = makeApp();

    prisma.payment.findMany.mockResolvedValueOnce([
      makePayment({
        id: "pay1",
        orderId: "o1",
        amount: "200.00",
        paidAt: "2025-01-01T10:00:00.000Z",
      }),
      makePayment({
        id: "pay2",
        orderId: "o2",
        amount: "100.00",
        paidAt: "2025-01-02T10:00:00.000Z",
      }),
    ]);

    const res = await app.handle(
      new Request("http://localhost/merchant/m1/finance/all?feeRate=0.15")
    );

    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.transactions.length).toBe(2);
    expect(json.payouts.length).toBe(2);
    expect(json.summary.netSales).toBe(300);
    expect(json.summary.deduction).toBe(45);
    expect(json.summary.netEarnings).toBe(255);
  });
});