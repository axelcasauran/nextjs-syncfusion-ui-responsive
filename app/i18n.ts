// app/i18n.ts

// Import translations
import arTranslation from '@/i18n/messages/ar.json';
import chTranslation from '@/i18n/messages/ch.json';
import deTranslation from '@/i18n/messages/de.json';
import enTranslation from '@/i18n/messages/en.json';
import esTranslation from '@/i18n/messages/es.json';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslation,
    },
    ar: {
      translation: arTranslation,
    },
    de: {
      translation: deTranslation,
    },
    es: {
      translation: esTranslation,
    },
    ch: {
      translation: chTranslation,
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
