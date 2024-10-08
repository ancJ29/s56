import * as z from "zod";
import { APP_ACTIONS } from "../enums/actions";
import {
  authenticationPayloadSchema,
  loginSchema,
  registerSchema,
  updatePasswordSchema,
} from "./auth";
import { getClientMetaDataSchema, updateTranslationSchema } from "./client";
import {
  addNoteSchema,
  deleteTaskSchema,
  getGroupsSchema,
  getTaskSchema,
  getTasksSchema,
  registerTaskSchema,
  removeNoteSchema,
  updateTaskSchema,
} from "./task";
import {
  addUserByAdminSchema,
  getAllUserSchema,
  markUserAsAdminSchema,
  markUserAsSystemAdminSchema,
} from "./user";

export const ACTION = z.enum([
  APP_ACTIONS.AUTH_REGISTER,
  APP_ACTIONS.AUTH_LOGIN,
  APP_ACTIONS.ADMIN_ADD_CLIENT,
  APP_ACTIONS.GET_CLIENT_META_DATA,
]);

export const C_SERVICE_SCHEMA = {
  AUTHENTICATION_PAYLOAD: authenticationPayloadSchema,
  API_GATEWAY: {
    REQUEST_BODY: z.union([
      loginSchema.payload,
      updatePasswordSchema.payload,
      registerSchema.payload,
      getClientMetaDataSchema.payload,
      updateTranslationSchema.payload,
      addUserByAdminSchema.payload,
      getAllUserSchema.payload,
      markUserAsAdminSchema.payload,
      markUserAsSystemAdminSchema.payload,
      getTasksSchema.payload,
      getTaskSchema.payload,
      getGroupsSchema.payload,
      registerTaskSchema.payload,
      updateTaskSchema.payload,
      deleteTaskSchema.payload,
      addNoteSchema.payload,
      removeNoteSchema.payload,
    ]),
    RESPONSE_BODY: z.union([
      loginSchema.result,
      updatePasswordSchema.result,
      registerSchema.result,
      getClientMetaDataSchema.result,
      updateTranslationSchema.result,
      addUserByAdminSchema.result,
      getAllUserSchema.result,
      markUserAsAdminSchema.result,
      markUserAsSystemAdminSchema.result,
      getTasksSchema.result,
      getTaskSchema.result,
      getGroupsSchema.result,
      registerTaskSchema.result,
      updateTaskSchema.result,
      deleteTaskSchema.result,
      addNoteSchema.result,
      removeNoteSchema.result,
    ]),
  },
};
