import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PromotionPlain = t.Object(
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
);

export const PromotionRelations = t.Object(
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
    usages: t.Array(
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
  },
  { additionalProperties: false },
);

export const PromotionPlainInputCreate = t.Object(
  {
    name: t.String(),
    type: t.Union(
      [t.Literal("PERCENT"), t.Literal("FIXED"), t.Literal("BOGO")],
      { additionalProperties: false },
    ),
    value: t.Number(),
    minOrder: t.Optional(__nullable__(t.Number())),
    usageLimit: t.Optional(__nullable__(t.Integer())),
    startAt: t.Optional(__nullable__(t.Date())),
    endAt: t.Optional(__nullable__(t.Date())),
    active: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const PromotionPlainInputUpdate = t.Object(
  {
    name: t.Optional(t.String()),
    type: t.Optional(
      t.Union([t.Literal("PERCENT"), t.Literal("FIXED"), t.Literal("BOGO")], {
        additionalProperties: false,
      }),
    ),
    value: t.Optional(t.Number()),
    minOrder: t.Optional(__nullable__(t.Number())),
    usageLimit: t.Optional(__nullable__(t.Integer())),
    startAt: t.Optional(__nullable__(t.Date())),
    endAt: t.Optional(__nullable__(t.Date())),
    active: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const PromotionRelationsInputCreate = t.Object(
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
    usages: t.Optional(
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

export const PromotionRelationsInputUpdate = t.Partial(
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
      usages: t.Partial(
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

export const PromotionWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          merchantId: t.String(),
          name: t.String(),
          type: t.Union(
            [t.Literal("PERCENT"), t.Literal("FIXED"), t.Literal("BOGO")],
            { additionalProperties: false },
          ),
          value: t.Number(),
          minOrder: t.Number(),
          usageLimit: t.Integer(),
          startAt: t.Date(),
          endAt: t.Date(),
          active: t.Boolean(),
        },
        { additionalProperties: false },
      ),
    { $id: "Promotion" },
  ),
);

export const PromotionWhereUnique = t.Recursive(
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
              name: t.String(),
              type: t.Union(
                [t.Literal("PERCENT"), t.Literal("FIXED"), t.Literal("BOGO")],
                { additionalProperties: false },
              ),
              value: t.Number(),
              minOrder: t.Number(),
              usageLimit: t.Integer(),
              startAt: t.Date(),
              endAt: t.Date(),
              active: t.Boolean(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Promotion" },
);

export const PromotionSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      merchantId: t.Boolean(),
      name: t.Boolean(),
      type: t.Boolean(),
      value: t.Boolean(),
      minOrder: t.Boolean(),
      usageLimit: t.Boolean(),
      startAt: t.Boolean(),
      endAt: t.Boolean(),
      active: t.Boolean(),
      merchant: t.Boolean(),
      usages: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PromotionInclude = t.Partial(
  t.Object(
    {
      type: t.Boolean(),
      merchant: t.Boolean(),
      usages: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PromotionOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      merchantId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      value: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      minOrder: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      usageLimit: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      startAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      endAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      active: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const Promotion = t.Composite([PromotionPlain, PromotionRelations], {
  additionalProperties: false,
});

export const PromotionInputCreate = t.Composite(
  [PromotionPlainInputCreate, PromotionRelationsInputCreate],
  { additionalProperties: false },
);

export const PromotionInputUpdate = t.Composite(
  [PromotionPlainInputUpdate, PromotionRelationsInputUpdate],
  { additionalProperties: false },
);
