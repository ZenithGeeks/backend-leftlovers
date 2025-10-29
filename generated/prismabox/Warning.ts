import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const WarningPlain = t.Object(
  {
    id: t.String(),
    merchantId: t.String(),
    complaintId: __nullable__(t.String()),
    suspensionDays: __nullable__(t.Integer()),
    issuedAt: t.Date(),
    expiresAt: __nullable__(t.Date()),
  },
  { additionalProperties: false },
);

export const WarningRelations = t.Object(
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

export const WarningPlainInputCreate = t.Object(
  {
    suspensionDays: t.Optional(__nullable__(t.Integer())),
    issuedAt: t.Optional(t.Date()),
    expiresAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const WarningPlainInputUpdate = t.Object(
  {
    suspensionDays: t.Optional(__nullable__(t.Integer())),
    issuedAt: t.Optional(t.Date()),
    expiresAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const WarningRelationsInputCreate = t.Object(
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

export const WarningRelationsInputUpdate = t.Partial(
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

export const WarningWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          merchantId: t.String(),
          complaintId: t.String(),
          suspensionDays: t.Integer(),
          issuedAt: t.Date(),
          expiresAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "Warning" },
  ),
);

export const WarningWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), complaintId: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ complaintId: t.String() })],
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
              complaintId: t.String(),
              suspensionDays: t.Integer(),
              issuedAt: t.Date(),
              expiresAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Warning" },
);

export const WarningSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      merchantId: t.Boolean(),
      complaintId: t.Boolean(),
      suspensionDays: t.Boolean(),
      issuedAt: t.Boolean(),
      expiresAt: t.Boolean(),
      merchant: t.Boolean(),
      complaint: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const WarningInclude = t.Partial(
  t.Object(
    { merchant: t.Boolean(), complaint: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const WarningOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      merchantId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      complaintId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      suspensionDays: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      issuedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      expiresAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const Warning = t.Composite([WarningPlain, WarningRelations], {
  additionalProperties: false,
});

export const WarningInputCreate = t.Composite(
  [WarningPlainInputCreate, WarningRelationsInputCreate],
  { additionalProperties: false },
);

export const WarningInputUpdate = t.Composite(
  [WarningPlainInputUpdate, WarningRelationsInputUpdate],
  { additionalProperties: false },
);
