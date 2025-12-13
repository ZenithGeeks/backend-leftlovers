// test/setup.ts
import { mock } from "bun:test";

/**
 * Global handles (so old tests that do globalThis.__prismaMock still work)
 */
declare global {
  // eslint-disable-next-line no-var
  var __prismaMock: any;
  // eslint-disable-next-line no-var
  var __txMock: any;
}

type AnyFn = (...args: any[]) => any;

const makeMockFn = (): any => mock((..._args: any[]) => undefined);

/**
 * Create a Proxy model where ANY method access returns a bun mock fn.
 * e.g. prisma.menuItem.create -> mock fn auto-created.
 */
function makeModelProxy(modelName: string) {
  const store: Record<string | symbol, any> = {};

  return new Proxy(store, {
    get(target, prop) {
      // avoid Node/Bun internals touching symbols
      if (typeof prop === "symbol") return (target as any)[prop];

      if (!(prop in target)) {
        (target as any)[prop] = makeMockFn();
      }
      return (target as any)[prop];
    },
  });
}

/**
 * Prisma root proxy: prisma.user, prisma.merchant, prisma.payment, ...
 * AND special-case $transaction.
 */
function makePrismaProxy() {
  const store: Record<string | symbol, any> = {};

  const tx = makeTxProxy();

  const prisma = new Proxy(store, {
    get(target, prop) {
      if (typeof prop === "symbol") return (target as any)[prop];

      if (prop === "$transaction") {
        if (!(prop in target)) {
          const fn = makeMockFn();

          // default $transaction behavior:
          // - if callback: call with tx
          // - if array: Promise.all
          fn.mockImplementation(async (arg: any) => {
            if (typeof arg === "function") return await arg(tx);
            if (Array.isArray(arg)) return await Promise.all(arg);
            return arg;
          });

          (target as any)[prop] = fn;
        }
        return (target as any)[prop];
      }

      if (!(prop in target)) {
        (target as any)[prop] = makeModelProxy(String(prop));
      }
      return (target as any)[prop];
    },
  });

  // expose tx too
  (prisma as any).__tx = tx;

  return prisma;
}

function makeTxProxy() {
  const store: Record<string | symbol, any> = {};
  return new Proxy(store, {
    get(target, prop) {
      if (typeof prop === "symbol") return (target as any)[prop];
      if (!(prop in target)) {
        (target as any)[prop] = makeModelProxy(`tx.${String(prop)}`);
      }
      return (target as any)[prop];
    },
  });
}

/**
 * Minimal Prisma error class used in many handlers (P2002/P2003/P2025 etc)
 */
type KnownErrorParams = { code: string; clientVersion: string; meta?: any };

export class PrismaClientKnownRequestError extends Error {
  code: string;
  clientVersion: string;
  meta?: any;

  constructor(
    message = "Prisma error",
    params: KnownErrorParams | string = { code: "P0000", clientVersion: "test" }
  ) {
    super(message);

    if (typeof params === "string") {
      // allow: new PrismaClientKnownRequestError("msg", "P2025")
      this.code = params;
      this.clientVersion = "test";
      return;
    }

    this.code = params.code;
    this.clientVersion = params.clientVersion;
    this.meta = params.meta;
  }
}

/**
 * Minimal Decimal (enough for tests that do .plus/.mul)
 */
class Decimal {
  private v: number;
  constructor(n: any) {
    const x = typeof n === "number" ? n : Number(n);
    this.v = Number.isFinite(x) ? x : 0;
  }
  plus(o: any) {
    const x = o instanceof Decimal ? (o as any).v : Number(o);
    return new Decimal(this.v + (Number.isFinite(x) ? x : 0));
  }
  mul(o: any) {
    const x = o instanceof Decimal ? (o as any).v : Number(o);
    return new Decimal(this.v * (Number.isFinite(x) ? x : 0));
  }
  valueOf() {
    return this.v;
  }
  toString() {
    return String(this.v);
  }
}

export const prisma = makePrismaProxy();
export const tx = (prisma as any).__tx;

// ✅ critical: set globals so ALL your existing tests keep working
globalThis.__prismaMock = prisma;
globalThis.__txMock = tx;

/**
 * Mock the entire @prisma/client module so "new PrismaClient()" in your routes
 * returns THIS prisma proxy, and enums exist.
 */
mock.module("@prisma/client", () => {
  const Prisma = {
    Decimal,
    PrismaClientKnownRequestError,
  };

  class PrismaClient {
    constructor() {
      return prisma;
    }
  }

  // enums: include whatever your code imports; harmless to have extras
  const Role = { ADMIN: "ADMIN", MERCHANT: "MERCHANT", CUSTOMER: "CUSTOMER", STAFF: "STAFF" } as const;
  const UserStatus = { ACTIVE: "ACTIVE", SUSPENDED: "SUSPENDED", DELETED: "DELETED" } as const;
  const MerchantStatus = { PENDING: "PENDING", APPROVED: "APPROVED", SUSPENDED: "SUSPENDED" } as const;
  const OpenStatus = { CLOSED: "CLOSED", PAUSE: "PAUSE", BUSY: "BUSY", OPEN: "OPEN" } as const;
  const MenuItemStatus = { DRAFT: "DRAFT", LIVE: "LIVE", SOLD_OUT: "SOLD_OUT", EXPIRED: "EXPIRED" } as const;
  const PaymentStatus = { UNPAID: "UNPAID", PAID: "PAID", REFUNDED: "REFUNDED" } as const;
  const OrderPreference = { CONTACT: "CONTACT", NO_CONTACT: "NO_CONTACT" } as const;
  const EmployeeStatus = { ACTIVE: "ACTIVE", DISABLED: "DISABLED" } as const;

  return {
    __esModule: true,
    PrismaClient,
    Prisma,
    Role,
    UserStatus,
    MerchantStatus,
    OpenStatus,
    MenuItemStatus,
    PaymentStatus,
    OrderPreference,
    EmployeeStatus,
  };
});
