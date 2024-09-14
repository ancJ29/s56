import * as z from "zod";
import { ServiceSchema } from "../types/base";

export const booleanSchema = z.boolean();
export const optionalBooleanSchema = booleanSchema.optional();
export const numberSchema = z.number();
export const optionalNumberSchema = numberSchema.optional();
export const stringSchema = z.string();
export const optionalStringSchema = stringSchema.optional();
export const successSchema = z.object({
  success: booleanSchema,
});
export const timestampSchema = numberSchema;

export const passwordSchema = stringSchema;
// z.custom<string>((v) => {
//   if (typeof v !== "string") {
//     throw new Error("Invalid password");
//   }
//   if (!isMd5(v)) {
//     throw new Error("Invalid password");
//   }
//   return v;
// });

export function builder<A, P, R>(
  schema: Omit<ServiceSchema<A, P, R>, "payload"> & {
    payload?: z.ZodObject<{
      action: z.ZodLiteral<A>;
      payload: z.ZodType<P>;
    }>;
  },
) {
  schema.payload = z.object({
    action: schema.action,
    payload: schema.params,
  }) satisfies z.ZodObject<{
    action: z.ZodLiteral<A>;
    payload: z.ZodType<P>;
  }>;
  return schema as ServiceSchema<A, P, R>;
}
