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
    users: z
      .record(
        stringSchema,
        z.object({
          id: stringSchema,
          userName: stringSchema,
        }),
      )
      .optional(),
    tasks: z
      .object({
        // Record<statusID, [displayName, order]>
        statusMap: z.record(
          stringSchema,
          z.tuple([stringSchema, numberSchema, stringSchema]),
        ),
      })
      .optional(),
  }),
});
