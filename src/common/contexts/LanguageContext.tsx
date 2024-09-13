import useClientStore from "@/common/stores/client";
import { LanguageContextType } from "@/common/types";
import { Language } from "@/configs/enums";
import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import logger from "../helpers/logger";

export const LanguageContext = createContext<LanguageContextType>({
  language: localStorage.__LANGUAGE__ || Language.EN,
  dictionary: {},
});

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { lang } = useClientStore();

  const onChangeLanguage = useCallback(
    (language: Language) => {
      localStorage.__LANGUAGE__ = language;
      const dictionary = lang?.[language] || {};
      logger.info("Language changed to", language, dictionary);
      setProvider((prev) => ({ ...prev, language, dictionary }));
    },
    [lang],
  );

  const [provider, setProvider] = useState<LanguageContextType>({
    dictionary: {},
    onChangeLanguage,
  });

  useEffect(() => {
    onChangeLanguage(localStorage.__LANGUAGE__ || Language.EN);
  }, [onChangeLanguage]);

  return (
    <LanguageContext.Provider value={provider}>
      {children}
    </LanguageContext.Provider>
  );
}
