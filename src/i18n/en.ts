import type { Translation } from './types';

// Engelse vertaling. Dezelfde sleutels als nl.ts; zie dat bestand voor de uitleg erbij.
export const en: Translation = {
  name: 'English',
  dateLocale: 'en-GB',
  turnstile: 'en',
  siteName: 'Hotel Claridge',
  homeTitle: 'Hotel Claridge | Charming hotel in Blankenberge',
  skipLink: 'Skip to content',

  nav: {
    label: 'Main menu',
    menu: 'Menu',
    language: 'Language',
    home: 'Home',
    rooms: 'Rooms',
    rates: 'Rates',
    contact: 'Contact',
    book: 'Request a stay',
  },

  common: {
    bookingCom: 'Or book via Booking.com',
    bookingComShort: 'Book via Booking.com',
    mapsHint: '(opens in Google Maps)',
    from: 'from',
    perNight: 'per night',
    free: 'free',
  },

  /** Notice at the top of the site when the hotel is closed; {van} and {tot} become dates */
  notice: {
    closed: 'We are closed from {van} to {tot} inclusive.',
    closedOneDay: 'We are closed on {van}.',
    fullyBooked: 'We are fully booked from {van} to {tot} inclusive.',
    fullyBookedOneDay: 'We are fully booked on {van}.',
  },

  footer: {
    tagline: 'A charming hotel in the heart of Blankenberge, just 400 metres from the beach.',
    contact: 'Contact',
    menu: 'Menu',
    direct: 'Book direct',
    directText: 'Book directly with us and enjoy the Happy Trip benefit for your train journey to the coast.',
    rights: 'All rights reserved',
  },

  cta: {
    title: 'Ready for a stay by the sea?',
    text: 'Request your stay directly. We will check availability and get back to you as soon as possible.',
  },

  home: {
    description:
      'Hotel Claridge is a charming hotel in the heart of Blankenberge, 400 metres from the beach. Comfortable rooms, a fresh breakfast and a homely atmosphere.',
    eyebrow: 'Blankenberge · Belgian coast',
    lead: 'A charming stay in the heart of Blankenberge, just 400 metres from the beach.',
    highlights: {
      beach: { title: '400 m from the beach', text: 'Sea and sand within walking distance' },
      central: { title: 'Central location', text: 'Quiet, between the marina and the station' },
      breakfast: { title: 'Fresh breakfast', text: 'Every morning, with fried eggs and bacon' },
      train: { title: 'Happy Trip', text: 'A discount on your train journey to the coast' },
    },
    intro: {
      eyebrow: 'Welcome',
      title: 'Welcome to Hotel Claridge',
      paragraphsHtml: [
        '<strong>Hotel Claridge</strong> is a charming hotel in the heart of Blankenberge, quietly located between the marina and the station, just <strong>400 metres from the beach</strong>.',
        'Thanks to our <strong>central location</strong>, the sea, the shops, the restaurants and the sights are all within easy reach. Perfect for a relaxing stay on the Belgian coast.',
        'We offer <strong>comfortable rooms, warm service and a homely atmosphere</strong>. Ideal for a romantic weekend, a family holiday or a refreshing break by the sea.',
        'Every morning we treat you to a fresh <strong>breakfast</strong>, including <strong>freshly fried eggs with bacon</strong> and boiled eggs every day – a delicious start to your day!',
        'Come and <strong>enjoy</strong> the fresh sea air, the soft sand and the warm hospitality of Hotel Claridge. We look forward to welcoming you!',
      ],
      imageAlt: 'The façade of Hotel Claridge in Blankenberge',
    },
    rooms: {
      eyebrow: 'Rooms',
      title: 'Our rooms',
      text: 'Comfort rooms, a standard room and a family room for 4 people. Breakfast is always included.',
      link: 'See all rooms',
    },
    happytrip: {
      eyebrow: 'By train to the sea',
      title: 'Happy Trip benefit for our guests',
      textHtml:
        'Book directly with us and receive <strong>discount codes</strong> for your train journey to the coast!<br />Just € 14 return, from any Belgian station. No parking stress. No extra costs.',
      callToAction: 'Ask for your Happy Trip discount when you book!',
      imageAlt: 'Happy Trip benefit',
    },
  },

  rooms: {
    title: 'Rooms',
    description:
      'Discover the rooms of Hotel Claridge in Blankenberge: comfort rooms with bath or shower, a standard room and a family room for 4 people.',
    eyebrow: 'Rooms',
    heading: 'Our rooms',
    intro: 'Comfortable rooms with a homely atmosphere, 400 metres from the beach.',
    included: 'Included in every room',
    includedItems: ['Breakfast', 'TV', 'Free wifi', 'Hairdryer'],
    requestRoom: 'Request this room',
    happytripNoteHtml:
      'Book directly with us and receive the <strong>Happy Trip guest benefit</strong> – a discount on train travel to the coast!',
    items: {
      'type-a': {
        name: 'Comfort room with bath',
        summary: 'Comfort room with bath/toilet and a double bed.',
        guests: '2 people, extra bed possible',
        bed: 'Double bed',
        bathroom: 'Bath and toilet',
        extras: ['Minibar / fridge', 'Kettle'],
        note: '',
        imageAlt: 'Comfort room with bath',
      },
      'type-b': {
        name: 'Comfort room with two beds',
        summary: 'Comfort room with shower/toilet and two separate beds.',
        guests: '2 people, extra bed possible',
        bed: 'Two separate beds',
        bathroom: 'Shower and toilet',
        extras: ['Minibar / fridge', 'Kettle'],
        note: '',
        imageAlt: 'Comfort room with shower and two separate beds',
      },
      'type-c': {
        name: 'Standard room',
        summary: 'Small room with shower/toilet and a double bed.',
        guests: 'Max. 2 people',
        bed: 'Double bed',
        bathroom: 'Shower and toilet',
        extras: [],
        note: 'No extra bed possible',
        imageAlt: 'Standard room with shower',
      },
      familiekamer: {
        name: 'Family room',
        summary: 'Room for 4 people, with extra comfort.',
        guests: '4 people, extra beds possible',
        bed: 'A double bed and two separate beds',
        bathroom: 'Bath and toilet',
        extras: ['Minibar / fridge', 'Kettle'],
        note: '',
        imageAlt: 'Family room',
      },
    },
  },

  rates: {
    title: 'Rates',
    description:
      'Rates of Hotel Claridge in Blankenberge, breakfast included. See the prices per room type for low and high season.',
    eyebrow: 'Rates',
    heading: 'Rates',
    intro: 'Clear prices per room type, breakfast always included.',
    tableCaption: 'Prices per room type',
    roomType: 'Room type',
    lowSeason: 'Low season',
    highSeason: 'High season',
    note: 'Prices per room per night, breakfast included. Prices may vary depending on the period.',
    promo: {
      eyebrow: 'Low season',
      title: '3 + 1 night free',
      text: 'Booking directly with us in low season? Then you pay for 3 nights and the 4th night is free. Valid on ordinary days, not during busy periods.',
    },
    extraBeds: {
      title: 'Extra beds',
      note: 'Not possible in Type C',
      items: {
        none: 'No extra bed (0 - 2 years)',
        cot: 'Cot (0 - 2 years)',
        child: "Child's bed (3 - 12 years)",
        single: 'Single bed (from 12 years)',
      },
    },
    included: {
      title: 'Included',
      extraHtml: '<strong>Extra in types A, B and the family room:</strong> minibar / fridge and kettle.',
    },
    touristTax: {
      title: 'Tourist tax',
      text: '€ {bedrag} per person per night (not included)',
    },
  },

  contact: {
    title: 'Contact',
    description:
      'Contact Hotel Claridge, de Limburg Stirumstraat 2, 8370 Blankenberge. Call +32 476 68 88 88 or send us an e-mail.',
    eyebrow: 'Contact',
    heading: 'Contact us',
    intro: 'A question about your stay? We are happy to help.',
    details: 'Contact details',
    address: 'Address',
    mobile: 'Mobile',
    email: 'E-mail',
    happytripNoteHtml:
      'Planning to come by train? Let us know when you book and receive a <strong>Happy Trip discount code</strong> for your journey!',
    mapTitle: 'Location of Hotel Claridge on Google Maps',
  },

  booking: {
    title: 'Request a stay',
    description:
      'Request your stay directly at Hotel Claridge in Blankenberge. We will check availability and get back to you as soon as possible.',
    eyebrow: 'Book direct',
    heading: 'Request your stay',
    intro:
      'Fill in the form below to request a stay. We will check availability and get back to you as soon as possible.',
    yourDetails: 'Your details',
    yourRequest: 'Your request',
    name: 'Name',
    email: 'E-mail',
    phone: 'Mobile number',
    phonePlaceholder: 'e.g. +32 123 45 67 89',
    optional: '(optional)',
    checkin: 'Arrival date',
    checkout: 'Departure date',
    guests: 'Number of people',
    roomType: 'Preferred room type',
    chooseRoom: 'Choose a room',
    remarks: 'Remarks',
    submit: 'Request a stay',
    sending: 'Sending...',
    robotCheck: 'Please tick the "I am not a robot" box above first.',
    error: 'Sending failed. Please try again or call us on',
    datesMissing: 'Please fill in both an arrival and a departure date.',
    datePattern: 'dd/mm/yyyy',
    dateInvalid: 'This date cannot be selected.',
    unavailable: 'Not available',
    openCalendar: 'Open the calendar',
    calendarLabel: 'Choose your arrival and departure date',
    previousMonth: 'Previous month',
    nextMonth: 'Next month',
    monthLabel: 'Month',
    yearLabel: 'Year',
    pickCheckin: 'Choose your arrival date',
    pickCheckout: 'Now choose your departure date',
    nightOne: '{n} night',
    nightMany: '{n} nights',
    sent: {
      title: 'Thank you for your request',
      text: 'We have received your request. We will check availability and get back to you as soon as possible by e-mail or phone.',
      mail: 'You will also receive a confirmation of your request by e-mail.',
    },
    aside: {
      title: 'Good to know',
      availability: 'We will check availability and get back to you as soon as possible.',
      breakfast: 'Breakfast is included in every room.',
      trainHtml:
        'Coming by train? Mention it in your remarks and receive a <strong>Happy Trip discount code</strong>.',
      phoneTitle: 'Prefer to call?',
    },
  },
};
