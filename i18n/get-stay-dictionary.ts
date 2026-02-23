import type { Locale } from './config';

const dictionaries = {
  en: () => import('./dictionaries/stay/en.json').then((module) => module.default),
  nl: () => import('./dictionaries/stay/nl.json').then((module) => module.default),
  de: () => import('./dictionaries/stay/de.json').then((module) => module.default),
  fr: () => import('./dictionaries/stay/fr.json').then((module) => module.default),
};

export const getStayDictionary = async (locale: Locale) => {
  return dictionaries[locale]();
};
