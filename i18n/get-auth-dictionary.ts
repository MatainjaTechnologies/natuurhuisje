import type { Locale } from './config';

const dictionaries = {
  en: () => import('./dictionaries/auth/en.json').then((module) => module.default),
  nl: () => import('./dictionaries/auth/nl.json').then((module) => module.default),
  de: () => import('./dictionaries/auth/de.json').then((module) => module.default),
  fr: () => import('./dictionaries/auth/fr.json').then((module) => module.default),
};

export const getAuthDictionary = async (locale: Locale) => {
  return dictionaries[locale]();
};
