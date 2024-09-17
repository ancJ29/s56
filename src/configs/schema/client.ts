import { APP_ACTION_GROUPS, APP_ACTIONS } from "@/configs/enums";
import * as z from "zod";
import { builder, numberSchema, stringSchema, successSchema } from "./_base";

export const languageSchema = z.object({
  EN: z.record(stringSchema, stringSchema),
  VI: z.record(stringSchema, stringSchema),
});

export const updateTranslationSchema = builder({
  group: z.literal(APP_ACTION_GROUPS.CLIENT),
  action: z.literal(APP_ACTIONS.GET_CLIENT_META_DATA),
  params: z.object({
    clientId: numberSchema,
    data: z.object({
      EN: z.record(stringSchema, stringSchema),
      VI: z.record(stringSchema, stringSchema),
    }),
  }),
  result: successSchema,
});

export const getClientMetaDataSchema = builder({
  group: z.literal(APP_ACTION_GROUPS.CLIENT),
  action: z.literal(APP_ACTIONS.GET_CLIENT_META_DATA),
  params: z.object({
    clientId: numberSchema,
  }),
  result: z.object({
    id: numberSchema,
    name: stringSchema,
    code: stringSchema,
    enabled: z.boolean(),
    lang: languageSchema,
    // Record<code, departmentName>
    departments: z.record(stringSchema, stringSchema).optional(),
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
        // Record<statusID, [displayName, order, textColor, bgColor]>
        statusMap: z.record(
          stringSchema,
          z.tuple([stringSchema, numberSchema, stringSchema, stringSchema]),
        ),
      })
      .optional(),
  }),
});
