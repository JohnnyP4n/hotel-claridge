import type { nl } from './nl';

// De vorm van een vertaling: precies dezelfde sleutels als in nl.ts.
// Ontbreekt er iets in fr.ts, en.ts of de.ts, dan geeft de editor een foutmelding.
export type Translation = typeof nl;
