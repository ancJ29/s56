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

const IDSchema = stringSchema;
const displayNameSchema = stringSchema;
const orderSchema = numberSchema;
const badgeColorSchema = stringSchema;
const textColorSchema = stringSchema;
const bgColorSchema = stringSchema;
const clientTasksSchema = z.object({
  priorityMap: z.record(
    IDSchema,
    z.tuple([displayNameSchema, textColorSchema]),
  ),
  statusMap: z.record(
    IDSchema,
    z.tuple([
      displayNameSchema,
      orderSchema,
      badgeColorSchema,
      textColorSchema,
      bgColorSchema,
    ]),
  ),
});

const departmentCodeSchema = stringSchema;
const departmentNameSchema = stringSchema;
const clientDepartmentsSchema = z.record(
  departmentCodeSchema,
  departmentNameSchema,
);

const levelCodeSchema = stringSchema;
const levelNameSchema = stringSchema;
const clientStaffLevelsSchema = z.record(levelCodeSchema, levelNameSchema);

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
    staffLevels: clientStaffLevelsSchema.optional(),
    users: clientUsersSchema.optional(),
  }),
});
