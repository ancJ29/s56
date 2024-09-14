import { ClientMetaData } from "@/configs/types";
import { Dictionary } from "@/configs/types/base";
import { create } from "zustand";

type ClientState = {
  id?: number;
  name?: string;
  lang?: {
    EN: Dictionary;
    VI: Dictionary;
  };
  client?: ClientMetaData;
  updateClient: (client: ClientMetaData) => void;
};

const clientStore = create<ClientState>((set) => ({
  lang: {
    EN: {},
    VI: {},
  },
  updateClient: (client: ClientMetaData) => {
    set({
      id: client.id,
      name: client.name,
      lang: client.lang,
      client,
    });
  },
}));

export default clientStore;
