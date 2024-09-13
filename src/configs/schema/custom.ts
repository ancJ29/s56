import * as z from "zod";
import { menuSchema } from "./admin";
import { languageSchema } from "./client";

export const OTHER_SCHEMA = {
  CLIENT_OTHER_SCHEMA: z.object({
    menu: menuSchema.optional(),
    lang: languageSchema.optional(),
  }),
};
