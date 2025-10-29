import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const EmployeeStatus = t.Union(
  [t.Literal("ACTIVE"), t.Literal("DISABLED")],
  { additionalProperties: false },
);
