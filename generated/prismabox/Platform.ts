import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const Platform = t.Union([t.Literal("IOS"), t.Literal("ANDROID")], {
  additionalProperties: false,
});
