import { Language } from "@/configs/enums";
import { ClientMetaData } from "@/configs/types";
import { Dictionary } from "@/configs/types/base";
import { create } from "zustand";

type ClientState = {
  id?: number;
  name?: string;
  lang?: Partial<Record<Language, Dictionary>>;
  client?: ClientMetaData;
  updateClient: (client: ClientMetaData) => void;
};

const clientStore = create<ClientState>((set) => ({
  updateClient: (client: ClientMetaData) => {
    set({
      id: client.id,
      name: client.name,
      client,
      lang: client.lang,
    });
  },
}));

export default clientStore;
