// Zet het basispad van de site voor een link. Op hotel-claridge.be is dat de wortel (/),
// maar staat de site ooit in een submap, dan kloppen alle links nog.
// Voor een link naar een pagina gebruik je localePath() uit src/i18n: die zet er ook de
// taalmap voor, bv. localePath('fr', '/kamers/'). withBase() zelf is voor bestanden
// zonder taal, bv. het favicon.
export function withBase(path: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path}`;
}
