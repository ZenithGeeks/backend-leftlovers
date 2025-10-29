import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const OptionPlain = t.Object(
  {
    id: t.String(),
    optionGroupId: t.String(),
    name: t.String(),
    priceDelta: t.Number(),
    sortOrder: t.Integer(),
    active: t.Boolean(),
  },
  { additionalProperties: false },
);

export const OptionRelations = t.Object(
  {
    group: t.Object(
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
    orderChoices: t.Array(
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

export const OptionPlainInputCreate = t.Object(
  {
    name: t.String(),
    priceDelta: t.Number(),
    sortOrder: t.Optional(t.Integer()),
    active: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const OptionPlainInputUpdate = t.Object(
  {
    name: t.Optional(t.String()),
    priceDelta: t.Optional(t.Number()),
    sortOrder: t.Optional(t.Integer()),
    active: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const OptionRelationsInputCreate = t.Object(
  {
    group: t.Object(
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
    orderChoices: t.Optional(
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

export const OptionRelationsInputUpdate = t.Partial(
  t.Object(
    {
      group: t.Object(
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
      orderChoices: t.Partial(
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

export const OptionWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          optionGroupId: t.String(),
          name: t.String(),
          priceDelta: t.Number(),
          sortOrder: t.Integer(),
          active: t.Boolean(),
        },
        { additionalProperties: false },
      ),
    { $id: "Option" },
  ),
);

export const OptionWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              optionGroupId_name: t.Object(
                { optionGroupId: t.String(), name: t.String() },
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
              optionGroupId_name: t.Object(
                { optionGroupId: t.String(), name: t.String() },
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
              optionGroupId: t.String(),
              name: t.String(),
              priceDelta: t.Number(),
              sortOrder: t.Integer(),
              active: t.Boolean(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Option" },
);

export const OptionSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      optionGroupId: t.Boolean(),
      name: t.Boolean(),
      priceDelta: t.Boolean(),
      sortOrder: t.Boolean(),
      active: t.Boolean(),
      group: t.Boolean(),
      orderChoices: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const OptionInclude = t.Partial(
  t.Object(
    { group: t.Boolean(), orderChoices: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const OptionOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      optionGroupId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      priceDelta: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      sortOrder: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      active: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const Option = t.Composite([OptionPlain, OptionRelations], {
  additionalProperties: false,
});

export const OptionInputCreate = t.Composite(
  [OptionPlainInputCreate, OptionRelationsInputCreate],
  { additionalProperties: false },
);

export const OptionInputUpdate = t.Composite(
  [OptionPlainInputUpdate, OptionRelationsInputUpdate],
  { additionalProperties: false },
);
