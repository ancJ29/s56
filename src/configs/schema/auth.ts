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
  isSystemAdmin: optionalBooleanSchema,
  isAdmin: optionalBooleanSchema,
  key: stringSchema,
  iv: stringSchema,
  client: z
    .object({
      id: numberSchema,
      name: stringSchema,
      code: stringSchema,
      menu: OTHER_SCHEMA.CLIENT_OTHER_SCHEMA.shape.menu,
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
