import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PromotionUsagePlain = t.Object(
  {
    id: t.String(),
    promotionId: t.String(),
    orderId: t.String(),
    discountAmount: t.Number(),
  },
  { additionalProperties: false },
);

export const PromotionUsageRelations = t.Object(
  {
    promotion: t.Object(
      {
        id: t.String(),
        merchantId: t.String(),
        name: t.String(),
        type: t.Union(
          [t.Literal("PERCENT"), t.Literal("FIXED"), t.Literal("BOGO")],
          { additionalProperties: false },
        ),
        value: t.Number(),
        minOrder: __nullable__(t.Number()),
        usageLimit: __nullable__(t.Integer()),
        startAt: __nullable__(t.Date()),
        endAt: __nullable__(t.Date()),
        active: t.Boolean(),
      },
      { additionalProperties: false },
    ),
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

export const PromotionUsagePlainInputCreate = t.Object(
  { discountAmount: t.Number() },
  { additionalProperties: false },
);

export const PromotionUsagePlainInputUpdate = t.Object(
  { discountAmount: t.Optional(t.Number()) },
  { additionalProperties: false },
);

export const PromotionUsageRelationsInputCreate = t.Object(
  {
    promotion: t.Object(
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

export const PromotionUsageRelationsInputUpdate = t.Partial(
  t.Object(
    {
      promotion: t.Object(
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

export const PromotionUsageWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          promotionId: t.String(),
          orderId: t.String(),
          discountAmount: t.Number(),
        },
        { additionalProperties: false },
      ),
    { $id: "PromotionUsage" },
  ),
);

export const PromotionUsageWhereUnique = t.Recursive(
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
              promotionId: t.String(),
              orderId: t.String(),
              discountAmount: t.Number(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "PromotionUsage" },
);

export const PromotionUsageSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      promotionId: t.Boolean(),
      orderId: t.Boolean(),
      discountAmount: t.Boolean(),
      promotion: t.Boolean(),
      order: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PromotionUsageInclude = t.Partial(
  t.Object(
    { promotion: t.Boolean(), order: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const PromotionUsageOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      promotionId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      orderId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      discountAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const PromotionUsage = t.Composite(
  [PromotionUsagePlain, PromotionUsageRelations],
  { additionalProperties: false },
);

export const PromotionUsageInputCreate = t.Composite(
  [PromotionUsagePlainInputCreate, PromotionUsageRelationsInputCreate],
  { additionalProperties: false },
);

export const PromotionUsageInputUpdate = t.Composite(
  [PromotionUsagePlainInputUpdate, PromotionUsageRelationsInputUpdate],
  { additionalProperties: false },
);
