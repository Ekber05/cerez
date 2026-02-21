// i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector'; // Yeni əlavə

import az from "./locales/az/translation.json";
import en from "./locales/en/translation.json";
import ru from "./locales/ru/translation.json";

i18n
  .use(LanguageDetector) // Yeni əlavə
  .use(initReactI18next)
  .init({
    resources: {
      az: { translation: az },
      en: { translation: en },
      ru: { translation: ru }
    },
    lng: localStorage.getItem('preferredLanguage') || "az", // Dəyişdirildi
    fallbackLng: "az",
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;