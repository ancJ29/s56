import { callApi } from "@/common/helpers/axios";
import logger from "@/common/helpers/logger";
import {
  APP_ACTION_GROUPS,
  APP_ACTIONS,
} from "@/configs/enums/actions";
import { getClientMetaDataSchema } from "@/configs/schema/client";
import { ONE_HOUR } from "@/constants";
import authStore from "../stores/auth";
import { _clientId } from "./_helpers";

export async function getMetaData() {
  const action = APP_ACTIONS.GET_CLIENT_META_DATA;
  const res = await callApi(
    {
      group: APP_ACTION_GROUPS.CLIENT,
      action,
      payload: { clientId: _clientId() },
    },
    getClientMetaDataSchema,
    {
      failed: null,
      cached: true,
      key: "clientMetaData",
      ttl: ONE_HOUR,
    },
  );
  logger.info("meta data", res);
  if (!res) {
    logger.error("Failed to get meta data");
    authStore.getState().logout();
  }
  return res;
}
