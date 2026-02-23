import type { Locale } from './config';

const dictionaries = {
  en: () => import('./dictionaries/search-results/en.json').then((module) => module.default),
  nl: () => import('./dictionaries/search-results/nl.json').then((module) => module.default),
  de: () => import('./dictionaries/search-results/de.json').then((module) => module.default),
  fr: () => import('./dictionaries/search-results/fr.json').then((module) => module.default),
};

export const getSearchResultsDictionary = async (locale: Locale) => {
  return dictionaries[locale]();
};
