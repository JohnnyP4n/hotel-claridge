// Ontvangt een verblijfsaanvraag van het formulier op /boeking/, controleert ze met
// Cloudflare Turnstile tegen spambots, mailt ze naar het hotel en stuurt de gast een
// bevestiging, via de eigen mailbox bij Combell. Instellingen staan in wrangler.jsonc,
// wachtwoorden als geheim bij Cloudflare (zie README.md in deze map).
import { WorkerMailer } from 'worker-mailer';

const MAX_BODY_LENGTH = 10_000;
const MAX_NIGHTS = 60;
const MAX_GUESTS = 10;

// Onderaan de bevestiging aan de gast (zelfde gegevens als src/data/hotel.ts)
const HOTEL = {
    name: 'Hotel Claridge',
    phone: '+32 476 68 88 88',
    address: 'de Limburg Stirumstraat 2, 8370 Blankenberge',
};

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
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            Vary: 'Origin',
        };

        if (request.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers: cors });
        }
        if (request.method !== 'POST') {
            return reply(405, { success: false, message: 'Enkel POST' }, cors);
        }

        const body = await request.text();
        let input;
        try {
            if (body.length > MAX_BODY_LENGTH) throw new Error('te groot');
            input = JSON.parse(body);
        } catch {
            return reply(400, { success: false, message: 'Ongeldige aanvraag' }, cors);
        }

        // Spamval: bots krijgen "gelukt" te zien, maar er vertrekt geen mail
        if (input.botcheck) {
            return reply(200, { success: true }, cors);
        }

        const { request: booking, error } = validate(input);
        if (error) {
            return reply(400, { success: false, message: error }, cors);
        }

        const human = await verifyTurnstile(env, input.turnstileToken, request.headers.get('CF-Connecting-IP'));
        if (!human) {
            return reply(403, { success: false, message: 'Spamcontrole mislukt' }, cors);
        }

        try {
            await sendMails(env, booking);
        } catch (e) {
            console.error('Mail niet verstuurd:', e);
            return reply(502, { success: false, message: 'Mail niet verstuurd' }, cors);
        }

        return reply(200, { success: true }, cors);
    },
};

function reply(status, data, headers = {}) {
    return Response.json(data, { status, headers });
}

// Vraagt Cloudflare of de Turnstile-controle in het formulier geslaagd is.
// Een token is 5 minuten geldig en kan maar één keer gecontroleerd worden.
async function verifyTurnstile(env, token, ip) {
    if (typeof token !== 'string' || !token || token.length > 2048) return false;

    const form = new FormData();
    form.append('secret', env.TURNSTILE_SECRET);
    form.append('response', token);
    if (ip) form.append('remoteip', ip);

    try {
        const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            body: form,
        });
        const result = await response.json();
        if (!result.success) console.warn('Turnstile geweigerd:', result['error-codes']);
        return result.success === true;
    } catch (e) {
        console.error('Turnstile niet bereikbaar:', e);
        return false;
    }
}

// Eén regel tekst: geen regeleinden (die zouden in de mailheaders kunnen belanden)
function line(value, maxLength) {
    return String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

// JJJJ-MM-DD naar een datum, of null als het geen bestaande datum is
function parseDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.getUTCDate() === day ? date : null;
}

