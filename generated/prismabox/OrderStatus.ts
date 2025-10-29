import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const OrderStatus = t.Union(
  [
    t.Literal("PENDING"),
    t.Literal("CONFIRMED"),
    t.Literal("READY"),
    t.Literal("PICKED_UP"),
    t.Literal("CANCELLED"),
  ],
  { additionalProperties: false },
);
