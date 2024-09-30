import * as z from "zod";
import { menuSchema } from "../schema/admin";

export type ServiceSchema<G, A, P, R> = {
  group: z.ZodLiteral<G>;
  action: z.ZodLiteral<A>;
  params: z.ZodType<P>;
  result: z.ZodType<R>;
  payload: z.ZodObject<{
    group: z.ZodLiteral<G>;
    action: z.ZodLiteral<A>;
    payload: z.ZodType<P>;
  }>;
};

export type Dictionary = Record<string, string>;

export type UnknownRecord = Record<string, unknown>;

export type Menu = z.infer<typeof menuSchema>;
