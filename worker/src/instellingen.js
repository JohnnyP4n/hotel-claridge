// Bewaart de instellingen die het hotel zelf aanpast via de adminpagina (/admin/ op de
// site): de prijzen, de sluitingsperiodes en of de 3 + 1 actie getoond wordt. Ze staan in
// Cloudflare KV, zodat een wijziging meteen zichtbaar is zonder de site opnieuw te bouwen.
//
// De site zelf leest ze met GET /instellingen. Staat er niets in KV (of is Cloudflare even
// onbereikbaar), dan blijven de prijzen staan die bij het bouwen in de pagina's zaten:
// die uit src/data/rooms.ts. Wat hier bewaard wordt, zijn dus enkel de afwijkingen.
import { reply } from './antwoord.js';

/** Sleutel waaronder alles als één JSON-tekst in KV staat */
const KV_SLEUTEL = 'instellingen';

/** Een aanmelding blijft 12 uur geldig; daarna vraagt de adminpagina het wachtwoord opnieuw */
const GELDIGHEID_MS = 12 * 60 * 60 * 1000;

const MAX_SLUITINGEN = 12;
const MAX_TEKST = 200;
/** Hoogste prijs die aanvaard wordt, tegen een tikfout van een nul te veel */
const MAX_PRIJS = 5000;

// Behandelt alles onder /instellingen en /admin. Geeft null terug als dit pad niet voor
// deze module is, zodat index.js zelf "niet gevonden" kan antwoorden.
export async function handleInstellingen(request, env, cors, pad) {
    if (pad === '/instellingen' && request.method === 'GET') {
        return lees(env, cors);
    }
    if (pad === '/admin/aanmelden' && request.method === 'POST') {
        return aanmelden(request, env, cors);
    }
    if (pad === '/admin/instellingen' && request.method === 'PUT') {
        return bewaar(request, env, cors);
    }
    return null;
}

// De instellingen zoals ze nu zijn. Nog nooit iets bewaard: dan een leeg object, en
// gebruikt de site de prijzen waarmee ze gebouwd is.
async function lees(env, cors) {
    const bewaard = await env.INSTELLINGEN.get(KV_SLEUTEL);

    return new Response(bewaard ?? '{}', {
        headers: {
            'Content-Type': 'application/json',
            // Een minuut in de browser: een aanpassing is dus hooguit een minuut later
            // overal zichtbaar, en het script wordt niet bij elke klik opnieuw bevraagd
            'Cache-Control': 'max-age=60',
            ...cors,
        },
    });
}

// Wachtwoord controleren en een sleutel teruggeven waarmee de adminpagina mag opslaan
async function aanmelden(request, env, cors) {
    if (!env.ADMIN_WACHTWOORD) {
        console.error('ADMIN_WACHTWOORD ontbreekt: npx wrangler secret put ADMIN_WACHTWOORD');
        return reply(503, { success: false, message: 'Adminpagina staat nog niet klaar' }, cors);
    }

    let ingevuld = '';
    try {
        const body = await request.json();
        ingevuld = String(body.wachtwoord ?? '');
    } catch {
        return reply(400, { success: false, message: 'Ongeldige aanvraag' }, cors);
    }

    if (!(await zelfdeTekst(ingevuld, env.ADMIN_WACHTWOORD))) {
        // Even wachten, zodat wachtwoorden raden niet duizenden keren per minuut lukt
        await new Promise((klaar) => setTimeout(klaar, 1000));
        return reply(401, { success: false, message: 'Verkeerd wachtwoord' }, cors);
    }

    const geldigTot = Date.now() + GELDIGHEID_MS;
    return reply(200, { success: true, sleutel: await maakSleutel(env, geldigTot), geldigTot }, cors);
}

