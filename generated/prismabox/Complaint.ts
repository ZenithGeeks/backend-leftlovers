import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ComplaintPlain = t.Object(
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
);

export const ComplaintRelations = t.Object(
  {
    order: t.Object(
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
    customer: t.Object(
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
    warning: __nullable__(
      t.Object(
        {
          id: t.String(),
          merchantId: t.String(),
          complaintId: __nullable__(t.String()),
          suspensionDays: __nullable__(t.Integer()),
          issuedAt: t.Date(),
          expiresAt: __nullable__(t.Date()),
        },
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const ComplaintPlainInputCreate = t.Object(
  {
    type: t.Union(
      [
        t.Literal("EXPIRED"),
        t.Literal("QUALITY"),
        t.Literal("SIZE"),
        t.Literal("OTHER"),
      ],
      { additionalProperties: false },
    ),
    description: t.Optional(__nullable__(t.String())),
    status: t.Optional(
      t.Union(
        [
          t.Literal("OPEN"),
          t.Literal("INVESTIGATING"),
          t.Literal("RESOLVED"),
          t.Literal("REJECTED"),
        ],
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const ComplaintPlainInputUpdate = t.Object(
  {
    type: t.Optional(
      t.Union(
        [
          t.Literal("EXPIRED"),
          t.Literal("QUALITY"),
          t.Literal("SIZE"),
          t.Literal("OTHER"),
        ],
        { additionalProperties: false },
      ),
    ),
    description: t.Optional(__nullable__(t.String())),
    status: t.Optional(
      t.Union(
        [
          t.Literal("OPEN"),
          t.Literal("INVESTIGATING"),
          t.Literal("RESOLVED"),
          t.Literal("REJECTED"),
        ],
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const ComplaintRelationsInputCreate = t.Object(
  {
    order: t.Object(
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
    customer: t.Object(
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
    warning: t.Optional(
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

export const ComplaintRelationsInputUpdate = t.Partial(
  t.Object(
    {
      order: t.Object(
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
      customer: t.Object(
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
      warning: t.Partial(
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

export const ComplaintWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
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
          description: t.String(),
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
    { $id: "Complaint" },
  ),
);

export const ComplaintWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), orderId: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ orderId: t.String() })],
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
              description: t.String(),
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
      ],
      { additionalProperties: false },
    ),
  { $id: "Complaint" },
);

export const ComplaintSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      orderId: t.Boolean(),
      customerId: t.Boolean(),
      type: t.Boolean(),
      description: t.Boolean(),
      status: t.Boolean(),
      createdAt: t.Boolean(),
      order: t.Boolean(),
      customer: t.Boolean(),
      warning: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ComplaintInclude = t.Partial(
  t.Object(
    {
      type: t.Boolean(),
      status: t.Boolean(),
      order: t.Boolean(),
      customer: t.Boolean(),
      warning: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ComplaintOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      orderId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      customerId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      description: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const Complaint = t.Composite([ComplaintPlain, ComplaintRelations], {
  additionalProperties: false,
});

export const ComplaintInputCreate = t.Composite(
  [ComplaintPlainInputCreate, ComplaintRelationsInputCreate],
  { additionalProperties: false },
);

export const ComplaintInputUpdate = t.Composite(
  [ComplaintPlainInputUpdate, ComplaintRelationsInputUpdate],
  { additionalProperties: false },
);
