// src/merchant/finance.ts
import { Elysia, t } from 'elysia';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
dayjs.extend(isoWeek);

import { PrismaClient, PaymentStatus } from '@prisma/client';

const prisma = new PrismaClient();


type PaymentTxn = {
  paymentId: string;
  orderId: string;
  merchantId: string;
  provider: string;
  providerChargeId?: string | null;
  currency: string;
  status: 'PAID' | 'UNPAID' | 'REFUNDED';
  amountTHB: number;
  paidAt: string;      // ISO
  date: string;        // YYYY-MM-DD (for pills)
  time: string;        // hh:mma
  id: string;          // display id (order short)
  title: string;       // "Order #<id>"
};

type Payout = {
  id: string;
  detailDate: string;            // transfer date (YYYY-MM-DD)
  processedAt?: string;          // ISO when transferred (optional)
  amountTHB: number;             // net
  feeTHB: number;                // fee
  status: 'Transferred' | 'Pending' | 'Failed';
  balanceTHB: number;
  oweTHB: number;
};

type Summary = {
  netSales: number;
  deduction: number;
  netEarnings: number;
  earnings: number;
};

type DateKey =
  | 'Today'
  | 'Yesterday'
  | 'This week'
  | 'This month'
  | 'This year'
  | 'Last year'
  | 'All';



function toNumber(n: any) {
  // Prisma Decimal-safe
  return typeof n === 'number' ? n : Number(n);
}

function computeRange(range: DateKey, now = dayjs()) {
  switch (range) {
    case 'Today': {
      const start = now.startOf('day');
      const end = now.endOf('day');
      return { gte: start.toDate(), lte: end.toDate() };
    }
    case 'Yesterday': {
      const y = now.subtract(1, 'day');
      return { gte: y.startOf('day').toDate(), lte: y.endOf('day').toDate() };
    }
    case 'This week': {
      return { gte: now.startOf('isoWeek').toDate(), lte: now.endOf('isoWeek').toDate() };
    }
    case 'This month': {
      return { gte: now.startOf('month').toDate(), lte: now.endOf('month').toDate() };
    }
    case 'This year': {
      return { gte: now.startOf('year').toDate(), lte: now.endOf('year').toDate() };
    }
    case 'Last year': {
      const y = now.subtract(1, 'year');
      return { gte: y.startOf('year').toDate(), lte: y.endOf('year').toDate() };
    }
    default:
      return {}; // All
  }
}

function mapPaymentToTxn(p: any): PaymentTxn {
  const paidAtIso = p.paidAt ? dayjs(p.paidAt).toISOString() : dayjs().toISOString();
  const d = dayjs(paidAtIso);
  const orderShort = p.orderId; // adjust if you keep a human short id separately
  return {
    paymentId: p.id,
    orderId: p.orderId,
    merchantId: p.merchantId,
    provider: p.provider,
    providerChargeId: p.providerChargeId,
    currency: p.currency,
    status: p.status,
    amountTHB: toNumber(p.amount),
    paidAt: paidAtIso,
    date: d.format('YYYY-MM-DD'),
    time: d.format('hh:mma'),
    id: orderShort,
    title: `Order #${orderShort}`,
  };
}

function groupBy<T>(arr: T[], keyFn: (x: T) => string): Record<string, T[]> {
  return arr.reduce<Record<string, T[]>>((acc, item) => {
    const k = keyFn(item);
    (acc[k] ||= []).push(item);
    return acc;
  }, {});
}

function sumBy<T>(arr: T[], sel: (x: T) => number) {
  let s = 0;
  for (let i = 0; i < arr.length; i++) s += sel(arr[i]);
  return s;
}

/** Build **one payout per paid day**, transfer on **next day** */
function buildDailyPayoutsFromPayments(txns: PaymentTxn[], feeRate = 0.15): Payout[] {
  if (txns.length === 0) return [];
  const byPaidDate = groupBy(txns, (t) => dayjs(t.paidAt).format('YYYY-MM-DD'));

  const payouts = Object.entries(byPaidDate).map(([paidDate, list]) => {
    const gross = sumBy(list, (t) => t.amountTHB);
    const feeTHB = +(gross * feeRate).toFixed(2);
    const net = +(gross - feeTHB).toFixed(2);

    const transferDate = dayjs(paidDate).add(1, 'day');
    const transferred = dayjs().isAfter(transferDate, 'day');

    const payout: Payout = {
      id: `payout-${paidDate}`,
      detailDate: transferDate.format('YYYY-MM-DD'),
      processedAt: transferred ? transferDate.toISOString() : undefined,
      amountTHB: net,
      feeTHB,
      status: transferred ? 'Transferred' : 'Pending',
      balanceTHB: 0,
      oweTHB: 0,
    };
    return payout;
  });

  // newest transfer first
  payouts.sort((a, b) => (a.detailDate < b.detailDate ? 1 : -1));
  return payouts;
}

