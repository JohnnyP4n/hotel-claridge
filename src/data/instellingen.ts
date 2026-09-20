// Wat het hotel zelf kan aanpassen via de adminpagina (/admin/): de prijzen, de
// sluitingsmeldingen en of de 3 + 1 actie getoond wordt.
//
// De waarden hieronder zijn de standaard: daarmee wordt de site gebouwd, en die staat dus
// meteen in elke pagina. Past het hotel iets aan, dan bewaart het script bij Cloudflare
// enkel de afwijkingen; src/scripts/instellingen.js haalt die op en past ze toe zodra de
// pagina geladen is. Is Cloudflare even onbereikbaar, dan blijft de standaard staan.
import { extraBeds, rooms } from './rooms';

/** Het eigen script bij Cloudflare (map worker/): aanvragen mailen en instellingen bewaren */
export const workerUrl = 'https://hotel-claridge-aanvraag.hotelclaridge.workers.dev';

/** Per persoon per nacht in euro, niet inbegrepen in de kamerprijs */
export const touristTax = 2.5;

/** Eén periode waarin het hotel gesloten is; de datums zijn JJJJ-MM-DD, tot en met */
export interface Sluiting {
  van: string;
  tot: string;
  /** Uit: de periode blijft bewaard, maar de melding verschijnt niet op de site */
  actief: boolean;
  /** Vrije regel onder de melding, bv. "Aanvragen blijven welkom"; mag leeg zijn */
  tekst: string;
}

export interface Instellingen {
  /** Prijs per kamer per nacht, per kamer-id uit src/data/rooms.ts */
  kamers: Record<string, { laag: number; hoog: number }>;
  /** Prijs per nacht van een extra bed, per bed-id uit src/data/rooms.ts */
  extraBedden: Record<string, number>;
  toeristenbelasting: number;
  /** Toont het actieblok "3 + 1 nacht gratis" op de tarievenpagina */
  promo3plus1: boolean;
  sluitingen: Sluiting[];
  /** Wanneer het hotel de instellingen laatst bewaarde; ontbreekt bij de standaard */
  bijgewerkt?: string;
}

/** De instellingen zoals ze in deze map staan: het vertrekpunt van de adminpagina */
export function standaardInstellingen(): Instellingen {
  return {
    kamers: Object.fromEntries(rooms.map((room) => [room.id, { laag: room.price.low, hoog: room.price.high }])),
    // Een bed zonder prijs (het babybedje voor 0 - 2 jaar is gratis) valt hier weg
    extraBedden: Object.fromEntries(
      extraBeds.filter((bed) => bed.price !== null).map((bed) => [bed.id, bed.price as number]),
    ),
    toeristenbelasting: touristTax,
    promo3plus1: true,
    sluitingen: [],
  };
}
