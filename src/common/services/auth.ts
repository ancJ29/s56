import { callApi } from "@/common/helpers/axios";
import { APP_ACTIONS } from "@/configs/enums/actions";
import { loginSchema } from "@/configs/schema/auth";
import { hashMd5 } from "@/utils";

export async function login(payload: {
  userName: string;
  password: string;
}) {
  const action = APP_ACTIONS.AUTH_LOGIN;
  const res = await callApi(
    {
      action,
      payload: {
        ...payload,
        password: hashMd5(payload.password),
        clientId: 2,
      },
    },
    loginSchema,
    {
      failed: null,
    },
  );
  return res === null ? null : res?.token || null;
}
