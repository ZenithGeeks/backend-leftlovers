import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const MenuItemPlain = t.Object(
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
);

export const MenuItemRelations = t.Object(
  {
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
    category: __nullable__(
      t.Object(
        {
          id: t.String(),
          merchantId: t.String(),
          parentId: __nullable__(t.String()),
          name: t.String(),
        },
        { additionalProperties: false },
      ),
    ),
    optionGroups: t.Array(
      t.Object(
        {
          id: t.String(),
          menuItemId: t.String(),
          name: t.String(),
          minSelect: t.Integer(),
          maxSelect: t.Integer(),
          sortOrder: t.Integer(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    orderItems: t.Array(
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
  },
  { additionalProperties: false },
);

export const MenuItemPlainInputCreate = t.Object(
  {
    name: t.String(),
    description: t.Optional(__nullable__(t.String())),
    basePrice: t.Number(),
    originalPrice: t.Optional(__nullable__(t.Number())),
    leftoverQty: t.Optional(t.Integer()),
    expiresAt: t.Optional(__nullable__(t.Date())),
    status: t.Optional(
      t.Union(
        [
          t.Literal("DRAFT"),
          t.Literal("LIVE"),
          t.Literal("SOLD_OUT"),
          t.Literal("EXPIRED"),
        ],
        { additionalProperties: false },
      ),
    ),
    photoUrl: t.Optional(__nullable__(t.String())),
    expireLabelUrl: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const MenuItemPlainInputUpdate = t.Object(
  {
    name: t.Optional(t.String()),
    description: t.Optional(__nullable__(t.String())),
    basePrice: t.Optional(t.Number()),
    originalPrice: t.Optional(__nullable__(t.Number())),
    leftoverQty: t.Optional(t.Integer()),
    expiresAt: t.Optional(__nullable__(t.Date())),
    status: t.Optional(
      t.Union(
        [
          t.Literal("DRAFT"),
          t.Literal("LIVE"),
          t.Literal("SOLD_OUT"),
          t.Literal("EXPIRED"),
        ],
        { additionalProperties: false },
      ),
    ),
    photoUrl: t.Optional(__nullable__(t.String())),
    expireLabelUrl: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const MenuItemRelationsInputCreate = t.Object(
  {
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
    category: t.Optional(
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
    optionGroups: t.Optional(
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
    orderItems: t.Optional(
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
  },
  { additionalProperties: false },
);

export const MenuItemRelationsInputUpdate = t.Partial(
  t.Object(
    {
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
      category: t.Partial(
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
      optionGroups: t.Partial(
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
      orderItems: t.Partial(
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
    },
    { additionalProperties: false },
  ),
);

export const MenuItemWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          merchantId: t.String(),
          categoryId: t.String(),
          name: t.String(),
          description: t.String(),
          basePrice: t.Number(),
          originalPrice: t.Number(),
          leftoverQty: t.Integer(),
          expiresAt: t.Date(),
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
          photoUrl: t.String(),
          expireLabelUrl: t.String(),
        },
        { additionalProperties: false },
      ),
    { $id: "MenuItem" },
  ),
);

export const MenuItemWhereUnique = t.Recursive(
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
              merchantId: t.String(),
              categoryId: t.String(),
              name: t.String(),
              description: t.String(),
              basePrice: t.Number(),
              originalPrice: t.Number(),
              leftoverQty: t.Integer(),
              expiresAt: t.Date(),
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
              photoUrl: t.String(),
              expireLabelUrl: t.String(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "MenuItem" },
);

export const MenuItemSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      merchantId: t.Boolean(),
      categoryId: t.Boolean(),
      name: t.Boolean(),
      description: t.Boolean(),
      basePrice: t.Boolean(),
      originalPrice: t.Boolean(),
      leftoverQty: t.Boolean(),
      expiresAt: t.Boolean(),
      status: t.Boolean(),
      createdAt: t.Boolean(),
      photoUrl: t.Boolean(),
      expireLabelUrl: t.Boolean(),
      merchant: t.Boolean(),
      category: t.Boolean(),
      optionGroups: t.Boolean(),
      orderItems: t.Boolean(),
      inventoryLogs: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const MenuItemInclude = t.Partial(
  t.Object(
    {
      status: t.Boolean(),
      merchant: t.Boolean(),
      category: t.Boolean(),
      optionGroups: t.Boolean(),
      orderItems: t.Boolean(),
      inventoryLogs: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const MenuItemOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      merchantId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      categoryId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      description: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      basePrice: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      originalPrice: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      leftoverQty: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      expiresAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      photoUrl: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      expireLabelUrl: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const MenuItem = t.Composite([MenuItemPlain, MenuItemRelations], {
  additionalProperties: false,
});

export const MenuItemInputCreate = t.Composite(
  [MenuItemPlainInputCreate, MenuItemRelationsInputCreate],
  { additionalProperties: false },
);

export const MenuItemInputUpdate = t.Composite(
  [MenuItemPlainInputUpdate, MenuItemRelationsInputUpdate],
  { additionalProperties: false },
);
