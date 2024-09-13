import { getClientMetaDataSchema } from "@/configs/schema/client";
import { Dictionary } from "@/configs/types/base";
import * as z from "zod";
import { create } from "zustand";

type ClientMetaData = z.infer<typeof getClientMetaDataSchema.result>;

type ClientState = {
  id?: number;
  name?: string;
  lang?: {
    EN: Dictionary;
    VI: Dictionary;
  };
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
    });
  },
}));

export default clientStore;
