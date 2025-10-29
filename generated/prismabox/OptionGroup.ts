import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const OptionGroupPlain = t.Object(
  {
    id: t.String(),
    menuItemId: t.String(),
    name: t.String(),
    minSelect: t.Integer(),
    maxSelect: t.Integer(),
    sortOrder: t.Integer(),
  },
  { additionalProperties: false },
);

export const OptionGroupRelations = t.Object(
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
    options: t.Array(
      t.Object(
        {
          id: t.String(),
          optionGroupId: t.String(),
          name: t.String(),
          priceDelta: t.Number(),
          sortOrder: t.Integer(),
          active: t.Boolean(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const OptionGroupPlainInputCreate = t.Object(
  {
    name: t.String(),
    minSelect: t.Optional(t.Integer()),
    maxSelect: t.Optional(t.Integer()),
    sortOrder: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const OptionGroupPlainInputUpdate = t.Object(
  {
    name: t.Optional(t.String()),
    minSelect: t.Optional(t.Integer()),
    maxSelect: t.Optional(t.Integer()),
    sortOrder: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const OptionGroupRelationsInputCreate = t.Object(
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

export const OptionGroupRelationsInputUpdate = t.Partial(
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

export const OptionGroupWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          menuItemId: t.String(),
          name: t.String(),
          minSelect: t.Integer(),
          maxSelect: t.Integer(),
          sortOrder: t.Integer(),
        },
        { additionalProperties: false },
      ),
    { $id: "OptionGroup" },
  ),
);

export const OptionGroupWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              menuItemId_name: t.Object(
                { menuItemId: t.String(), name: t.String() },
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
              menuItemId_name: t.Object(
                { menuItemId: t.String(), name: t.String() },
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
              menuItemId: t.String(),
              name: t.String(),
              minSelect: t.Integer(),
              maxSelect: t.Integer(),
              sortOrder: t.Integer(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "OptionGroup" },
);

export const OptionGroupSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      menuItemId: t.Boolean(),
      name: t.Boolean(),
      minSelect: t.Boolean(),
      maxSelect: t.Boolean(),
      sortOrder: t.Boolean(),
      menuItem: t.Boolean(),
      options: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const OptionGroupInclude = t.Partial(
  t.Object(
    { menuItem: t.Boolean(), options: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const OptionGroupOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      menuItemId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      minSelect: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      maxSelect: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      sortOrder: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const OptionGroup = t.Composite(
  [OptionGroupPlain, OptionGroupRelations],
  { additionalProperties: false },
);

export const OptionGroupInputCreate = t.Composite(
  [OptionGroupPlainInputCreate, OptionGroupRelationsInputCreate],
  { additionalProperties: false },
);

export const OptionGroupInputUpdate = t.Composite(
  [OptionGroupPlainInputUpdate, OptionGroupRelationsInputUpdate],
  { additionalProperties: false },
);
