# Internationalization (i18n) Setup

This project now supports multiple languages with URL-based routing: **English (en)**, **Nederlands (nl)**, **Deutsch (de)**, and **Français (fr)**.

## URL Structure

All routes now follow this pattern:
```
/{language}/{path}
```

Examples:
- `/en` - English homepage
- `/nl/search` - Dutch search page
- `/de/stay/cabin-123` - German listing detail page
- `/fr/account` - French account page

## Default Language

The default language is **English (en)**. When users visit the root URL (`/`), they will be redirected to their preferred language based on:

1. Language in the URL path
2. `NEXT_LOCALE` cookie (if set)
3. Browser's `Accept-Language` header
4. Default to English if none of the above match

## File Structure

```
i18n/
├── config.ts                 # i18n configuration
├── get-dictionary.ts         # Server-side dictionary loader
└── dictionaries/
    ├── en.json              # English translations
    ├── nl.json              # Dutch translations
    ├── de.json              # German translations
    └── fr.json              # French translations

app/
└── [lang]/                  # Language-based routing
    ├── layout.tsx           # Root layout with language support
    ├── page.tsx             # Homepage
    ├── search/
    ├── stay/
    ├── account/
    └── ...

middleware.ts                # Language detection and redirection
lib/
└── navigation.ts            # Client-side navigation utilities
```

## Adding Translations

### 1. Server Components

For server components, use the `getDictionary` function:

```tsx
import { getDictionary } from '@/i18n/get-dictionary';
import type { Locale } from '@/i18n/config';

export default async function MyPage({ params }: { params: { lang: Locale } }) {
  const dict = await getDictionary(params.lang);
  
  return (
    <div>
      <h1>{dict.home.hero.title}</h1>
    </div>
  );
}
```

### 2. Client Components

For client components, you'll need to pass translations as props or use the language from the URL:

```tsx
'use client';

import { useParams } from 'next/navigation';
import type { Locale } from '@/i18n/config';

export function MyComponent() {
  const params = useParams();
  const lang = params.lang as Locale;
  
  // Use lang for language-aware navigation
  return <Link href={`/${lang}/search`}>Search</Link>;
}
```

### 3. Using Navigation Utilities

```tsx
'use client';

import { useLanguage, useLocalizedRouter } from '@/lib/navigation';

export function MyComponent() {
  const lang = useLanguage();
  const router = useLocalizedRouter();
  
  // Automatically adds language prefix
  router.push('/search');  // Goes to /{lang}/search
  
  return <div>Current language: {lang}</div>;
}
```

## Language Switching

The language switcher in the Header component allows users to change languages. When a user switches languages, they are redirected to the same page in the new language.

```tsx
import { switchLanguage } from '@/lib/navigation';

const newPath = switchLanguage(currentPath, newLang);
router.push(newPath);
```

## Adding New Languages

1. Add the language code to `i18n/config.ts`:
```typescript
export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'nl', 'de', 'fr', 'es'], // Add 'es' for Spanish
} as const;
```

2. Create a new dictionary file `i18n/dictionaries/es.json` with all translations

3. Add the language to the `dictionaries` object in `i18n/get-dictionary.ts`:
```typescript
const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  nl: () => import('./dictionaries/nl.json').then((module) => module.default),
  de: () => import('./dictionaries/de.json').then((module) => module.default),
  fr: () => import('./dictionaries/fr.json').then((module) => module.default),
  es: () => import('./dictionaries/es.json').then((module) => module.default),
};
```

4. Add the language name and flag to `i18n/config.ts`:
```typescript
export const localeNames: Record<Locale, string> = {
  en: 'English',
  nl: 'Nederlands',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
};

export const localeFlags: Record<Locale, string> = {
  en: '/flags/gb.svg',
  nl: '/flags/nl.svg',
  de: '/flags/de.svg',
  fr: '/flags/fr.svg',
  es: '/flags/es.svg',
};
```

## Translation Keys Structure

The translation files follow this structure:

```json
{
  "header": {
    "banner": { ... },
    "search": { ... },
    "days": { ... }
  },
  "home": {
    "hero": { ... },
    "featured": "...",
    "destinations": "..."
  },
  "footer": { ... },
  "common": { ... }
}
```

## Important Notes

- All internal links must include the language prefix: `/${lang}/path`
- API routes (`/api/*`) are not affected by language routing
- Static files and Next.js internals (`/_next/*`) are excluded from language routing
- The middleware automatically redirects root URL to the appropriate language
- Language preference is stored in a cookie for returning visitors

## Migration from Old Routes

If you have existing routes without language prefixes, the middleware will automatically redirect them to the appropriate language version based on user preferences.

Example:
- `/search` → `/en/search` (or user's preferred language)
- `/stay/cabin-123` → `/nl/stay/cabin-123` (if user prefers Dutch)
