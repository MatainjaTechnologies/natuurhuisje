export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'nl', 'de', 'fr'],
} as const;

export type Locale = (typeof i18n)['locales'][number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  nl: 'Nederlands',
  de: 'Deutsch',
  fr: 'Français',
};

export const localeFlags: Record<Locale, string> = {
  en: '/flags/gb.svg',
  nl: '/flags/nl.svg',
  de: '/flags/de.svg',
  fr: '/flags/fr.svg',
};
