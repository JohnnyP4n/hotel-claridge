// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // De site staat op GitHub Pages onder het eigen domein https://hotel-claridge.be.
  // Het bestand public/CNAME houdt dat domein ingesteld bij elke publicatie.
  // De site staat in de wortel van het domein, dus er is geen base meer nodig.
  site: 'https://hotel-claridge.be',

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
