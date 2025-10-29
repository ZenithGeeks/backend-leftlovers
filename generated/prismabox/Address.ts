import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AddressPlain = t.Object(
  {
    id: t.String(),
    userId: t.String(),
    label: __nullable__(t.String()),
    line1: t.String(),
    line2: __nullable__(t.String()),
    city: __nullable__(t.String()),
    province: __nullable__(t.String()),
    postalCode: __nullable__(t.String()),
    lat: __nullable__(t.Number()),
    lng: __nullable__(t.Number()),
  },
  { additionalProperties: false },
);

export const AddressRelations = t.Object(
  {
    user: t.Object(
      {
        id: t.String(),
        role: t.Union(
          [
            t.Literal("ADMIN"),
            t.Literal("MERCHANT"),
            t.Literal("CUSTOMER"),
            t.Literal("STAFF"),
          ],
          { additionalProperties: false },
        ),
        name: t.String(),
        email: t.String(),
        phone: __nullable__(t.String()),
        avatarUrl: __nullable__(t.String()),
        status: t.Union(
          [t.Literal("ACTIVE"), t.Literal("SUSPENDED"), t.Literal("DELETED")],
          { additionalProperties: false },
        ),
        createdAt: t.Date(),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const AddressPlainInputCreate = t.Object(
  {
    label: t.Optional(__nullable__(t.String())),
    line1: t.String(),
    line2: t.Optional(__nullable__(t.String())),
    city: t.Optional(__nullable__(t.String())),
    province: t.Optional(__nullable__(t.String())),
    postalCode: t.Optional(__nullable__(t.String())),
    lat: t.Optional(__nullable__(t.Number())),
    lng: t.Optional(__nullable__(t.Number())),
  },
  { additionalProperties: false },
);

export const AddressPlainInputUpdate = t.Object(
  {
    label: t.Optional(__nullable__(t.String())),
    line1: t.Optional(t.String()),
    line2: t.Optional(__nullable__(t.String())),
    city: t.Optional(__nullable__(t.String())),
    province: t.Optional(__nullable__(t.String())),
    postalCode: t.Optional(__nullable__(t.String())),
    lat: t.Optional(__nullable__(t.Number())),
    lng: t.Optional(__nullable__(t.Number())),
  },
  { additionalProperties: false },
);

export const AddressRelationsInputCreate = t.Object(
  {
    user: t.Object(
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

export const AddressRelationsInputUpdate = t.Partial(
  t.Object(
    {
      user: t.Object(
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

export const AddressWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          userId: t.String(),
          label: t.String(),
          line1: t.String(),
          line2: t.String(),
          city: t.String(),
          province: t.String(),
          postalCode: t.String(),
          lat: t.Number(),
          lng: t.Number(),
        },
        { additionalProperties: false },
      ),
    { $id: "Address" },
  ),
);

export const AddressWhereUnique = t.Recursive(
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
              userId: t.String(),
              label: t.String(),
              line1: t.String(),
              line2: t.String(),
              city: t.String(),
              province: t.String(),
              postalCode: t.String(),
              lat: t.Number(),
              lng: t.Number(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Address" },
);

export const AddressSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      userId: t.Boolean(),
      label: t.Boolean(),
      line1: t.Boolean(),
      line2: t.Boolean(),
      city: t.Boolean(),
      province: t.Boolean(),
      postalCode: t.Boolean(),
      lat: t.Boolean(),
      lng: t.Boolean(),
      user: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const AddressInclude = t.Partial(
  t.Object(
    { user: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const AddressOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      userId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      label: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      line1: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      line2: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      city: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      province: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      postalCode: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      lat: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      lng: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const Address = t.Composite([AddressPlain, AddressRelations], {
  additionalProperties: false,
});

export const AddressInputCreate = t.Composite(
  [AddressPlainInputCreate, AddressRelationsInputCreate],
  { additionalProperties: false },
);

export const AddressInputUpdate = t.Composite(
  [AddressPlainInputUpdate, AddressRelationsInputUpdate],
  { additionalProperties: false },
);
