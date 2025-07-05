import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import resources from "@/types/translation/resources";
import { DEFAULT_LANGUAGE, defaultNS } from "@/constants/languages";

if (!localStorage.getItem("mapLanguage")) {
  localStorage.setItem("mapLanguage", DEFAULT_LANGUAGE);
}

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    defaultNS,
    fallbackLng: DEFAULT_LANGUAGE,
    lng: localStorage.getItem("mapLanguage") || DEFAULT_LANGUAGE,
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    interpolation: { escapeValue: false },
  });

export default i18n;
