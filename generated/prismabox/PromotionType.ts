import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PromotionType = t.Union(
  [t.Literal("PERCENT"), t.Literal("FIXED"), t.Literal("BOGO")],
  { additionalProperties: false },
);
