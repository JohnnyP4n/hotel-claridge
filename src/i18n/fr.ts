import type { Translation } from './types';

// Franse vertaling. Dezelfde sleutels als nl.ts; zie dat bestand voor de uitleg erbij.
export const fr: Translation = {
  name: 'Français',
  dateLocale: 'fr-BE',
  turnstile: 'fr',
  siteName: 'Hotel Claridge',
  homeTitle: 'Hotel Claridge | Hôtel de charme à Blankenberge',
  skipLink: 'Aller au contenu',

  nav: {
    label: 'Menu principal',
    menu: 'Menu',
    language: 'Langue',
    home: 'Accueil',
    rooms: 'Chambres',
    rates: 'Tarifs',
    contact: 'Contact',
    book: 'Demander un séjour',
  },

  common: {
    bookingCom: 'Ou réservez via Booking.com',
    bookingComShort: 'Réservez via Booking.com',
    mapsHint: '(ouvre Google Maps)',
    from: 'à partir de',
    perNight: 'par nuit',
    free: 'gratuit',
  },

  /** Message en haut du site quand l’hôtel est fermé ; {van} et {tot} deviennent des dates */
  notice: {
    closed: 'Nous sommes fermés du {van} au {tot} inclus.',
    closedOneDay: 'Nous sommes fermés le {van}.',
    fullyBooked: 'Nous sommes complets du {van} au {tot} inclus.',
    fullyBookedOneDay: 'Nous sommes complets le {van}.',
  },

  footer: {
    tagline: 'Hôtel de charme au cœur de Blankenberge, à seulement 400 mètres de la plage.',
    contact: 'Contact',
    menu: 'Menu',
    direct: 'Réservation directe',
    directText:
      'Réservez directement chez nous et profitez de l’avantage Happy Trip pour votre trajet en train vers la côte.',
    rights: 'Tous droits réservés',
  },

  cta: {
    title: 'Prêt pour un séjour à la mer ?',
    text: 'Demandez votre séjour directement. Nous vérifions les disponibilités et vous recontactons dans les plus brefs délais.',
  },

  home: {
    description:
      'Hotel Claridge est un hôtel de charme au cœur de Blankenberge, à 400 mètres de la plage. Chambres confortables, petit-déjeuner frais et ambiance familiale.',
    eyebrow: 'Blankenberge · Côte belge',
    lead: 'Séjour de charme au cœur de Blankenberge, à seulement 400 mètres de la plage.',
    highlights: {
      beach: { title: 'À 400 m de la plage', text: 'La mer et le sable à distance de marche' },
      central: { title: 'Situation centrale', text: 'Au calme entre le port de plaisance et la gare' },
      breakfast: { title: 'Petit-déjeuner frais', text: 'Chaque matin, avec œufs au plat et lard' },
      train: { title: 'Happy Trip', text: 'Réduction sur votre trajet en train vers la côte' },
    },
    intro: {
      eyebrow: 'Bienvenue',
      title: 'Bienvenue à l’Hotel Claridge',
      paragraphsHtml: [
        'L’<strong>Hotel Claridge</strong> est un hôtel de charme au cœur de Blankenberge, au calme entre le port de plaisance et la gare, à seulement <strong>400 mètres de la plage</strong>.',
        'Grâce à notre <strong>situation centrale</strong>, vous rejoignez facilement la mer, les commerces, les restaurants et les curiosités. Parfait pour un séjour détendu à la côte belge.',
        'Nous vous proposons des <strong>chambres confortables, un service chaleureux et une ambiance familiale</strong>. Idéal pour un week-end romantique, des vacances en famille ou une escapade revigorante à la mer.',
        'Chaque matin, nous vous gâtons avec un <strong>petit-déjeuner</strong> frais, avec chaque jour des <strong>œufs au plat et du lard</strong> ainsi que des œufs à la coque – un délicieux début de journée !',
        'Venez <strong>profiter</strong> de l’air marin, du sable fin et de l’accueil chaleureux de l’Hotel Claridge. Au plaisir de vous recevoir !',
      ],
      imageAlt: 'La façade de l’Hotel Claridge à Blankenberge',
    },
    rooms: {
      eyebrow: 'Chambres',
      title: 'Nos chambres',
      text: 'Des chambres confort, une chambre standard et une chambre familiale pour 4 personnes. Le petit-déjeuner est toujours inclus.',
      link: 'Voir toutes les chambres',
    },
    happytrip: {
      eyebrow: 'En train vers la mer',
      title: 'L’avantage Happy Trip pour nos hôtes',
      textHtml:
        'Réservez directement chez nous et recevez des <strong>codes de réduction</strong> pour votre trajet en train vers la côte !<br />Seulement 14 € aller-retour, au départ de n’importe quelle gare belge. Pas de stress de stationnement. Pas de frais supplémentaires.',
      callToAction: 'Demandez votre réduction Happy Trip lors de votre réservation !',
      imageAlt: 'Avantage Happy Trip',
    },
  },

  rooms: {
    title: 'Chambres',
    description:
      'Découvrez les chambres de l’Hotel Claridge à Blankenberge : chambres confort avec bain ou douche, une chambre standard et une chambre familiale pour 4 personnes.',
    eyebrow: 'Chambres',
    heading: 'Nos chambres',
    intro: 'Des chambres confortables à l’ambiance familiale, à 400 mètres de la plage.',
    included: 'Inclus dans chaque chambre',
    includedItems: ['Petit-déjeuner', 'Télévision', 'Wi-Fi gratuit', 'Sèche-cheveux'],
    requestRoom: 'Demander cette chambre',
    happytripNoteHtml:
      'Réservez directement chez nous et profitez de l’<strong>avantage Happy Trip</strong> – une réduction sur le train vers la côte !',
    items: {
      'type-a': {
        name: 'Chambre confort avec bain',
        summary: 'Chambre confort avec bain/WC et un lit double.',
        guests: '2 personnes, lit supplémentaire possible',
        bed: 'Lit double',
        bathroom: 'Bain et WC',
        extras: ['Minibar / frigo', 'Bouilloire'],
        note: '',
        imageAlt: 'Chambre confort avec bain',
      },
      'type-b': {
        name: 'Chambre confort avec deux lits',
        summary: 'Chambre confort avec douche/WC et deux lits séparés.',
        guests: '2 personnes, lit supplémentaire possible',
        bed: 'Deux lits séparés',
        bathroom: 'Douche et WC',
        extras: ['Minibar / frigo', 'Bouilloire'],
        note: '',
        imageAlt: 'Chambre confort avec douche et deux lits séparés',
      },
      'type-c': {
        name: 'Chambre standard',
        summary: 'Petite chambre avec douche/WC et un lit double.',
        guests: 'Max. 2 personnes',
        bed: 'Lit double',
        bathroom: 'Douche et WC',
        extras: [],
        note: 'Pas de lit supplémentaire possible',
        imageAlt: 'Chambre standard avec douche',
      },
      familiekamer: {
        name: 'Chambre familiale',
        summary: 'De la place pour 4 personnes, avec un confort supplémentaire.',
        guests: '4 personnes, lits supplémentaires possibles',
        bed: 'Un lit double et deux lits séparés',
        bathroom: 'Bain et WC',
        extras: ['Minibar / frigo', 'Bouilloire'],
        note: '',
        imageAlt: 'Chambre familiale',
      },
    },
  },

  rates: {
    title: 'Tarifs',
    description:
      'Tarifs de l’Hotel Claridge à Blankenberge, petit-déjeuner inclus. Découvrez les prix par type de chambre en basse et haute saison.',
    eyebrow: 'Tarifs',
    heading: 'Tarifs',
    intro: 'Des prix clairs par type de chambre, petit-déjeuner toujours inclus.',
    tableCaption: 'Prix par type de chambre',
    roomType: 'Type de chambre',
    lowSeason: 'Basse saison',
    highSeason: 'Haute saison',
    note: 'Prix par chambre et par nuit, petit-déjeuner inclus. Les prix peuvent varier selon la période.',
    promo: {
      eyebrow: 'Basse saison',
      title: '3 + 1 nuit gratuite',
      text: 'Vous réservez directement chez nous en basse saison ? Vous payez 3 nuits et la 4e est gratuite. Valable les jours ordinaires, pas pendant les périodes de forte affluence.',
    },
    extraBeds: {
      title: 'Lits supplémentaires',
      note: 'Pas possible en Type C',
      items: {
        none: 'Pas de lit supplémentaire (0 - 2 ans)',
        cot: 'Lit bébé (0 - 2 ans)',
        child: 'Lit enfant (3 - 12 ans)',
        single: 'Lit simple (à partir de 12 ans)',
      },
    },
    included: {
      title: 'Inclus',
      extraHtml: '<strong>En plus pour les types A, B et la chambre familiale :</strong> minibar / frigo et bouilloire.',
    },
    touristTax: {
      title: 'Taxe de séjour',
      text: '{bedrag} € par personne et par nuit (non incluse)',
    },
  },

  contact: {
    title: 'Contact',
    description:
      'Contactez l’Hotel Claridge, de Limburg Stirumstraat 2, 8370 Blankenberge. Appelez le +32 476 68 88 88 ou envoyez-nous un e-mail.',
    eyebrow: 'Contact',
    heading: 'Contactez-nous',
    intro: 'Une question sur votre séjour ? Nous vous aidons volontiers.',
    details: 'Coordonnées',
    address: 'Adresse',
    mobile: 'GSM',
    email: 'E-mail',
    happytripNoteHtml:
      'Vous comptez venir en train ? Signalez-le lors de votre réservation et recevez un <strong>code de réduction Happy Trip</strong> pour votre voyage !',
    mapTitle: 'Situation de l’Hotel Claridge sur Google Maps',
  },

  booking: {
    title: 'Demander un séjour',
    description:
      'Demandez votre séjour directement à l’Hotel Claridge à Blankenberge. Nous vérifions les disponibilités et vous recontactons dans les plus brefs délais.',
    eyebrow: 'Réservation directe',
    heading: 'Demandez votre séjour',
    intro:
      'Remplissez le formulaire ci-dessous pour demander un séjour. Nous vérifions les disponibilités et vous recontactons dans les plus brefs délais.',
    yourDetails: 'Vos coordonnées',
    yourRequest: 'Votre demande',
    name: 'Nom',
    email: 'E-mail',
    phone: 'Numéro de GSM',
    phonePlaceholder: 'p. ex. +32 123 45 67 89',
    optional: '(facultatif)',
    checkin: 'Date d’arrivée',
    checkout: 'Date de départ',
    guests: 'Nombre de personnes',
    roomType: 'Type de chambre souhaité',
    chooseRoom: 'Choisissez une chambre',
    remarks: 'Remarques',
    submit: 'Demander un séjour',
    sending: 'Envoi en cours...',
    robotCheck: 'Cochez d’abord la case « Je ne suis pas un robot » ci-dessus.',
    error: 'L’envoi a échoué. Réessayez ou appelez-nous au',
    datesMissing: 'Veuillez indiquer une date d’arrivée et une date de départ.',
    datePattern: 'jj/mm/aaaa',
    dateInvalid: 'Cette date ne peut pas être choisie.',
    unavailable: 'Non disponible',
    openCalendar: 'Ouvrir le calendrier',
    calendarLabel: 'Choisissez vos dates d’arrivée et de départ',
    previousMonth: 'Mois précédent',
    nextMonth: 'Mois suivant',
    monthLabel: 'Mois',
    yearLabel: 'Année',
    pickCheckin: 'Choisissez votre date d’arrivée',
    pickCheckout: 'Choisissez maintenant votre date de départ',
    nightOne: '{n} nuit',
    nightMany: '{n} nuits',
    sent: {
      title: 'Merci pour votre demande',
      text: 'Nous avons bien reçu votre demande. Nous vérifions les disponibilités et vous recontactons dans les plus brefs délais par e-mail ou par téléphone.',
      mail: 'Vous recevez également une confirmation de votre demande par e-mail.',
    },
    aside: {
      title: 'Bon à savoir',
      availability: 'Nous vérifions les disponibilités et vous recontactons dans les plus brefs délais.',
      breakfast: 'Le petit-déjeuner est inclus dans chaque chambre.',
      trainHtml:
        'Vous venez en train ? Mentionnez-le dans vos remarques et recevez un <strong>code de réduction Happy Trip</strong>.',
      phoneTitle: 'Vous préférez téléphoner ?',
    },
  },
};
