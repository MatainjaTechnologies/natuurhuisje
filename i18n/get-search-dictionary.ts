import type { Locale } from './config';

const dictionaries = {
  en: () => import('./dictionaries/search/en.json').then((module) => module.default),
  nl: () => import('./dictionaries/search/nl.json').then((module) => module.default),
  de: () => import('./dictionaries/search/de.json').then((module) => module.default),
  fr: () => import('./dictionaries/search/fr.json').then((module) => module.default),
};

export const getSearchDictionary = async (locale: Locale) => {
  return dictionaries[locale]();
};
