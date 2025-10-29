import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const InventoryLogPlain = t.Object(
  {
    id: t.String(),
    menuItemId: t.String(),
    orderId: __nullable__(t.String()),
    change: t.Integer(),
    reason: t.String(),
    createdAt: t.Date(),
  },
  { additionalProperties: false },
);

export const InventoryLogRelations = t.Object(
  {
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
    order: __nullable__(
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
    ),
  },
  { additionalProperties: false },
);

export const InventoryLogPlainInputCreate = t.Object(
  { change: t.Integer(), reason: t.String() },
  { additionalProperties: false },
);

export const InventoryLogPlainInputUpdate = t.Object(
  { change: t.Optional(t.Integer()), reason: t.Optional(t.String()) },
  { additionalProperties: false },
);

export const InventoryLogRelationsInputCreate = t.Object(
  {
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
    order: t.Optional(
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

export const InventoryLogRelationsInputUpdate = t.Partial(
  t.Object(
    {
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
      order: t.Partial(
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

export const InventoryLogWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          menuItemId: t.String(),
          orderId: t.String(),
          change: t.Integer(),
          reason: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "InventoryLog" },
  ),
);

export const InventoryLogWhereUnique = t.Recursive(
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
              menuItemId: t.String(),
              orderId: t.String(),
              change: t.Integer(),
              reason: t.String(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "InventoryLog" },
);

export const InventoryLogSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      menuItemId: t.Boolean(),
      orderId: t.Boolean(),
      change: t.Boolean(),
      reason: t.Boolean(),
      createdAt: t.Boolean(),
      menuItem: t.Boolean(),
      order: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const InventoryLogInclude = t.Partial(
  t.Object(
    { menuItem: t.Boolean(), order: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const InventoryLogOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      menuItemId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      orderId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      change: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      reason: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const InventoryLog = t.Composite(
  [InventoryLogPlain, InventoryLogRelations],
  { additionalProperties: false },
);

export const InventoryLogInputCreate = t.Composite(
  [InventoryLogPlainInputCreate, InventoryLogRelationsInputCreate],
  { additionalProperties: false },
);

export const InventoryLogInputUpdate = t.Composite(
  [InventoryLogPlainInputUpdate, InventoryLogRelationsInputUpdate],
  { additionalProperties: false },
);
