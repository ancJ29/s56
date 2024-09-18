import { Language } from "@/configs/enums";
import { getClientMetaDataSchema } from "@/configs/schema/client";
import { ClientMetaData } from "@/configs/types";
import { Dictionary } from "@/configs/types/base";
import { create } from "zustand";
import logger from "../helpers/logger";

type ClientState = {
  id?: number;
  name?: string;
  lang?: Partial<Record<Language, Dictionary>>;
  client?: ClientMetaData;
  updateClient: (client: ClientMetaData) => void;
};

const clientStore = create<ClientState>((set) => ({
  client: _loadClient(),
  updateClient: (client: ClientMetaData) => {
    localStorage.__CLIENT__ = JSON.stringify(client);
    set({
      id: client.id,
      name: client.name,
      client,
      lang: client.lang,
    });
  },
}));

export default clientStore;

function _loadClient() {
  try {
    const res = getClientMetaDataSchema.result.safeParse(JSON.parse(localStorage.__CLIENT__ || "{}"));
    return res.success ? res.data : undefined;
  } catch (e) {
    // skip
    logger.trace("Failed to load client", e);
  }
  return undefined;
}
