import { callApi } from "@/common/helpers/axios";
import { APP_ACTIONS } from "@/configs/enums/actions";
import {
  getAllUserSchema,
} from "@/configs/schema/user";
import * as z from "zod";

export type User = z.infer<typeof getAllUserSchema.result>[0];

export async function getUsers(): Promise<User[]> {
  const APP_CLIENT_ID = Number(import.meta.env.APP_CLIENT_ID || 0);
  if (!APP_CLIENT_ID || isNaN(APP_CLIENT_ID)) {
    throw new Error("APP_CLIENT_ID is not defined");
  }

  const action = APP_ACTIONS.USER_GET_ALL_USERS;

  const users = await callApi(
    {
      action,
      payload: {
        clientId: APP_CLIENT_ID,
      },
    },
    getAllUserSchema,
    {
      failed: null,
    },
  );
  return users || [];
}
