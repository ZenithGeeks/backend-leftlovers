import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const WarningAction = t.Union(
  [t.Literal("WARN"), t.Literal("SUSPEND")],
  { additionalProperties: false },
);
