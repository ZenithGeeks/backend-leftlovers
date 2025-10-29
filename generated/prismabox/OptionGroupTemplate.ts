import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const OptionGroupTemplatePlain = t.Object(
  {
    id: t.String(),
    merchantId: t.String(),
    name: t.String(),
    minSelect: t.Integer(),
    maxSelect: t.Integer(),
    sortOrder: t.Integer(),
  },
  { additionalProperties: false },
);

export const OptionGroupTemplateRelations = t.Object(
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
    options: t.Array(
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
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const OptionGroupTemplatePlainInputCreate = t.Object(
  {
    name: t.String(),
    minSelect: t.Optional(t.Integer()),
    maxSelect: t.Optional(t.Integer()),
    sortOrder: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const OptionGroupTemplatePlainInputUpdate = t.Object(
  {
    name: t.Optional(t.String()),
    minSelect: t.Optional(t.Integer()),
    maxSelect: t.Optional(t.Integer()),
    sortOrder: t.Optional(t.Integer()),
  },
  { additionalProperties: false },
);

export const OptionGroupTemplateRelationsInputCreate = t.Object(
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

export const OptionGroupTemplateRelationsInputUpdate = t.Partial(
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

export const OptionGroupTemplateWhere = t.Partial(
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
          minSelect: t.Integer(),
          maxSelect: t.Integer(),
          sortOrder: t.Integer(),
        },
        { additionalProperties: false },
      ),
    { $id: "OptionGroupTemplate" },
  ),
);

export const OptionGroupTemplateWhereUnique = t.Recursive(
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
  { $id: "OptionGroupTemplate" },
);

export const OptionGroupTemplateSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      merchantId: t.Boolean(),
      name: t.Boolean(),
      minSelect: t.Boolean(),
      maxSelect: t.Boolean(),
      sortOrder: t.Boolean(),
      merchant: t.Boolean(),
      options: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const OptionGroupTemplateInclude = t.Partial(
  t.Object(
    { merchant: t.Boolean(), options: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const OptionGroupTemplateOrderBy = t.Partial(
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

export const OptionGroupTemplate = t.Composite(
  [OptionGroupTemplatePlain, OptionGroupTemplateRelations],
  { additionalProperties: false },
);

export const OptionGroupTemplateInputCreate = t.Composite(
  [
    OptionGroupTemplatePlainInputCreate,
    OptionGroupTemplateRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const OptionGroupTemplateInputUpdate = t.Composite(
  [
    OptionGroupTemplatePlainInputUpdate,
    OptionGroupTemplateRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
