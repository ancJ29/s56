import { getClientMetaDataSchema } from "@/configs/schema/client";
import * as z from "zod";
import { Menu, UnknownRecord } from "./base";

export type ClientMetaData = z.infer<typeof getClientMetaDataSchema.result>;

type ColorCode = string;
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
    /**
     * statusMapGenerator is a function that
     * returns a Record<statusID, [displayName, order]>
     */
    statusMapGenerator?: () => Record<
      number,
      [string, TaskStatusOrder, ColorCode, ColorCode]
    >;
    statusMapper?: (status: string) => number;
    statusValidator?: (_: number) => boolean;
    // getCondition?: (
    //   user: AuthenticationPayload,
    //   _?: {
    //     assigneeId?: string;
    //   },
    // ) => Promise<Prisma.TaskFindFirstOrThrowArgs["where"]>;
  };
}
