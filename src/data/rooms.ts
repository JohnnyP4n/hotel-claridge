import type { ImageMetadata } from 'astro';
import roomBath from '../assets/images/kamermetbad.jpeg';
import roomTwin from '../assets/images/kamertwin.jpeg';
import roomShower from '../assets/images/kamermetdouche.jpeg';
import roomFamily from '../assets/images/familiekamer.jpeg';

export interface Room {
  /** Anker op de kamerpagina, bv. /kamers/#type-a */
  id: string;
  /** Waarde in het aanvraagformulier en in de e-mail die het hotel ontvangt */
  code: string;
  name: string;
  summary: string;
  guests: string;
  bed?: string;
  bathroom?: string;
  /** Voorzieningen bovenop wat bij elke kamer inbegrepen is */
  extras: string[];
  note?: string;
  price: { low: number; high: number };
  image: ImageMetadata;
  imageAlt: string;
}

// Inbegrepen bij elke kamer
export const includedInEveryRoom = ['Ontbijt', 'Tv', 'Gratis wifi', 'Haardroger'];

export const rooms: Room[] = [
  {
    id: 'type-a',
    code: 'Type A',
    name: 'Comfortkamer met bad',
    summary: 'Comfortkamer met bad/toilet en een tweepersoonsbed.',
    guests: '2 personen, extra bed mogelijk',
    bed: 'Tweepersoonsbed',
    bathroom: 'Bad en toilet',
    extras: ['Minibar / frigo', 'Waterkoker'],
    price: { low: 110, high: 120 },
    image: roomBath,
    imageAlt: 'Comfortkamer met bad',
  },
  {
    id: 'type-b',
    code: 'Type B',
    name: 'Comfortkamer met twee bedden',
    summary: 'Comfortkamer met douche/toilet en twee aparte bedden.',
    guests: '2 personen, extra bed mogelijk',
    bed: 'Twee aparte bedden',
    bathroom: 'Douche en toilet',
    extras: ['Minibar / frigo', 'Waterkoker'],
    price: { low: 110, high: 120 },
    image: roomTwin,
    imageAlt: 'Comfortkamer met douche en twee aparte bedden',
  },
  {
    id: 'type-c',
    code: 'Type C',
    name: 'Standaardkamer',
    summary: 'Kleine kamer met douche/toilet en een tweepersoonsbed.',
    guests: '2 personen',
    bed: 'Tweepersoonsbed',
    bathroom: 'Douche en toilet',
    extras: [],
    note: 'Geen extra bed mogelijk',
    price: { low: 90, high: 100 },
    image: roomShower,
    imageAlt: 'Standaardkamer met douche',
  },
  {
    id: 'familiekamer',
    code: 'Familiekamer',
    name: 'Familiekamer',
    summary: 'Ruimte voor 4 personen, met extra comfort.',
    guests: '4 personen',
    extras: ['Minibar / frigo', 'Waterkoker'],
    price: { low: 200, high: 230 },
    image: roomFamily,
    imageAlt: 'Familiekamer',
  },
];

// Prijs per nacht in euro; null = gratis
export const extraBeds: { label: string; price: number | null }[] = [
  { label: 'Geen extra bed (0 - 2 jaar)', price: null },
  { label: 'Babybedje (0 - 2 jaar)', price: 20 },
  { label: 'Kinderbed (3 - 12 jaar)', price: 30 },
  { label: 'Eenpersoonsbed (vanaf 12 jaar)', price: 40 },
];

export const touristTax = '€ 2,50 per persoon per nacht (niet inbegrepen)';
