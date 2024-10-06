import { getClientMetaDataSchema } from "@/configs/schema/client";
import * as z from "zod";
import { AuthenticationPayload } from ".";
import { Menu, UnknownRecord } from "./base";

export type ClientMetaData = z.infer<typeof getClientMetaDataSchema.result>;

type ColorCode = string;
type TextColorCode = ColorCode;
type BackgroundColorCode = ColorCode;
type BadgeColorCode = ColorCode;
type TaskStatusOrder = number;

export interface ClientSpecificCustomHandler {
  isAdmin?: (_: unknown) => boolean;
  isSystemAdmin?: (_: unknown) => boolean;
  client?: {
    customPayloadBuilder: (_: {
      userId: string;
      clientId: number;
    }) => Promise<UnknownRecord>;
  };
  user?: {
    // Add custom user fields here
    displayName?: (_: UnknownRecord) => string;
    menuBuilder?: (_: UnknownRecord) => Menu;
  };
  task?: {
    statusMapGenerator?: () => Record<
      number,
      // statusID
      [
        string,
        TaskStatusOrder,
        TextColorCode,
        BadgeColorCode,
        BackgroundColorCode,
      ]
    >;
    statusMapper?: (status: string) => number;
    priorityGenerator?: () => Record<
      number,
      // priorityID
      [string, TextColorCode]
    >;
    priorityMapper?: (priority: string) => number;
    statusValidator?: (_: number) => boolean;
    getCondition?: (
      user: AuthenticationPayload,
      _?: {
        assigneeId?: string;
      },
    ) => Promise<UnknownRecord>;
  };
}
