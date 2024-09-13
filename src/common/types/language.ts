import { Language } from "@/configs/enums";
import { Dictionary } from "@/configs/types/base";

export type LanguageContextType = {
  language?: Language;
  dictionary: Dictionary;
  onChangeLanguage?: (selected: Language) => void;
};
