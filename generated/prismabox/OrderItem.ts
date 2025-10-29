import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const OrderItemPlain = t.Object(
  {
    id: t.String(),
    orderId: t.String(),
    menuItemId: t.String(),
    quantity: t.Integer(),
    unitPrice: t.Number(),
    lineTotal: t.Number(),
  },
  { additionalProperties: false },
);

export const OrderItemRelations = t.Object(
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
    menuItem: t.Object(
      {
        id: t.String(),
        merchantId: t.String(),
        categoryId: __nullable__(t.String()),
        name: t.String(),
        description: __nullable__(t.String()),
        basePrice: t.Number(),
        originalPrice: __nullable__(t.Number()),
        leftoverQty: t.Integer(),
        expiresAt: __nullable__(t.Date()),
        status: t.Union(
          [
            t.Literal("DRAFT"),
            t.Literal("LIVE"),
            t.Literal("SOLD_OUT"),
            t.Literal("EXPIRED"),
          ],
          { additionalProperties: false },
        ),
        createdAt: t.Date(),
        photoUrl: __nullable__(t.String()),
        expireLabelUrl: __nullable__(t.String()),
      },
      { additionalProperties: false },
    ),
    options: t.Array(
      t.Object(
        {
          id: t.String(),
          orderItemId: t.String(),
          optionId: t.String(),
          priceDelta: t.Number(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const OrderItemPlainInputCreate = t.Object(
  { quantity: t.Integer(), unitPrice: t.Number(), lineTotal: t.Number() },
  { additionalProperties: false },
);

export const OrderItemPlainInputUpdate = t.Object(
  {
    quantity: t.Optional(t.Integer()),
    unitPrice: t.Optional(t.Number()),
    lineTotal: t.Optional(t.Number()),
  },
  { additionalProperties: false },
);

export const OrderItemRelationsInputCreate = t.Object(
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
    menuItem: t.Object(
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
    options: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const OrderItemRelationsInputUpdate = t.Partial(
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
      menuItem: t.Object(
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
      options: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
    },
    { additionalProperties: false },
  ),
);

export const OrderItemWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          orderId: t.String(),
          menuItemId: t.String(),
          quantity: t.Integer(),
          unitPrice: t.Number(),
          lineTotal: t.Number(),
        },
        { additionalProperties: false },
      ),
    { $id: "OrderItem" },
  ),
);

export const OrderItemWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object({ id: t.String() }, { additionalProperties: false }),
          { additionalProperties: false },
        ),
        t.Union([t.Object({ id: t.String() })], {
          additionalProperties: false,
        }),
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
              menuItemId: t.String(),
              quantity: t.Integer(),
              unitPrice: t.Number(),
              lineTotal: t.Number(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "OrderItem" },
);

export const OrderItemSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      orderId: t.Boolean(),
      menuItemId: t.Boolean(),
      quantity: t.Boolean(),
      unitPrice: t.Boolean(),
      lineTotal: t.Boolean(),
      order: t.Boolean(),
      menuItem: t.Boolean(),
      options: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const OrderItemInclude = t.Partial(
  t.Object(
    {
      order: t.Boolean(),
      menuItem: t.Boolean(),
      options: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const OrderItemOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      orderId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      menuItemId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      quantity: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      unitPrice: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      lineTotal: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const OrderItem = t.Composite([OrderItemPlain, OrderItemRelations], {
  additionalProperties: false,
});

export const OrderItemInputCreate = t.Composite(
  [OrderItemPlainInputCreate, OrderItemRelationsInputCreate],
  { additionalProperties: false },
);

export const OrderItemInputUpdate = t.Composite(
  [OrderItemPlainInputUpdate, OrderItemRelationsInputUpdate],
  { additionalProperties: false },
);
