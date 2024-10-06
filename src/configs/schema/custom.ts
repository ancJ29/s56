import * as z from "zod";
import { stringSchema } from "./_base";
import { menuSchema } from "./admin";
import { languageConfigSchema } from "./client";

const optionSchema = z
  .object({
    name: stringSchema,
    code: stringSchema,
  })
  .array()
  .optional();
export const OTHER_SCHEMA = {
  CLIENT_OTHER_SCHEMA: z.object({
    menu: menuSchema.optional(),
    lang: languageConfigSchema.optional(),
    departments: optionSchema,
    levels: optionSchema,
  }),
};
