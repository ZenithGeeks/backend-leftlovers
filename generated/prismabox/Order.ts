import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const OrderPlain = t.Object(
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
);

export const OrderRelations = t.Object(
  {
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
    merchant: t.Object(
      {
        id: t.String(),
        ownerUserId: t.String(),
        displayName: t.String(),
        description: __nullable__(t.String()),
        address: __nullable__(t.String()),
        lat: __nullable__(t.Number()),
        lng: __nullable__(t.Number()),
        openHours: __nullable__(t.Any()),
        isOpen: t.Boolean(),
        status: t.Union(
          [t.Literal("PENDING"), t.Literal("APPROVED"), t.Literal("SUSPENDED")],
          { additionalProperties: false },
        ),
        createdAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    items: t.Array(
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
      { additionalProperties: false },
    ),
    payment: __nullable__(
      t.Object(
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
      ),
    ),
    promoUsages: t.Array(
      t.Object(
        {
          id: t.String(),
          promotionId: t.String(),
          orderId: t.String(),
          discountAmount: t.Number(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    inventoryLogs: t.Array(
      t.Object(
        {
          id: t.String(),
          menuItemId: t.String(),
          orderId: __nullable__(t.String()),
          change: t.Integer(),
          reason: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    review: __nullable__(
      t.Object(
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
      ),
    ),
    complaint: __nullable__(
      t.Object(
        {
          id: t.String(),
          orderId: t.String(),
          customerId: t.String(),
          type: t.Union(
            [
              t.Literal("EXPIRED"),
              t.Literal("QUALITY"),
              t.Literal("SIZE"),
              t.Literal("OTHER"),
            ],
            { additionalProperties: false },
          ),
          description: __nullable__(t.String()),
          status: t.Union(
            [
              t.Literal("OPEN"),
              t.Literal("INVESTIGATING"),
              t.Literal("RESOLVED"),
              t.Literal("REJECTED"),
            ],
            { additionalProperties: false },
          ),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const OrderPlainInputCreate = t.Object(
  {
    status: t.Optional(
      t.Union(
        [
          t.Literal("PENDING"),
          t.Literal("CONFIRMED"),
          t.Literal("READY"),
          t.Literal("PICKED_UP"),
          t.Literal("CANCELLED"),
        ],
        { additionalProperties: false },
      ),
    ),
    subtotal: t.Number(),
    discountTotal: t.Optional(t.Number()),
    totalAmount: t.Number(),
    paymentStatus: t.Optional(
      t.Union([t.Literal("UNPAID"), t.Literal("PAID"), t.Literal("REFUNDED")], {
        additionalProperties: false,
      }),
    ),
    pickupCode: t.Optional(__nullable__(t.String())),
    pickupDeadline: t.Optional(__nullable__(t.Date())),
    preference: t.Optional(
      t.Union(
        [t.Literal("CONTACT"), t.Literal("REMOVE"), t.Literal("CANCELLED")],
        { additionalProperties: false },
      ),
    ),
    note: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const OrderPlainInputUpdate = t.Object(
  {
    status: t.Optional(
      t.Union(
        [
          t.Literal("PENDING"),
          t.Literal("CONFIRMED"),
          t.Literal("READY"),
          t.Literal("PICKED_UP"),
          t.Literal("CANCELLED"),
        ],
        { additionalProperties: false },
      ),
    ),
    subtotal: t.Optional(t.Number()),
    discountTotal: t.Optional(t.Number()),
    totalAmount: t.Optional(t.Number()),
    paymentStatus: t.Optional(
      t.Union([t.Literal("UNPAID"), t.Literal("PAID"), t.Literal("REFUNDED")], {
        additionalProperties: false,
      }),
    ),
    pickupCode: t.Optional(__nullable__(t.String())),
    pickupDeadline: t.Optional(__nullable__(t.Date())),
    preference: t.Optional(
      t.Union(
        [t.Literal("CONTACT"), t.Literal("REMOVE"), t.Literal("CANCELLED")],
        { additionalProperties: false },
      ),
    ),
    note: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const OrderRelationsInputCreate = t.Object(
  {
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
    merchant: t.Object(
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
    items: t.Optional(
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
    payment: t.Optional(
      t.Object(
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
    ),
    promoUsages: t.Optional(
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
    inventoryLogs: t.Optional(
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
    review: t.Optional(
      t.Object(
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
    ),
    complaint: t.Optional(
      t.Object(
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
    ),
  },
  { additionalProperties: false },
);

export const OrderRelationsInputUpdate = t.Partial(
  t.Object(
    {
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
      merchant: t.Object(
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
      items: t.Partial(
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
      payment: t.Partial(
        t.Object(
          {
            connect: t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            disconnect: t.Boolean(),
          },
          { additionalProperties: false },
        ),
      ),
      promoUsages: t.Partial(
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
      inventoryLogs: t.Partial(
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
      review: t.Partial(
        t.Object(
          {
            connect: t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            disconnect: t.Boolean(),
          },
          { additionalProperties: false },
        ),
      ),
      complaint: t.Partial(
        t.Object(
          {
            connect: t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            disconnect: t.Boolean(),
          },
          { additionalProperties: false },
        ),
      ),
    },
    { additionalProperties: false },
  ),
);

export const OrderWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
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
          pickupCode: t.String(),
          pickupDeadline: t.Date(),
          createdAt: t.Date(),
          preference: t.Union(
            [t.Literal("CONTACT"), t.Literal("REMOVE"), t.Literal("CANCELLED")],
            { additionalProperties: false },
          ),
          note: t.String(),
        },
        { additionalProperties: false },
      ),
    { $id: "Order" },
  ),
);

export const OrderWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), pickupCode: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ pickupCode: t.String() })],
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
              pickupCode: t.String(),
              pickupDeadline: t.Date(),
              createdAt: t.Date(),
              preference: t.Union(
                [
                  t.Literal("CONTACT"),
                  t.Literal("REMOVE"),
                  t.Literal("CANCELLED"),
                ],
                { additionalProperties: false },
              ),
              note: t.String(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Order" },
);

export const OrderSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      customerId: t.Boolean(),
      merchantId: t.Boolean(),
      status: t.Boolean(),
      subtotal: t.Boolean(),
      discountTotal: t.Boolean(),
      totalAmount: t.Boolean(),
      paymentStatus: t.Boolean(),
      pickupCode: t.Boolean(),
      pickupDeadline: t.Boolean(),
      createdAt: t.Boolean(),
      preference: t.Boolean(),
      note: t.Boolean(),
      customer: t.Boolean(),
      merchant: t.Boolean(),
      items: t.Boolean(),
      payment: t.Boolean(),
      promoUsages: t.Boolean(),
      inventoryLogs: t.Boolean(),
      review: t.Boolean(),
      complaint: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const OrderInclude = t.Partial(
  t.Object(
    {
      status: t.Boolean(),
      paymentStatus: t.Boolean(),
      preference: t.Boolean(),
      customer: t.Boolean(),
      merchant: t.Boolean(),
      items: t.Boolean(),
      payment: t.Boolean(),
      promoUsages: t.Boolean(),
      inventoryLogs: t.Boolean(),
      review: t.Boolean(),
      complaint: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const OrderOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      customerId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      merchantId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      subtotal: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      discountTotal: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      totalAmount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      pickupCode: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      pickupDeadline: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      note: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const Order = t.Composite([OrderPlain, OrderRelations], {
  additionalProperties: false,
});

export const OrderInputCreate = t.Composite(
  [OrderPlainInputCreate, OrderRelationsInputCreate],
  { additionalProperties: false },
);

export const OrderInputUpdate = t.Composite(
  [OrderPlainInputUpdate, OrderRelationsInputUpdate],
  { additionalProperties: false },
);
