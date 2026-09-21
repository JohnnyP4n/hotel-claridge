// Welke nachten het hotel volgeboekt is. Het kassasysteem kent die (het planbord), de
// website niet: een klein script bij Supabase stuurt de lijst elk uur hierheen, en de
// kalender op /boeking/ sluit die nachten dan af. Er gaan enkel datums over de lijn —
// geen namen, geen aantallen, niets over wie er logeert.
//
// Twee vangrails, allebei bewust aan de kant van "liever een aanvraag te veel":
//
//   1. Wordt er een tijd niets meer doorgestuurd (script stuk, Supabase onbereikbaar),
//      dan geeft dit bestand niets meer door en staat de kalender weer helemaal open.
//   2. De periodes die het hotel zelf instelde op /admin/ blijven volledig los hiervan
//      bestaan; deze lijst vervangt ze nooit.
import { reply } from './antwoord.js';
import { zelfdeTekst } from './geheim.js';

/** Sleutel in KV, los van de instellingen van de adminpagina */
export const KV_SLEUTEL = 'beschikbaarheid';

/** Ruim een jaar vooruit; meer nachten hoeft een aanvraagformulier niet te kennen */
const MAX_NACHTEN = 400;

/** Is de lijst ouder dan dit, dan gebruiken we ze niet meer (zie vangrail 1) */
const HOUDBAAR_MS = 6 * 60 * 60 * 1000;

// Behandelt PUT /beschikbaarheid. Geeft null terug als dit pad niet voor deze module is.
// Let op: dit is de enige ingang die niet uit een browser komt maar van het script bij
// Supabase. Er is dus geen Origin om op te controleren; de geheime sleutel doet dat werk.
export async function handleBeschikbaarheid(request, env, pad) {
    if (pad !== '/beschikbaarheid') return null;
    if (request.method !== 'PUT') {
        return reply(405, { success: false, message: 'Enkel PUT' });
    }
    return bewaar(request, env);
}

/**
 * De volgeboekte nachten als aaneengesloten periodes, klaar voor de kalender:
 * { periodes: [{ van, tot }], bijgewerkt }. Null zolang er niets (recents) doorgestuurd is.
 */
export async function volgeboektePeriodes(env) {
    const bewaard = await env.INSTELLINGEN.get(KV_SLEUTEL, { type: 'json' });
    if (!bewaard?.bijgewerkt || !Array.isArray(bewaard.nachten)) return null;

    // Te oud: dan weten we niet of het nog klopt, en zwijgen we erover.
    if (Date.now() - Date.parse(bewaard.bijgewerkt) > HOUDBAAR_MS) return null;

    // Voorbije nachten mogen weg: de kalender begint toch pas vandaag.
    const vanaf = vandaag();
    const nachten = bewaard.nachten.filter((nacht) => nacht >= vanaf);

    // Ook een lege lijst gaat mee: dan sluit de kalender niets af, maar ziet de
    // adminpagina wel dat de koppeling nog loopt.
    return { periodes: periodes(nachten), bijgewerkt: bewaard.bijgewerkt };
}

// De lijst van het kassasysteem opslaan. Enkel met de gedeelde sleutel.
async function bewaar(request, env) {
    if (!env.SYNC_SLEUTEL) {
        console.error('SYNC_SLEUTEL ontbreekt: npx wrangler secret put SYNC_SLEUTEL');
        return reply(503, { success: false, message: 'Koppeling staat nog niet klaar' });
    }

    const gekregen = (request.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
    if (!(await zelfdeTekst(gekregen, env.SYNC_SLEUTEL))) {
        return reply(401, { success: false, message: 'Verkeerde sleutel' });
    }

    let ingevuld;
    try {
        ingevuld = await request.json();
    } catch {
        return reply(400, { success: false, message: 'Ongeldige aanvraag' });
    }

    const nachten = controleer(ingevuld?.volgeboekt);
    if (nachten === null) {
        return reply(400, { success: false, message: 'Ongeldige lijst met nachten' });
    }

    const bijgewerkt = new Date().toISOString();
    await env.INSTELLINGEN.put(KV_SLEUTEL, JSON.stringify({ nachten, bijgewerkt }));
    return reply(200, { success: true, nachten: nachten.length, bijgewerkt });
}

// Enkel echte datums, zonder dubbels en op volgorde. Een lege lijst is geldig: dat
// betekent gewoon dat er geen enkele nacht volgeboekt is.
function controleer(lijst) {
    if (!Array.isArray(lijst) || lijst.length > MAX_NACHTEN) return null;

    const nachten = new Set();
    for (const waarde of lijst) {
        const nacht = datum(waarde);
        if (!nacht) return null;
        nachten.add(nacht);
    }
    return [...nachten].sort();
}

// Opeenvolgende nachten worden één periode: 10, 11 en 12 juli → van 10 tot 12 juli.
// De kalender leest dat als "deze nachten kunnen niet"; vertrekken op de eerste dag van
// een periode mag wel, want die nacht slaapt de gast er niet meer.
function periodes(nachten) {
    const lijst = [];
    for (const nacht of nachten) {
        const laatste = lijst[lijst.length - 1];
        if (laatste && nacht === volgendeDag(laatste.tot)) laatste.tot = nacht;
        else lijst.push({ van: nacht, tot: nacht });
    }
    return lijst;
}

function volgendeDag(iso) {
    const dag = new Date(`${iso}T00:00:00Z`);
    dag.setUTCDate(dag.getUTCDate() + 1);
    return dag.toISOString().slice(0, 10);
}

// Vandaag in Belgische tijd: een worker draait in UTC, en dat is 's nachts nog gisteren.
function vandaag() {
    return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Brussels' }).format(new Date());
}

// JJJJ-MM-DD, en dan ook een dag die echt bestaat (geen 31 februari)
function datum(waarde) {
    if (typeof waarde !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(waarde)) return null;
    const [jaar, maand, dag] = waarde.split('-').map(Number);
    const gelezen = new Date(Date.UTC(jaar, maand - 1, dag));
    return gelezen.getUTCDate() === dag && gelezen.getUTCMonth() === maand - 1 ? waarde : null;
}
