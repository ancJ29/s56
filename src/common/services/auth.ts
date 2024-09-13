import { callApi } from "@/common/helpers/axios";
import { APP_ACTIONS } from "@/configs/enums/actions";
import { loginSchema } from "@/configs/schema/auth";
import { hashMd5 } from "@/utils";

export async function login(payload: {
  userName: string;
  password: string;
}) {
  const APP_CLIENT_ID = Number(import.meta.env.APP_CLIENT_ID || 0);
  if (!APP_CLIENT_ID || isNaN(APP_CLIENT_ID)) {
    throw new Error("APP_CLIENT_ID is not defined");
  }
  const action = APP_ACTIONS.AUTH_LOGIN;
  const res = await callApi(
    {
      action,
      payload: {
        ...payload,
        password: hashMd5(payload.password),
        clientId: APP_CLIENT_ID,
      },
    },
    loginSchema,
    {
      failed: null,
    },
  );
  return res === null ? null : res?.token || null;
}
