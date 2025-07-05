import ukTranslation from "../../locales/uk/translation.json";
import enTranslation from "../../locales/en/translation.json";
import itTranslation from "../../locales/it/translation.json";

export const resources = {
  uk: { translation: ukTranslation },
  en: { translation: enTranslation },
  it: { translation: itTranslation },
} as const;

export default resources;
