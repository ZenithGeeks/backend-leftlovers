import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const OrderPreference = t.Union(
  [t.Literal("CONTACT"), t.Literal("REMOVE"), t.Literal("CANCELLED")],
  { additionalProperties: false },
);
