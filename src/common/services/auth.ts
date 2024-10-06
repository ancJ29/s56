import { callApi } from "@/common/helpers/axios";
import {
  APP_ACTION_GROUPS,
  APP_ACTIONS,
} from "@/configs/enums/actions";
import {
  loginSchema,
  updatePasswordSchema,
} from "@/configs/schema/auth";
import { hashMd5 } from "@/utils";
import logger from "../helpers/logger";
import { _clientId } from "./_helpers";

export async function updatePassword(payload: {
  password: string;
  newPassword: string;
}) {
  const action = APP_ACTIONS.UPDATE_PASSWORD;
  const res = await callApi(
    {
      group: APP_ACTION_GROUPS.AUTH,
      action,
      payload: {
        password: hashMd5(payload.password),
        newPassword: hashMd5(payload.newPassword),
        clientId: _clientId(),
      },
    },
    updatePasswordSchema,
    {
      failed: null,
    },
  );
  logger.info("updatePassword", res);
  return res === null ? false : res.success;
}

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
