// De site staat in vier talen online. Het Nederlands staat op de gewone adressen
// (/kamers/), de andere talen onder een taalmap (/fr/kamers/, /en/kamers/, /de/kamers/).
// De teksten zelf staan in nl.ts, fr.ts, en.ts en de.ts.
import { withBase } from '../utils/paths';
import type { Translation } from './types';
import { de } from './de';
import { en } from './en';
import { fr } from './fr';
import { nl } from './nl';

export type { Translation };

export const locales = ['nl', 'fr', 'en', 'de'] as const;
export type Locale = (typeof locales)[number];

/** Deze taal staat zonder taalmap in de URL */
export const defaultLocale: Locale = 'nl';

const translations: Record<Locale, Translation> = { nl, fr, en, de };

/** De teksten van één taal, bv. useTranslations('fr').nav.rooms */
export function useTranslations(locale: Locale): Translation {
  return translations[locale];
}

/** Link naar een pagina in een taal, bv. localePath('fr', '/kamers/') → /hotel-claridge/fr/kamers/ */
export function localePath(locale: Locale, path: string) {
  return withBase(locale === defaultLocale ? path : `/${locale}${path}`);
}

// Elke pagina in src/pages/[...lang]/ maakt hiermee één versie per taal aan.
// lang is undefined voor het Nederlands, zodat die pagina zonder taalmap online komt.
export function localeStaticPaths() {
  return locales.map((locale) => ({
    params: { lang: locale === defaultLocale ? undefined : locale },
    props: { locale },
  }));
}

/** Het pad binnen de site, zonder basispad en zonder taalmap, bv. /hotel-claridge/fr/kamers/ → /kamers/ */
function pagePath(pathname: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const segments = (pathname.startsWith(base) ? pathname.slice(base.length) : pathname).split('/');

  // ['', 'fr', 'kamers', ''] → ['', 'kamers', '']
  if (segments[1] !== defaultLocale && locales.includes(segments[1] as Locale)) {
    segments.splice(1, 1);
  }

  return segments.join('/') || '/';
}

/** Dezelfde pagina in elke taal: voor de taalkeuze in het menu en de hreflang-verwijzingen */
export function localeLinks(url: URL) {
  const path = pagePath(url.pathname);

  return locales.map((locale) => ({
    locale,
    name: translations[locale].name,
    href: localePath(locale, path),
  }));
}
