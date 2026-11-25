import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

export const supportedLngs = [
  'en', 'de', 'fr', 'ru', 'ar', 'it', 'es', 'zh', 'ja', 'ko',
  'nl', 'pl', 'tr', 'pt', 'sv', 'cs', 'uk', 'hu', 'ro', 'sk',
  'da', 'no', 'fi', 'sr', 'bg', 'hi', 'id', 'el', 'vi', 'he', 'kk', 'lt'
];

const rtlLanguages = ['ar', 'he'];

export const applyDocumentDirection = (lng?: string) => {
  if (typeof document === 'undefined') return;
  const code = (lng || i18n.language || 'en').split('-')[0].toLowerCase();
  const isRtl = rtlLanguages.includes(code);
  document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  document.documentElement.lang = code;
  if (isRtl) {
    document.documentElement.classList.add('rtl');
    document.documentElement.classList.remove('ltr');
  } else {
    document.documentElement.classList.add('ltr');
    document.documentElement.classList.remove('rtl');
  }
};

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs,
    ns: ['translation'],
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
    detection: {
      order: ['querystring', 'localStorage', 'navigator'],
      lookupQuerystring: 'lang',
      lookupLocalStorage: 'kemetvacation-language',
      caches: ['localStorage'],
    }
  });

i18n.on('languageChanged', (lng) => {
  applyDocumentDirection(lng);
  try {
    localStorage.setItem('kemetvacation-language', lng);
  } catch (e) {
    // ignore
  }
});

i18n.on('initialized', () => {
  applyDocumentDirection(i18n.language);
});

// Immediately apply for initial SSR/first paint
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem('kemetvacation-language');
    if (saved) applyDocumentDirection(saved);
  } catch (e) {}
}

export default i18n;
