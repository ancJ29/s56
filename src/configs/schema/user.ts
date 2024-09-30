import { APP_ACTION_GROUPS, APP_ACTIONS } from "@/configs/enums";
import * as z from "zod";
import {
  builder,
  numberSchema,
  optionalStringSchema,
  passwordSchema,
  stringSchema,
  successSchema,
} from "./_base";

export const getAllUserSchema = builder({
  group: z.literal(APP_ACTION_GROUPS.USER),
  action: z.literal(APP_ACTIONS.GET_ALL_USERS),
  params: z.object({
    clientId: numberSchema,
  }),
  result: z
    .object({
      id: stringSchema,
      userName: stringSchema,
      fullName: optionalStringSchema,
      displayName: optionalStringSchema,
      departmentCode: optionalStringSchema,
    })
    .array(),
});

export const addUserByAdminSchema = builder({
  group: z.literal(APP_ACTION_GROUPS.USER),
  action: z.literal(APP_ACTIONS.ADD_USER_BY_ADMIN),
  params: z.object({
    clientId: numberSchema,
    userName: stringSchema,
    password: passwordSchema,
    fullName: optionalStringSchema,
    departmentCode: optionalStringSchema,
  }),
  result: successSchema,
});

export const markUserAsAdminSchema = builder({
  group: z.literal(APP_ACTION_GROUPS.USER),
  action: z.literal(APP_ACTIONS.MARK_USER_AS_ADMIN),
  params: z.object({
    userId: stringSchema,
  }),
  result: successSchema,
});

export const markUserAsSystemAdminSchema = builder({
  group: z.literal(APP_ACTION_GROUPS.USER),
  action: z.literal(APP_ACTIONS.MARK_AS_SYSTEM_ADMIN),
  params: z.object({
    userId: stringSchema,
  }),
  result: successSchema,
});
