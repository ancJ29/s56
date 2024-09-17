import { callApi } from "@/common/helpers/axios";
import {
  APP_ACTION_GROUPS,
  APP_ACTIONS,
} from "@/configs/enums/actions";
import { loginSchema } from "@/configs/schema/auth";
import { hashMd5 } from "@/utils";
import { _clientId } from "./_helpers";

export async function login(payload: {
  userName: string;
  password: string;
}) {
  const action = APP_ACTIONS.AUTH_LOGIN;
  const res = await callApi(
    {
      group: APP_ACTION_GROUPS.AUTH,
      action,
      payload: {
        ...payload,
        password: hashMd5(payload.password),
        clientId: _clientId(),
      },
    },
    loginSchema,
    {
      failed: null,
    },
  );
  return res === null ? null : res?.token || null;
}
