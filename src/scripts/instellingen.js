// Haalt op wat het hotel via /admin/ instelde en past het toe op de pagina: de prijzen, de
// melding bovenaan als het hotel niet beschikbaar is, en of het 3 + 1 actieblok getoond
// wordt. De periodes gaan ook naar de kalender van het aanvraagformulier, die er de dagen
// mee afsluit (src/scripts/datumkiezer.js).
//
// De pagina is ook zonder dit script volledig juist: ze werd gebouwd met de waarden uit
// src/data/. Dit script verandert enkel wat het hotel sindsdien aanpaste. Lukt het ophalen
// niet, dan blijft alles staan zoals het gebouwd is.
import { bedrag, euro } from '../utils/prijs';

const balk = document.getElementById('site-melding');
// De teksten en het adres staan als data-attributen op de balk (zie src/layouts/Layout.astro)
const teksten = balk.dataset;

haalOp();

async function haalOp() {
    try {
        const antwoord = await fetch(teksten.url, { headers: { Accept: 'application/json' } });
        if (!antwoord.ok) throw new Error(`status ${antwoord.status}`);

        const instellingen = await antwoord.json();
        toonPrijzen(instellingen);
        toonPromo(instellingen);
        toonMelding(instellingen);
        meldPeriodes(instellingen);
    } catch (fout) {
        // Niets aan de hand voor de bezoeker: hij ziet de prijzen waarmee de site gebouwd is
        console.warn('Instellingen niet opgehaald:', fout);
    }
}

// bv. "kamers.type-a.laag" → het getal dat daar in de instellingen staat
function waardeVan(instellingen, pad) {
    return pad.split('.').reduce((deel, sleutel) => (deel == null ? undefined : deel[sleutel]), instellingen);
}


/* ================================
   Prijzen
================================= */

// Elk bedrag op de pagina draagt een data-prijs met zijn plaats in de instellingen. Staat
// daar een ander bedrag, dan komt dat in de plaats. Met data-sjabloon zit het bedrag in
// een zin, bv. "€ {bedrag} per persoon per nacht".
function toonPrijzen(instellingen) {
    for (const element of document.querySelectorAll('[data-prijs]')) {
        const waarde = waardeVan(instellingen, element.dataset.prijs);
        if (typeof waarde !== 'number') continue;

        element.textContent = element.dataset.sjabloon
            ? element.dataset.sjabloon.replace('{bedrag}', bedrag(waarde, teksten.locale))
            : euro(waarde, teksten.locale);
    }
}


/* ================================
   3 + 1 actie
================================= */

function toonPromo(instellingen) {
    if (typeof instellingen.promo3plus1 !== 'boolean') return;

    for (const element of document.querySelectorAll('[data-promo="3plus1"]')) {
        element.hidden = !instellingen.promo3plus1;
    }
}


/* ================================
   Periodes doorgeven aan het aanvraagformulier
================================= */

// De kalender op /boeking/ luistert hiernaar en sluit die dagen af. Komt dit bericht er
// niet (geen boekingspagina, of Cloudflare onbereikbaar), dan blijft de kalender gewoon
// open staan en vangt het script bij Cloudflare de aanvraag alsnog op.
function meldPeriodes(instellingen) {
    document.dispatchEvent(
        new CustomEvent('claridge-periodes', { detail: instellingen.sluitingen ?? [] }),
    );
}


/* ================================
   Melding bovenaan
================================= */

function toonMelding(instellingen) {
    const sluitingen = (instellingen.sluitingen ?? []).filter(looptNog);
    if (sluitingen.length === 0) return;

    const container = document.createElement('div');
    container.className = 'container';

    for (const sluiting of sluitingen) {
        container.append(regel(sluiting));
    }

    balk.replaceChildren(container);
    balk.hidden = false;
}

// De melding blijft staan tot en met de laatste dag van de sluiting. Een periode die het
// hotel op "uit" zette, of die voorbij is, verschijnt niet.
function looptNog(sluiting) {
    return sluiting.actief !== false && sluiting.tot >= vandaag();
}

// Vandaag als JJJJ-MM-DD in Belgische tijd (een datum in UTC is 's nachts nog gisteren)
function vandaag() {
    const nu = new Date();
    const maand = String(nu.getMonth() + 1).padStart(2, '0');
    const dagVanMaand = String(nu.getDate()).padStart(2, '0');
    return `${nu.getFullYear()}-${maand}-${dagVanMaand}`;
}

function regel(sluiting) {
    // "Wij zijn gesloten van ... tot en met ..." of "Wij zijn volgeboekt ...", en bij een
    // periode van één dag de kortere zin
    const volgeboekt = sluiting.reden === 'volgeboekt';
    const eenDag = sluiting.van === sluiting.tot;
    const sjabloon = volgeboekt
        ? (eenDag ? teksten.volgeboektEenDag : teksten.volgeboekt)
        : (eenDag ? teksten.geslotenEenDag : teksten.gesloten);

    const zin = sjabloon.replace('{van}', datum(sluiting.van)).replace('{tot}', datum(sluiting.tot));

    const paragraaf = document.createElement('p');
    const vet = document.createElement('strong');
    vet.textContent = zin;
    paragraaf.append(vet);

    // Eigen regel van het hotel, bv. "Aanvragen blijven welkom." Als tekst toevoegen,
    // nooit als HTML: wat in de adminpagina getypt wordt, is gewone tekst.
    if (sluiting.tekst) {
        const extra = document.createElement('span');
        extra.textContent = sluiting.tekst;
        paragraaf.append(' ', extra);
    }

    return paragraaf;
}

// bv. "15 januari"; het jaartal komt erbij zodra de datum in een ander jaar valt
function datum(waarde) {
    const [jaar, maand, dagVanMaand] = waarde.split('-').map(Number);
    const gelezen = new Date(Date.UTC(jaar, maand - 1, dagVanMaand));

    return gelezen.toLocaleDateString(teksten.locale, {
        day: 'numeric',
        month: 'long',
        year: jaar === new Date().getFullYear() ? undefined : 'numeric',
        timeZone: 'UTC',
    });
}
