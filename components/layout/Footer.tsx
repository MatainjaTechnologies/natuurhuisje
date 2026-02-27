'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Instagram, Facebook, Twitter, Globe, ChevronDown } from 'lucide-react';
import { Logo } from '@/components/Logo';
import type { Locale } from '@/i18n/config';
import { switchLanguage } from '@/lib/navigation';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { getFooterDictionary } from '@/i18n/get-footer-dictionary';

interface FooterProps {
  lang: Locale;
}

export function Footer({ lang }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const [t, setT] = useState<any>(null);

  useEffect(() => {
    const loadTranslations = async () => {
      const translations = await getFooterDictionary(lang);
      setT(translations);
    };
    loadTranslations();
  }, [lang]);

  const languages = [
    { code: 'nl', name: 'Nederlands', flag: '/flags/nl.svg' },
    { code: 'en', name: 'English', flag: '/flags/gb.svg' },
    { code: 'de', name: 'Deutsch', flag: '/flags/de.svg' },
    { code: 'fr', name: 'Français', flag: '/flags/fr.svg' },
  ] as const;

  const currentLanguage = languages.find(l => l.code === lang) || languages[0];

  const handleLanguageChange = (newLocale: Locale) => {
    const newPath = switchLanguage(pathname, newLocale);
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    setShowLanguageDropdown(false);
    window.location.href = newPath;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target as Node)
      ) {
        setShowLanguageDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-14">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <Logo size="md" />
            <p className="mt-4 text-sm text-gray-500 leading-relaxed">
              {t?.description || 'Loading...'}
            </p>
            <div className="flex gap-3 mt-6">
              <Link href="#" className="p-2.5 rounded-xl bg-gray-900 text-white hover:bg-gray-700 transition-colors">
                <Instagram size={16} />
              </Link>
              <Link href="#" className="p-2.5 rounded-xl bg-gray-900 text-white hover:bg-gray-700 transition-colors">
                <Facebook size={16} />
              </Link>
              <Link href="#" className="p-2.5 rounded-xl bg-gray-900 text-white hover:bg-gray-700 transition-colors">
                <Twitter size={16} />
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">{t?.sections.discover}</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href={`/${lang}/search`} className="text-gray-500 hover:text-gray-900 transition-colors">{t?.discover.allStays}</Link></li>
              <li><Link href={`/${lang}/search?type=cabin`} className="text-gray-500 hover:text-gray-900 transition-colors">{t?.discover.cabins}</Link></li>
              <li><Link href={`/${lang}/search?type=treehouse`} className="text-gray-500 hover:text-gray-900 transition-colors">{t?.discover.treehouses}</Link></li>
              <li><Link href={`/${lang}/search?type=glamping`} className="text-gray-500 hover:text-gray-900 transition-colors">{t?.discover.glamping}</Link></li>
              <li><Link href={`/${lang}/search?type=tiny-house`} className="text-gray-500 hover:text-gray-900 transition-colors">{t?.discover.tinyHouses}</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">{t?.sections.host}</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href={`/${lang}/host`} className="text-gray-500 hover:text-gray-900 transition-colors">{t?.host.becomeHost}</Link></li>
              <li><Link href={`/${lang}/host/listings`} className="text-gray-500 hover:text-gray-900 transition-colors">{t?.host.manageListings}</Link></li>
              <li><Link href={`/${lang}/host/bookings`} className="text-gray-500 hover:text-gray-900 transition-colors">{t?.host.viewBookings}</Link></li>
              <li><Link href={`/${lang}/host/insights`} className="text-gray-500 hover:text-gray-900 transition-colors">{t?.host.hostInsights}</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">{t?.sections.support}</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href={`/${lang}/help`} className="text-gray-500 hover:text-gray-900 transition-colors">{t?.support.helpCenter}</Link></li>
              <li><Link href={`/${lang}/privacy`} className="text-gray-500 hover:text-gray-900 transition-colors">{t?.support.privacyPolicy}</Link></li>
              <li><Link href={`/${lang}/terms`} className="text-gray-500 hover:text-gray-900 transition-colors">{t?.support.termsOfService}</Link></li>
              <li><Link href={`/${lang}/contact`} className="text-gray-500 hover:text-gray-900 transition-colors">{t?.support.contactUs}</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-6 text-sm text-gray-400">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <p>&copy; {currentYear} NatureStays. {t?.footer.copyright}</p>
            
            <div className="flex flex-wrap items-center gap-6">
              <Link href={`/${lang}/privacy`} className="hover:text-gray-700 transition-colors">{t?.footer.privacy}</Link>
              <Link href={`/${lang}/terms`} className="hover:text-gray-700 transition-colors">{t?.footer.terms}</Link>
              <Link href={`/${lang}/cookies`} className="hover:text-gray-700 transition-colors">{t?.footer.cookies}</Link>
              
              {/* Language Selector */}
              <div className="relative" ref={languageDropdownRef}>
                <button
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-gray-700"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-sm font-medium">{currentLanguage.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showLanguageDropdown && (
                  <div className="absolute bottom-full mb-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[200px] z-50">
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => handleLanguageChange(language.code as Locale)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors ${
                          language.code === lang ? 'bg-purple-50' : ''
                        }`}
                      >
                        <Image
                          src={language.flag}
                          alt={language.name}
                          width={20}
                          height={15}
                          className="rounded"
                        />
                        <span className={`text-sm ${
                          language.code === lang ? 'font-semibold text-purple-600' : 'text-gray-700'
                        }`}>
                          {language.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
