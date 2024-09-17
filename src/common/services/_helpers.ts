import clientStore from "@/common/stores/client";
import { getMetaData } from "./client";

export async function _getClient() {
  let client = clientStore.getState().client;
  if (!client) {
    client = (await getMetaData()) || undefined;
  }
  return client;
}

export function _clientId() {
  const APP_CLIENT_ID = Number(import.meta.env.APP_CLIENT_ID || 0);
  if (!APP_CLIENT_ID || isNaN(APP_CLIENT_ID)) {
    throw new Error("APP_CLIENT_ID is not defined");
  }
  return APP_CLIENT_ID;
}
