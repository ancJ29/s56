import { Md5 } from "ts-md5";

export async function delay(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export function hashMd5(str: string) {
  return `48D6.${Md5.hashStr(str)}`;
}

export function isMd5(str: string) {
  const md5Regex = /^48D6\.[a-f0-9]{32}$/i;
  return md5Regex.test(str);
}

// Sample: dropTime(Date.now(), ONE_DAY)
export function dropTime(ts: number, span: number) {
  return ts - (ts % span);
}

export function uuid() {
  // https://stackoverflow.com/a/8809472
  let d = new Date().getTime(); //Timestamp
  let d2 =
    (typeof performance !== "undefined" &&
      performance.now &&
      performance.now() * 1000) ||
    0; //Time in microseconds since page-load or 0 if unsupported
  // cspell: disable-next-line
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    let r = Math.random() * 16; //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function cleanObj<T extends Record<string, unknown>>(obj: T) {
  for (const key in obj) {
    if (obj[key] === null || obj[key] === undefined) {
      delete obj[key];
    }
  }
  return obj;
}
