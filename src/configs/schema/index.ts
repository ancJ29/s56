import * as z from "zod";
import { APP_ACTIONS } from "../enums/actions";
import {
  authenticationPayloadSchema,
  loginSchema,
  registerSchema,
} from "./auth";
import { getClientMetaDataSchema } from "./client";
import {
  addNoteSchema,
  deleteTaskSchema,
  getTaskSchema,
  getTasksSchema,
  registerTaskSchema,
  removeNoteSchema,
  updateTaskSchema,
} from "./task";
import {
  addUserByAdminSchema,
  markUserAsAdminSchema,
  markUserAsSystemAdminSchema,
} from "./user";

export const ACTION = z.enum([
  APP_ACTIONS.AUTH_REGISTER,
  APP_ACTIONS.AUTH_LOGIN,
  APP_ACTIONS.ADMIN_ADD_CLIENT,
  APP_ACTIONS.CLIENT_GET_META_DATA,
]);

export const C_SERVICE_SCHEMA = {
  AUTHENTICATION_PAYLOAD: authenticationPayloadSchema,
  API_GATEWAY: {
    REQUEST_BODY: z.union([
      loginSchema.payload,
      registerSchema.payload,
      getClientMetaDataSchema.payload,
      addUserByAdminSchema.payload,
      markUserAsAdminSchema.payload,
      markUserAsSystemAdminSchema.payload,
      getTasksSchema.payload,
      getTaskSchema.payload,
      registerTaskSchema.payload,
      updateTaskSchema.payload,
      deleteTaskSchema.payload,
      addNoteSchema.payload,
      removeNoteSchema.payload,
    ]),
    RESPONSE_BODY: z.union([
      loginSchema.result,
      registerSchema.result,
      getClientMetaDataSchema.result,
      addUserByAdminSchema.result,
      markUserAsAdminSchema.result,
      markUserAsSystemAdminSchema.result,
      getTasksSchema.result,
      getTaskSchema.result,
      registerTaskSchema.result,
      updateTaskSchema.result,
      deleteTaskSchema.result,
      addNoteSchema.result,
      removeNoteSchema.result,
    ]),
  },
};
