import { create } from "zustand";
import logger from "../helpers/logger";

type AppState = {
  loading: boolean;
  header: {
    icon?: React.ReactNode;
    display: boolean;
    title?: string;
  };
  triggerLoading: () => void;
  resetHeader: () => void;
  updateHeader: (_: AppState["header"]) => void;
  stopLoading: () => void;
};

let timer: NodeJS.Timeout;

const appStore = create<AppState>((set) => ({
  loading: false,
  header: {
    display: true,
    title: "",
  },
  updateHeader: (header: AppState["header"]) => {
    set({ header });
  },
  resetHeader: () => {
    set({ header: { display: true } });
  },
  triggerLoading: () => {
    set({ loading: true });
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      logger.debug("timeout...");
      set({ loading: false });
    }, 3e3);
  },
  stopLoading: () => {
    logger.debug("stopLoading...");
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      set({ loading: false });
    }, 500);
  },
}));

export default appStore;
