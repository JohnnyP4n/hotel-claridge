import type { ImageMetadata } from 'astro';
import type { Translation } from '../i18n';
import roomBath from '../assets/images/kamermetbad.jpeg';
import roomTwin from '../assets/images/kamertwin.jpeg';
import roomShower from '../assets/images/kamermetdouche.jpeg';
import roomFamily from '../assets/images/familiekamer.jpeg';

// De namen en beschrijvingen van de kamers staan bij de teksten in src/i18n (rooms.items),
// zodat ze ook in het Frans, Engels en Duits bestaan. Hier staat enkel wat in elke taal
// hetzelfde is: de prijs, de foto en de bedden.
export interface Room {
  /** Anker op de kamerpagina (/kamers/#type-a) én sleutel van de teksten in src/i18n */
  id: keyof Translation['rooms']['items'];
  /** Waarde in het aanvraagformulier en in de e-mail die het hotel ontvangt */
  code: string;
  /** Toont de code apart naast de naam; bij de familiekamer is de code zelf de naam */
  showCode?: boolean;
  /** Iconen vóór de bedtekst; standaard één tweepersoonsbed */
  bedIcons?: ('double' | 'twin')[];
  /** Prijs per kamer per nacht in euro, ontbijt inbegrepen */
  price: { low: number; high: number };
  image: ImageMetadata;
}

export const rooms: Room[] = [
  {
    id: 'type-a',
    code: 'Type A',
    showCode: true,
    price: { low: 110, high: 120 },
    image: roomBath,
  },
  {
    id: 'type-b',
    code: 'Type B',
    showCode: true,
    bedIcons: ['twin'],
    price: { low: 110, high: 120 },
    image: roomTwin,
  },
  {
    id: 'type-c',
    code: 'Type C',
    showCode: true,
    price: { low: 90, high: 100 },
    image: roomShower,
  },
  {
    id: 'familiekamer',
    code: 'Familiekamer',
    bedIcons: ['double', 'twin'],
    price: { low: 200, high: 230 },
    image: roomFamily,
  },
];

// Prijs per nacht in euro; null = gratis. De omschrijvingen staan in src/i18n (rates.extraBeds.items).
export const extraBeds: { id: keyof Translation['rates']['extraBeds']['items']; price: number | null }[] = [
  { id: 'none', price: null },
  { id: 'cot', price: 20 },
  { id: 'child', price: 30 },
  { id: 'single', price: 40 },
];
