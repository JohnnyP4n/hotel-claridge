// Alle Nederlandse teksten van de site. Dit bestand is het voorbeeld voor de andere talen:
// fr.ts, en.ts en de.ts hebben exact dezelfde sleutels (TypeScript waarschuwt als er één ontbreekt).
// Sleutels die op "Html" eindigen mogen tags bevatten, bv. <strong>.
export const nl = {
  /** Naam van de taal in de taalkeuze */
  name: 'Nederlands',
  /** Voor datums en getallen, bv. in de bevestigingsmail */
  dateLocale: 'nl-BE',
  /** Taal van de spamcontrole (Cloudflare Turnstile) op het aanvraagformulier */
  turnstile: 'nl',
  /** Staat achter de paginatitel in het tabblad, bv. "Kamers | Hotel Claridge" */
  siteName: 'Hotel Claridge',
  /** Titel van het tabblad op de homepagina */
  homeTitle: 'Hotel Claridge | Charmant hotel in Blankenberge',
  skipLink: 'Naar de inhoud',

  nav: {
    label: 'Hoofdmenu',
    menu: 'Menu',
    language: 'Taal',
    home: 'Home',
    rooms: 'Kamers',
    rates: 'Tarieven',
    contact: 'Contact',
    book: 'Vraag verblijf aan',
  },

  common: {
    bookingCom: 'Of boek via Booking.com',
    bookingComShort: 'Boek via Booking.com',
    mapsHint: '(opent in Google Maps)',
    from: 'vanaf',
    perNight: 'per nacht',
    free: 'gratis',
  },

  /** Melding bovenaan de site als het hotel gesloten is; {van} en {tot} worden datums */
  notice: {
    closed: 'Wij zijn gesloten van {van} tot en met {tot}.',
    closedOneDay: 'Wij zijn gesloten op {van}.',
  },

  footer: {
    tagline: 'Charmant hotel in het hart van Blankenberge, op slechts 400 meter van het strand.',
    contact: 'Contact',
    menu: 'Menu',
    direct: 'Rechtstreeks boeken',
    directText: 'Boek rechtstreeks bij ons en ontvang het Happy Trip-voordeel voor uw treinreis naar de kust.',
    rights: 'Alle rechten voorbehouden',
  },

  cta: {
    title: 'Klaar voor een verblijf aan zee?',
    text: 'Vraag rechtstreeks uw verblijf aan. Wij controleren de beschikbaarheid en nemen zo snel mogelijk contact met u op.',
  },

  home: {
    description:
      'Hotel Claridge is een charmant hotel in het hart van Blankenberge, op 400 meter van het strand. Comfortabele kamers, vers ontbijt en een huiselijke sfeer.',
    eyebrow: 'Blankenberge · Belgische kust',
    lead: 'Charmant verblijf in het hart van Blankenberge, op slechts 400 meter van het strand.',
    highlights: {
      beach: { title: '400 m van het strand', text: 'Zee en zand op wandelafstand' },
      central: { title: 'Centraal gelegen', text: 'Rustig tussen jachthaven en station' },
      breakfast: { title: 'Vers ontbijt', text: 'Elke ochtend, met gebakken eieren en spek' },
      train: { title: 'Happy Trip', text: 'Korting op uw treinreis naar de kust' },
    },
    intro: {
      eyebrow: 'Welkom',
      title: 'Welkom bij Hotel Claridge',
      paragraphsHtml: [
        '<strong>Hotel Claridge</strong> is een charmant hotel in het hart van Blankenberge, rustig gelegen tussen de jachthaven en het station, op slechts <strong>400 meter van het strand</strong>.',
        'Dankzij onze <strong>centrale ligging</strong> bereikt u vlot de zee, winkels, restaurants en bezienswaardigheden. Perfect voor een ontspannen verblijf aan de Belgische kust.',
        'Wij bieden <strong>comfortabele kamers, een hartelijke service en een huiselijke sfeer</strong>. Ideaal voor een romantisch weekendje, familievakantie of een verfrissende break aan zee.',
        'Elke ochtend verwennen wij u met een vers <strong>ontbijt</strong>, inclusief dagelijks <strong>vers gebakken eieren met spek</strong> en gekookte eieren – een heerlijke start van uw dag!',
        'Kom <strong>genieten</strong> van de frisse zeelucht, het zachte zand en de warme gastvrijheid van Hotel Claridge. Wij kijken ernaar uit u te mogen ontvangen!',
      ],
      imageAlt: 'De gevel van Hotel Claridge in Blankenberge',
    },
    rooms: {
      eyebrow: 'Kamers',
      title: 'Onze kamers',
      text: 'Comfortkamers, een standaardkamer en een familiekamer voor 4 personen. Het ontbijt is altijd inbegrepen.',
      link: 'Alle kamers bekijken',
    },
    happytrip: {
      eyebrow: 'Met de trein naar zee',
      title: 'Happy Trip voordeel voor onze gasten',
      textHtml:
        'Boek rechtstreeks bij ons en ontvang <strong>kortingscodes</strong> voor je treinreis naar de kust!<br />Slechts € 14 heen en terug, vanuit élk Belgisch station. Geen parkeerstress. Geen extra kosten.',
      callToAction: 'Vraag je Happy Trip-korting aan bij je boeking!',
      imageAlt: 'Happy Trip voordeel',
    },
  },

  rooms: {
    title: 'Kamers',
    description:
      'Ontdek de kamers van Hotel Claridge in Blankenberge: comfortkamers met bad of douche, een standaardkamer en een familiekamer voor 4 personen.',
    eyebrow: 'Kamers',
    heading: 'Onze kamers',
    intro: 'Comfortabele kamers met een huiselijke sfeer, op 400 meter van het strand.',
    included: 'Inbegrepen bij elke kamer',
    includedItems: ['Ontbijt', 'Tv', 'Gratis wifi', 'Haardroger'],
    requestRoom: 'Vraag deze kamer aan',
    happytripNoteHtml:
      'Boek rechtstreeks bij ons en ontvang het <strong>Happy Trip gastenvoordeel</strong> – korting op treinvervoer naar de kust!',
    // Teksten per kamer; de prijzen en foto's staan in src/data/rooms.ts
    items: {
      'type-a': {
        name: 'Comfortkamer met bad',
        summary: 'Comfortkamer met bad/toilet en een tweepersoonsbed.',
        guests: '2 personen, extra bed mogelijk',
        bed: 'Tweepersoonsbed',
        bathroom: 'Bad en toilet',
        extras: ['Minibar / frigo', 'Waterkoker'],
        note: '',
        imageAlt: 'Comfortkamer met bad',
      },
      'type-b': {
        name: 'Comfortkamer met twee bedden',
        summary: 'Comfortkamer met douche/toilet en twee aparte bedden.',
        guests: '2 personen, extra bed mogelijk',
        bed: 'Twee aparte bedden',
        bathroom: 'Douche en toilet',
        extras: ['Minibar / frigo', 'Waterkoker'],
        note: '',
        imageAlt: 'Comfortkamer met douche en twee aparte bedden',
      },
      'type-c': {
        name: 'Standaardkamer',
        summary: 'Kleine kamer met douche/toilet en een tweepersoonsbed.',
        guests: 'Max. 2 personen',
        bed: 'Tweepersoonsbed',
        bathroom: 'Douche en toilet',
        extras: [],
        note: 'Geen extra bed mogelijk',
        imageAlt: 'Standaardkamer met douche',
      },
      familiekamer: {
        name: 'Familiekamer',
        summary: 'Ruimte voor 4 personen, met extra comfort.',
        guests: '4 personen, extra bedden mogelijk',
        bed: 'Tweepersoonsbed en twee aparte bedden',
        bathroom: 'Bad en toilet',
        extras: ['Minibar / frigo', 'Waterkoker'],
        note: '',
        imageAlt: 'Familiekamer',
      },
    },
  },

  rates: {
    title: 'Tarieven',
    description:
      'Tarieven van Hotel Claridge in Blankenberge, ontbijt inbegrepen. Bekijk de prijzen per kamertype voor laag- en hoogseizoen.',
    eyebrow: 'Tarieven',
    heading: 'Tarieven',
    intro: 'Heldere prijzen per kamertype, ontbijt altijd inbegrepen.',
    tableCaption: 'Prijzen per kamertype',
    roomType: 'Type kamer',
    lowSeason: 'Laagseizoen',
    highSeason: 'Hoogseizoen',
    note: 'Prijzen per kamer per nacht, ontbijt inbegrepen. De prijzen kunnen variëren afhankelijk van de periode.',
    promo: {
      eyebrow: 'Laagseizoen',
      title: '3 + 1 nacht gratis',
      text: 'Boekt u rechtstreeks bij ons in het laagseizoen? Dan betaalt u 3 nachten en is de 4de nacht gratis. Geldig op gewone dagen, niet tijdens drukke periodes.',
    },
    extraBeds: {
      title: 'Extra bedden',
      note: 'Niet mogelijk bij Type C',
      items: {
        none: 'Geen extra bed (0 - 2 jaar)',
        cot: 'Babybedje (0 - 2 jaar)',
        child: 'Kinderbed (3 - 12 jaar)',
        single: 'Eenpersoonsbed (vanaf 12 jaar)',
      },
    },
    included: {
      title: 'Inbegrepen',
      extraHtml: '<strong>Extra bij type A, B en familiekamer:</strong> minibar / frigo en waterkoker.',
    },
    touristTax: {
      title: 'Toeristenbelasting',
      text: '€ {bedrag} per persoon per nacht (niet inbegrepen)',
    },
  },

  contact: {
    title: 'Contact',
    description:
      'Contacteer Hotel Claridge, de Limburg Stirumstraat 2, 8370 Blankenberge. Bel +32 476 68 88 88 of stuur ons een e-mail.',
    eyebrow: 'Contact',
    heading: 'Contacteer ons',
    intro: 'Een vraag over uw verblijf? Wij helpen u graag verder.',
    details: 'Contactgegevens',
    address: 'Adres',
    mobile: 'Gsm',
    email: 'E-mail',
    happytripNoteHtml:
      'Ben je van plan met de trein te komen? Laat het ons weten bij je reservatie en ontvang een <strong>Happy Trip kortingscode</strong> voor je reis!',
    mapTitle: 'Ligging van Hotel Claridge op Google Maps',
  },

  booking: {
    title: 'Vraag verblijf aan',
    description:
      'Vraag rechtstreeks uw verblijf aan bij Hotel Claridge in Blankenberge. Wij controleren de beschikbaarheid en nemen zo snel mogelijk contact met u op.',
    eyebrow: 'Rechtstreeks boeken',
    heading: 'Vraag uw verblijf aan',
    intro:
      'Vul onderstaand formulier in om een verblijf aan te vragen. Wij controleren de beschikbaarheid en nemen zo snel mogelijk contact met u op.',
    yourDetails: 'Jouw gegevens',
    yourRequest: 'Uw aanvraag',
    name: 'Naam',
    email: 'E-mail',
    phone: 'Gsm-nummer',
    phonePlaceholder: 'bijv. +32 123 45 67 89',
    optional: '(optioneel)',
    checkin: 'Aankomstdatum',
    checkout: 'Vertrekdatum',
    guests: 'Aantal personen',
    roomType: 'Gewenst kamertype',
    chooseRoom: 'Kies een kamer',
    remarks: 'Opmerkingen',
    submit: 'Vraag verblijf aan',
    sending: 'Bezig met versturen...',
    robotCheck: 'Vink eerst het vakje "Ik ben geen robot" hierboven aan.',
    error: 'Het versturen is niet gelukt. Probeer het opnieuw of bel ons op',
    datesMissing: 'Gelieve zowel een aankomst- als vertrekdatum in te vullen.',
    // De teksten van de eigen kalender (src/components/DateRange.astro).
    // datePattern is zowel het voorbeeld in het lege veld als de vorm waarin een gekozen
    // datum komt te staan; het teken ertussen wordt ook gebruikt bij het intypen.
    datePattern: 'dd-mm-jjjj',
    dateInvalid: 'Deze datum kan niet gekozen worden.',
    openCalendar: 'Kalender openen',
    calendarLabel: 'Kies uw aankomst- en vertrekdatum',
    previousMonth: 'Vorige maand',
    nextMonth: 'Volgende maand',
    monthLabel: 'Maand',
    yearLabel: 'Jaar',
    pickCheckin: 'Kies uw aankomstdatum',
    pickCheckout: 'Kies nu uw vertrekdatum',
    nightOne: '{n} nacht',
    nightMany: '{n} nachten',
    sent: {
      title: 'Bedankt voor uw aanvraag',
      text: 'Wij hebben uw aanvraag goed ontvangen. We controleren de beschikbaarheid en nemen zo snel mogelijk contact met u op via e-mail of telefoon.',
      mail: 'U ontvangt ook een bevestiging van uw aanvraag per e-mail.',
    },
    aside: {
      title: 'Goed om te weten',
      availability: 'Wij controleren de beschikbaarheid en nemen zo snel mogelijk contact met u op.',
      breakfast: 'Het ontbijt is inbegrepen bij elke kamer.',
      trainHtml:
        'Komt u met de trein? Vermeld het bij uw opmerkingen en ontvang een <strong>Happy Trip kortingscode</strong>.',
      phoneTitle: 'Liever telefonisch?',
    },
  },
};
