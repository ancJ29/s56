import * as z from "zod";

export type ServiceSchema<A, P, R> = {
  action: z.ZodLiteral<A>;
  params: z.ZodType<P>;
  result: z.ZodType<R>;
  payload: z.ZodObject<{
    action: z.ZodLiteral<A>;
    payload: z.ZodType<P>;
  }>;
};

export type Dictionary = Record<string, string>;

export type UnknownRecord = Record<string, unknown>;
