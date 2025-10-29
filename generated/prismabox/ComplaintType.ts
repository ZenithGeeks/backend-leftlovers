import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ComplaintType = t.Union(
  [
    t.Literal("EXPIRED"),
    t.Literal("QUALITY"),
    t.Literal("SIZE"),
    t.Literal("OTHER"),
  ],
  { additionalProperties: false },
);
