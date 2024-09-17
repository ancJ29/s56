import * as z from "zod";
import { stringSchema } from "./_base";
import { menuSchema } from "./admin";
import { languageSchema } from "./client";

export const OTHER_SCHEMA = {
  CLIENT_OTHER_SCHEMA: z.object({
    menu: menuSchema.optional(),
    lang: languageSchema.optional(),
    departments: z
      .object({
        name: stringSchema,
        code: stringSchema,
      })
      .array()
      .optional(),
  }),
};
