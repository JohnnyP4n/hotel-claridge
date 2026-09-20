// De beheerpagina op /admin/ (zie src/pages/admin.astro): de prijzen, de 3 + 1 actie en de
// periodes waarin het hotel niet beschikbaar is. Meldt aan bij het script in de map worker/,
// toont wat daar bewaard is en stuurt de wijzigingen terug. Zolang er nog niets bewaard is,
// staan de waarden uit src/data/ in het formulier.

const hoofd = document.querySelector('main');
/** Het script bij Cloudflare; de adressen eronder zijn /admin/aanmelden en /admin/instellingen */
const adres = hoofd.dataset.url;
const standaard = JSON.parse(document.getElementById('standaard-instellingen').textContent);

const aanmeldformulier = document.getElementById('aanmeldformulier');
const aanmeldfout = document.getElementById('aanmeldfout');
const beheerformulier = document.getElementById('beheerformulier');
const promo = document.getElementById('promo');
const periodes = document.getElementById('periodes');
const geenPeriodes = document.getElementById('geen-periodes');
const sjabloon = document.getElementById('periode-sjabloon');
const opslaanKnop = document.getElementById('opslaan');
const statusregel = document.getElementById('status');

/** De aanmelding blijft in dit tabblad staan; een nieuw venster vraagt opnieuw het wachtwoord */
const BEWAARPLAATS = 'claridge-beheer';
let sleutel = bewaardeSleutel();
/** Staat er al iets ingevuld? Dan mag een nieuwe aanmelding het niet overschrijven */
let gevuld = false;

start();

function start() {
    aanmeldformulier.addEventListener('submit', aanmelden);
    beheerformulier.addEventListener('submit', opslaan);
    document.getElementById('periode-toevoegen').addEventListener('click', () => voegPeriodeToe());
    document.getElementById('terugzetten').addEventListener('click', zetPrijzenTerug);
    document.getElementById('afmelden').addEventListener('click', () => afmelden());

    if (sleutel) {
        toonBeheer();
        laad();
    } else {
        document.getElementById('wachtwoord').focus();
    }
}


/* ================================
   Aanmelden en afmelden
================================= */

async function aanmelden(gebeurtenis) {
    gebeurtenis.preventDefault();
    const knop = aanmeldformulier.querySelector('button');
    const wachtwoord = document.getElementById('wachtwoord').value;

    knop.disabled = true;
    aanmeldfout.hidden = true;

    try {
        const antwoord = await fetch(`${adres}/admin/aanmelden`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ wachtwoord }),
        });
        const resultaat = await antwoord.json();
        if (!antwoord.ok || !resultaat.success) throw new Error(resultaat.message ?? 'Aanmelden mislukt');

        sleutel = resultaat.sleutel;
        try {
            sessionStorage.setItem(BEWAARPLAATS, sleutel);
        } catch {
            // Bewaren kan uitstaan in de browser; aanmelden werkt dan enkel voor deze pagina
        }

        document.getElementById('wachtwoord').value = '';
        toonBeheer();

        // Meldde het hotel zich opnieuw aan omdat de aanmelding verliep tijdens het
        // werken, dan blijft staan wat het intussen invulde
        if (gevuld) {
            meld('Opnieuw aangemeld. Klik op Opslaan om uw wijzigingen te bewaren.');
        } else {
            laad();
        }
    } catch (fout) {
        aanmeldfout.textContent = fout.message;
        aanmeldfout.hidden = false;
    } finally {
        knop.disabled = false;
    }
}

function bewaardeSleutel() {
    try {
        return sessionStorage.getItem(BEWAARPLAATS);
    } catch {
        return null;
    }
}

function afmelden(reden = '') {
    sleutel = null;
    try {
        sessionStorage.removeItem(BEWAARPLAATS);
    } catch {
        // niets te wissen
    }

    beheerformulier.hidden = true;
    aanmeldformulier.hidden = false;
    aanmeldfout.textContent = reden;
    aanmeldfout.hidden = !reden;
    document.getElementById('wachtwoord').focus();
}

function toonBeheer() {
    aanmeldformulier.hidden = true;
    beheerformulier.hidden = false;
}


/* ================================
   Ophalen en bewaren
================================= */

async function laad() {
    meld('Bezig met ophalen...');

    try {
        // Zonder tussenkopie van de browser: anders staat er een minuut lang de oude versie
        const antwoord = await fetch(`${adres}/instellingen`, { cache: 'no-store' });
        if (!antwoord.ok) throw new Error(`status ${antwoord.status}`);

        const bewaard = await antwoord.json();
        vul(samen(bewaard));
        meld(bewaard.bijgewerkt ? `Laatst bewaard op ${tijdstip(bewaard.bijgewerkt)}.` : 'Nog niets bewaard.');
    } catch (fout) {
        vul(standaard);
        meld(`Ophalen mislukt (${fout.message}). Het formulier toont de standaardwaarden.`, 'mislukt');
    }
}

