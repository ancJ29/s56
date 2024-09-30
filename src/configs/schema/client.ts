import { APP_ACTION_GROUPS, APP_ACTIONS, Language } from "@/configs/enums";
import * as z from "zod";
import { builder, numberSchema, stringSchema, successSchema } from "./_base";

const languageEnumSchema = z.enum([Language.EN, Language.VI]);

export const languageConfigSchema = z.record(
  languageEnumSchema,
  z.record(stringSchema),
);

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

const statusIDSchema = stringSchema;
const displayNameSchema = stringSchema;
const orderSchema = numberSchema;
const textColorSchema = stringSchema;
const bgColorSchema = stringSchema;
const clientTasksSchema = z.object({
  statusMap: z.record(
    statusIDSchema,
    z.tuple([displayNameSchema, orderSchema, textColorSchema, bgColorSchema]),
  ),
});

const departmentCodeSchema = stringSchema;
const departmentNameSchema = stringSchema;
const clientDepartmentsSchema = z.record(
  departmentCodeSchema,
  departmentNameSchema,
);

const idSchema = stringSchema;
const clientUsersSchema = z.record(
  idSchema,
  z.object({
    id: idSchema,
    userName: stringSchema,
    avatar: stringSchema.optional(),
  }),
);

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
    lang: languageConfigSchema,
    tasks: clientTasksSchema.optional(),
    departments: clientDepartmentsSchema.optional(),
    users: clientUsersSchema.optional(),
  }),
});
