import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const DevicePlain = t.Object(
  {
    id: t.String(),
    userId: t.String(),
    platform: t.Union([t.Literal("IOS"), t.Literal("ANDROID")], {
      additionalProperties: false,
    }),
    pushToken: __nullable__(t.String()),
    createdAt: t.Date(),
  },
  { additionalProperties: false },
);

export const DeviceRelations = t.Object(
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

export const DevicePlainInputCreate = t.Object(
  {
    platform: t.Union([t.Literal("IOS"), t.Literal("ANDROID")], {
      additionalProperties: false,
    }),
    pushToken: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const DevicePlainInputUpdate = t.Object(
  {
    platform: t.Optional(
      t.Union([t.Literal("IOS"), t.Literal("ANDROID")], {
        additionalProperties: false,
      }),
    ),
    pushToken: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const DeviceRelationsInputCreate = t.Object(
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

export const DeviceRelationsInputUpdate = t.Partial(
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

export const DeviceWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          userId: t.String(),
          platform: t.Union([t.Literal("IOS"), t.Literal("ANDROID")], {
            additionalProperties: false,
          }),
          pushToken: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "Device" },
  ),
);

export const DeviceWhereUnique = t.Recursive(
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
              platform: t.Union([t.Literal("IOS"), t.Literal("ANDROID")], {
                additionalProperties: false,
              }),
              pushToken: t.String(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Device" },
);

export const DeviceSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      userId: t.Boolean(),
      platform: t.Boolean(),
      pushToken: t.Boolean(),
      createdAt: t.Boolean(),
      user: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const DeviceInclude = t.Partial(
  t.Object(
    { platform: t.Boolean(), user: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const DeviceOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      userId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      pushToken: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const Device = t.Composite([DevicePlain, DeviceRelations], {
  additionalProperties: false,
});

export const DeviceInputCreate = t.Composite(
  [DevicePlainInputCreate, DeviceRelationsInputCreate],
  { additionalProperties: false },
);

export const DeviceInputUpdate = t.Composite(
  [DevicePlainInputUpdate, DeviceRelationsInputUpdate],
  { additionalProperties: false },
);