async function opslaan(gebeurtenis) {
    gebeurtenis.preventDefault();

    const fout = controleerPeriodes();
    if (fout) {
        meld(fout, 'mislukt');
        return;
    }

    opslaanKnop.disabled = true;
    meld('Bezig met opslaan...');

    try {
        const antwoord = await fetch(`${adres}/admin/instellingen`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sleutel}` },
            body: JSON.stringify(lees()),
        });

        if (antwoord.status === 401) {
            afmelden('Uw aanmelding is verlopen. Meld u opnieuw aan; uw wijzigingen zijn nog niet bewaard.');
            return;
        }

        const resultaat = await antwoord.json();
        if (!antwoord.ok || !resultaat.success) throw new Error(resultaat.message ?? 'Opslaan mislukt');

        vul(samen(resultaat.instellingen));
        meld('Opgeslagen. De site toont de wijziging binnen de minuut.', 'gelukt');
    } catch (fout) {
        meld(`Opslaan mislukt: ${fout.message}`, 'mislukt');
    } finally {
        opslaanKnop.disabled = false;
    }
}

// Wat bewaard is, over de standaardwaarden heen: een kamer of bed waarvoor nog nooit een
// prijs bewaard werd, houdt zo de prijs waarmee de site gebouwd is.
function samen(bewaard) {
    return {
        ...standaard,
        ...bewaard,
        kamers: { ...standaard.kamers, ...(bewaard.kamers ?? {}) },
        extraBedden: { ...standaard.extraBedden, ...(bewaard.extraBedden ?? {}) },
        sluitingen: bewaard.sluitingen ?? [],
    };
}

function meld(tekst, soort = '') {
    statusregel.textContent = tekst;
    statusregel.className = `admin-status ${soort}`;
}

// bv. "20 september 2026 om 19:30"
function tijdstip(waarde) {
    const moment = new Date(waarde);
    if (Number.isNaN(moment.getTime())) return waarde;

    const datum = moment.toLocaleDateString('nl-BE', { day: 'numeric', month: 'long', year: 'numeric' });
    const uur = moment.toLocaleTimeString('nl-BE', { hour: '2-digit', minute: '2-digit' });
    return `${datum} om ${uur}`;
}


/* ================================
   Het formulier vullen en uitlezen
================================= */

function vul(instellingen) {
    gevuld = true;

    for (const invoer of beheerformulier.querySelectorAll('[data-prijs]')) {
        const waarde = waardeVan(instellingen, invoer.dataset.prijs);
        invoer.value = typeof waarde === 'number' ? waarde : '';
    }

    promo.checked = instellingen.promo3plus1 !== false;

    periodes.replaceChildren();
    for (const sluiting of instellingen.sluitingen ?? []) {
        voegPeriodeToe(sluiting);
    }
    toonLeegmelding();
}

function lees() {
    const instellingen = { kamers: {}, extraBedden: {}, promo3plus1: promo.checked, sluitingen: [] };

    for (const invoer of beheerformulier.querySelectorAll('[data-prijs]')) {
        zetWaarde(instellingen, invoer.dataset.prijs, Number(invoer.value));
    }

    for (const periode of periodes.children) {
        instellingen.sluitingen.push({
            van: veld(periode, 'van').value,
            tot: veld(periode, 'tot').value,
            reden: veld(periode, 'reden').value,
            tekst: veld(periode, 'tekst').value,
            actief: veld(periode, 'actief').checked,
        });
    }

    return instellingen;
}

// bv. "kamers.type-a.laag" → instellingen.kamers['type-a'].laag
function waardeVan(instellingen, pad) {
    return pad.split('.').reduce((deel, sleutel) => (deel == null ? undefined : deel[sleutel]), instellingen);
}

function zetWaarde(doel, pad, waarde) {
    const delen = pad.split('.');
    const laatste = delen.pop();
    let plek = doel;
    for (const deel of delen) {
        plek[deel] ??= {};
        plek = plek[deel];
    }
    plek[laatste] = waarde;
}

// Zet enkel de bedragen terug zoals ze in src/data/ staan; opslaan doet het hotel zelf
function zetPrijzenTerug() {
    for (const invoer of beheerformulier.querySelectorAll('[data-prijs]')) {
        const waarde = waardeVan(standaard, invoer.dataset.prijs);
        if (typeof waarde === 'number') invoer.value = waarde;
    }
    meld('Standaardprijzen ingevuld. Klik op Opslaan om ze op de site te zetten.');
}


/* ================================
   Periodes waarin het hotel niet beschikbaar is
================================= */

function voegPeriodeToe(sluiting = { van: '', tot: '', reden: 'gesloten', tekst: '', actief: true }) {
    const periode = sjabloon.content.firstElementChild.cloneNode(true);

    veld(periode, 'van').value = sluiting.van ?? '';
    veld(periode, 'tot').value = sluiting.tot ?? '';
    // Periodes van voor de reden erbij kwam, waren allemaal sluitingen
    veld(periode, 'reden').value = sluiting.reden === 'volgeboekt' ? 'volgeboekt' : 'gesloten';
    veld(periode, 'tekst').value = sluiting.tekst ?? '';
    veld(periode, 'actief').checked = sluiting.actief !== false;

    periode.querySelector('[data-verwijder]').addEventListener('click', () => {
        periode.remove();
        toonLeegmelding();
    });

    periodes.append(periode);
    toonLeegmelding();
}

function veld(periode, naam) {
    return periode.querySelector(`[data-veld="${naam}"]`);
}

function toonLeegmelding() {
    geenPeriodes.hidden = periodes.children.length > 0;
}

// De browser let al op lege of onbestaande datums; hier enkel de volgorde
function controleerPeriodes() {
    for (const periode of periodes.children) {
        if (veld(periode, 'tot').value < veld(periode, 'van').value) {
            veld(periode, 'tot').focus();
            return 'Een periode eindigt voor ze begint. Kijk de datums na.';
        }
    }
    return '';
}
