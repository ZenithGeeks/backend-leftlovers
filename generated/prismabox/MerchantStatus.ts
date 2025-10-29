import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const MerchantStatus = t.Union(
  [t.Literal("PENDING"), t.Literal("APPROVED"), t.Literal("SUSPENDED")],
  { additionalProperties: false },
);
