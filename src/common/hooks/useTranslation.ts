import { LanguageContext } from "@/common/contexts/LanguageContext";
import { IS_DEV } from "@/common/helpers/env";
import { useCallback, useContext } from "react";

export default function useTranslation(): (
  key?: string,
  ...args: (string | number)[]
) => string {
  const { dictionary } = useContext(LanguageContext);
  const t = useCallback(
    (key?: string, ...args: (string | number)[]) => {
      return key ? _t(dictionary, key, ...args) : "";
    },
    [dictionary],
  );
  return t;
}

function _t(
  dictionary: Record<string, string>,
  key?: string,
  ...args: (string | number)[]
) {
  if (IS_DEV) {
    if (localStorage.___CHECK_LANGUAGE___ === "1") {
      return "xxxxxxxxx";
    }
  }
  if (!key) {
    return "";
  }
  if (dictionary[key]) {
    return _convert(dictionary[key], ...args);
  } else {
    return _convert(key, ...args);
  }
}

function _convert(
  template: string,
  ...args: (string | number)[]
): string {
  let result = template;
  args.forEach((arg) => {
    result = arg
      ? result.replace("%s", (arg || "").toString())
      : result;
  });
  return result;
}
