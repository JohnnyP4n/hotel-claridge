import { localePath, useTranslations, type Locale } from '../i18n';

const address = {
  street: 'de Limburg Stirumstraat 2',
  postalCode: '8370',
  city: 'Blankenberge',
};

// Gegevens van het hotel die op meerdere pagina's terugkomen (footer, contact, boeking)
export const hotel = {
  name: 'Hotel Claridge',
  address,
  // Opent Google Maps (op een gsm de Maps-app) met het hotel als zoekresultaat
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `Hotel Claridge, ${address.street}, ${address.postalCode} ${address.city}`,
  )}`,
  // Enkel het gsm-nummer wordt gebruikt (geen vast nummer meer)
  mobile: { label: '+32 476 68 88 88', href: 'tel:+32476688888' },
  emails: ['info@hotel-claridge.be', 'hotelclaridge@msn.com'],
  bookingUrl: 'https://www.booking.com/hotel/be/claridge.nl.html',
  mapEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4402.822345914325!2d3.1224820735192624!3d51.3121768219327!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c359d06ad375ab%3A0xd74044230ed0ef0!2sHotel%20Claridge!5e0!3m2!1snl!2sbe!4v1745256436132!5m2!1snl!2sbe',
};

// Het menu in de gevraagde taal; de adressen krijgen de taalmap mee (bv. /fr/kamers/)
export function mainNav(locale: Locale) {
  const t = useTranslations(locale);

  return [
    { href: localePath(locale, '/'), label: t.nav.home },
    { href: localePath(locale, '/kamers/'), label: t.nav.rooms },
    { href: localePath(locale, '/tarieven/'), label: t.nav.rates },
    { href: localePath(locale, '/contact/'), label: t.nav.contact },
  ];
}

export function bookingPath(locale: Locale) {
  return localePath(locale, '/boeking/');
}
