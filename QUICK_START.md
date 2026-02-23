# Quick Start: Using i18n in Your Project

## Testing the Implementation

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Access your site:**
   - English: `http://localhost:3000/en`
   - Dutch: `http://localhost:3000/nl`
   - German: `http://localhost:3000/de`
   - French: `http://localhost:3000/fr`

3. **Test automatic redirection:**
   - Visit `http://localhost:3000/` - Redirects to your browser's language
   - Visit `http://localhost:3000/search` - Redirects to `/en/search`

## How URLs Work Now

All your routes now follow this pattern:
```
/{language}/{path}
```

Examples:
- Homepage: `/en`, `/nl`, `/de`, `/fr`
- Search: `/en/search`, `/nl/search`, etc.
- Listing: `/en/stay/cabin-123`, `/nl/stay/cabin-123`, etc.
- Account: `/en/account`, `/nl/account`, etc.

## Adding Translations to a Page

### Server Component (Recommended):

```tsx
import { getDictionary } from '@/i18n/get-dictionary';
import type { Locale } from '@/i18n/config';

export default async function MyPage({ params }: { params: { lang: Locale } }) {
  const dict = await getDictionary(params.lang);
  
  return (
    <div>
      <h1>{dict.home.hero.title}</h1>
      <p>{dict.home.hero.subtitle}</p>
    </div>
  );
}
```

### Client Component:

```tsx
'use client';
import { useParams } from 'next/navigation';
import type { Locale } from '@/i18n/config';

export function MyComponent() {
  const params = useParams();
  const lang = params.lang as Locale;
  
  return <div>Current language: {lang}</div>;
}
```

## Creating Links

Always include the language in your links:

```tsx
import Link from 'next/link';
import { useParams } from 'next/navigation';
import type { Locale } from '@/i18n/config';

export function MyComponent() {
  const params = useParams();
  const lang = params.lang as Locale;
  
  return (
    <nav>
      <Link href={`/${lang}/search`}>Search</Link>
      <Link href={`/${lang}/account`}>Account</Link>
    </nav>
  );
}
```

Or use the navigation utility:

```tsx
import { useLanguage, useLocalizedRouter } from '@/lib/navigation';

export function MyComponent() {
  const lang = useLanguage();
  const router = useLocalizedRouter();
  
  return (
    <button onClick={() => router.push('/search')}>
      Search
    </button>
  );
}
```

## Adding New Translations

1. Open the appropriate dictionary file:
   - `i18n/dictionaries/en.json` for English
   - `i18n/dictionaries/nl.json` for Dutch
   - `i18n/dictionaries/de.json` for German
   - `i18n/dictionaries/fr.json` for French

2. Add your translation key:
   ```json
   {
     "mySection": {
       "title": "My Title",
       "description": "My Description"
     }
   }
   ```

3. Use it in your component:
   ```tsx
   const dict = await getDictionary(params.lang);
   <h1>{dict.mySection.title}</h1>
   ```

## Language Switching

The language switcher is already implemented in the Header component. Users can:
1. Click the language dropdown in the header
2. Select their preferred language
3. They'll be redirected to the same page in the new language

## What's Already Translated

The following components have translation support:
- ✅ Header (banner, search, navigation)
- ✅ Footer (links, copyright)
- ✅ Common elements (buttons, labels)

## What You Need to Translate

You'll need to add translations for:
- Page-specific content
- Form labels and validation messages
- Error messages
- Success messages
- Email templates (if any)
- Dynamic content from your database

## Available Languages

- **English (en)** - Default language
- **Nederlands (nl)** - Dutch
- **Deutsch (de)** - German
- **Français (fr)** - French

## Need Help?

- See `I18N_SETUP.md` for detailed documentation
- See `MIGRATION_GUIDE.md` for migration instructions
- Check example pages in `app/[lang]/` directory
