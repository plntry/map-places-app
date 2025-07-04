import ukTranslation from "../../locales/uk/translation.json";
import enTranslation from "../../locales/en/translation.json";

export const resources = {
  uk: { translation: ukTranslation },
  en: { translation: enTranslation },
} as const;

export default resources;
