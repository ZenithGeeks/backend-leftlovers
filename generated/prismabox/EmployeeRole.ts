import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const EmployeeRole = t.Union(
  [
    t.Literal("OWNER"),
    t.Literal("MANAGER"),
    t.Literal("CASHIER"),
    t.Literal("STOCK"),
  ],
  { additionalProperties: false },
);
