// Ontvangt een verblijfsaanvraag van het formulier op /boeking/ en mailt ze naar het hotel
// via de eigen mailbox bij Combell. Instellingen staan in wrangler.jsonc, het wachtwoord
// als geheim bij Cloudflare (zie README.md in deze map).
import { WorkerMailer } from 'worker-mailer';

const MAX_BODY_LENGTH = 10_000;
const MAX_NIGHTS = 60;
const MAX_GUESTS = 10;

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

        try {
            await sendMail(env, booking);
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

async function sendMail(env, booking) {
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
    ].join('\n');

    const port = Number(env.SMTP_PORT);

    await WorkerMailer.send(
        {
            host: env.SMTP_HOST,
            port,
            // Poort 465 is meteen versleuteld; op andere poorten schakelt STARTTLS de versleuteling in
            secure: port === 465,
            credentials: { username: env.SMTP_USER, password: env.SMTP_PASSWORD },
            authType: ['plain', 'login'],
        },
        {
            from: { name: 'Website Hotel Claridge', email: env.SMTP_USER },
            to: env.MAIL_TO,
            // Enkel het adres: een naam met accenten of aanhalingstekens verminkt deze header
            reply: booking.email,
            subject: `Verblijfsaanvraag ${booking.name}, ${booking.room} (${dates})`,
            text,
        },
    );
}
