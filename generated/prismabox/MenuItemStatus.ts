import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const MenuItemStatus = t.Union(
  [
    t.Literal("DRAFT"),
    t.Literal("LIVE"),
    t.Literal("SOLD_OUT"),
    t.Literal("EXPIRED"),
  ],
  { additionalProperties: false },
);
