import { useParams, usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import type { Locale } from '@/i18n/config';

export function useLanguage() {
  const params = useParams();
  return (params?.lang as Locale) || 'en';
}

export function useLocalizedRouter() {
  const router = useRouter();
  const lang = useLanguage();

  return {
    push: (href: string) => {
      const localizedHref = href.startsWith('/') && !href.startsWith(`/${lang}`) 
        ? `/${lang}${href}` 
        : href;
      router.push(localizedHref);
    },
    replace: (href: string) => {
      const localizedHref = href.startsWith('/') && !href.startsWith(`/${lang}`) 
        ? `/${lang}${href}` 
        : href;
      router.replace(localizedHref);
    },
    back: () => router.back(),
    forward: () => router.forward(),
    refresh: () => router.refresh(),
  };
}

export function getLocalizedPath(path: string, lang: Locale): string {
  if (path.startsWith('/') && !path.startsWith(`/${lang}`)) {
    return `/${lang}${path}`;
  }
  return path;
}

export function switchLanguage(currentPath: string, newLang: Locale): string {
  const pathWithoutLang = currentPath.replace(/^\/[a-z]{2}(\/|$)/, '/');
  return `/${newLang}${pathWithoutLang === '/' ? '' : pathWithoutLang}`;
}
