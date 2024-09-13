import { callApi } from "@/common/helpers/axios";
// import { IS_DEV } from "@/common/helpers/env";
import logger from "@/common/helpers/logger";
import { APP_ACTIONS } from "@/configs/enums/actions";
import { getClientMetaDataSchema } from "@/configs/schema/client";
import { ONE_HOUR } from "@/constants";

export async function getMetaData() {
  const APP_CLIENT_ID = Number(import.meta.env.APP_CLIENT_ID || 0);
  if (!APP_CLIENT_ID || isNaN(APP_CLIENT_ID)) {
    throw new Error("APP_CLIENT_ID is not defined");
  }
  const action = APP_ACTIONS.CLIENT_GET_META_DATA;
  const res = await callApi(
    {
      action,
      payload: { clientId: APP_CLIENT_ID },
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
  return res;
}
