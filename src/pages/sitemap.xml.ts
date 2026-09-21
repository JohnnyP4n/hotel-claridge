// Sitemap: de lijst met alle adressen van de site, voor Google Search Console.
// Ze komt bij het bouwen als /sitemap.xml online te staan en wordt in public/robots.txt
// vermeld. Bij elke pagina staan ook de andere talen (hreflang), net als in de <head>.
import type { APIRoute } from 'astro';
import { defaultLocale, localePath, locales, type Locale } from '../i18n';

// De pagina's van de site, zonder taalmap. De beheerpagina /admin/ hoort er niet bij.
const pages = ['/', '/kamers/', '/tarieven/', '/contact/', '/boeking/'];

export const GET: APIRoute = ({ site }) => {
  const url = (locale: Locale, path: string) => new URL(localePath(locale, path), site).href;

  const entries = pages.flatMap((path) =>
    locales.map((locale) => {
      const alternates = [
        ...locales.map((other) => ({ hreflang: other, href: url(other, path) })),
        { hreflang: 'x-default', href: url(defaultLocale, path) },
      ];

      return [
        '  <url>',
        `    <loc>${url(locale, path)}</loc>`,
        ...alternates.map(
          (link) =>
            `    <xhtml:link rel="alternate" hreflang="${link.hreflang}" href="${link.href}" />`,
        ),
        '  </url>',
      ].join('\n');
    }),
  );

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...entries,
    '</urlset>',
    '',
  ].join('\n');

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
