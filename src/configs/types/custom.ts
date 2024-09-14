import { getClientMetaDataSchema } from "@/configs/schema/client";
import * as z from "zod";

export type ClientMetaData = z.infer<typeof getClientMetaDataSchema.result>;

export interface ClientSpecificCustomHandler {
  isAdmin?: (_: unknown) => boolean;
  isSystemAdmin?: (_: unknown) => boolean;
  task?: {
    /**
     * statusMapGenerator is a function that
     * returns a Record<statusID, [displayName, order]>
     */
    statusMapGenerator?: () => Record<number, [string, number]>;
    statusMapper?: (status: string) => number;
    statusValidator?: (_: number) => boolean;
  };
}