// Nieuwe instellingen opslaan. Enkel met een geldige sleutel uit aanmelden().
async function bewaar(request, env, cors) {
    const sleutel = (request.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
    if (!(await sleutelKlopt(env, sleutel))) {
        return reply(401, { success: false, message: 'Meld u opnieuw aan' }, cors);
    }

    let ingevuld;
    try {
        ingevuld = await request.json();
    } catch {
        return reply(400, { success: false, message: 'Ongeldige aanvraag' }, cors);
    }

    const { instellingen, fout } = controleer(ingevuld);
    if (fout) {
        return reply(400, { success: false, message: fout }, cors);
    }

    await env.INSTELLINGEN.put(KV_SLEUTEL, JSON.stringify(instellingen));
    return reply(200, { success: true, instellingen }, cors);
}


/* ================================
   Nakijken wat er binnenkomt
================================= */

// Alles wat bewaard wordt, wordt hier eerst opnieuw opgebouwd: wat niet in dit model
// past, raakt niet in KV. De namen van de kamers en de bedden staan bewust niet vast in
// dit script, zodat een nieuwe kamer in src/data/rooms.ts hier niets hoeft te veranderen.
function controleer(ingevuld) {
    if (!ingevuld || typeof ingevuld !== 'object') return { fout: 'Ongeldige aanvraag' };

    const kamers = {};
    for (const [id, prijzen] of paren(ingevuld.kamers)) {
        const laag = prijs(prijzen?.laag);
        const hoog = prijs(prijzen?.hoog);
        if (laag === null || hoog === null) return { fout: `Ongeldige prijs bij ${id}` };
        kamers[id] = { laag, hoog };
    }

    const extraBedden = {};
    for (const [id, bedrag] of paren(ingevuld.extraBedden)) {
        const waarde = prijs(bedrag);
        if (waarde === null) return { fout: `Ongeldige prijs bij ${id}` };
        extraBedden[id] = waarde;
    }

    const toeristenbelasting = prijs(ingevuld.toeristenbelasting);
    if (toeristenbelasting === null) return { fout: 'Ongeldige toeristenbelasting' };

    const sluitingen = [];
    const lijst = Array.isArray(ingevuld.sluitingen) ? ingevuld.sluitingen.slice(0, MAX_SLUITINGEN) : [];
    for (const sluiting of lijst) {
        const van = datum(sluiting?.van);
        const tot = datum(sluiting?.tot);
        if (!van || !tot) return { fout: 'Ongeldige datum bij een sluitingsperiode' };
        if (tot < van) return { fout: 'Een sluitingsperiode eindigt voor ze begint' };
        sluitingen.push({
            van,
            tot,
            actief: sluiting.actief !== false,
            tekst: String(sluiting?.tekst ?? '').replace(/\s+/g, ' ').trim().slice(0, MAX_TEKST),
        });
    }

    return {
        instellingen: {
            kamers,
            extraBedden,
            toeristenbelasting,
            promo3plus1: ingevuld.promo3plus1 !== false,
            sluitingen,
            bijgewerkt: new Date().toISOString(),
        },
    };
}

// De sleutel-waardeparen van een object, met enkel sleutels zoals "type-a" of "cot"
function paren(waarde) {
    if (!waarde || typeof waarde !== 'object') return [];
    return Object.entries(waarde).filter(([id]) => /^[a-z0-9-]{1,40}$/.test(id));
}

// Een prijs in euro, afgerond op de cent; null als het geen bruikbaar bedrag is
function prijs(waarde) {
    const getal = Number(waarde);
    if (!Number.isFinite(getal) || getal < 0 || getal > MAX_PRIJS) return null;
    return Math.round(getal * 100) / 100;
}

// JJJJ-MM-DD, en dan ook een dag die echt bestaat (geen 31 februari)
function datum(waarde) {
    if (typeof waarde !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(waarde)) return null;
    const [jaar, maand, dag] = waarde.split('-').map(Number);
    const gelezen = new Date(Date.UTC(jaar, maand - 1, dag));
    return gelezen.getUTCDate() === dag && gelezen.getUTCMonth() === maand - 1 ? waarde : null;
}


/* ================================
   Aanmelden
================================= */

// De sleutel is de vervaldatum met een handtekening erachter. De handtekening wordt
// gemaakt met het adminwachtwoord, dat enkel als geheim bij Cloudflare staat: zonder dat
// wachtwoord kan niemand zelf een geldige sleutel maken. Wordt het wachtwoord gewijzigd,
// dan vervallen de bestaande sleutels vanzelf.
async function maakSleutel(env, geldigTot) {
    return `${geldigTot}.${await handtekening(env.ADMIN_WACHTWOORD, String(geldigTot))}`;
}

async function sleutelKlopt(env, sleutel) {
    if (!env.ADMIN_WACHTWOORD || typeof sleutel !== 'string') return false;

    const [geldigTot, gekregen] = sleutel.split('.');
    if (!/^\d{1,15}$/.test(geldigTot ?? '') || Number(geldigTot) < Date.now()) return false;

    const verwacht = await handtekening(env.ADMIN_WACHTWOORD, geldigTot);
    return zelfdeTekst(gekregen ?? '', verwacht);
}

async function handtekening(geheim, tekst) {
    const sleutel = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(geheim),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign'],
    );
    const ondertekend = await crypto.subtle.sign('HMAC', sleutel, new TextEncoder().encode(tekst));
    return [...new Uint8Array(ondertekend)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

// Vergelijkt twee teksten zonder dat de duur van de vergelijking verraadt hoeveel tekens
// al kloppen. Eerst versleuteld samenvatten, zodat de vergelijking altijd 32 bytes lang is.
async function zelfdeTekst(a, b) {
    const encoder = new TextEncoder();
    const [eerste, tweede] = await Promise.all([
        crypto.subtle.digest('SHA-256', encoder.encode(a)),
        crypto.subtle.digest('SHA-256', encoder.encode(b)),
    ]);
    return crypto.subtle.timingSafeEqual(eerste, tweede);
}
