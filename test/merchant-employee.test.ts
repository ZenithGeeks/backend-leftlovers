// test/merchant-employee.test.ts
import { describe, it, expect, beforeEach } from "bun:test";
import { Elysia } from "elysia";
import { MerchantEmployees } from "../src/merchant/employee";

const prisma = (globalThis as any).__prismaMock;

function resetAllMocks() {
  prisma.merchant.findUnique.mockReset();

  prisma.employee.findMany.mockReset();
  prisma.employee.findFirst.mockReset();
  prisma.employee.findUnique.mockReset();
  prisma.employee.create.mockReset();
  prisma.employee.update.mockReset();
  prisma.employee.delete.mockReset();

  prisma.user.findFirst.mockReset();
}

async function readJson(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
}

describe("MerchantEmployees routes", () => {
  const app = new Elysia().use(MerchantEmployees);

  beforeEach(() => {
    resetAllMocks();
  });

  it("GET /merchant/:merchantId/employees -> 404 when merchant not found", async () => {
    prisma.merchant.findUnique.mockResolvedValue(null);

    const res = await app.handle(
      new Request("http://localhost/merchant/m1/employees")
    );

    expect(res.status).toBe(404);
    const body = await readJson(res);
    expect(body.message).toBe("Merchant not found");
  });

  it("GET /merchant/:merchantId/employees -> 200 returns owner + employees", async () => {
    prisma.merchant.findUnique.mockResolvedValue({
      id: "m1",
      owner: { id: "u1", name: "John Doe", email: "john@x.com", phone: "099" },
    });

    prisma.employee.findMany.mockResolvedValue([
      {
        id: "e1",
        merchantId: "m1",
        userId: null,
        fullName: "Alice Smith",
        username: "alice",
        email: "alice@x.com",
        mobileNumber: "088",
        role: "CASHIER",
        status: "ACTIVE",
        createdAt: new Date("2025-01-01T00:00:00.000Z"),
        disabledAt: null,
      },
    ]);

    const res = await app.handle(
      new Request("http://localhost/merchant/m1/employees")
    );

    expect(res.status).toBe(200);
    const body = await readJson(res);

    expect(body.owner).toEqual({
      id: "u1",
      firstName: "John",
      lastName: "Doe",
      email: "john@x.com",
      phone: "099",
      username: null,
      role: "Owner",
    });

    expect(Array.isArray(body.employees)).toBe(true);
    expect(body.employees[0]).toMatchObject({
      id: "e1",
      firstName: "Alice",
      lastName: "Smith",
      username: "alice",
      email: "alice@x.com",
      phone: "088",
      role: "Cashier",
      status: "ACTIVE",
      disabledAt: null,
    });
    expect(typeof body.employees[0].createdAt).toBe("string");
  });

  it("POST /merchant/:merchantId/employees -> 404 when merchant not found", async () => {
    prisma.merchant.findUnique.mockResolvedValue(null);

    const res = await app.handle(
      new Request("http://localhost/merchant/m1/employees", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fullName: "Bob B",
          role: "Stock",
        }),
      })
    );

    expect(res.status).toBe(404);
    const body = await readJson(res);
    expect(body.message).toBe("Merchant not found");
  });

  it("POST /merchant/:merchantId/employees -> 409 when username already taken", async () => {
    prisma.merchant.findUnique.mockResolvedValue({ id: "m1" });

    prisma.employee.findUnique.mockResolvedValue({ id: "exists" });

    const res = await app.handle(
      new Request("http://localhost/merchant/m1/employees", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fullName: "Bob B",
          username: "bob",
          role: "Stock",
        }),
      })
    );

    expect(res.status).toBe(409);
    const body = await readJson(res);
    expect(body.message).toBe("Username already taken");
  });

  it("POST /merchant/:merchantId/employees -> 400 when fullName is whitespace (handler validation)", async () => {
    prisma.merchant.findUnique.mockResolvedValue({ id: "m1" });
    prisma.employee.findUnique.mockResolvedValue(null);

    const res = await app.handle(
      new Request("http://localhost/merchant/m1/employees", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fullName: "   ",
          role: "Stock",
        }),
      })
    );

    // schema allows minLength 1 (spaces), but handler rejects trimmed empty
    expect(res.status).toBe(400);
    const body = await readJson(res);
    expect(body.message).toBe("fullName cannot be empty or just whitespace.");
  });

  it("POST /merchant/:merchantId/employees -> 201 links userId when email matches (MERCHANT)", async () => {
    prisma.merchant.findUnique.mockResolvedValue({ id: "m1" });
    prisma.employee.findUnique.mockResolvedValue(null);

    prisma.user.findFirst.mockResolvedValue({ id: "u-merchant-1" });

    prisma.employee.create.mockResolvedValue({
      id: "e1",
      fullName: "Bob Builder",
      username: "bob",
      email: "bob@x.com",
      mobileNumber: "088",
      role: "STOCK",
      status: "ACTIVE",
      createdAt: new Date("2025-01-01T00:00:00.000Z"),
      disabledAt: null,
    });

    const res = await app.handle(
      new Request("http://localhost/merchant/m1/employees", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fullName: "Bob Builder",
          username: "bob",
          email: "  BOB@X.COM  ",
          phone: " 088 ",
          role: "Stock",
        }),
      })
    );

    expect(res.status).toBe(201);

    // verify prisma.employee.create got normalized email + linked userId
    const call = prisma.employee.create.mock.calls[0]?.[0];
    expect(call.data).toMatchObject({
      merchantId: "m1",
      userId: "u-merchant-1",
      fullName: "Bob Builder",
      username: "bob",
      email: "bob@x.com",
      mobileNumber: "088",
      role: "STOCK",
      status: "ACTIVE",
    });

    const body = await readJson(res);
    expect(body).toMatchObject({
      id: "e1",
      firstName: "Bob",
      lastName: "Builder",
      role: "Stock",
      status: "ACTIVE",
      email: "bob@x.com",
      phone: "088",
    });
  });

  it("PUT /merchant/:merchantId/employees/:employeeId -> 404 when employee not found", async () => {
    prisma.employee.findFirst.mockResolvedValue(null);

    const res = await app.handle(
      new Request("http://localhost/merchant/m1/employees/e1", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: "DISABLED" }),
      })
    );

    expect(res.status).toBe(404);
    const body = await readJson(res);
    expect(body.message).toBe("Employee not found");
  });

  it("PUT /merchant/:merchantId/employees/:employeeId -> 409 when changing username to an existing one", async () => {
    prisma.employee.findFirst.mockResolvedValue({
      id: "e1",
      merchantId: "m1",
      username: "old",
    });

    prisma.employee.findUnique.mockResolvedValue({ id: "other-emp" });

    const res = await app.handle(
      new Request("http://localhost/merchant/m1/employees/e1", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username: "taken" }),
      })
    );

    expect(res.status).toBe(409);
    const body = await readJson(res);
    expect(body.message).toBe("Username already taken");
  });

  it("PUT /merchant/:merchantId/employees/:employeeId -> DISABLED sets disabledAt Date", async () => {
    prisma.employee.findFirst.mockResolvedValue({
      id: "e1",
      merchantId: "m1",
      username: "bob",
    });

    prisma.employee.findUnique.mockResolvedValue(null);

    prisma.employee.update.mockResolvedValue({
      id: "e1",
      fullName: "Bob B",
      username: "bob",
      email: "bob@x.com",
      mobileNumber: null,
      role: "STOCK",
      status: "DISABLED",
      createdAt: new Date("2025-01-01T00:00:00.000Z"),
      disabledAt: new Date(),
    });

    const res = await app.handle(
      new Request("http://localhost/merchant/m1/employees/e1", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: "DISABLED" }),
      })
    );

    expect(res.status).toBe(200);

    const call = prisma.employee.update.mock.calls[0]?.[0];
    expect(call.where).toEqual({ id: "e1" });
    expect(call.data.status).toBe("DISABLED");
    expect(call.data.disabledAt instanceof Date).toBe(true);
  });

  it("POST /merchant/:merchantId/employees/:employeeId/disable -> 404 if not found", async () => {
    prisma.employee.findFirst.mockResolvedValue(null);

    const res = await app.handle(
      new Request("http://localhost/merchant/m1/employees/e1/disable", {
        method: "POST",
      })
    );

    expect(res.status).toBe(404);
    const body = await readJson(res);
    expect(body.message).toBe("Employee not found");
  });

  it("POST /merchant/:merchantId/employees/:employeeId/enable -> 200 sets ACTIVE and disabledAt null", async () => {
    prisma.employee.findFirst.mockResolvedValue({
      id: "e1",
      merchantId: "m1",
    });

    prisma.employee.update.mockResolvedValue({
      id: "e1",
      fullName: "Bob B",
      username: "bob",
      email: "bob@x.com",
      mobileNumber: null,
      role: "STOCK",
      status: "ACTIVE",
      createdAt: new Date("2025-01-01T00:00:00.000Z"),
      disabledAt: null,
    });

    const res = await app.handle(
      new Request("http://localhost/merchant/m1/employees/e1/enable", {
        method: "POST",
      })
    );

    expect(res.status).toBe(200);

    const call = prisma.employee.update.mock.calls[0]?.[0];
    expect(call.data.status).toBe("ACTIVE");
    expect(call.data.disabledAt).toBeNull();
  });

  it("DELETE /merchant/:merchantId/employees/:employeeId -> 204 on success", async () => {
    prisma.employee.findFirst.mockResolvedValue({ id: "e1" });
    prisma.employee.delete.mockResolvedValue({ id: "e1" });

    const res = await app.handle(
      new Request("http://localhost/merchant/m1/employees/e1", {
        method: "DELETE",
      })
    );

    expect(res.status).toBe(204);
  });

  it("GET /merchant/employees/merchant?email=... -> 404 when not found", async () => {
    prisma.employee.findFirst.mockResolvedValue(null);

    const res = await app.handle(
      new Request("http://localhost/merchant/employees/merchant?email=x@y.com")
    );

    expect(res.status).toBe(404);
    const body = await readJson(res);
    expect(body.message).toBe("Employee not found");
  });

  it("GET /merchant/employees/merchant?email=... -> 200 returns merchantId + merchantStatus", async () => {
    prisma.employee.findFirst.mockResolvedValue({
      merchant: { id: "m9", status: "APPROVED" },
    });

    const res = await app.handle(
      new Request("http://localhost/merchant/employees/merchant?email=TeSt@X.com")
    );

    expect(res.status).toBe(200);
    const body = await readJson(res);
    expect(body).toEqual({
      merchantId: "m9",
      merchantStatus: "APPROVED",
    });
  });
});
