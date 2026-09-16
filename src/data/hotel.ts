// Gegevens van het hotel die op meerdere pagina's terugkomen (footer, contact, boeking)
export const hotel = {
  name: 'Hotel Claridge',
  address: {
    street: 'de Limburg Stirumstraat 2',
    postalCode: '8370',
    city: 'Blankenberge',
  },
  phone: { label: '+32 50 42 66 88', href: 'tel:+3250426688' },
  mobile: { label: '+32 476 68 88 88', href: 'tel:+32476688888' },
  emails: ['info@hotel-claridge.be', 'hotelclaridge@msn.com'],
  bookingUrl: 'https://www.booking.com/hotel/be/claridge.nl.html',
  mapEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4402.822345914325!2d3.1224820735192624!3d51.3121768219327!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c359d06ad375ab%3A0xd74044230ed0ef0!2sHotel%20Claridge!5e0!3m2!1snl!2sbe!4v1745256436132!5m2!1snl!2sbe',
};

export const mainNav = [
  { href: '/', label: 'Home' },
  { href: '/kamers/', label: 'Kamers' },
  { href: '/tarieven/', label: 'Tarieven' },
  { href: '/contact/', label: 'Contact' },
];

export const bookingPath = '/boeking/';
