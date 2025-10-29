import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const MerchantPlain = t.Object(
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
);

export const MerchantRelations = t.Object(
  {
    owner: t.Object(
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
    categories: t.Array(
      t.Object(
        {
          id: t.String(),
          merchantId: t.String(),
          parentId: __nullable__(t.String()),
          name: t.String(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    menuItems: t.Array(
      t.Object(
        {
          id: t.String(),
          merchantId: t.String(),
          categoryId: __nullable__(t.String()),
          name: t.String(),
          description: __nullable__(t.String()),
          basePrice: t.Number(),
          originalPrice: __nullable__(t.Number()),
          leftoverQty: t.Integer(),
          expiresAt: __nullable__(t.Date()),
          status: t.Union(
            [
              t.Literal("DRAFT"),
              t.Literal("LIVE"),
              t.Literal("SOLD_OUT"),
              t.Literal("EXPIRED"),
            ],
            { additionalProperties: false },
          ),
          createdAt: t.Date(),
          photoUrl: __nullable__(t.String()),
          expireLabelUrl: __nullable__(t.String()),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    promotions: t.Array(
      t.Object(
        {
          id: t.String(),
          merchantId: t.String(),
          name: t.String(),
          type: t.Union(
            [t.Literal("PERCENT"), t.Literal("FIXED"), t.Literal("BOGO")],
            { additionalProperties: false },
          ),
          value: t.Number(),
          minOrder: __nullable__(t.Number()),
          usageLimit: __nullable__(t.Integer()),
          startAt: __nullable__(t.Date()),
          endAt: __nullable__(t.Date()),
          active: t.Boolean(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    orders: t.Array(
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
    warnings: t.Array(
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
    optionGroupTemplates: t.Array(
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
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const MerchantPlainInputCreate = t.Object(
  {
    displayName: t.String(),
    description: t.Optional(__nullable__(t.String())),
    address: t.Optional(__nullable__(t.String())),
    lat: t.Optional(__nullable__(t.Number())),
    lng: t.Optional(__nullable__(t.Number())),
    openHours: t.Optional(__nullable__(t.Any())),
    isOpen: t.Optional(t.Boolean()),
    status: t.Optional(
      t.Union(
        [t.Literal("PENDING"), t.Literal("APPROVED"), t.Literal("SUSPENDED")],
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const MerchantPlainInputUpdate = t.Object(
  {
    displayName: t.Optional(t.String()),
    description: t.Optional(__nullable__(t.String())),
    address: t.Optional(__nullable__(t.String())),
    lat: t.Optional(__nullable__(t.Number())),
    lng: t.Optional(__nullable__(t.Number())),
    openHours: t.Optional(__nullable__(t.Any())),
    isOpen: t.Optional(t.Boolean()),
    status: t.Optional(
      t.Union(
        [t.Literal("PENDING"), t.Literal("APPROVED"), t.Literal("SUSPENDED")],
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const MerchantRelationsInputCreate = t.Object(
  {
    owner: t.Object(
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
    categories: t.Optional(
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
    menuItems: t.Optional(
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
    promotions: t.Optional(
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
    orders: t.Optional(
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
    warnings: t.Optional(
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
    optionGroupTemplates: t.Optional(
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

export const MerchantRelationsInputUpdate = t.Partial(
  t.Object(
    {
      owner: t.Object(
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
      categories: t.Partial(
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
      menuItems: t.Partial(
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
      promotions: t.Partial(
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
      orders: t.Partial(
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
      warnings: t.Partial(
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
      optionGroupTemplates: t.Partial(
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

export const MerchantWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          ownerUserId: t.String(),
          displayName: t.String(),
          description: t.String(),
          address: t.String(),
          lat: t.Number(),
          lng: t.Number(),
          openHours: t.Any(),
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
    { $id: "Merchant" },
  ),
);

export const MerchantWhereUnique = t.Recursive(
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
              ownerUserId: t.String(),
              displayName: t.String(),
              description: t.String(),
              address: t.String(),
              lat: t.Number(),
              lng: t.Number(),
              openHours: t.Any(),
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
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Merchant" },
);

export const MerchantSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      ownerUserId: t.Boolean(),
      displayName: t.Boolean(),
      description: t.Boolean(),
      address: t.Boolean(),
      lat: t.Boolean(),
      lng: t.Boolean(),
      openHours: t.Boolean(),
      isOpen: t.Boolean(),
      status: t.Boolean(),
      createdAt: t.Boolean(),
      owner: t.Boolean(),
      categories: t.Boolean(),
      menuItems: t.Boolean(),
      promotions: t.Boolean(),
      orders: t.Boolean(),
      warnings: t.Boolean(),
      employees: t.Boolean(),
      optionGroupTemplates: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const MerchantInclude = t.Partial(
  t.Object(
    {
      status: t.Boolean(),
      owner: t.Boolean(),
      categories: t.Boolean(),
      menuItems: t.Boolean(),
      promotions: t.Boolean(),
      orders: t.Boolean(),
      warnings: t.Boolean(),
      employees: t.Boolean(),
      optionGroupTemplates: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const MerchantOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      ownerUserId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      displayName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      description: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      address: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      lat: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      lng: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      openHours: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      isOpen: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const Merchant = t.Composite([MerchantPlain, MerchantRelations], {
  additionalProperties: false,
});

export const MerchantInputCreate = t.Composite(
  [MerchantPlainInputCreate, MerchantRelationsInputCreate],
  { additionalProperties: false },
);

export const MerchantInputUpdate = t.Composite(
  [MerchantPlainInputUpdate, MerchantRelationsInputUpdate],
  { additionalProperties: false },
);
