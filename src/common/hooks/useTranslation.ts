import { IS_DEV } from "@/common/helpers/env";
import useClientStore from "@/common/stores/client";
import { Language } from "@/configs/enums";
import en from "@/configs/languages/en.json";
import vi from "@/configs/languages/vi.json";
import { useCallback, useMemo } from "react";

const languages = {
  [Language.EN]: en,
  [Language.VI]: vi,
};

export default function useTranslation(): (
  key?: string,
  ...args: (string | number)[]
) => string {
  const { lang: clientLanguages } = useClientStore();

  const dictionary = useMemo(() => {
    const current = (localStorage.__LANGUAGE__ ||
      Language.EN) as Language;

    return {
      ...(languages[current] || {}),
      ...(clientLanguages?.[current] || {}),
    };
  }, [clientLanguages]);

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
