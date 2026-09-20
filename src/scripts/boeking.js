const bookingForm = document.getElementById('booking-form');
const checkinInput = document.getElementById('checkin');
const checkoutInput = document.getElementById('checkout');
const roomSelect = document.getElementById('room-type');
const submitButton = bookingForm.querySelector('button[type="submit"]');
const errorMessage = document.getElementById('booking-error');
const sentMessage = document.getElementById('booking-sent');
const checkMessage = document.getElementById('booking-check');

// De teksten van dit script staan als data-attributen op het formulier (zie boeking.astro),
// zodat ze in elke taal kloppen: data-lang, data-submit, data-sending en data-dates-missing
const texts = bookingForm.dataset;

// Kamertype vooraf kiezen als de bezoeker via "Vraag deze kamer aan" komt (bv. ?kamer=Type%20A)
function preselectRoom() {
    const requestedRoom = new URLSearchParams(window.location.search).get('kamer');
    const exists = [...roomSelect.options].some((option) => option.value === requestedRoom);
    if (requestedRoom && exists) {
        roomSelect.value = requestedRoom;
    }
}

preselectRoom();

// De kalender (src/scripts/datumkiezer.js) laat geen datum in het verleden toe en houdt de
// vertrekdatum altijd na de aankomst. Hier blijft alleen over: staan ze allebei ingevuld?
function validateDates() {
    if (!checkinInput.value || !checkoutInput.value) {
        alert(texts.datesMissing);
        return false;
    }

    return true;
}

// De ingevulde velden; het script in worker/ maakt er de e-mails voor het hotel en de gast van
function buildRequest(form) {
    const fields = form.elements;
    return {
        name: fields.name.value,
        email: fields.email.value,
        phone: fields.phone.value,
        checkin: fields.checkin.value,
        checkout: fields.checkout.value,
        guests: fields.guests.value,
        room: fields['room-type'].value,
        // bv. "Type A - Comfortkamer met bad", voor de bevestiging aan de gast
        roomName: roomSelect.selectedOptions[0]?.textContent ?? '',
        remarks: fields.remarks.value,
        // De taal van de pagina; het script in worker/ mailt de bevestiging in die taal
        lang: texts.lang,
        botcheck: fields.botcheck.checked,
        turnstileToken: turnstileToken(),
    };
}

// Turnstile zet dit verborgen veld in het formulier zodra de controle geslaagd is
function turnstileToken() {
    return bookingForm.elements['cf-turnstile-response']?.value ?? '';
}

async function sendRequest(form) {
    submitButton.disabled = true;
    submitButton.textContent = texts.sending;
    errorMessage.hidden = true;

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(buildRequest(form)),
        });
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message);
        }

        form.hidden = true;
        sentMessage.hidden = false;
        sentMessage.focus();
    } catch (error) {
        console.error('Aanvraag niet verstuurd:', error);
        errorMessage.hidden = false;
        submitButton.disabled = false;
        submitButton.textContent = texts.submit;
        // Een Turnstile-token werkt maar één keer: vraag een nieuw aan voor de volgende poging
        window.turnstile?.reset();
    }
}

bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if (!validateDates()) return;

    // Zonder geslaagde Turnstile-controle weigert het script de aanvraag toch
    checkMessage.hidden = Boolean(turnstileToken());
    if (checkMessage.hidden) {
        sendRequest(bookingForm);
    }
});
