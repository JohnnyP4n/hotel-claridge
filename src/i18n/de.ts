import type { Translation } from './types';

// Duitse vertaling. Dezelfde sleutels als nl.ts; zie dat bestand voor de uitleg erbij.
export const de: Translation = {
  name: 'Deutsch',
  dateLocale: 'de-DE',
  turnstile: 'de',
  siteName: 'Hotel Claridge',
  homeTitle: 'Hotel Claridge | Charmantes Hotel in Blankenberge',
  skipLink: 'Zum Inhalt',

  nav: {
    label: 'Hauptmenü',
    menu: 'Menü',
    language: 'Sprache',
    home: 'Startseite',
    rooms: 'Zimmer',
    rates: 'Preise',
    contact: 'Kontakt',
    book: 'Aufenthalt anfragen',
  },

  common: {
    bookingCom: 'Oder buchen Sie über Booking.com',
    bookingComShort: 'Über Booking.com buchen',
    mapsHint: '(öffnet Google Maps)',
    from: 'ab',
    perNight: 'pro Nacht',
    free: 'gratis',
  },

  /** Hinweis oben auf der Website, wenn das Hotel geschlossen ist; {van} und {tot} werden Daten */
  notice: {
    closed: 'Wir sind vom {van} bis einschließlich {tot} geschlossen.',
    closedOneDay: 'Wir sind am {van} geschlossen.',
  },

  footer: {
    tagline: 'Charmantes Hotel im Herzen von Blankenberge, nur 400 Meter vom Strand entfernt.',
    contact: 'Kontakt',
    menu: 'Menü',
    direct: 'Direkt buchen',
    directText: 'Buchen Sie direkt bei uns und erhalten Sie den Happy-Trip-Vorteil für Ihre Zugfahrt an die Küste.',
    rights: 'Alle Rechte vorbehalten',
  },

  cta: {
    title: 'Bereit für einen Aufenthalt am Meer?',
    text: 'Fragen Sie Ihren Aufenthalt direkt an. Wir prüfen die Verfügbarkeit und melden uns so schnell wie möglich bei Ihnen.',
  },

  home: {
    description:
      'Das Hotel Claridge ist ein charmantes Hotel im Herzen von Blankenberge, 400 Meter vom Strand entfernt. Komfortable Zimmer, frisches Frühstück und eine familiäre Atmosphäre.',
    eyebrow: 'Blankenberge · Belgische Küste',
    lead: 'Charmanter Aufenthalt im Herzen von Blankenberge, nur 400 Meter vom Strand entfernt.',
    highlights: {
      beach: { title: '400 m vom Strand', text: 'Meer und Sand in Gehweite' },
      central: { title: 'Zentrale Lage', text: 'Ruhig zwischen Jachthafen und Bahnhof' },
      breakfast: { title: 'Frisches Frühstück', text: 'Jeden Morgen, mit Spiegeleiern und Speck' },
      train: { title: 'Happy Trip', text: 'Rabatt auf Ihre Zugfahrt an die Küste' },
    },
    intro: {
      eyebrow: 'Willkommen',
      title: 'Willkommen im Hotel Claridge',
      paragraphsHtml: [
        'Das <strong>Hotel Claridge</strong> ist ein charmantes Hotel im Herzen von Blankenberge, ruhig gelegen zwischen dem Jachthafen und dem Bahnhof, nur <strong>400 Meter vom Strand</strong> entfernt.',
        'Dank unserer <strong>zentralen Lage</strong> erreichen Sie das Meer, die Geschäfte, die Restaurants und die Sehenswürdigkeiten mühelos. Perfekt für einen entspannten Aufenthalt an der belgischen Küste.',
        'Wir bieten Ihnen <strong>komfortable Zimmer, einen herzlichen Service und eine familiäre Atmosphäre</strong>. Ideal für ein romantisches Wochenende, einen Familienurlaub oder eine erfrischende Auszeit am Meer.',
        'Jeden Morgen verwöhnen wir Sie mit einem frischen <strong>Frühstück</strong>, täglich mit <strong>frisch gebratenen Spiegeleiern und Speck</strong> sowie gekochten Eiern – ein herrlicher Start in den Tag!',
        'Kommen Sie und <strong>genießen</strong> Sie die frische Meeresluft, den weichen Sand und die herzliche Gastfreundschaft des Hotel Claridge. Wir freuen uns auf Ihren Besuch!',
      ],
      imageAlt: 'Die Fassade des Hotel Claridge in Blankenberge',
    },
    rooms: {
      eyebrow: 'Zimmer',
      title: 'Unsere Zimmer',
      text: 'Komfortzimmer, ein Standardzimmer und ein Familienzimmer für 4 Personen. Das Frühstück ist immer inbegriffen.',
      link: 'Alle Zimmer ansehen',
    },
    happytrip: {
      eyebrow: 'Mit dem Zug ans Meer',
      title: 'Happy-Trip-Vorteil für unsere Gäste',
      textHtml:
        'Buchen Sie direkt bei uns und erhalten Sie <strong>Rabattcodes</strong> für Ihre Zugfahrt an die Küste!<br />Nur 14 € hin und zurück, ab jedem belgischen Bahnhof. Kein Parkstress. Keine zusätzlichen Kosten.',
      callToAction: 'Fragen Sie Ihren Happy-Trip-Rabatt bei Ihrer Buchung an!',
      imageAlt: 'Happy-Trip-Vorteil',
    },
  },

  rooms: {
    title: 'Zimmer',
    description:
      'Entdecken Sie die Zimmer des Hotel Claridge in Blankenberge: Komfortzimmer mit Badewanne oder Dusche, ein Standardzimmer und ein Familienzimmer für 4 Personen.',
    eyebrow: 'Zimmer',
    heading: 'Unsere Zimmer',
    intro: 'Komfortable Zimmer mit familiärer Atmosphäre, 400 Meter vom Strand entfernt.',
    included: 'In jedem Zimmer inbegriffen',
    includedItems: ['Frühstück', 'TV', 'Gratis WLAN', 'Haartrockner'],
    requestRoom: 'Dieses Zimmer anfragen',
    happytripNoteHtml:
      'Buchen Sie direkt bei uns und erhalten Sie den <strong>Happy-Trip-Gästevorteil</strong> – Rabatt auf die Zugfahrt an die Küste!',
    items: {
      'type-a': {
        name: 'Komfortzimmer mit Badewanne',
        summary: 'Komfortzimmer mit Badewanne/WC und einem Doppelbett.',
        guests: '2 Personen, Zustellbett möglich',
        bed: 'Doppelbett',
        bathroom: 'Badewanne und WC',
        extras: ['Minibar / Kühlschrank', 'Wasserkocher'],
        note: '',
        imageAlt: 'Komfortzimmer mit Badewanne',
      },
      'type-b': {
        name: 'Komfortzimmer mit zwei Betten',
        summary: 'Komfortzimmer mit Dusche/WC und zwei Einzelbetten.',
        guests: '2 Personen, Zustellbett möglich',
        bed: 'Zwei Einzelbetten',
        bathroom: 'Dusche und WC',
        extras: ['Minibar / Kühlschrank', 'Wasserkocher'],
        note: '',
        imageAlt: 'Komfortzimmer mit Dusche und zwei Einzelbetten',
      },
      'type-c': {
        name: 'Standardzimmer',
        summary: 'Kleines Zimmer mit Dusche/WC und einem Doppelbett.',
        guests: 'Max. 2 Personen',
        bed: 'Doppelbett',
        bathroom: 'Dusche und WC',
        extras: [],
        note: 'Kein Zustellbett möglich',
        imageAlt: 'Standardzimmer mit Dusche',
      },
      familiekamer: {
        name: 'Familienzimmer',
        summary: 'Platz für 4 Personen, mit zusätzlichem Komfort.',
        guests: '4 Personen, Zustellbetten möglich',
        bed: 'Ein Doppelbett und zwei Einzelbetten',
        bathroom: 'Badewanne und WC',
        extras: ['Minibar / Kühlschrank', 'Wasserkocher'],
        note: '',
        imageAlt: 'Familienzimmer',
      },
    },
  },

  rates: {
    title: 'Preise',
    description:
      'Preise des Hotel Claridge in Blankenberge, Frühstück inbegriffen. Sehen Sie die Preise pro Zimmertyp für Neben- und Hauptsaison.',
    eyebrow: 'Preise',
    heading: 'Preise',
    intro: 'Klare Preise pro Zimmertyp, Frühstück immer inbegriffen.',
    tableCaption: 'Preise pro Zimmertyp',
    roomType: 'Zimmertyp',
    lowSeason: 'Nebensaison',
    highSeason: 'Hauptsaison',
    note: 'Preise pro Zimmer und Nacht, Frühstück inbegriffen. Die Preise können je nach Zeitraum variieren.',
    promo: {
      eyebrow: 'Nebensaison',
      title: '3 + 1 Nacht gratis',
      text: 'Buchen Sie in der Nebensaison direkt bei uns? Dann zahlen Sie 3 Nächte und die 4. Nacht ist gratis. Gültig an gewöhnlichen Tagen, nicht in stark gefragten Zeiträumen.',
    },
    extraBeds: {
      title: 'Zustellbetten',
      note: 'Nicht möglich bei Typ C',
      items: {
        none: 'Kein Zustellbett (0 - 2 Jahre)',
        cot: 'Babybett (0 - 2 Jahre)',
        child: 'Kinderbett (3 - 12 Jahre)',
        single: 'Einzelbett (ab 12 Jahren)',
      },
    },
    included: {
      title: 'Inbegriffen',
      extraHtml: '<strong>Zusätzlich bei Typ A, B und im Familienzimmer:</strong> Minibar / Kühlschrank und Wasserkocher.',
    },
    touristTax: {
      title: 'Kurtaxe',
      text: '{bedrag} € pro Person und Nacht (nicht inbegriffen)',
    },
  },

  contact: {
    title: 'Kontakt',
    description:
      'Kontaktieren Sie das Hotel Claridge, de Limburg Stirumstraat 2, 8370 Blankenberge. Rufen Sie +32 476 68 88 88 an oder schreiben Sie uns eine E-Mail.',
    eyebrow: 'Kontakt',
    heading: 'Kontaktieren Sie uns',
    intro: 'Eine Frage zu Ihrem Aufenthalt? Wir helfen Ihnen gerne weiter.',
    details: 'Kontaktdaten',
    address: 'Adresse',
    mobile: 'Mobil',
    email: 'E-Mail',
    happytripNoteHtml:
      'Möchten Sie mit dem Zug kommen? Sagen Sie es uns bei Ihrer Reservierung und erhalten Sie einen <strong>Happy-Trip-Rabattcode</strong> für Ihre Reise!',
    mapTitle: 'Lage des Hotel Claridge auf Google Maps',
  },

  booking: {
    title: 'Aufenthalt anfragen',
    description:
      'Fragen Sie Ihren Aufenthalt direkt im Hotel Claridge in Blankenberge an. Wir prüfen die Verfügbarkeit und melden uns so schnell wie möglich bei Ihnen.',
    eyebrow: 'Direkt buchen',
    heading: 'Fragen Sie Ihren Aufenthalt an',
    intro:
      'Füllen Sie das Formular unten aus, um einen Aufenthalt anzufragen. Wir prüfen die Verfügbarkeit und melden uns so schnell wie möglich bei Ihnen.',
    yourDetails: 'Ihre Daten',
    yourRequest: 'Ihre Anfrage',
    name: 'Name',
    email: 'E-Mail',
    phone: 'Handynummer',
    phonePlaceholder: 'z. B. +32 123 45 67 89',
    optional: '(optional)',
    checkin: 'Anreisedatum',
    checkout: 'Abreisedatum',
    guests: 'Anzahl Personen',
    roomType: 'Gewünschter Zimmertyp',
    chooseRoom: 'Zimmer auswählen',
    remarks: 'Anmerkungen',
    submit: 'Aufenthalt anfragen',
    sending: 'Wird gesendet ...',
    robotCheck: 'Kreuzen Sie zuerst oben das Kästchen „Ich bin kein Roboter“ an.',
    error: 'Das Senden ist fehlgeschlagen. Versuchen Sie es erneut oder rufen Sie uns an unter',
    datesMissing: 'Bitte geben Sie sowohl ein Anreise- als auch ein Abreisedatum an.',
    datePattern: 'tt.mm.jjjj',
    dateInvalid: 'Dieses Datum ist nicht möglich.',
    openCalendar: 'Kalender öffnen',
    calendarLabel: 'Wählen Sie Ihr An- und Abreisedatum',
    previousMonth: 'Voriger Monat',
    nextMonth: 'Nächster Monat',
    monthLabel: 'Monat',
    yearLabel: 'Jahr',
    pickCheckin: 'Wählen Sie Ihr Anreisedatum',
    pickCheckout: 'Wählen Sie jetzt Ihr Abreisedatum',
    nightOne: '{n} Nacht',
    nightMany: '{n} Nächte',
    sent: {
      title: 'Vielen Dank für Ihre Anfrage',
      text: 'Wir haben Ihre Anfrage gut erhalten. Wir prüfen die Verfügbarkeit und melden uns so schnell wie möglich per E-Mail oder Telefon bei Ihnen.',
      mail: 'Sie erhalten außerdem eine Bestätigung Ihrer Anfrage per E-Mail.',
    },
    aside: {
      title: 'Gut zu wissen',
      availability: 'Wir prüfen die Verfügbarkeit und melden uns so schnell wie möglich bei Ihnen.',
      breakfast: 'Das Frühstück ist in jedem Zimmer inbegriffen.',
      trainHtml:
        'Kommen Sie mit dem Zug? Erwähnen Sie es bei Ihren Anmerkungen und erhalten Sie einen <strong>Happy-Trip-Rabattcode</strong>.',
      phoneTitle: 'Lieber telefonisch?',
    },
  },
};
