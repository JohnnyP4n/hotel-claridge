// Wat het hotel zelf kan aanpassen via de adminpagina (/admin/): de prijzen, de periodes
// waarin het niet beschikbaar is, en of de 3 + 1 actie getoond wordt.
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

/** Waarom het hotel in die periode geen gasten kan ontvangen */
export type Reden = 'gesloten' | 'volgeboekt';

/**
 * Eén periode waarin het hotel niet beschikbaar is; de datums zijn JJJJ-MM-DD, tot en met.
 * Die nachten zijn niet meer te kiezen in het aanvraagformulier op /boeking/.
 */
export interface Sluiting {
  van: string;
  tot: string;
  reden: Reden;
  /** Toont de melding bovenaan de site; de datums zijn hoe dan ook niet aan te vragen */
  actief: boolean;
  /** Vrije regel onder de melding, bv. "Aanvragen blijven welkom"; mag leeg zijn */
  tekst: string;
}

/**
 * De nachten die het kassasysteem als volgeboekt doorgaf, samengevat in periodes
 * (JJJJ-MM-DD, tot en met). Dit deel wordt NIET op /admin/ ingesteld en ook niet
 * bewaard vanuit de adminpagina: het script bij Cloudflare voegt het toe aan het
 * antwoord van GET /instellingen, en enkel als de lijst recent genoeg is.
 *
 * De kalender op /boeking/ sluit die nachten af; er komt geen melding bovenaan.
 */
export interface Volgeboekt {
  periodes: { van: string; tot: string }[];
  /** Wanneer het kassasysteem de lijst laatst doorstuurde (ISO-tijdstempel) */
  bijgewerkt: string;
}

export interface Instellingen {
  /** Prijs per kamer per nacht, per kamer-id uit src/data/rooms.ts */
  kamers: Record<string, { laag: number; hoog: number }>;
  /** Prijs per nacht van een extra bed, per bed-id uit src/data/rooms.ts */
  extraBedden: Record<string, number>;
  toeristenbelasting: number;
  /** Toont het actieblok "3 + 1 nacht gratis" op de tarievenpagina */
  promo3plus1: boolean;
  /** Periodes waarin er geen gasten kunnen; heet historisch "sluitingen" */
  sluitingen: Sluiting[];
  /** Wanneer het hotel de instellingen laatst bewaarde; ontbreekt bij de standaard */
  bijgewerkt?: string;
  /** Automatisch uit het kassasysteem; nooit ingesteld of bewaard via /admin/ */
  volgeboekt?: Volgeboekt;
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
