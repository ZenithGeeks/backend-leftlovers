import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const OrderItemOptionPlain = t.Object(
  {
    id: t.String(),
    orderItemId: t.String(),
    optionId: t.String(),
    priceDelta: t.Number(),
  },
  { additionalProperties: false },
);

export const OrderItemOptionRelations = t.Object(
  {
    orderItem: t.Object(
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
    option: t.Object(
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
  },
  { additionalProperties: false },
);

export const OrderItemOptionPlainInputCreate = t.Object(
  { priceDelta: t.Number() },
  { additionalProperties: false },
);

export const OrderItemOptionPlainInputUpdate = t.Object(
  { priceDelta: t.Optional(t.Number()) },
  { additionalProperties: false },
);

export const OrderItemOptionRelationsInputCreate = t.Object(
  {
    orderItem: t.Object(
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
    option: t.Object(
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

export const OrderItemOptionRelationsInputUpdate = t.Partial(
  t.Object(
    {
      orderItem: t.Object(
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
      option: t.Object(
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

export const OrderItemOptionWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          orderItemId: t.String(),
          optionId: t.String(),
          priceDelta: t.Number(),
        },
        { additionalProperties: false },
      ),
    { $id: "OrderItemOption" },
  ),
);

export const OrderItemOptionWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              orderItemId_optionId: t.Object(
                { orderItemId: t.String(), optionId: t.String() },
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
              orderItemId_optionId: t.Object(
                { orderItemId: t.String(), optionId: t.String() },
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
              orderItemId: t.String(),
              optionId: t.String(),
              priceDelta: t.Number(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "OrderItemOption" },
);

export const OrderItemOptionSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      orderItemId: t.Boolean(),
      optionId: t.Boolean(),
      priceDelta: t.Boolean(),
      orderItem: t.Boolean(),
      option: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const OrderItemOptionInclude = t.Partial(
  t.Object(
    { orderItem: t.Boolean(), option: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const OrderItemOptionOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      orderItemId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      optionId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      priceDelta: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const OrderItemOption = t.Composite(
  [OrderItemOptionPlain, OrderItemOptionRelations],
  { additionalProperties: false },
);

export const OrderItemOptionInputCreate = t.Composite(
  [OrderItemOptionPlainInputCreate, OrderItemOptionRelationsInputCreate],
  { additionalProperties: false },
);

export const OrderItemOptionInputUpdate = t.Composite(
  [OrderItemOptionPlainInputUpdate, OrderItemOptionRelationsInputUpdate],
  { additionalProperties: false },
);
