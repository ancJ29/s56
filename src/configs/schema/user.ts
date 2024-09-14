import { APP_ACTIONS } from "@/configs/enums";
import * as z from "zod";
import {
  builder,
  numberSchema,
  passwordSchema,
  stringSchema,
  successSchema,
} from "./_base";

export const addUserByAdminSchema = builder({
  action: z.literal(APP_ACTIONS.USER_ADD_USER_BY_ADMIN),
  params: z.object({
    clientId: numberSchema,
    userName: stringSchema,
    password: passwordSchema,
  }),
  result: successSchema,
});

export const markUserAsAdminSchema = builder({
  action: z.literal(APP_ACTIONS.USER_MARK_USER_AS_ADMIN),
  params: z.object({
    userId: stringSchema,
  }),
  result: successSchema,
});

export const markUserAsSystemAdminSchema = builder({
  action: z.literal(APP_ACTIONS.USER_MARK_USER_AS_SYSTEM_ADMIN),
  params: z.object({
    userId: stringSchema,
  }),
  result: successSchema,
});
