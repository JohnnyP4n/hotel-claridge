// De kalender bij het aanvraagformulier (zie src/components/DateRange.astro).
// De gast kan de datum intypen of ze in de kalender aanklikken; allebei houden ze hetzelfde
// bij. Eén kalender bedient de twee velden: wie een aankomstdatum kiest, kiest daarna meteen
// de vertrekdatum. Datums voor vandaag zijn niet te kiezen, en de vertrekdatum ligt altijd
// minstens één nacht na de aankomst. Nachten die het hotel via /admin/ afsloot (gesloten of
// volgeboekt) vallen er ook uit. De gekozen datums komen als JJJJ-MM-DD in de verborgen
// velden checkin en checkout terecht, waar src/scripts/boeking.js ze uitleest.

const dateRange = document.querySelector('[data-date-range]');
const calendar = dateRange.querySelector('.calendar');
const monthSelect = calendar.querySelector('[data-period="month"]');
const yearSelect = calendar.querySelector('[data-period="year"]');
const weekdayRow = calendar.querySelector('.calendar-weekdays');
const dayGrid = calendar.querySelector('.calendar-days');
const hint = calendar.querySelector('.calendar-hint');
const previousMonthButton = calendar.querySelector('[data-step="-1"]');
const nextMonthButton = calendar.querySelector('[data-step="1"]');

const names = ['checkin', 'checkout'];

// Per datumveld het tekstvak, het kadertje eromheen, de kalenderknop, het verborgen veld
// dat meegaat met het formulier, en de foutmelding eronder
const fields = {};
for (const name of names) {
    const input = document.getElementById(`${name}-input`);
    fields[name] = {
        input,
        field: input.closest('.date-field'),
        control: input.closest('.date-control'),
        openButton: dateRange.querySelector(`[data-opens="${name}"]`),
        hidden: document.getElementById(name),
        error: document.getElementById(`${name}-error`),
    };
}

// De teksten staan als data-attributen op de kalender (zie DateRange.astro), zodat dit
// script zelf geen vertalingen bevat: data-locale, data-pattern, data-pick-checkin,
// data-pick-checkout, data-night-one en data-night-many
const texts = dateRange.dataset;

// Het teken tussen dag, maand en jaar: uit "dd-mm-jjjj" komt het streepje, uit
// "jj/mm/aaaa" de schuine streep
const separator = texts.pattern.replace(/[a-z]/gi, '')[0] ?? '-';

// De maand- en dagnamen komen van de browser zelf, in de taal van de pagina
const monthName = new Intl.DateTimeFormat(texts.locale, { month: 'long' });
const weekdayName = new Intl.DateTimeFormat(texts.locale, { weekday: 'short' });
const fullDate = new Intl.DateTimeFormat(texts.locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });


/* ================================
   Rekenen met datums
   Elke datum staat op middernacht, zo zijn twee datums met === te vergelijken
================================= */

function startOfToday() {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
}

function startOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function addMonths(date, months) {
    return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

/** Maandag = 1 ... zondag = 7. getDay() geeft zondag als 0, en hier begint de week op maandag */
function weekday(date) {
    return date.getDay() || 7;
}

/** Twee datums vergelijken; twee lege datums tellen als gelijk */
function sameDay(a, b) {
    if (!a || !b) return a === b;
    return a.getTime() === b.getTime();
}

function countNights(from, to) {
    // Round() vangt de zomer- en winteruurwissel op: die dagen duren 23 of 25 uur
    return Math.round((to - from) / (24 * 60 * 60 * 1000));
}


/* ================================
   Datums lezen en schrijven
================================= */

/** JJJJ-MM-DD, de vorm van de verborgen velden en van het script in worker/ */
function toInputDate(date) {
    const monthNumber = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${monthNumber}-${day}`;
}

function fromInputDate(value) {
    const [year, monthNumber, day] = value.split('-').map(Number);
    return new Date(year, monthNumber - 1, day);
}

/** Zoals de gast ze intypt, bv. 22-09-2026 */
function toTypedDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const monthNumber = String(date.getMonth() + 1).padStart(2, '0');
    return [day, monthNumber, date.getFullYear()].join(separator);
}

/**
 * Zet de scheidingstekens tussen de cijfers terwijl de gast typt: 28092026 wordt 28-09-2026.
 * Tikt de gast zelf een teken (28-9-), dan is dat groepje ook af en wordt het aangevuld.
 */
function groupDigits(value) {
    const groups = [];
    let current = '';

    for (const character of value) {
        const isDigit = character >= '0' && character <= '9';
        if (isDigit) current += character;

        // Dag en maand zijn af na twee cijfers, of zodra de gast zelf een teken tikt
        if (groups.length < 2 && current && (current.length === 2 || !isDigit)) {
            groups.push(current.padStart(2, '0'));
            current = '';
        }
    }

    return [...groups, current.slice(0, 4)].filter(Boolean).join(separator);
}

/**
 * Leest wat de gast intypte. Het scheidingsteken maakt niet uit (22-9-2026, 22/9/26 en
 * 22092026 komen alle drie aan), en een datum die niet bestaat geeft null.
 */
function parseTyped(value) {
    const groups = value.match(/\d+/g) ?? [];
    let day;
    let monthNumber;
    let year;

    if (groups.length === 3) {
        [day, monthNumber, year] = groups.map(Number);
    } else if (groups.length === 1 && groups[0].length === 8) {
        day = Number(groups[0].slice(0, 2));
        monthNumber = Number(groups[0].slice(2, 4));
        year = Number(groups[0].slice(4));
    } else {
        return null;
    }

    if (year < 100) year += 2000;
    const date = new Date(year, monthNumber - 1, day);

    // new Date(2026, 1, 31) schuift door naar 3 maart; zo vallen 31 februari en co. af
    const exists = date.getDate() === day && date.getMonth() === monthNumber - 1 && date.getFullYear() === year;
    return exists ? date : null;
}


/* ================================
   Wat er gekozen is
================================= */

const today = startOfToday();
/**
 * De laatste dag waarvoor een aanvraag kan: het einde van volgend jaar, nu dus
 * 31 december 2027. Alles hieronder rekent hiermee: de kalender laat geen latere dag
 * kiezen, de jaarkeuze stopt hier, en een latere ingetypte datum geeft een foutmelding.
 */
const lastDay = new Date(today.getFullYear() + 1, 11, 31);

let checkin = null;
let checkout = null;
/** 'checkin' of 'checkout': welke van de twee datums een klik in de kalender nu invult */
let mode = 'checkin';
/** Bij welk van de twee velden de kalender openstaat, om de aandacht erheen terug te sturen */
let openedBy = null;
/** Staat de kalender net te sluiten? Dan mag het tekstvak ze niet meteen weer openen */
let closing = false;
/** De getoonde maand */
let month = startOfMonth(today);
/** De dag waar de muis boven zweeft: die toont het verblijf alvast in het groen */
let hovered = null;
/** De dag die de pijltjestoetsen verplaatsen */
let focusDay = today;
/** Periodes waarin het hotel geen gasten kan ontvangen; komt binnen via instellingen.js */
let closedRanges = [];

/** De vroegste dag die voor dit veld te kiezen is: vandaag, of de dag na de aankomst */
function earliestFor(name) {
    return name === 'checkout' && checkin ? addDays(checkin, 1) : today;
}

function earliestDay() {
    return earliestFor(mode);
}

/** Valt deze nacht in een periode die het hotel afsloot? */
function isClosed(date) {
    return closedRanges.some((range) => date >= range.from && date <= range.to);
}

/**
 * De laatste vertrekdatum die na deze aankomst nog kan. Vertrekken op de eerste afgesloten
 * dag mag: die nacht slaapt de gast er niet meer. Verder dan die dag kan niet.
 */
function lastCheckout() {
    let latest = lastDay;
    for (const range of closedRanges) {
        if (range.from > checkin && range.from < latest) latest = range.from;
    }
    return latest;
}

/** Kan deze datum voor dit veld? Zonder aankomst gelden de regels van de aankomst. */
function isAvailableFor(name, date) {
    if (name === 'checkout' && checkin) return date <= lastCheckout();
    return !isClosed(date);
}

/** Houdt een datum binnen wat te kiezen valt */
function clamp(date) {
    if (date < earliestDay()) return earliestDay();
    if (date > lastDay) return lastDay;
    return date;
}

/** Aankomst en vertrek, met de dag onder de muis als voorproefje van het vertrek */
function range() {
    if (mode === 'checkout' && checkin && hovered && hovered > checkin) {
        return [checkin, hovered];
    }
    return [checkin, checkout];
}


/* ================================
   De kalender tekenen
================================= */

function fillWeekdays() {
    const monday = addDays(today, 1 - weekday(today));
    for (let i = 0; i < 7; i++) {
        const cell = document.createElement('span');
        // Het Frans schrijft "lun.", de punt mag weg in een kolomkop
        cell.textContent = weekdayName.format(addDays(monday, i)).replace('.', '');
        weekdayRow.append(cell);
    }
}

/** De maand- en jaarkeuze vullen; welke ervan uitstaan, regelt updatePeriod() */
function fillPeriod() {
    for (let i = 0; i < 12; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = monthName.format(new Date(today.getFullYear(), i, 1));
        monthSelect.append(option);
    }

    for (let year = today.getFullYear(); year <= lastDay.getFullYear(); year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.append(option);
    }
}

/** De maand- en jaarkeuze en de pijlen laten zien waar de getoonde maand staat */
function updatePeriod() {
    const earliest = earliestDay();
    monthSelect.value = month.getMonth();
    yearSelect.value = month.getFullYear();

    for (const option of yearSelect.options) {
        option.disabled = Number(option.value) < earliest.getFullYear();
    }

    // Maanden die dit jaar al voorbij zijn, staan uit
    for (const option of monthSelect.options) {
        const sameYear = month.getFullYear() === earliest.getFullYear();
        option.disabled = sameYear && Number(option.value) < earliest.getMonth();
    }

    previousMonthButton.disabled = month <= startOfMonth(earliest);
    nextMonthButton.disabled = month >= startOfMonth(lastDay);
}

function renderMonth() {
    updatePeriod();

    const days = [];
    // Lege vakjes tot de eerste van de maand, zodat die onder de juiste weekdag staat
    for (let i = 1; i < weekday(month); i++) {
        days.push(document.createElement('span'));
    }

    const lastDayOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    for (let day = 1; day <= lastDayOfMonth; day++) {
        days.push(dayButton(new Date(month.getFullYear(), month.getMonth(), day)));
    }

    // De dagknop die de aandacht heeft, verdwijnt bij het opnieuw tekenen. Valt de aandacht
    // daardoor uit de kalender, dan sluit die vanzelf (zie de focusout onderaan), en dus
    // krijgt een dag van de nieuwe maand ze hieronder terug.
    const hadFocus = dayGrid.contains(document.activeElement);

    dayGrid.replaceChildren(...days);

    // Er moet altijd één dag met de tabtoets te bereiken zijn, ook als de dag van de
    // pijltjestoetsen in een andere maand staat
    if (!dayGrid.querySelector('[tabindex="0"]')) {
        const first = dayGrid.querySelector('.calendar-day:not(:disabled)');
        if (first) first.tabIndex = 0;
    }

    if (hadFocus) {
        const day = dayGrid.querySelector('[tabindex="0"]');
        if (day) {
            focusDay = fromInputDate(day.dataset.date);
            day.focus();
        }
    }

    paintRange();
}

function dayButton(date) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'calendar-day';
    button.textContent = date.getDate();
    button.dataset.date = toInputDate(date);
    button.setAttribute('aria-label', fullDate.format(date));
    button.disabled = date < earliestDay() || date > lastDay || !isAvailableFor(mode, date);
    button.tabIndex = sameDay(date, focusDay) && !button.disabled ? 0 : -1;
    if (sameDay(date, today)) button.classList.add('is-today');

    // Een dag die het hotel afsloot, krijgt een streep en zegt waarom; een dag die enkel
    // te vroeg of te laat is, blijft gewoon grijs
    if (button.disabled && isClosed(date)) {
        button.classList.add('is-closed');
        button.title = texts.unavailable;
        button.setAttribute('aria-label', `${fullDate.format(date)} - ${texts.unavailable}`);
    }

    return button;
}

/** Zet de kleuren van het gekozen verblijf op de dagen die al getekend zijn */
function paintRange() {
    const [from, to] = range();
    dayGrid.classList.toggle('has-range', Boolean(from && to));

    for (const button of dayGrid.querySelectorAll('.calendar-day')) {
        const date = fromInputDate(button.dataset.date);
        button.classList.toggle('is-start', sameDay(date, from));
        button.classList.toggle('is-end', sameDay(date, to));
        button.classList.toggle('is-between', Boolean(from && to && date > from && date < to));
        button.setAttribute('aria-pressed', String(sameDay(date, checkin) || sameDay(date, checkout)));
    }

    showHint();
}

function showHint() {
    const [from, to] = range();

    if (from && to) {
        const nights = countNights(from, to);
        hint.textContent = (nights === 1 ? texts.nightOne : texts.nightMany).replace('{n}', nights);
    } else {
        hint.textContent = mode === 'checkout' ? texts.pickCheckout : texts.pickCheckin;
    }
}


/* ================================
   De twee velden bijwerken
================================= */

/**
 * Zet de datums in de verborgen velden en in de tekstvakken.
 * Het veld waarin de gast op dat ogenblik typt, blijft ongemoeid.
 */
function showChoice(typing) {
    for (const name of names) {
        const date = name === 'checkin' ? checkin : checkout;
        fields[name].hidden.value = date ? toInputDate(date) : '';

        if (name !== typing) {
            fields[name].input.value = date ? toTypedDate(date) : '';
            showError(name, false);
        }
    }
}

function showError(name, show) {
    fields[name].control.classList.toggle('is-invalid', show);
    fields[name].error.hidden = !show;
    fields[name].input.setAttribute('aria-invalid', String(show));
}

/** Een datum vastleggen; een vertrekdatum die niet meer na de aankomst ligt, vervalt */
function setDate(name, date) {
    if (name === 'checkin') {
        checkin = date;
        // Een vertrekdatum die niet meer na de aankomst ligt, of die nu over een afgesloten
        // periode heen zou lopen, vervalt
        if (date && checkout && (checkout <= date || checkout > lastCheckout())) checkout = null;
    } else {
        checkout = date;
    }
}


/* ================================
   Openen, sluiten en kiezen
================================= */

function openCalendar(name, moveFocus) {
    // Zonder aankomstdatum valt er nog geen vertrekdatum te kiezen
    mode = name === 'checkout' && !checkin ? 'checkin' : name;
    openedBy = name;

    const start = mode === 'checkout' ? (checkout ?? addDays(checkin, 1)) : (checkin ?? today);
    focusDay = clamp(start);

    // De kalender verhuist naar het veld waar de gast mee bezig is en hangt daar onder
    fields[name].field.append(calendar);
    calendar.hidden = false;
    calendar.classList.toggle('to-the-right', name === 'checkout');
    fields[name].openButton.setAttribute('aria-expanded', 'true');

    if (moveFocus) {
        focusOn(focusDay);
    } else {
        showMonthOf(focusDay);
    }
}

function closeCalendar(returnFocus) {
    if (calendar.hidden) return;

    const input = fields[openedBy]?.input;
    calendar.hidden = true;
    hovered = null;
    for (const name of names) {
        fields[name].openButton.setAttribute('aria-expanded', 'false');
    }
    openedBy = null;

    // De aandacht gaat terug naar het tekstvak, maar dat mag de kalender niet opnieuw
    // openen: na de twee datums hoort ze dicht te blijven
    if (returnFocus) {
        closing = true;
        input?.focus();
        closing = false;
    }
}

function choose(date) {
    if (mode === 'checkin') {
        setDate('checkin', date);
        mode = 'checkout';
    } else {
        setDate('checkout', date);
    }

    hovered = null;
    showChoice();

    if (checkout) {
        closeCalendar(true);
    } else {
        // De aankomst staat vast; de kalender blijft open voor de vertrekdatum
        focusOn(addDays(checkin, 1));
    }
}

/** Naar de maand van een datum springen, zonder de aandacht te verplaatsen */
function showMonthOf(date) {
    month = startOfMonth(date);
    renderMonth();
}

/** Een dag de aandacht geven, en zo nodig naar de maand ernaast springen */
function focusOn(date) {
    focusDay = date;
    showMonthOf(date);
    dayGrid.querySelector(`[data-date="${toInputDate(date)}"]`)?.focus();
}

function moveFocus(days) {
    const next = addDays(focusDay, days);
    if (next >= earliestDay() && next <= lastDay) focusOn(next);
}


/* ================================
   Intypen
================================= */

function onTyped(name) {
    const input = fields[name].input;

    // De scheidingstekens komen er vanzelf bij, maar alleen als de cursor achteraan staat;
    // anders zou hij bij een verbetering middenin naar het einde springen
    if (input.selectionStart === input.value.length) {
        input.value = groupDigits(input.value);
    }

    const typed = input.value.trim();
    const date = typed ? parseTyped(typed) : null;
    const usable =
        Boolean(date) && date >= earliestFor(name) && date <= lastDay && isAvailableFor(name, date);

    showError(name, Boolean(typed) && !usable);
    setDate(name, usable ? date : null);
    showChoice(name);

    // De kalender volgt mee met wat er staat
    mode = name;
    if (usable) {
        focusDay = date;
        showMonthOf(date);
    } else {
        renderMonth();
    }
}

/** Bij het verlaten van het veld komt een geldige datum er netjes in te staan */
function onLeft(name) {
    const date = name === 'checkin' ? checkin : checkout;
    if (date) fields[name].input.value = toTypedDate(date);
}


/* ================================
   Bediening
================================= */

for (const name of names) {
    const { input, openButton } = fields[name];

    input.addEventListener('focus', function() {
        if (!closing && openedBy !== name) openCalendar(name, false);
    });

    input.addEventListener('input', function() {
        onTyped(name);
    });

    input.addEventListener('change', function() {
        onLeft(name);
    });

    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            // Enter in een datumveld sluit de kalender en verstuurt het formulier niet
            e.preventDefault();
            onLeft(name);
            closeCalendar(false);
        } else if (e.key === 'Escape') {
            closeCalendar(false);
        } else if (e.key === 'ArrowDown' && !calendar.hidden) {
            // Pijl omlaag stapt van het tekstvak in de kalender
            e.preventDefault();
            focusOn(focusDay);
        }
    });

    openButton.addEventListener('click', function() {
        if (openedBy === name) {
            closeCalendar(true);
        } else {
            openCalendar(name, true);
        }
    });
}

for (const button of calendar.querySelectorAll('.calendar-nav')) {
    button.addEventListener('click', function() {
        showMonthOf(addMonths(month, Number(button.dataset.step)));
        // Bij de eerste of laatste maand gaat de pijl uit en verliest hij de aandacht
        if (button.disabled) calendar.querySelector('.calendar-nav:not(:disabled)').focus();
    });
}

for (const select of [monthSelect, yearSelect]) {
    select.addEventListener('change', function() {
        showMonthOf(clamp(new Date(Number(yearSelect.value), Number(monthSelect.value), 1)));
    });
}

dayGrid.addEventListener('click', function(e) {
    const button = e.target.closest('.calendar-day');
    if (button && !button.disabled) choose(fromInputDate(button.dataset.date));
});

dayGrid.addEventListener('mouseover', function(e) {
    const button = e.target.closest('.calendar-day');
    const date = button && !button.disabled ? fromInputDate(button.dataset.date) : null;
    if (sameDay(date, hovered)) return;
    hovered = date;
    paintRange();
});

dayGrid.addEventListener('mouseleave', function() {
    hovered = null;
    paintRange();
});

dayGrid.addEventListener('keydown', function(e) {
    const steps = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };

    if (e.key in steps) {
        e.preventDefault();
        moveFocus(steps[e.key]);
    } else if (e.key === 'Home') {
        e.preventDefault();
        moveFocus(1 - weekday(focusDay));
    } else if (e.key === 'End') {
        e.preventDefault();
        moveFocus(7 - weekday(focusDay));
    } else if (e.key === 'PageUp' || e.key === 'PageDown') {
        e.preventDefault();
        moveFocus(e.key === 'PageUp' ? -28 : 28);
    }
});

dateRange.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !calendar.hidden) closeCalendar(true);
});

// Klikken of tabben buiten de kalender sluit ze
document.addEventListener('pointerdown', function(e) {
    if (!dateRange.contains(e.target)) closeCalendar(false);
});

dateRange.addEventListener('focusout', function() {
    // Even wachten met oordelen: de aandacht is soms een ogenblik nergens voor ze op haar
    // nieuwe plaats aankomt
    setTimeout(function() {
        const away = document.activeElement;

        // Alleen sluiten als de aandacht bij een ander element terechtkwam, bv. het volgende
        // veld van het formulier. Valt ze op de pagina zelf terug, dan laat de browser ze
        // vallen: Safari en de browsers op de telefoon doen dat bij elke klik op een knop,
        // en dan zou de kalender sluiten nog voor de klik op een maandpijl aankomt. Klikken
        // naast de kalender sluit ze hierboven al.
        const landed = Boolean(away) && away !== document.body && away !== document.documentElement;
        if (landed && !dateRange.contains(away)) closeCalendar(false);
    });
});

// Het hotel kan via /admin/ periodes afsluiten. src/scripts/instellingen.js haalt ze bij
// Cloudflare op en stuurt ze hierheen zodra ze binnen zijn, een ogenblik na het laden.
// Blijven ze uit, dan staat de kalender gewoon open en weigert het script bij Cloudflare
// een aanvraag op die datums alsnog.
document.addEventListener('claridge-periodes', function(e) {
    closedRanges = (e.detail ?? [])
        .filter((periode) => periode?.van && periode?.tot)
        .map((periode) => ({ from: fromInputDate(periode.van), to: fromInputDate(periode.tot) }));

    // Een datum die intussen al gekozen werd, kan nu afgesloten zijn
    for (const name of names) {
        const gekozen = name === 'checkin' ? checkin : checkout;
        if (gekozen && !isAvailableFor(name, gekozen)) setDate(name, null);
    }

    showChoice();
    if (!calendar.hidden) renderMonth();
});

fillWeekdays();
fillPeriod();
showChoice();
