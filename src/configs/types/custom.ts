import { getClientMetaDataSchema } from "@/configs/schema/client";
import * as z from "zod";

export type ClientMetaData = z.infer<typeof getClientMetaDataSchema.result>;

type ColorCode = string;
type TaskStatusOrder = number;

export interface ClientSpecificCustomHandler {
  isAdmin?: (_: unknown) => boolean;
  isSystemAdmin?: (_: unknown) => boolean;
  task?: {
    /**
     * statusMapGenerator is a function that
     * returns a Record<statusID, [displayName, order]>
     */
    statusMapGenerator?: () => Record<number, [string, TaskStatusOrder, ColorCode]>;
    statusMapper?: (status: string) => number;
    statusValidator?: (_: number) => boolean;
  };
}
