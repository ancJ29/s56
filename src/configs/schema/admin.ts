import { APP_ACTIONS, APP_ICONS } from "@/configs/enums";
import * as z from "zod";
import {
  builder,
  optionalBooleanSchema,
  stringSchema,
  successSchema,
} from "./_base";

export const addClientSchema = builder({
  action: z.literal(APP_ACTIONS.ADMIN_ADD_CLIENT),
  params: z.object({
    name: stringSchema,
    code: stringSchema,
    enabled: optionalBooleanSchema.default(true),
  }),
  result: successSchema,
});

export const iconSchema = z.enum([
  APP_ICONS.Icon2fa,
  APP_ICONS.IconUsersGroup,
  APP_ICONS.IconBellRinging,
  APP_ICONS.IconDatabaseImport,
  APP_ICONS.IconFingerprint,
  APP_ICONS.IconKey,
  APP_ICONS.IconLogout,
  APP_ICONS.IconReceipt2,
  APP_ICONS.IconSettings,
]);

export const menuItemSchema = z.object({
  label: stringSchema,
  link: stringSchema,
  icon: iconSchema,
});

export const menuSchema = menuItemSchema.array();
