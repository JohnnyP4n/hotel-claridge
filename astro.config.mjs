// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Spaties behandelen zoals in gewone HTML. De standaardinstelling ('jsx') laat een
  // spatie wegvallen als een regel eindigt vlak voor een tag, bv. "dagelijks\n<strong>".
  compressHTML: true,
});
