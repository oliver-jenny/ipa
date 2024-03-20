import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../translations/en.json';
import de from '../translations/de.json';

i18next.use(initReactI18next).init({
  fallbackLng: 'de',
  resources: {
    en: {
      common: en,
    },
    de: {
      common: de,
    },
  },
  returnNull: false,
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;
