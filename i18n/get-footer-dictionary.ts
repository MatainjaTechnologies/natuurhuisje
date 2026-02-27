import type { Locale } from './config';

const dictionaries = {
  en: () => import('./dictionaries/en/footer.json').then((module) => module.default),
  nl: () => import('./dictionaries/nl/footer.json').then((module) => module.default),
  de: () => import('./dictionaries/de/footer.json').then((module) => module.default),
  fr: () => import('./dictionaries/fr/footer.json').then((module) => module.default),
};

export const getFooterDictionary = async (locale: Locale) => {
  return dictionaries[locale]();
};
