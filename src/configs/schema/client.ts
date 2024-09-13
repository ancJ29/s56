import { APP_ACTIONS } from "@/configs/enums";
import * as z from "zod";
import { builder, numberSchema, stringSchema } from "./_base";

export const languageSchema = z.object({
  EN: z.record(stringSchema, stringSchema),
  VI: z.record(stringSchema, stringSchema),
});

export const getClientMetaDataSchema = builder({
  action: z.literal(APP_ACTIONS.CLIENT_GET_META_DATA),
  params: z.object({
    clientId: numberSchema,
  }),
  result: z.object({
    id: numberSchema,
    name: stringSchema,
    code: stringSchema,
    enabled: z.boolean(),
    lang: languageSchema,
  }),
});
