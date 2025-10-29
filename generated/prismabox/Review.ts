import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ReviewPlain = t.Object(
  {
    id: t.String(),
    orderId: t.String(),
    customerId: t.String(),
    rating: t.Integer(),
    comment: __nullable__(t.String()),
    tags: __nullable__(t.String()),
    createdAt: t.Date(),
  },
  { additionalProperties: false },
);

export const ReviewRelations = t.Object(
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
    customer: t.Object(
      {
        id: t.String(),
        role: t.Union(
          [
            t.Literal("ADMIN"),
            t.Literal("MERCHANT"),
            t.Literal("CUSTOMER"),
            t.Literal("STAFF"),
          ],
          { additionalProperties: false },
        ),
        name: t.String(),
        email: t.String(),
        phone: __nullable__(t.String()),
        avatarUrl: __nullable__(t.String()),
        status: t.Union(
          [t.Literal("ACTIVE"), t.Literal("SUSPENDED"), t.Literal("DELETED")],
          { additionalProperties: false },
        ),
        createdAt: t.Date(),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const ReviewPlainInputCreate = t.Object(
  {
    rating: t.Integer(),
    comment: t.Optional(__nullable__(t.String())),
    tags: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const ReviewPlainInputUpdate = t.Object(
  {
    rating: t.Optional(t.Integer()),
    comment: t.Optional(__nullable__(t.String())),
    tags: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const ReviewRelationsInputCreate = t.Object(
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
    customer: t.Object(
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

export const ReviewRelationsInputUpdate = t.Partial(
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
      customer: t.Object(
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

export const ReviewWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          orderId: t.String(),
          customerId: t.String(),
          rating: t.Integer(),
          comment: t.String(),
          tags: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "Review" },
  ),
);

export const ReviewWhereUnique = t.Recursive(
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
              customerId: t.String(),
              rating: t.Integer(),
              comment: t.String(),
              tags: t.String(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Review" },
);

export const ReviewSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      orderId: t.Boolean(),
      customerId: t.Boolean(),
      rating: t.Boolean(),
      comment: t.Boolean(),
      tags: t.Boolean(),
      createdAt: t.Boolean(),
      order: t.Boolean(),
      customer: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ReviewInclude = t.Partial(
  t.Object(
    { order: t.Boolean(), customer: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const ReviewOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      orderId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      customerId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      rating: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      comment: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      tags: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const Review = t.Composite([ReviewPlain, ReviewRelations], {
  additionalProperties: false,
});

export const ReviewInputCreate = t.Composite(
  [ReviewPlainInputCreate, ReviewRelationsInputCreate],
  { additionalProperties: false },
);

export const ReviewInputUpdate = t.Composite(
  [ReviewPlainInputUpdate, ReviewRelationsInputUpdate],
  { additionalProperties: false },
);
