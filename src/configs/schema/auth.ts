import { APP_ACTION_GROUPS, APP_ACTIONS } from "@/configs/enums";
import * as z from "zod";
import {
  builder,
  numberSchema,
  optionalBooleanSchema,
  optionalStringSchema,
  passwordSchema,
  stringSchema,
  successSchema,
} from "./_base";
import { OTHER_SCHEMA } from "./custom";

export const authenticationPayloadSchema = z.object({
  id: stringSchema,
  clientId: numberSchema,
  userName: stringSchema,
  fullName: optionalStringSchema,
  key: stringSchema,
  iv: stringSchema,
  permission: z
    .object({
      isSystemAdmin: optionalBooleanSchema,
      isAdmin: optionalBooleanSchema,
      menu: OTHER_SCHEMA.CLIENT_OTHER_SCHEMA.shape.menu,
    })
    .optional(),
  client: z
    .object({
      id: numberSchema,
      name: stringSchema,
      code: stringSchema,
      others: z.record(stringSchema, z.unknown()).optional(),
    })
    .optional(),
});

export const registerSchema = builder({
  group: z.literal(APP_ACTION_GROUPS.AUTH),
  action: z.literal(APP_ACTIONS.AUTH_REGISTER),
  params: z.object({
    clientId: numberSchema,
    userName: stringSchema,
    password: passwordSchema,
  }),
  result: successSchema,
});

export const loginSchema = builder({
  group: z.literal(APP_ACTION_GROUPS.AUTH),
  action: z.literal(APP_ACTIONS.AUTH_LOGIN),
  params: z.object({
    clientId: numberSchema,
    userName: stringSchema,
    password: stringSchema,
    mfaCode: optionalStringSchema,
  }),
  result: z.object({
    token: stringSchema,
  }),
});

export const updatePasswordSchema = builder({
  group: z.literal(APP_ACTION_GROUPS.AUTH),
  action: z.literal(APP_ACTIONS.UPDATE_PASSWORD),
  params: z.object({
    clientId: numberSchema,
    password: stringSchema,
    newPassword: stringSchema,
  }),
  result: successSchema,
});
