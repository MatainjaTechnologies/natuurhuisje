import type { Locale } from './config';

const dictionaries = {
  en: () => import('./dictionaries/en/rent-out.json').then((module) => module.default),
  nl: () => import('./dictionaries/nl/rent-out.json').then((module) => module.default),
  de: () => import('./dictionaries/de/rent-out.json').then((module) => module.default),
  fr: () => import('./dictionaries/fr/rent-out.json').then((module) => module.default),
};

export const getRentOutDictionary = async (locale: Locale) => {
  return dictionaries[locale]();
};
