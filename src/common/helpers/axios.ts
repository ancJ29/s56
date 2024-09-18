import { IS_DEV } from "@/common/helpers/env";
import { RequestPayload, UnknownRecord } from "@/configs/types";
import { ServiceSchema } from "@/configs/types/base";
import { ONE_DAY, ONE_HOUR } from "@/constants";
import _axios, { AxiosInstance } from "axios";
import { Buffer } from "buffer";
import throttle from "lodash.throttle";
import { Md5 } from "ts-md5";
import appStore from "../stores/app";
import authStore from "../stores/auth";
import { cache } from "./cache";
import logger from "./logger";

/* cspell:disable-next-line */
const debug = localStorage.__DEBUG_CODE__ === "sfeErHDHNTQQ";
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
    throw new Error(`API request failed: ${action}`);
  }
}

async function _apiRequest<T>(payload: UnknownRecord) {
  _browserOnly();
  axios = _buildBrowserAxiosInstance();
  let url = "/req";
  if (IS_DEV) {
    // logger.debug("API Request", payload);
    url += `?action=${payload?.action || "unknown"}`;
  }
  const key = authStore.getState().payload?.key || "";
  const iv = authStore.getState().payload?.iv || "";
  const encoded = key && iv ? await _encode(key, iv, payload) : undefined;
  return axios
    .request<{
      result?: T;
      data?: string;
    }>({
      method: "POST",
      url,
      data: JSON.stringify({
        ...(!encoded || debug ? payload : {}),
        data: encoded,
      }),
    })
    .then((res) => {
      if (res.data.data && key && iv) {
        return _decode<T>(key, iv, res.data.data);
      }
      if (res.data.result) {
        return res.data.result;
      }
      throw new Error("API response is invalid");
    });
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

async function _encrypt(
  key: string,
  iv: string,
  raw: UnknownRecord,
): Promise<string> {
  // Convert data, key, and iv to ArrayBuffer
  const dataBuffer = new TextEncoder().encode(
    Buffer.from(encodeURIComponent(JSON.stringify(raw))).toString(
      "base64",
    ),
  ).buffer;
  const keyArrayBuffer = new Uint8Array(
    key.match(/[\da-f]{2}/gi)!.map((h) => parseInt(h, 16)),
  ).buffer;
  const ivArrayBuffer = new Uint8Array(
    iv.match(/[\da-f]{2}/gi)!.map((h) => parseInt(h, 16)),
  ).buffer;

  const cryptoKey = await window.crypto.subtle.importKey(
    "raw",
    keyArrayBuffer,
    { name: "AES-CBC", length: 256 },
    false,
    ["encrypt"],
  );

  // Encrypt the data
  const encryptedArrayBuffer = await window.crypto.subtle.encrypt(
    { name: "AES-CBC", iv: ivArrayBuffer },
    cryptoKey,
    dataBuffer,
  );

  // Convert ArrayBuffer to string
  const encryptedArray = new Uint8Array(encryptedArrayBuffer);
  const encrypted = Array.prototype.map
    .call(encryptedArray, (x) => ("00" + x.toString(16)).slice(-2))
    .join("");

  return encrypted;
}

async function _decrypt<T>(
  key: string,
  iv: string,
  encryptedData: string,
): Promise<T> {
  // Convert encrypted data, key, and iv to ArrayBuffer
  // prettier-ignore
  const encryptedArrayBuffer = new Uint8Array(

    encryptedData.match(/[\da-f]{2}/gi)!.map((h) => parseInt(h, 16)),
  ).buffer;
  const keyArrayBuffer = new Uint8Array(
    key.match(/[\da-f]{2}/gi)!.map((h) => parseInt(h, 16)),
  ).buffer;
  const ivArrayBuffer = new Uint8Array(
    iv.match(/[\da-f]{2}/gi)!.map((h) => parseInt(h, 16)),
  ).buffer;

  // Import the key
  // const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  const cryptoKey = await window.crypto.subtle.importKey(
    "raw",
    keyArrayBuffer,
    { name: "AES-CBC", length: 256 },
    false,
    ["decrypt"],
  );

  // Decrypt the data
  const decryptedArrayBuffer = await window.crypto.subtle.decrypt(
    { name: "AES-CBC", iv: ivArrayBuffer },
    cryptoKey,
    encryptedArrayBuffer,
  );

  // Convert ArrayBuffer to string
  const decoder = new TextDecoder();
  const decrypted = decoder.decode(decryptedArrayBuffer);

  // Parse the decrypted data
  return JSON.parse(
    decodeURIComponent(
      Buffer.from(decrypted, "base64").toString("utf8"),
    ),
  );
}

async function _encode(
  key: string,
  iv: string,
  payload: UnknownRecord) {
  if (!key || !iv) {
    throw new Error("Key or IV is missing");
  }
  logger.debug("Payload", key, iv, payload);
  const __r = Math.random().toString(36).slice(2, 6);
  payload.__r = __r;
  const data = await _encrypt(key, iv, payload);
  const mark = Math.floor(data.length / 2);
  return data.slice(0, mark) + __r + data.slice(mark);
}

async function _decode<T>(
  key: string,
  iv: string,
  data: string) {
  if (!key || !iv) {
    throw new Error("Key or IV is missing");
  }
  const mark = Math.floor(data.length / 2) - 2;
  const r = data.slice(mark, mark + 4);
  const raw = data.slice(0, mark) + data.slice(mark + 4);
  const { __r, ...payload } = await _decrypt<
    UnknownRecord & { __r: string }
  >(key, iv, raw);
  if (__r === r) {
    if (payload.__data) {
      return payload.__data as T;
    }
    return payload as T;
  }
  return null;
}
