import {
  APP_ACTION_GROUPS,
  APP_ACTIONS,
  APP_ICONS,
  APP_MENU,
} from "@/configs/enums";
import * as z from "zod";
import {
  builder,
  optionalBooleanSchema,
  stringSchema,
  successSchema,
} from "./_base";

export const addClientSchema = builder({
  group: z.literal(APP_ACTION_GROUPS.ADMIN),
  action: z.literal(APP_ACTIONS.ADMIN_ADD_CLIENT),
  params: z.object({
    name: stringSchema,
    code: stringSchema,
    enabled: optionalBooleanSchema.default(true),
  }),
  result: successSchema,
});

export const menuKeySchema = z.enum([
  APP_MENU.TASK_MANAGEMENT,
  APP_MENU.USER_MANAGEMENT,
]);

export const iconSchema = z.enum([
  APP_ICONS.Icon2fa,
  APP_ICONS.IconBellRinging,
  APP_ICONS.IconChecklist,
  APP_ICONS.IconDatabaseImport,
  APP_ICONS.IconFingerprint,
  APP_ICONS.IconKey,
  APP_ICONS.IconLogout,
  APP_ICONS.IconReceipt2,
  APP_ICONS.IconSettings,
  APP_ICONS.IconUsersGroup,
]);

export const menuItemSchema = z.object({
  label: stringSchema,
  key: menuKeySchema,
  link: stringSchema,
  icon: iconSchema,
});

export const menuSchema = menuItemSchema.array();
