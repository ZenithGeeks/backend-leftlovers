import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const OptionTemplatePlain = t.Object(
  {
    id: t.String(),
    optionGroupTemplateId: t.String(),
    name: t.String(),
    priceDelta: t.Number(),
    sortOrder: t.Integer(),
    active: t.Boolean(),
  },
  { additionalProperties: false },
);

export const OptionTemplateRelations = t.Object(
  {
    groupTemplate: t.Object(
      {
        id: t.String(),
        merchantId: t.String(),
        name: t.String(),
        minSelect: t.Integer(),
        maxSelect: t.Integer(),
        sortOrder: t.Integer(),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const OptionTemplatePlainInputCreate = t.Object(
  {
    name: t.String(),
    priceDelta: t.Number(),
    sortOrder: t.Optional(t.Integer()),
    active: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const OptionTemplatePlainInputUpdate = t.Object(
  {
    name: t.Optional(t.String()),
    priceDelta: t.Optional(t.Number()),
    sortOrder: t.Optional(t.Integer()),
    active: t.Optional(t.Boolean()),
  },
  { additionalProperties: false },
);

export const OptionTemplateRelationsInputCreate = t.Object(
  {
    groupTemplate: t.Object(
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

export const OptionTemplateRelationsInputUpdate = t.Partial(
  t.Object(
    {
      groupTemplate: t.Object(
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

export const OptionTemplateWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          optionGroupTemplateId: t.String(),
          name: t.String(),
          priceDelta: t.Number(),
          sortOrder: t.Integer(),
          active: t.Boolean(),
        },
        { additionalProperties: false },
      ),
    { $id: "OptionTemplate" },
  ),
);

export const OptionTemplateWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              optionGroupTemplateId_name: t.Object(
                { optionGroupTemplateId: t.String(), name: t.String() },
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
              optionGroupTemplateId_name: t.Object(
                { optionGroupTemplateId: t.String(), name: t.String() },
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
              optionGroupTemplateId: t.String(),
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
  { $id: "OptionTemplate" },
);

export const OptionTemplateSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      optionGroupTemplateId: t.Boolean(),
      name: t.Boolean(),
      priceDelta: t.Boolean(),
      sortOrder: t.Boolean(),
      active: t.Boolean(),
      groupTemplate: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const OptionTemplateInclude = t.Partial(
  t.Object(
    { groupTemplate: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const OptionTemplateOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      optionGroupTemplateId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const OptionTemplate = t.Composite(
  [OptionTemplatePlain, OptionTemplateRelations],
  { additionalProperties: false },
);

export const OptionTemplateInputCreate = t.Composite(
  [OptionTemplatePlainInputCreate, OptionTemplateRelationsInputCreate],
  { additionalProperties: false },
);

export const OptionTemplateInputUpdate = t.Composite(
  [OptionTemplatePlainInputUpdate, OptionTemplateRelationsInputUpdate],
  { additionalProperties: false },
);
