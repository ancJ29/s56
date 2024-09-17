import { create } from "zustand";
import logger from "../helpers/logger";

type AppState = {
  loading: boolean;
  display: {
    header: boolean;
  };
  triggerLoading: () => void;
  hideHeader: () => void;
  showHeader: () => void;
  stopLoading: () => void;
};

let timer: NodeJS.Timeout;

const appStore = create<AppState>((set) => ({
  loading: false,
  title: "",
  display: {
    header: true,
  },
  hideHeader: () => {
    set({ display: { header: false } });
  },
  showHeader: () => {
    set({ display: { header: true } });
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
