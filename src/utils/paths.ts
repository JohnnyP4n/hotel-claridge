// Zet het basispad van de site (bv. /hotel-claridge op GitHub Pages) voor een interne link.
// Gebruik dit voor elke link naar een eigen pagina of bestand, bv. withBase('/kamers/').
export function withBase(path: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path}`;
}
