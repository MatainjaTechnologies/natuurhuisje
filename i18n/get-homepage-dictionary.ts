import type { Locale } from './config';

const dictionaries = {
  en: () => import('./dictionaries/homepage/en.json').then((module) => module.default),
  nl: () => import('./dictionaries/homepage/nl.json').then((module) => module.default),
  de: () => import('./dictionaries/homepage/de.json').then((module) => module.default),
  fr: () => import('./dictionaries/homepage/fr.json').then((module) => module.default),
};

export const getHomepageDictionary = async (locale: Locale) => {
  return dictionaries[locale]();
};
