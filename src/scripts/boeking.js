const bookingForm = document.getElementById('booking-form');
const checkinInput = document.getElementById('checkin');
const checkoutInput = document.getElementById('checkout');

function setMinimumDates() {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    checkinInput.min = todayStr;
    checkoutInput.min = '';
    checkoutInput.value = '';
}

function validateDates() {
    if (!checkinInput.value || !checkoutInput.value) {
        alert('Gelieve zowel een aankomst- als vertrekdatum in te vullen.');
        return false;
    }

    const checkinDate = new Date(checkinInput.value);
    const checkoutDate = new Date(checkoutInput.value);

    if (checkoutDate <= checkinDate) {
        alert('De vertrekdatum moet minstens één dag na de aankomstdatum zijn.');
        checkoutInput.value = '';
        return false;
    }

    return true;
}

bookingForm.addEventListener('submit', function(e) {
    if (!validateDates()) {
        e.preventDefault(); // Alleen blokkeren als er een fout is
    }
});

checkinInput.addEventListener('change', function() {
    if (checkinInput.value) {
        const checkinDate = new Date(checkinInput.value);
        checkinDate.setDate(checkinDate.getDate() + 1);
        checkoutInput.min = checkinDate.toISOString().split('T')[0];
        checkoutInput.value = '';
    }
});

document.addEventListener('DOMContentLoaded', setMinimumDates);
