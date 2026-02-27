import type { Locale } from './config';

export async function getHeaderDictionary(locale: Locale) {
  try {
    const dictionary = await import(`./dictionaries/${locale}/header.json`);
    return dictionary.default;
  } catch (error) {
    console.error(`Failed to load header dictionary for locale: ${locale}`, error);
    const fallback = await import('./dictionaries/en/header.json');
    return fallback.default;
  }
}
