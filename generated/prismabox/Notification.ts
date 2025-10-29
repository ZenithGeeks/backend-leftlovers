import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const NotificationPlain = t.Object(
  {
    id: t.String(),
    userId: t.String(),
    type: t.String(),
    title: t.String(),
    body: t.String(),
    readAt: __nullable__(t.Date()),
    createdAt: t.Date(),
  },
  { additionalProperties: false },
);

export const NotificationRelations = t.Object(
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

export const NotificationPlainInputCreate = t.Object(
  {
    type: t.String(),
    title: t.String(),
    body: t.String(),
    readAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const NotificationPlainInputUpdate = t.Object(
  {
    type: t.Optional(t.String()),
    title: t.Optional(t.String()),
    body: t.Optional(t.String()),
    readAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const NotificationRelationsInputCreate = t.Object(
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

export const NotificationRelationsInputUpdate = t.Partial(
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

export const NotificationWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          userId: t.String(),
          type: t.String(),
          title: t.String(),
          body: t.String(),
          readAt: t.Date(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "Notification" },
  ),
);

export const NotificationWhereUnique = t.Recursive(
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
              type: t.String(),
              title: t.String(),
              body: t.String(),
              readAt: t.Date(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Notification" },
);

export const NotificationSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      userId: t.Boolean(),
      type: t.Boolean(),
      title: t.Boolean(),
      body: t.Boolean(),
      readAt: t.Boolean(),
      createdAt: t.Boolean(),
      user: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const NotificationInclude = t.Partial(
  t.Object(
    { user: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const NotificationOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      userId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      type: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      title: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      body: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      readAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const Notification = t.Composite(
  [NotificationPlain, NotificationRelations],
  { additionalProperties: false },
);

export const NotificationInputCreate = t.Composite(
  [NotificationPlainInputCreate, NotificationRelationsInputCreate],
  { additionalProperties: false },
);

export const NotificationInputUpdate = t.Composite(
  [NotificationPlainInputUpdate, NotificationRelationsInputUpdate],
  { additionalProperties: false },
);
