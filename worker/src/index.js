// Het script bij Cloudflare dat de website van achter de schermen bedient. Dit bestand
// verdeelt de aanvragen; het werk zelf gebeurt in de andere bestanden in deze map:
//
//   POST /                     een verblijfsaanvraag van het formulier op /boeking/
//                              mailen naar het hotel en naar de gast   → aanvraag.js
//   GET  /instellingen         de prijzen en meldingen die het hotel zelf
//                              aanpaste, voor elke pagina van de site   → instellingen.js
//   POST /admin/aanmelden      aanmelden op de adminpagina (/admin/)    → instellingen.js
//   PUT  /admin/instellingen   nieuwe prijzen en meldingen bewaren      → instellingen.js
//
// Instellingen staan in wrangler.jsonc, wachtwoorden als geheim bij Cloudflare
// (zie README.md in deze map).
import { handleAanvraag } from './aanvraag.js';
import { handleInstellingen } from './instellingen.js';
import { reply } from './antwoord.js';

export default {
    async fetch(request, env) {
        const allowedOrigins = env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim());
        const origin = request.headers.get('Origin');

        // Enkel aanvragen vanaf de eigen site aannemen
        if (!allowedOrigins.includes(origin)) {
            return reply(403, { success: false, message: 'Niet toegestaan' });
        }

        const cors = {
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
            // Authorization: de sleutel waarmee de adminpagina mag opslaan
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            Vary: 'Origin',
        };

        if (request.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers: cors });
        }

        // Met of zonder schuine streep op het einde is hetzelfde adres
        const pad = new URL(request.url).pathname.replace(/\/+$/, '') || '/';

        if (pad === '/') {
            if (request.method !== 'POST') {
                return reply(405, { success: false, message: 'Enkel POST' }, cors);
            }
            return handleAanvraag(request, env, cors);
        }

        const antwoord = await handleInstellingen(request, env, cors, pad);
        return antwoord ?? reply(404, { success: false, message: 'Onbekende aanvraag' }, cors);
    },
};
