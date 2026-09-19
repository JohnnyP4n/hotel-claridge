const bookingForm = document.getElementById('booking-form');
const checkinInput = document.getElementById('checkin');
const checkoutInput = document.getElementById('checkout');
const roomSelect = document.getElementById('room-type');
const submitButton = bookingForm.querySelector('button[type="submit"]');
const errorMessage = document.getElementById('booking-error');
const sentMessage = document.getElementById('booking-sent');

// Kamertype vooraf kiezen als de bezoeker via "Vraag deze kamer aan" komt (bv. ?kamer=Type%20A)
function preselectRoom() {
    const requestedRoom = new URLSearchParams(window.location.search).get('kamer');
    const exists = [...roomSelect.options].some((option) => option.value === requestedRoom);
    if (requestedRoom && exists) {
        roomSelect.value = requestedRoom;
    }
}

preselectRoom();

// Datum als JJJJ-MM-DD in Belgische tijd (toISOString() geeft UTC, en dat is tot 2 uur 's nachts nog gisteren)
function toInputDate(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
}

// Leest de waarde van een datumveld (JJJJ-MM-DD) als lokale datum
function fromInputDate(value) {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
}

function countNights(checkin, checkout) {
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.round((fromInputDate(checkout) - fromInputDate(checkin)) / msPerDay);
}

function setMinimumDates() {
    checkinInput.min = toInputDate(new Date());
    checkoutInput.min = '';
    checkoutInput.value = '';
}

function validateDates() {
    if (!checkinInput.value || !checkoutInput.value) {
        alert('Gelieve zowel een aankomst- als vertrekdatum in te vullen.');
        return false;
    }

    if (countNights(checkinInput.value, checkoutInput.value) < 1) {
        alert('De vertrekdatum moet minstens één dag na de aankomstdatum zijn.');
        checkoutInput.value = '';
        return false;
    }

    return true;
}

// De ingevulde velden; het script in worker/ maakt er de e-mail voor het hotel van
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
        remarks: fields.remarks.value,
        botcheck: fields.botcheck.checked,
    };
}

async function sendRequest(form) {
    submitButton.disabled = true;
    submitButton.textContent = 'Bezig met versturen...';
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
        submitButton.textContent = 'Vraag verblijf aan';
    }
}

bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if (validateDates()) {
        sendRequest(bookingForm);
    }
});

checkinInput.addEventListener('change', function() {
    if (checkinInput.value) {
        const checkinDate = fromInputDate(checkinInput.value);
        checkinDate.setDate(checkinDate.getDate() + 1);
        checkoutInput.min = toInputDate(checkinDate);
        checkoutInput.value = '';
    }
});

document.addEventListener('DOMContentLoaded', setMinimumDates);
