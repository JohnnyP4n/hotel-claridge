// Ontvangt een verblijfsaanvraag van het formulier op /boeking/, controleert ze met
// Cloudflare Turnstile tegen spambots, mailt ze naar het hotel en stuurt de gast een
// bevestiging, via de eigen mailbox bij Combell. Instellingen staan in wrangler.jsonc,
// wachtwoorden als geheim bij Cloudflare (zie README.md in deze map).
import { WorkerMailer } from 'worker-mailer';
import { bewaardeInstellingen } from './instellingen.js';
import { reply } from './antwoord.js';

const MAX_BODY_LENGTH = 10_000;
const MAX_NIGHTS = 60;
const MAX_GUESTS = 10;

// Onderaan de bevestiging aan de gast (zelfde gegevens als src/data/hotel.ts)
const HOTEL = {
    name: 'Hotel Claridge',
    phone: '+32 476 68 88 88',
    address: 'de Limburg Stirumstraat 2, 8370 Blankenberge',
};

// De gast krijgt de bevestiging in de taal van de website waarop hij het formulier invulde
// (het veld "lang", zie src/scripts/boeking.js). De mail naar het hotel blijft Nederlands,
// met de taal van de gast erbij.
const LANGUAGES = {
    nl: {
        name: 'Nederlands',
        dateLocale: 'nl-BE',
        subject: (dates) => `Uw aanvraag bij ${HOTEL.name} (${dates})`,
        greeting: (name) => `Beste ${name},`,
        thanks: `Bedankt voor uw aanvraag bij ${HOTEL.name}. We hebben ze goed ontvangen.`,
        notConfirmed:
            'Dit is nog geen bevestiging van uw reservatie. We controleren de beschikbaarheid en nemen zo snel mogelijk contact met u op.',
        heading: 'Uw aanvraag',
        checkin: 'Aankomst',
        checkout: 'Vertrek',
        nights: 'Aantal nachten',
        guests: 'Aantal personen',
        room: 'Kamertype',
        questions: `Vragen of iets wijzigen? Beantwoord deze e-mail of bel ons op ${HOTEL.phone}.`,
        regards: 'Met vriendelijke groeten,',
    },
    fr: {
        name: 'Frans',
        dateLocale: 'fr-BE',
        subject: (dates) => `Votre demande à l’${HOTEL.name} (${dates})`,
        greeting: (name) => `Bonjour ${name},`,
        thanks: `Merci pour votre demande à l’${HOTEL.name}. Nous l’avons bien reçue.`,
        notConfirmed:
            'Ceci n’est pas encore une confirmation de votre réservation. Nous vérifions les disponibilités et vous recontactons dans les plus brefs délais.',
        heading: 'Votre demande',
        checkin: 'Arrivée',
        checkout: 'Départ',
        nights: 'Nombre de nuits',
        guests: 'Nombre de personnes',
        room: 'Type de chambre',
        questions: `Une question ou un changement ? Répondez à cet e-mail ou appelez-nous au ${HOTEL.phone}.`,
        regards: 'Cordialement,',
    },
    en: {
        name: 'Engels',
        dateLocale: 'en-GB',
        subject: (dates) => `Your request at ${HOTEL.name} (${dates})`,
        greeting: (name) => `Dear ${name},`,
        thanks: `Thank you for your request at ${HOTEL.name}. We have received it.`,
        notConfirmed:
            'This is not yet a confirmation of your reservation. We will check availability and get back to you as soon as possible.',
        heading: 'Your request',
        checkin: 'Arrival',
        checkout: 'Departure',
        nights: 'Number of nights',
        guests: 'Number of people',
        room: 'Room type',
        questions: `Questions or changes? Reply to this e-mail or call us on ${HOTEL.phone}.`,
        regards: 'Kind regards,',
    },
    de: {
        name: 'Duits',
        dateLocale: 'de-DE',
        subject: (dates) => `Ihre Anfrage im ${HOTEL.name} (${dates})`,
        greeting: (name) => `Guten Tag ${name},`,
        thanks: `Vielen Dank für Ihre Anfrage im ${HOTEL.name}. Wir haben sie gut erhalten.`,
        notConfirmed:
            'Dies ist noch keine Bestätigung Ihrer Reservierung. Wir prüfen die Verfügbarkeit und melden uns so schnell wie möglich bei Ihnen.',
        heading: 'Ihre Anfrage',
        checkin: 'Anreise',
        checkout: 'Abreise',
        nights: 'Anzahl Nächte',
        guests: 'Anzahl Personen',
        room: 'Zimmertyp',
        questions: `Fragen oder Änderungen? Antworten Sie auf diese E-Mail oder rufen Sie uns an unter ${HOTEL.phone}.`,
        regards: 'Mit freundlichen Grüßen,',
    },
};

