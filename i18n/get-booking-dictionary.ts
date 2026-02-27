import type { Locale } from './config';

const dictionaries = {
  en: () => import('./dictionaries/en/booking.json').then((module) => module.default),
  nl: () => import('./dictionaries/nl/booking.json').then((module) => module.default),
  de: () => import('./dictionaries/de/booking.json').then((module) => module.default),
  fr: () => import('./dictionaries/fr/booking.json').then((module) => module.default),
};

export const getBookingDictionary = async (locale: Locale) => {
  return dictionaries[locale]();
};
