// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // De site staat op GitHub Pages onder https://johnnyp4n.github.io/hotel-claridge/.
  // Interne links gebruiken daarom withBase() uit src/utils/paths.ts.
  // Bij een eigen domein (bv. hotel-claridge.be): site aanpassen en base verwijderen.
  site: 'https://johnnyp4n.github.io',
  base: '/hotel-claridge',

  // Spaties behandelen zoals in gewone HTML. De standaardinstelling ('jsx') laat een
  // spatie wegvallen als een regel eindigt vlak voor een tag, bv. "dagelijks\n<strong>".
  compressHTML: true,

  // Lettertypes worden bij het bouwen gedownload en vanaf de eigen site geserveerd
  // (sneller en zonder verzoeken naar Google bij elke bezoeker).
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Cormorant Garamond',
      cssVariable: '--font-serif',
      weights: [500, 600, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Georgia', 'serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'DM Sans',
      cssVariable: '--font-sans',
      weights: [400, 500, 600],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
  ],
});
