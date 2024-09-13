import * as z from "zod";
import { ACTION, C_SERVICE_SCHEMA } from "../schema";

export * from "./base";
export * from "./custom";

export type Action = z.infer<typeof ACTION>;

export type RequestPayload = z.infer<
  typeof C_SERVICE_SCHEMA.API_GATEWAY.REQUEST_BODY
>;

export type ResponsePayload = z.infer<
  typeof C_SERVICE_SCHEMA.API_GATEWAY.RESPONSE_BODY
>;

export type AuthenticationPayload = z.infer<
  typeof C_SERVICE_SCHEMA.AUTHENTICATION_PAYLOAD
>;
