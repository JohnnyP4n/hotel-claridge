// Bedragen op dezelfde manier tonen bij het bouwen van de site (de .astro-pagina's) en
// achteraf in de browser, als src/scripts/instellingen.js de prijzen van het hotel ophaalt.

/** bv. 110 → "110" en 2,5 → "2,50"; in het Engels "2.50" */
export function bedrag(waarde: number, dateLocale: string) {
  return waarde.toLocaleString(dateLocale, {
    minimumFractionDigits: Number.isInteger(waarde) ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

/** bv. "€ 110"; het euroteken staat in elke taal vooraan, zoals in de tarieventabel */
export function euro(waarde: number, dateLocale: string) {
  return `€ ${bedrag(waarde, dateLocale)}`;
}
