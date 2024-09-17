import { IS_DEV } from "@/common/helpers/env";
import { RequestPayload, UnknownRecord } from "@/configs/types";
import { ServiceSchema } from "@/configs/types/base";
import { ONE_DAY, ONE_HOUR } from "@/constants";
import _axios, { AxiosInstance } from "axios";
import throttle from "lodash.throttle";
import { Md5 } from "ts-md5";
import appStore from "../stores/app";
import { cache } from "./cache";
import logger from "./logger";

let axios: AxiosInstance;

export async function callApi<G, A, P, R>(
  { group, action, payload }: RequestPayload,
  schema: ServiceSchema<G, A, P, R>,
  opt?: {
    failed: R | null | undefined;
    cached?: boolean;
    key?: string;
    ttl?: number; // in milliseconds
    loading?: boolean;
  },
) {
  _browserOnly();
  const triggerLoading = opt?.loading !== false;
  if (opt?.key && cache.has(opt?.key)) {
    return cache.get(opt.key) as R;
  }
  if (triggerLoading) {
    appStore.getState().triggerLoading();
  }
  try {
    const res = await _run();
    if (triggerLoading) {
      appStore.getState().stopLoading();
    }
    return res;
  } catch (error) {
    if (triggerLoading) {
      appStore.getState().stopLoading();
    }
    throw error;
  }

  async function _run() {
    const res = await _apiRequest(
      schema.payload.parse({ group, action, payload }),
    );
    const data = schema.result.safeParse(res);
    if (data.success) {
      if (opt?.cached) {
        if (!opt.key || !opt.ttl) {
          if (IS_DEV) {
            throw new Error(
              "key and ttl must be provided for caching",
            );
          }
        } else {
          cache.set(opt.key, data.data as UnknownRecord, {
            ttl: opt.ttl,
          });
        }
      }
      return data.data;
    }
    logger.error(data.error);
    if (opt?.failed !== undefined) {
      return opt.failed;
    }
    throw new Error("API request failed");
  }
}

function _apiRequest<T>(payload?: UnknownRecord) {
  _browserOnly();
  axios = _buildBrowserAxiosInstance();
  let url = "/req";
  if (IS_DEV) {
    logger.debug("API Request", payload);
    url += `?action=${payload?.action || "unknown"}`;
  }
  return axios
    .request<{
      result?: T;
    }>({
      method: "POST",
      url,
      data: JSON.stringify(payload),
    })
    .then((res) => res.data.result);
}

function _buildBrowserAxiosInstance() {
  _browserOnly();
  if (axios) {
    return axios;
  }
  axios = _axios.create({
    baseURL: import.meta.env.APP_API_URL,
    headers: {
      "Content-type": "application/json",
      "X-LANG": localStorage.__LANGUAGE__,
    },
  });

  const initUid = throttle(function _initUid() {
    const last = Number(localStorage?.__X_UID__?.split(".")[0] || 0);
    if (Date.now() - last > ONE_DAY) {
      delete localStorage.__X_UID__;
    }
    if (
      !localStorage.__X_UID__ ||
      !/.*\..*/.test(localStorage.__X_UID__)
    ) {
      localStorage.__X_UID__ = _generateUID(Date.now().toString());
    }

    const from = localStorage.__X_UID__.split(".")[1];
    if (Date.now() - parseInt(from) > ONE_HOUR) {
      localStorage.__X_UID__ = _generateUID(Date.now().toString());
    }
  }, ONE_HOUR);

  axios.interceptors.request.use(
    (config) => {
      initUid();
      const token =
        sessionStorage.__TOKEN__ || localStorage.__TOKEN__;
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      if (localStorage.__DEBUG_CODE__) {
        config.headers["X-DEBUG-CODE"] = localStorage.__DEBUG_CODE__;
      }
      const timestamp = Date.now().toString();
      config.headers["X-UID"] = localStorage.__X_UID__;
      config.headers["X-TIMESTAMP"] = timestamp;
      config.headers["X-NONCE"] = _generateNonce(
        `${localStorage.__X_UID__}/${timestamp}`,
      );
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  return axios;

  function _generateUID(prefix: string) {
    let cont = true;
    do {
      const uid = Math.random().toString(36).slice(2);
      if (_check(`${prefix}/${uid}`)) {
        cont = false;
        return `${prefix}.${uid}`;
      }
    } while (cont);
    return "";
  }

  function _generateNonce(prefix: string) {
    let cont = true;
    do {
      const nonce = Math.random().toString(36).slice(2);
      if (_check(`${prefix}/${nonce}`)) {
        cont = false;
        return nonce;
      }
    } while (cont);
    return "";
  }

  function _check(uid: string, end = "000") {
    return Md5.hashStr(uid).endsWith(end);
  }
}

function _browserOnly() {
  if (typeof window === "undefined") {
    throw new Error(
      "This function should be called in browser environment",
    );
  }
}
