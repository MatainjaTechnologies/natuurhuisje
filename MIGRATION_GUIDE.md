# Migration Guide: Adding i18n to Your Project

This guide explains the changes made to implement internationalization (i18n) with URL-based language routing.

## What Changed

### 1. URL Structure
**Before:**
```
/
/search
/stay/cabin-123
/account
```

**After:**
```
/{lang}
/{lang}/search
/{lang}/stay/cabin-123
/{lang}/account
```

All routes now include a language prefix (en, nl, de, fr).

### 2. File Structure Changes

#### New Files Created:
```
i18n/
├── config.ts                    # Language configuration
├── get-dictionary.ts            # Server-side translation loader
└── dictionaries/
    ├── en.json                 # English translations
    ├── nl.json                 # Dutch translations
    ├── de.json                 # German translations
    └── fr.json                 # French translations

middleware.ts                    # Language detection & redirection
lib/navigation.ts                # Client-side navigation utilities

app/[lang]/                      # New language-based routing
├── layout.tsx                   # Updated root layout
├── page.tsx                     # Updated homepage
├── search/page.tsx
├── stay/[slug]/page.tsx
├── login/page.tsx
├── register/page.tsx
├── account/page.tsx
└── host/page.tsx
```

#### Modified Files:
- `components/layout/Header.tsx` - Now accepts `lang` prop
- `components/layout/Footer.tsx` - Now accepts `lang` prop
- `components/ListingCard.tsx` - Now accepts `lang` prop for links

### 3. Old Files to Remove (After Migration)

Once you've verified everything works, you can remove:
```
app/layout.tsx          → Replaced by app/[lang]/layout.tsx
app/page.tsx            → Replaced by app/[lang]/page.tsx
app/search/             → Replaced by app/[lang]/search/
app/stay/               → Replaced by app/[lang]/stay/
app/login/              → Replaced by app/[lang]/login/
app/register/           → Replaced by app/[lang]/register/
app/account/            → Replaced by app/[lang]/account/
app/host/               → Replaced by app/[lang]/host/
```

**Important:** Keep these directories:
- `app/api/` - API routes are not affected by language routing
- `app/auth/` - Auth callbacks remain unchanged
- `app/actions/` - Server actions remain unchanged

## How to Migrate Existing Pages

### For Server Components:

**Before:**
```tsx
export default function MyPage() {
  return <h1>Welcome</h1>;
}
```

**After:**
```tsx
import { getDictionary } from '@/i18n/get-dictionary';
import type { Locale } from '@/i18n/config';

export default async function MyPage({ params }: { params: { lang: Locale } }) {
  const dict = await getDictionary(params.lang);
  
  return <h1>{dict.home.hero.title}</h1>;
}
```

### For Client Components:

**Before:**
```tsx
'use client';
import Link from 'next/link';

export function MyComponent() {
  return <Link href="/search">Search</Link>;
}
```

**After:**
```tsx
'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import type { Locale } from '@/i18n/config';

export function MyComponent() {
  const params = useParams();
  const lang = params.lang as Locale;
  
  return <Link href={`/${lang}/search`}>Search</Link>;
}
```

### Using Navigation Utilities:

**Recommended approach:**
```tsx
'use client';
import { useLanguage, useLocalizedRouter } from '@/lib/navigation';

export function MyComponent() {
  const lang = useLanguage();
  const router = useLocalizedRouter();
  
  // Automatically adds language prefix
  const handleClick = () => {
    router.push('/search'); // Goes to /{lang}/search
  };
  
  return <button onClick={handleClick}>Search</button>;
}
```

## Updating Links

All internal links must include the language prefix:

**Before:**
```tsx
<Link href="/search">Search</Link>
<Link href="/stay/cabin-123">View Cabin</Link>
```

**After:**
```tsx
<Link href={`/${lang}/search`}>Search</Link>
<Link href={`/${lang}/stay/cabin-123`}>View Cabin</Link>
```

## Testing the Migration

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Test language detection:**
   - Visit `http://localhost:3000/` - Should redirect to `/en` (or your browser's language)
   - Visit `http://localhost:3000/nl` - Should show Dutch version
   - Visit `http://localhost:3000/de` - Should show German version
   - Visit `http://localhost:3000/fr` - Should show French version

3. **Test language switching:**
   - Use the language selector in the header
   - Verify you stay on the same page but in a different language

4. **Test old URLs:**
   - Visit `http://localhost:3000/search` - Should redirect to `/en/search`
   - Verify all old URLs redirect properly

## Common Issues & Solutions

### Issue: "Cannot find module '@/i18n/config'"
**Solution:** Make sure you've created all files in the `i18n/` directory.

### Issue: Links not working
**Solution:** Ensure all `<Link>` components include the `/${lang}` prefix.

### Issue: Language not persisting
**Solution:** Check that the middleware is properly setting the `NEXT_LOCALE` cookie.

### Issue: API routes returning 404
**Solution:** API routes should NOT include language prefix. They remain at `/api/*`.

## Rollback Plan

If you need to rollback:

1. Delete the `app/[lang]/` directory
2. Delete `middleware.ts`
3. Delete `i18n/` directory
4. Delete `lib/navigation.ts`
5. Restore the original `app/layout.tsx` and `app/page.tsx`
6. Revert changes to Header, Footer, and ListingCard components

## Next Steps

1. **Add more translations:** Update the JSON files in `i18n/dictionaries/`
2. **Translate existing content:** Replace hardcoded strings with translation keys
3. **Add language-specific metadata:** Update SEO tags per language
4. **Test thoroughly:** Verify all pages work in all languages
5. **Update documentation:** Document any custom translation needs

## Support

For questions or issues:
- Review `I18N_SETUP.md` for detailed usage instructions
- Check the example pages in `app/[lang]/`
- Refer to Next.js i18n documentation: https://nextjs.org/docs/app/building-your-application/routing/internationalization
