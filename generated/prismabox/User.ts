import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const UserPlain = t.Object(
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
);

export const UserRelations = t.Object(
  {
    merchants: t.Array(
      t.Object(
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
            [
              t.Literal("PENDING"),
              t.Literal("APPROVED"),
              t.Literal("SUSPENDED"),
            ],
            { additionalProperties: false },
          ),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    addresses: t.Array(
      t.Object(
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
      ),
      { additionalProperties: false },
    ),
    devices: t.Array(
      t.Object(
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
      ),
      { additionalProperties: false },
    ),
    notifications: t.Array(
      t.Object(
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
      ),
      { additionalProperties: false },
    ),
    reviews: t.Array(
      t.Object(
        {
          id: t.String(),
          orderId: t.String(),
          customerId: t.String(),
          rating: t.Integer(),
          comment: __nullable__(t.String()),
          tags: __nullable__(t.String()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    complaints: t.Array(
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
      { additionalProperties: false },
    ),
    auditLogs: t.Array(
      t.Object(
        {
          id: t.String(),
          actorUserId: __nullable__(t.String()),
          action: t.String(),
          targetType: t.String(),
          targetId: __nullable__(t.String()),
          meta: __nullable__(t.Any()),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    employees: t.Array(
      t.Object(
        {
          id: t.String(),
          merchantId: t.String(),
          userId: __nullable__(t.String()),
          fullName: t.String(),
          username: __nullable__(t.String()),
          email: __nullable__(t.String()),
          mobileNumber: __nullable__(t.String()),
          role: t.Union(
            [
              t.Literal("OWNER"),
              t.Literal("MANAGER"),
              t.Literal("CASHIER"),
              t.Literal("STOCK"),
            ],
            { additionalProperties: false },
          ),
          status: t.Union([t.Literal("ACTIVE"), t.Literal("DISABLED")], {
            additionalProperties: false,
          }),
          createdAt: t.Date(),
          disabledAt: __nullable__(t.Date()),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    Order: t.Array(
      t.Object(
        {
          id: t.String(),
          customerId: t.String(),
          merchantId: t.String(),
          status: t.Union(
            [
              t.Literal("PENDING"),
              t.Literal("CONFIRMED"),
              t.Literal("READY"),
              t.Literal("PICKED_UP"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          subtotal: t.Number(),
          discountTotal: t.Number(),
          totalAmount: t.Number(),
          paymentStatus: t.Union(
            [t.Literal("UNPAID"), t.Literal("PAID"), t.Literal("REFUNDED")],
            { additionalProperties: false },
          ),
          pickupCode: __nullable__(t.String()),
          pickupDeadline: __nullable__(t.Date()),
          createdAt: t.Date(),
          preference: t.Union(
            [t.Literal("CONTACT"), t.Literal("REMOVE"), t.Literal("CANCELLED")],
            { additionalProperties: false },
          ),
          note: __nullable__(t.String()),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const UserPlainInputCreate = t.Object(
  {
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
    phone: t.Optional(__nullable__(t.String())),
    avatarUrl: t.Optional(__nullable__(t.String())),
    status: t.Optional(
      t.Union(
        [t.Literal("ACTIVE"), t.Literal("SUSPENDED"), t.Literal("DELETED")],
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const UserPlainInputUpdate = t.Object(
  {
    role: t.Optional(
      t.Union(
        [
          t.Literal("ADMIN"),
          t.Literal("MERCHANT"),
          t.Literal("CUSTOMER"),
          t.Literal("STAFF"),
        ],
        { additionalProperties: false },
      ),
    ),
    name: t.Optional(t.String()),
    email: t.Optional(t.String()),
    phone: t.Optional(__nullable__(t.String())),
    avatarUrl: t.Optional(__nullable__(t.String())),
    status: t.Optional(
      t.Union(
        [t.Literal("ACTIVE"), t.Literal("SUSPENDED"), t.Literal("DELETED")],
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const UserRelationsInputCreate = t.Object(
  {
    merchants: t.Optional(
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
    addresses: t.Optional(
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
    devices: t.Optional(
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
    notifications: t.Optional(
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
    reviews: t.Optional(
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
    complaints: t.Optional(
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
    auditLogs: t.Optional(
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
    employees: t.Optional(
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
    Order: t.Optional(
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

export const UserRelationsInputUpdate = t.Partial(
  t.Object(
    {
      merchants: t.Partial(
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
      addresses: t.Partial(
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
      devices: t.Partial(
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
      notifications: t.Partial(
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
      reviews: t.Partial(
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
      complaints: t.Partial(
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
      auditLogs: t.Partial(
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
      employees: t.Partial(
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
      Order: t.Partial(
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

export const UserWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
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
          phone: t.String(),
          avatarUrl: t.String(),
          status: t.Union(
            [t.Literal("ACTIVE"), t.Literal("SUSPENDED"), t.Literal("DELETED")],
            { additionalProperties: false },
          ),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "User" },
  ),
);

export const UserWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), email: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ email: t.String() })],
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
              phone: t.String(),
              avatarUrl: t.String(),
              status: t.Union(
                [
                  t.Literal("ACTIVE"),
                  t.Literal("SUSPENDED"),
                  t.Literal("DELETED"),
                ],
                { additionalProperties: false },
              ),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "User" },
);

export const UserSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      role: t.Boolean(),
      name: t.Boolean(),
      email: t.Boolean(),
      phone: t.Boolean(),
      avatarUrl: t.Boolean(),
      status: t.Boolean(),
      createdAt: t.Boolean(),
      merchants: t.Boolean(),
      addresses: t.Boolean(),
      devices: t.Boolean(),
      notifications: t.Boolean(),
      reviews: t.Boolean(),
      complaints: t.Boolean(),
      auditLogs: t.Boolean(),
      employees: t.Boolean(),
      Order: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const UserInclude = t.Partial(
  t.Object(
    {
      role: t.Boolean(),
      status: t.Boolean(),
      merchants: t.Boolean(),
      addresses: t.Boolean(),
      devices: t.Boolean(),
      notifications: t.Boolean(),
      reviews: t.Boolean(),
      complaints: t.Boolean(),
      auditLogs: t.Boolean(),
      employees: t.Boolean(),
      Order: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const UserOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      email: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      phone: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      avatarUrl: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const User = t.Composite([UserPlain, UserRelations], {
  additionalProperties: false,
});

export const UserInputCreate = t.Composite(
  [UserPlainInputCreate, UserRelationsInputCreate],
  { additionalProperties: false },
);

export const UserInputUpdate = t.Composite(
  [UserPlainInputUpdate, UserRelationsInputUpdate],
  { additionalProperties: false },
);
