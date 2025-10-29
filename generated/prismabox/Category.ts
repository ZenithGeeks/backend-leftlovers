import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CategoryPlain = t.Object(
  {
    id: t.String(),
    merchantId: t.String(),
    parentId: __nullable__(t.String()),
    name: t.String(),
  },
  { additionalProperties: false },
);

export const CategoryRelations = t.Object(
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
    parent: __nullable__(
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
    children: t.Array(
      t.Object(
        {
          id: t.String(),
          merchantId: t.String(),
          parentId: __nullable__(t.String()),
          name: t.String(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    menuItems: t.Array(
      t.Object(
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
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const CategoryPlainInputCreate = t.Object(
  { name: t.String() },
  { additionalProperties: false },
);

export const CategoryPlainInputUpdate = t.Object(
  { name: t.Optional(t.String()) },
  { additionalProperties: false },
);

export const CategoryRelationsInputCreate = t.Object(
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
    parent: t.Optional(
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
    children: t.Optional(
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
    menuItems: t.Optional(
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

export const CategoryRelationsInputUpdate = t.Partial(
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
      parent: t.Partial(
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
      children: t.Partial(
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
      menuItems: t.Partial(
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

export const CategoryWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          merchantId: t.String(),
          parentId: t.String(),
          name: t.String(),
        },
        { additionalProperties: false },
      ),
    { $id: "Category" },
  ),
);

export const CategoryWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              merchantId_name: t.Object(
                { merchantId: t.String(), name: t.String() },
                { additionalProperties: false },
              ),
            },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({
              merchantId_name: t.Object(
                { merchantId: t.String(), name: t.String() },
                { additionalProperties: false },
              ),
            }),
          ],
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
              merchantId: t.String(),
              parentId: t.String(),
              name: t.String(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Category" },
);

export const CategorySelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      merchantId: t.Boolean(),
      parentId: t.Boolean(),
      name: t.Boolean(),
      merchant: t.Boolean(),
      parent: t.Boolean(),
      children: t.Boolean(),
      menuItems: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const CategoryInclude = t.Partial(
  t.Object(
    {
      merchant: t.Boolean(),
      parent: t.Boolean(),
      children: t.Boolean(),
      menuItems: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const CategoryOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      merchantId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      parentId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const Category = t.Composite([CategoryPlain, CategoryRelations], {
  additionalProperties: false,
});

export const CategoryInputCreate = t.Composite(
  [CategoryPlainInputCreate, CategoryRelationsInputCreate],
  { additionalProperties: false },
);

export const CategoryInputUpdate = t.Composite(
  [CategoryPlainInputUpdate, CategoryRelationsInputUpdate],
  { additionalProperties: false },
);