// Onbekende of ontbrekende taal: dan het Nederlands
function language(code) {
    return LANGUAGES[code] ?? LANGUAGES.nl;
}

// Behandelt POST / : de aanvraag uit het formulier op /boeking/
export async function handleAanvraag(request, env, cors) {
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

    if (await isGesloten(env, booking)) {
        return reply(409, { success: false, message: 'Die datums zijn niet beschikbaar' }, cors);
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
}

// Ligt er een nacht van dit verblijf in een periode die het hotel via /admin/ afsloot
// (gesloten of volgeboekt)? De kalender op /boeking/ laat die dagen al niet kiezen; dit is
// dezelfde controle aan deze kant, want een POST komt niet per se van dat formulier.
async function isGesloten(env, booking) {
    let sluitingen;
    try {
        sluitingen = (await bewaardeInstellingen(env)).sluitingen ?? [];
    } catch (e) {
        // Liever een aanvraag te veel dan een gast die niets kan versturen
        console.error('Instellingen niet gelezen:', e);
        return false;
    }

    // Een periode sluit nachten af. De laatste nacht van het verblijf is de dag voor het
    // vertrek: wie vertrekt op de eerste gesloten dag, slaapt er die nacht niet meer.
    const laatsteNacht = new Date(booking.checkout.getTime() - 24 * 60 * 60 * 1000);

    return sluitingen.some((sluiting) => {
        const van = parseDate(String(sluiting?.van ?? ''));
        const tot = parseDate(String(sluiting?.tot ?? ''));
        return van && tot && van <= laatsteNacht && tot >= booking.checkin;
    });
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
        // Taal van de website waarop de gast het formulier invulde (nl, fr, en of de)
        lang: line(input.lang, 5),
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

// bv. "za 26 september 2026", in de taal van de mail
function formatDate(date, dateLocale) {
    return date.toLocaleDateString(dateLocale, {
        weekday: 'short',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
    });
}

// bv. "26/09", kort genoeg voor de onderwerpregel
function formatShortDate(date, dateLocale) {
    return date.toLocaleDateString(dateLocale, { day: '2-digit', month: '2-digit', timeZone: 'UTC' });
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
    const guestLanguage = language(booking.lang);
    const dates = `${formatShortDate(booking.checkin, 'nl-BE')} - ${formatShortDate(booking.checkout, 'nl-BE')}`;

    const text = [
        'Nieuwe verblijfsaanvraag via de website',
        '',
        `Naam: ${booking.name}`,
        `E-mail: ${booking.email}`,
        `Gsm-nummer: ${booking.phone || '-'}`,
        `Taal van de gast: ${guestLanguage.name}`,
        '',
        `Aankomst: ${formatDate(booking.checkin, 'nl-BE')}`,
        `Vertrek: ${formatDate(booking.checkout, 'nl-BE')}`,
        `Aantal nachten: ${booking.nights}`,
        `Aantal personen: ${booking.guests}`,
        `Kamertype: ${booking.room}`,
        '',
        'Opmerkingen:',
        booking.remarks || '-',
        '',
        '--',
        'Klik op "Beantwoorden" om de gast rechtstreeks te antwoorden.',
        `De gast kreeg automatisch een bevestiging dat de aanvraag ontvangen is, in het ${guestLanguage.name}.`,
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

// De bevestiging aan de gast, in de taal van de website waarop hij het formulier invulde.
// De opmerkingen staan hier bewust niet in: anders kan iemand via het formulier
// eigen tekst laten mailen naar een vreemd adres, met het hotel als afzender
function guestMail(env, booking) {
    const text = language(booking.lang);
    const dates = `${formatShortDate(booking.checkin, text.dateLocale)} - ${formatShortDate(booking.checkout, text.dateLocale)}`;

    const body = [
        text.greeting(booking.name),
        '',
        text.thanks,
        '',
        text.notConfirmed,
        '',
        text.heading,
        `${text.checkin}: ${formatDate(booking.checkin, text.dateLocale)}`,
        `${text.checkout}: ${formatDate(booking.checkout, text.dateLocale)}`,
        `${text.nights}: ${booking.nights}`,
        `${text.guests}: ${booking.guests}`,
        `${text.room}: ${booking.roomName || booking.room}`,
        '',
        text.questions,
        '',
        text.regards,
        HOTEL.name,
        HOTEL.address,
    ].join('\n');

    return {
        from: { name: HOTEL.name, email: env.SMTP_USER },
        to: booking.email,
        reply: env.REPLY_TO,
        subject: text.subject(dates),
        text: body,
    };
}
