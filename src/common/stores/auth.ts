import logger from "@/common/helpers/logger";
import { C_SERVICE_SCHEMA } from "@/configs/schema";
import { AuthenticationPayload } from "@/configs/types";
import { jwtDecode } from "jwt-decode";
import { create } from "zustand";

type AuthState = {
  token?: string;
  payload?: AuthenticationPayload;
  setToken: (token?: string, remember?: boolean) => void;
  logout: (_?: { reload?: boolean; to?: string }) => void;
};

const _defaultState = {
  token: undefined,
  payload: undefined,
  isAdmin: false,
};

const authStore = create<AuthState>((set, get) => ({
  ..._loadPayload(),
  setToken: (token?: string, remember = false) => {
    logger.trace("setToken", token, remember);
    if (token) {
      try {
        logger.trace("setToken", jwtDecode(token));
        const res = C_SERVICE_SCHEMA.AUTHENTICATION_PAYLOAD.safeParse(
          jwtDecode(token),
        );
        logger.trace("setToken", res);
        if (res.success) {
          set({ token, payload: res.data });
          if (remember) {
            localStorage.__TOKEN__ = token;
          }
          sessionStorage.__TOKEN__ = token;
          return;
        }
      } catch (error) {
        logger.error("setToken error", error);
      }
      get().logout({ reload: false });
    }
  },
  logout: (
    {
      to,
      reload,
    }: {
      reload?: boolean;
      to?: string;
    } = {
      reload: true,
    },
  ) => {
    set({ ..._defaultState });
    delete localStorage.__TOKEN__;
    delete sessionStorage.__TOKEN__;
    if (reload !== false) {
      setTimeout(() => {
        if (to) {
          window.location.replace(to);
        } else {
          window.location.reload();
        }
      }, 10);
    }
  },
}));

export default authStore;

function _loadPayload() {
  logger.trace("_loadPayload");
  try {
    const token = sessionStorage.__TOKEN__ || localStorage.__TOKEN__;
    if (token) {
      const res = C_SERVICE_SCHEMA.AUTHENTICATION_PAYLOAD.safeParse(
        jwtDecode(token),
      );
      if (res.success) {
        logger.trace("_loadPayload", res.data);
        return {
          token,
          payload: res.data,
        };
      }
    }
  } catch (error) {
    logger.error("_loadPayload error", error);
  }
  return { token: undefined, payload: undefined };
}