function computeSummaryFromTransactions(txns: PaymentTxn[], feeRate = 0.15): Summary {
  if (txns.length === 0) {
    return { netSales: 0, deduction: 0, netEarnings: 0, earnings: 0 };
  }
  const netSales = +(sumBy(txns, (t) => t.amountTHB).toFixed(2));
  const deduction = +(netSales * feeRate).toFixed(2);
  const netEarnings = +(netSales - deduction).toFixed(2);
  return { netSales, deduction, netEarnings, earnings: netEarnings };
}

/* ----------------------------- Routes ----------------------------- */

export const MerchantFinance = new Elysia({ prefix: '/merchant' })
  
  .get(
    '/:merchantId/finance/transactions',
    async ({ params, query, set }) => {
      const range = (query.range as DateKey) || 'All';
      const whereRange = computeRange(range);

      const payments = await prisma.payment.findMany({
        where: {
          merchantId: params.merchantId,
          status: PaymentStatus.PAID,
          ...(whereRange.gte
            ? { paidAt: { gte: whereRange.gte, lte: whereRange.lte } }
            : {}),
        },
        orderBy: { paidAt: 'desc' },
      });

      const txns: PaymentTxn[] = payments.map((p) => mapPaymentToTxn(p));
      return { transactions: txns };
    },
    {
      query: t.Object({ range: t.Optional(t.String()) }),
      detail: { tags: ['Finance'], summary: 'List paid transactions by range' },
    }
  )

  
  .get(
    '/:merchantId/finance/payouts',
    async ({ params, query }) => {
      const range = (query.range as DateKey) || 'All';
      const feeRate = query.feeRate ? Number(query.feeRate) : 0.15;
      const whereRange = computeRange(range);

      const payments = await prisma.payment.findMany({
        where: {
          merchantId: params.merchantId,
          status: PaymentStatus.PAID,
          ...(whereRange.gte
            ? { paidAt: { gte: whereRange.gte, lte: whereRange.lte } }
            : {}),
        },
        orderBy: { paidAt: 'desc' },
      });

      const txns = payments.map(mapPaymentToTxn);
      const payouts = buildDailyPayoutsFromPayments(txns, feeRate);
      return { payouts };
    },
    {
      query: t.Object({
        range: t.Optional(t.String()),
        feeRate: t.Optional(t.String()),
      }),
      detail: { tags: ['Finance'], summary: 'List daily payouts by range' },
    }
  )

  
  .get(
    '/:merchantId/finance/summary',
    async ({ params, query }) => {
      const range = (query.range as DateKey) || 'All';
      const feeRate = query.feeRate ? Number(query.feeRate) : 0.15;
      const whereRange = computeRange(range);

      const payments = await prisma.payment.findMany({
        where: {
          merchantId: params.merchantId,
          status: PaymentStatus.PAID,
          ...(whereRange.gte
            ? { paidAt: { gte: whereRange.gte, lte: whereRange.lte } }
            : {}),
        },
      });

      const txns = payments.map(mapPaymentToTxn);
      const summary = computeSummaryFromTransactions(txns, feeRate);
      return { summary };
    },
    {
      query: t.Object({
        range: t.Optional(t.String()),
        feeRate: t.Optional(t.String()),
      }),
      detail: { tags: ['Finance'], summary: 'Summary totals by range' },
    }
  )

  /**
   * OPTIONAL: one call returns all three
   * GET /api/merchant/:merchantId/finance/all?range=...&feeRate=0.15
   */
  .get(
    '/:merchantId/finance/all',
    async ({ params, query }) => {
      const range = (query.range as DateKey) || 'All';
      const feeRate = query.feeRate ? Number(query.feeRate) : 0.15;
      const whereRange = computeRange(range);

      const payments = await prisma.payment.findMany({
        where: {
          merchantId: params.merchantId,
          status: PaymentStatus.PAID,
          ...(whereRange.gte
            ? { paidAt: { gte: whereRange.gte, lte: whereRange.lte } }
            : {}),
        },
        orderBy: { paidAt: 'desc' },
      });

      const txns = payments.map(mapPaymentToTxn);
      const payouts = buildDailyPayoutsFromPayments(txns, feeRate);
      const summary = computeSummaryFromTransactions(txns, feeRate);

      return { transactions: txns, payouts, summary };
    },
    {
      query: t.Object({
        range: t.Optional(t.String()),
        feeRate: t.Optional(t.String()),
      }),
      detail: { tags: ['Finance'], summary: 'Transactions, payouts and summary' },
    }
  );
