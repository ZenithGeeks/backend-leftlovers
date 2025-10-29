import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const EmployeePlain = t.Object(
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
);

export const EmployeeRelations = t.Object(
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
    user: __nullable__(
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
    ),
  },
  { additionalProperties: false },
);

export const EmployeePlainInputCreate = t.Object(
  {
    fullName: t.String(),
    username: t.Optional(__nullable__(t.String())),
    email: t.Optional(__nullable__(t.String())),
    mobileNumber: t.Optional(__nullable__(t.String())),
    role: t.Optional(
      t.Union(
        [
          t.Literal("OWNER"),
          t.Literal("MANAGER"),
          t.Literal("CASHIER"),
          t.Literal("STOCK"),
        ],
        { additionalProperties: false },
      ),
    ),
    status: t.Optional(
      t.Union([t.Literal("ACTIVE"), t.Literal("DISABLED")], {
        additionalProperties: false,
      }),
    ),
    disabledAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const EmployeePlainInputUpdate = t.Object(
  {
    fullName: t.Optional(t.String()),
    username: t.Optional(__nullable__(t.String())),
    email: t.Optional(__nullable__(t.String())),
    mobileNumber: t.Optional(__nullable__(t.String())),
    role: t.Optional(
      t.Union(
        [
          t.Literal("OWNER"),
          t.Literal("MANAGER"),
          t.Literal("CASHIER"),
          t.Literal("STOCK"),
        ],
        { additionalProperties: false },
      ),
    ),
    status: t.Optional(
      t.Union([t.Literal("ACTIVE"), t.Literal("DISABLED")], {
        additionalProperties: false,
      }),
    ),
    disabledAt: t.Optional(__nullable__(t.Date())),
  },
  { additionalProperties: false },
);

export const EmployeeRelationsInputCreate = t.Object(
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
    user: t.Optional(
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

export const EmployeeRelationsInputUpdate = t.Partial(
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
      user: t.Partial(
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

export const EmployeeWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          merchantId: t.String(),
          userId: t.String(),
          fullName: t.String(),
          username: t.String(),
          email: t.String(),
          mobileNumber: t.String(),
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
          disabledAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "Employee" },
  ),
);

export const EmployeeWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), username: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ username: t.String() })],
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
              userId: t.String(),
              fullName: t.String(),
              username: t.String(),
              email: t.String(),
              mobileNumber: t.String(),
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
              disabledAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Employee" },
);

export const EmployeeSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      merchantId: t.Boolean(),
      userId: t.Boolean(),
      fullName: t.Boolean(),
      username: t.Boolean(),
      email: t.Boolean(),
      mobileNumber: t.Boolean(),
      role: t.Boolean(),
      status: t.Boolean(),
      createdAt: t.Boolean(),
      disabledAt: t.Boolean(),
      merchant: t.Boolean(),
      user: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const EmployeeInclude = t.Partial(
  t.Object(
    {
      role: t.Boolean(),
      status: t.Boolean(),
      merchant: t.Boolean(),
      user: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const EmployeeOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      merchantId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      userId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      fullName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      username: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      email: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      mobileNumber: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      disabledAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const Employee = t.Composite([EmployeePlain, EmployeeRelations], {
  additionalProperties: false,
});

export const EmployeeInputCreate = t.Composite(
  [EmployeePlainInputCreate, EmployeeRelationsInputCreate],
  { additionalProperties: false },
);

export const EmployeeInputUpdate = t.Composite(
  [EmployeePlainInputUpdate, EmployeeRelationsInputUpdate],
  { additionalProperties: false },
);
