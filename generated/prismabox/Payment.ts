import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PaymentPlain = t.Object(
  {
    id: t.String(),
    orderId: t.String(),
    merchantId: t.String(),
    provider: t.String(),
    providerChargeId: __nullable__(t.String()),
    amount: t.Number(),
    currency: t.String(),
    status: t.Union(
      [t.Literal("UNPAID"), t.Literal("PAID"), t.Literal("REFUNDED")],
      { additionalProperties: false },
    ),
    paidAt: __nullable__(t.Date()),
  },
  { additionalProperties: false },
);

export const PaymentRelations = t.Object(
  {
    order: t.Object(
      {
        id: t.String(),
        customerId: t.String(),
        merchantId: t.String(),
        status: t.Union(
          [
            t.Literal("PENDING"),
            t.Literal("CONFIRMED"),
            t.Literal("READY"),
            t.Literal("PICKED_UP"),
            t.Literal("CANCELLED"),
          ],
          { additionalProperties: false },
        ),
        subtotal: t.Number(),
        discountTotal: t.Number(),
        totalAmount: t.Number(),
        paymentStatus: t.Union(
          [t.Literal("UNPAID"), t.Literal("PAID"), t.Literal("REFUNDED")],
          { additionalProperties: false },
        ),
        pickupCode: __nullable__(t.String()),
        pickupDeadline: __nullable__(t.Date()),
        createdAt: t.Date(),
        preference: t.Union(
          [t.Literal("CONTACT"), t.Literal("REMOVE"), t.Literal("CANCELLED")],
          { additionalProperties: false },
        ),
        note: __nullable__(t.String()),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const PaymentPlainInputCreate = t.Object(
  {
    provider: t.String(),
    amount: t.Number(),
    currency: t.Optional(t.String()),
    status: t.Optional(
      t.Union([t.Literal("UNPAID"), t.Literal("PAID"), t.Literal("REFUNDED")], {
        additionalProperties: false,
      }),
    ),
    paidAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const PaymentPlainInputUpdate = t.Object(
  {
    provider: t.Optional(t.String()),
    amount: t.Optional(t.Number()),
    currency: t.Optional(t.String()),
    status: t.Optional(
      t.Union([t.Literal("UNPAID"), t.Literal("PAID"), t.Literal("REFUNDED")], {
        additionalProperties: false,
      }),
    ),
    paidAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const PaymentRelationsInputCreate = t.Object(
  {
    order: t.Object(
      {
        connect: t.Object(
          {
            id: t.String({ additionalProperties: false }),
          },
          { additionalProperties: false },
        ),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const PaymentRelationsInputUpdate = t.Partial(
  t.Object(
    {
      order: t.Object(
        {
          connect: t.Object(
            {
              id: t.String({ additionalProperties: false }),
            },
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    },
    { additionalProperties: false },
  ),
);

export const PaymentWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          orderId: t.String(),
          merchantId: t.String(),
          provider: t.String(),
          providerChargeId: t.String(),
          amount: t.Number(),
          currency: t.String(),
          status: t.Union(
            [t.Literal("UNPAID"), t.Literal("PAID"), t.Literal("REFUNDED")],
            { additionalProperties: false },
          ),
          paidAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "Payment" },
  ),
);

export const PaymentWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), orderId: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ orderId: t.String() })],
          { additionalProperties: false },
        ),
        t.Partial(
          t.Object({
            AND: t.Union([
              Self,
              t.Array(Self, { additionalProperties: false }),
            ]),
            NOT: t.Union([
              Self,
              t.Array(Self, { additionalProperties: false }),
            ]),
            OR: t.Array(Self, { additionalProperties: false }),
          }),
          { additionalProperties: false },
        ),
        t.Partial(
          t.Object(
            {
              id: t.String(),
              orderId: t.String(),
              merchantId: t.String(),
              provider: t.String(),
              providerChargeId: t.String(),
              amount: t.Number(),
              currency: t.String(),
              status: t.Union(
                [t.Literal("UNPAID"), t.Literal("PAID"), t.Literal("REFUNDED")],
                { additionalProperties: false },
              ),
              paidAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Payment" },
);

export const PaymentSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      orderId: t.Boolean(),
      merchantId: t.Boolean(),
      provider: t.Boolean(),
      providerChargeId: t.Boolean(),
      amount: t.Boolean(),
      currency: t.Boolean(),
      status: t.Boolean(),
      paidAt: t.Boolean(),
      order: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PaymentInclude = t.Partial(
  t.Object(
    { status: t.Boolean(), order: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const PaymentOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      orderId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      merchantId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      provider: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      providerChargeId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      amount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      currency: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      paidAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const Payment = t.Composite([PaymentPlain, PaymentRelations], {
  additionalProperties: false,
});

export const PaymentInputCreate = t.Composite(
  [PaymentPlainInputCreate, PaymentRelationsInputCreate],
  { additionalProperties: false },
);

export const PaymentInputUpdate = t.Composite(
  [PaymentPlainInputUpdate, PaymentRelationsInputUpdate],
  { additionalProperties: false },
);