function validate(input) {
    const booking = {
        name: line(input.name, 100),
        email: line(input.email, 200),
        phone: line(input.phone, 40),
        room: line(input.room, 60),
        // bv. "Type A - Comfortkamer met bad", voor de gast duidelijker dan enkel "Type A"
        roomName: line(input.roomName, 100),
        guests: Number(input.guests),
        remarks: String(input.remarks ?? '').trim().slice(0, 2000),
        checkin: parseDate(input.checkin),
        checkout: parseDate(input.checkout),
    };

    if (!booking.name) return { error: 'Naam ontbreekt' };
    // Geen tekens die in een mailheader iets betekenen, zoals < > " , ;
    if (!/^[^\s@<>"(),;:]+@[^\s@<>"(),;:]+\.[^\s@<>"(),;:]+$/.test(booking.email)) {
        return { error: 'Ongeldig e-mailadres' };
    }
    if (!booking.room) return { error: 'Kamertype ontbreekt' };
    if (!Number.isInteger(booking.guests) || booking.guests < 1 || booking.guests > MAX_GUESTS) {
        return { error: 'Ongeldig aantal personen' };
    }
    if (!booking.checkin || !booking.checkout) return { error: 'Ongeldige datum' };

    // Een dag speling voor tijdzones: in België kan het al morgen zijn
    const yesterday = Date.now() - 24 * 60 * 60 * 1000;
    if (booking.checkin.getTime() < yesterday) return { error: 'Aankomstdatum ligt in het verleden' };

    booking.nights = Math.round((booking.checkout - booking.checkin) / (24 * 60 * 60 * 1000));
    if (booking.nights < 1 || booking.nights > MAX_NIGHTS) return { error: 'Ongeldige vertrekdatum' };

    return { request: booking };
}

// bv. "za 26 september 2026"
function formatDate(date) {
    return date.toLocaleDateString('nl-BE', {
        weekday: 'short',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
    });
}

// bv. "26/09", kort genoeg voor de onderwerpregel
function formatShortDate(date) {
    return date.toLocaleDateString('nl-BE', { day: '2-digit', month: '2-digit', timeZone: 'UTC' });
}

// Verstuurt de aanvraag naar het hotel en een bevestiging naar de gast, over één verbinding
async function sendMails(env, booking) {
    const port = Number(env.SMTP_PORT);
    const mailer = await WorkerMailer.connect({
        host: env.SMTP_HOST,
        port,
        // Poort 465 is meteen versleuteld; op andere poorten schakelt STARTTLS de versleuteling in
        secure: port === 465,
        credentials: { username: env.SMTP_USER, password: env.SMTP_PASSWORD },
        authType: ['plain', 'login'],
    });

    try {
        await mailer.send(hotelMail(env, booking));

        // Het hotel heeft de aanvraag; lukt de bevestiging niet (bv. een tikfout in het
        // adres van de gast), dan krijgt de gast toch "gelukt" te zien
        try {
            await mailer.send(guestMail(env, booking));
        } catch (e) {
            console.error('Bevestiging aan gast niet verstuurd:', e);
        }
    } finally {
        await mailer.close();
    }
}

function hotelMail(env, booking) {
    const dates = `${formatShortDate(booking.checkin)} - ${formatShortDate(booking.checkout)}`;

    const text = [
        'Nieuwe verblijfsaanvraag via de website',
        '',
        `Naam: ${booking.name}`,
        `E-mail: ${booking.email}`,
        `Gsm-nummer: ${booking.phone || '-'}`,
        '',
        `Aankomst: ${formatDate(booking.checkin)}`,
        `Vertrek: ${formatDate(booking.checkout)}`,
        `Aantal nachten: ${booking.nights}`,
        `Aantal personen: ${booking.guests}`,
        `Kamertype: ${booking.room}`,
        '',
        'Opmerkingen:',
        booking.remarks || '-',
        '',
        '--',
        'Klik op "Beantwoorden" om de gast rechtstreeks te antwoorden.',
        'De gast kreeg automatisch een bevestiging dat de aanvraag ontvangen is.',
    ].join('\n');

    return {
        from: { name: 'Website Hotel Claridge', email: env.SMTP_USER },
        to: env.MAIL_TO,
        // Enkel het adres: een naam met accenten of aanhalingstekens verminkt deze header
        reply: booking.email,
        subject: `Verblijfsaanvraag ${booking.name}, ${booking.room} (${dates})`,
        text,
    };
}

// De opmerkingen staan hier bewust niet in: anders kan iemand via het formulier
// eigen tekst laten mailen naar een vreemd adres, met het hotel als afzender
function guestMail(env, booking) {
    const dates = `${formatShortDate(booking.checkin)} - ${formatShortDate(booking.checkout)}`;

    const text = [
        `Beste ${booking.name},`,
        '',
        `Bedankt voor uw aanvraag bij ${HOTEL.name}. We hebben ze goed ontvangen.`,
        '',
        'Dit is nog geen bevestiging van uw reservatie. We controleren de beschikbaarheid en nemen zo snel mogelijk contact met u op.',
        '',
        'Uw aanvraag',
        `Aankomst: ${formatDate(booking.checkin)}`,
        `Vertrek: ${formatDate(booking.checkout)}`,
        `Aantal nachten: ${booking.nights}`,
        `Aantal personen: ${booking.guests}`,
        `Kamertype: ${booking.roomName || booking.room}`,
        '',
        `Vragen of iets wijzigen? Beantwoord deze e-mail of bel ons op ${HOTEL.phone}.`,
        '',
        'Met vriendelijke groeten,',
        HOTEL.name,
        HOTEL.address,
    ].join('\n');

    return {
        from: { name: HOTEL.name, email: env.SMTP_USER },
        to: booking.email,
        reply: env.REPLY_TO,
        subject: `Uw aanvraag bij ${HOTEL.name} (${dates})`,
        text,
    };
}
