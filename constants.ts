
import { Room, SiteContent, Amenity, ThemeSettings, SeoSettings, SectionVisibility, NavLinkItem, TranslationDictionary, GalleryCardData, Testimonial } from './types';

// --- ROOM TEMPLATES & DATA ---

export const ROOM_CATEGORIES = [
  "Chambre Double",
  "Chambre Triple",
  "Chambre Quadruple",
  "Appartement 2 Pièces"
];

export const ROOM_TEMPLATES: Record<string, Partial<Room>> = {
  "Chambre Double": {
    description: `Une chambre confortable et lumineuse avec deux lits simples, réputés pour leur confort (note 7,9). Idéale pour un séjour reposant avec une vue apaisante sur le jardin.`,
    size: "30 m²",
    capacity: 2,
    features: [
      "Wi-Fi Gratuit", 
      "Climatisation", 
      "Télévision à écran plat", 
      "TV Satellite",
      "Vue sur le jardin", 
      "Baignoire", 
      "Douche",
      "Toilettes privatives",
      "Réfrigérateur", 
      "Chauffage", 
      "Téléphone",
      "Détecteur de monoxyde de carbone",
      "Gel hydroalcoolique",
      "Non-fumeurs"
    ]
  },
  "Chambre Triple": {
    description: `Spacieuse et conviviale, cette chambre dispose de trois lits simples confortables. Un choix parfait pour les petits groupes ou les familles, offrant calme et intimité.`,
    size: "36 m²",
    capacity: 3,
    features: [
      "Wi-Fi Gratuit", 
      "Climatisation", 
      "Télévision à écran plat", 
      "TV Satellite",
      "Vue sur le jardin", 
      "Baignoire", 
      "Douche",
      "Toilettes privatives",
      "Réfrigérateur", 
      "Chauffage", 
      "Téléphone",
      "Détecteur de monoxyde de carbone",
      "Gel hydroalcoolique",
      "Non-fumeurs"
    ]
  },
  "Chambre Quadruple": {
    description: `Un grand espace de vie de 44 m² équipé de quatre lits simples. Cette chambre offre tout le confort nécessaire pour les familles nombreuses ou les groupes d'amis.`,
    size: "44 m²",
    capacity: 4,
    features: [
      "Wi-Fi Gratuit", 
      "Climatisation", 
      "Télévision à écran plat", 
      "TV Satellite",
      "Vue sur le jardin", 
      "Baignoire", 
      "Douche",
      "Toilettes privatives",
      "Réfrigérateur", 
      "Chauffage", 
      "Téléphone",
      "Détecteur de monoxyde de carbone",
      "Gel hydroalcoolique",
      "Non-fumeurs"
    ]
  },
  "Appartement 2 Pièces": {
    description: `Un appartement entier de 60 m² pour une indépendance totale. Il se compose de deux chambres séparées : la première avec un grand lit double, la seconde avec trois lits simples.`,
    size: "60 m²",
    capacity: 5,
    features: [
      "Appartement entier",
      "Wi-Fi Gratuit", 
      "Climatisation", 
      "Télévision à écran plat", 
      "TV Satellite",
      "Vue sur le jardin", 
      "Baignoire", 
      "Douche",
      "Toilettes privatives",
      "Réfrigérateur", 
      "Chauffage", 
      "Téléphone",
      "Fax",
      "Détecteur de monoxyde de carbone",
      "Non-fumeurs"
    ]
  }
};

export const INITIAL_CONTENT: SiteContent = {
  heroTitle: "Résidence El Arich",
  heroSubtitle: "Élégance et confort aux portes du désert à Tozeur",
  heroImage: "https://yourimageshare.com/ib/0mqzi7WnZt.png",
  aboutTitle: "À propos de la Résidence",
  aboutText: `Située aux portes du désert et à mi-chemin entre la zone touristique et le centre-ville, la Résidence El Arich vous accueille dans un bâtiment élégant à 3 kilomètres seulement de l'aéroport.

La Résidence El Arich vous propose des chambres et suites, chacune dotées d'équipements tout confort, notamment des chaînes satellite. Certaines chambres offrent une vue panoramique sur les palmiers de l'oasis.

Pendant votre séjour, profitez du calme absolu de la Résidence El Arich. L'architecture traditionnelle en briques de Tozeur confère au lieu un charme authentique et apaisant.

La résidence vous permet d'accéder à de nombreuses attractions, notamment des sources, le zoo et différents musées. Elle se trouve à 5 minutes en taxi du centre-ville.`,
  aboutImage1: "https://yourimageshare.com/ib/yjeVdEpl4E.webp",
  aboutImage2: "https://yourimageshare.com/ib/hXhaF9aDB3.webp",
  locationTitle: "Notre Emplacement",
  locationText: "Zone Touristique, 2200 Tozeur, Tunisie. À 2.8km de l'Aéroport international de Tozeur-Nefta.",
  contactEmail: "elarichtozeur@gmail.com",
  contactPhone: "+216 76 462 644",
  address: "Zone Touristique, 2200 Tozeur, Tunisie",
  mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3316.5!2d8.12!3d33.91!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDU0JzUxLjgiTiA4wrAwNyc0My42IkU!5e0!3m2!1sfr!2stn!4v1600000000000!5m2!1sfr!2stn",
  googleMapsLink: "https://www.google.com/maps/place/R%C3%A9sidence+El+Arich/@33.914389,8.128778,17z/",
  ratingScore: 4.0,
  ctaImage: "https://yourimageshare.com/ib/YBJAoJJLLH.webp",
  serviceImage: "https://yourimageshare.com/ib/cMif5GzVtg.jpg",
  logo: "",
  footerImage: ""
};

export const INITIAL_ROOMS: Room[] = [
  {
    id: 'appt-oasis',
    name: 'Appartement 2 Pièces',
    category: 'Appartement 2 Pièces',
    ...ROOM_TEMPLATES["Appartement 2 Pièces"] as any,
    price: 280,
    promotionPrice: 240,
    promotionLabel: 'Promo Famille',
    images: ['https://yourimageshare.com/ib/biUl3r9yAc.jpg'],
    available: true
  },
  {
    id: 'chambre-double',
    name: 'Chambre Double',
    category: 'Chambre Double',
    ...ROOM_TEMPLATES["Chambre Double"] as any,
    price: 120,
    images: ['https://yourimageshare.com/ib/cRJlQyb1ll.jpg'],
    available: true
  },
  {
    id: 'chambre-quad',
    name: 'Chambre Quadruple',
    category: 'Chambre Quadruple',
    ...ROOM_TEMPLATES["Chambre Quadruple"] as any,
    price: 200,
    images: ['https://yourimageshare.com/ib/idRsEuzhr8.jpg'],
    available: true
  }
];

export const INITIAL_AMENITIES: Amenity[] = [
  { 
    id: '1', 
    name: 'Parking Privé', 
    icon: 'Car', 
    description: 'Un parking gratuit et sécurisé est disponible sur place (sans réservation préalable).' 
  },
  { 
    id: '2', 
    name: 'Wi-Fi Gratuit', 
    icon: 'Wifi', 
    description: 'Une connexion Wi-Fi haut débit est disponible dans tout l\'établissement gratuitement.' 
  },
  { 
    id: '3', 
    name: 'Petit-Déjeuner', 
    icon: 'Coffee', 
    description: 'Savourez un petit-déjeuner continental varié servi chaque matin dans notre salle dédiée.' 
  },
  { 
    id: '4', 
    name: 'Réception 24h/24', 
    icon: 'Clock', 
    description: 'Notre équipe vous accueille et vous assiste à toute heure du jour et de la nuit.' 
  },
  { 
    id: '5', 
    name: 'Climatisation', 
    icon: 'Wind', 
    description: 'Toutes nos chambres sont équipées de climatisation réversible pour votre confort.' 
  },
  { 
    id: '6', 
    name: 'Excursions 4x4', 
    icon: 'MapPin', 
    description: 'Organisation de sorties vers les oasis de montagne, Chebika, Tamerza et Ong Jemel.' 
  },
  { 
    id: '7', 
    name: 'TV Satellite', 
    icon: 'Tv', 
    description: 'Télévision à écran plat avec chaînes satellite internationales dans chaque chambre.' 
  },
  { 
    id: '8', 
    name: 'Service de Ménage', 
    icon: 'CheckCircle', 
    description: 'Un service de ménage quotidien est assuré pour garantir une propreté irréprochable.' 
  },
  { 
    id: '9', 
    name: 'Jardin & Terrasse', 
    icon: 'Sun', 
    description: 'Détendez-vous dans notre jardin arboré ou sur la terrasse ensoleillée.' 
  },
  { 
    id: '10', 
    name: 'Sécurité 24/7', 
    icon: 'Shield', 
    description: 'Surveillance et gardiennage pour assurer votre tranquillité tout au long du séjour.' 
  },
  { 
    id: '11', 
    name: 'Bagagerie', 
    icon: 'Briefcase', 
    description: 'Service de bagagerie sécurisé pour profiter de votre dernière journée les mains libres.' 
  },
  { 
    id: '12', 
    name: 'Chauffage', 
    icon: 'Droplet', 
    description: 'Chauffage central performant pour les nuits fraîches du désert en hiver.' 
  }
];

export const INITIAL_GALLERY: GalleryCardData[] = [
  {
    id: 'card-interior',
    order: 1,
    category: "Réception, Intérieur & Petit Déjeuner",
    title: "Accueil & Gourmandise",
    description: "Élégance, luxe, saveurs locales...",
    images: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=800&auto=format&fit=crop", // Lounge/Interior
      "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=800&auto=format&fit=crop", // Breakfast Table
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=800&auto=format&fit=crop"  // Breakfast Dairy/Details
    ]
  },
  {
    id: 'card-exterior',
    order: 2,
    category: "Oasis & Loisirs",
    title: "Oasis & Loisirs",
    description: "Détente, Fraîcheur, Évasion.",
    images: [
      "https://placehold.co/800x1000/1a1a1a/FFFFFF/png?text=Oasis+Loisirs"
    ]
  },
  {
    id: 'card-parking',
    order: 3,
    category: "Parking",
    title: "Parking",
    description: "Sécurité, Espace, Tranquillité.",
    images: [
      "https://placehold.co/800x1000/1a1a1a/FFFFFF/png?text=Parking"
    ]
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah M.',
    role: 'Voyage en Famille',
    content: "Un séjour merveilleux ! Le personnel est très attentionné et le cadre est tout simplement magnifique, un véritable havre de paix.",
    rating: 5
  },
  {
    id: '2',
    name: 'Jean-Pierre L.',
    role: 'Séjour Affaires',
    content: "Excellent rapport qualité/prix. Les chambres sont spacieuses et propres, et le wifi fonctionne parfaitement pour travailler.",
    rating: 4
  },
  {
    id: '3',
    name: 'Emily Davis',
    role: 'Tourist from UK',
    content: "The location is perfect for exploring Tozeur. We loved the traditional architecture and the breakfast was delicious.",
    rating: 5
  }
];

export const INITIAL_THEME: ThemeSettings = {
  primaryColor: '#f56e1e', // Sunset Orange
  secondaryColor: '#14b8a6' // Vivid Teal
};

export const INITIAL_SEO: SeoSettings = {
  metaTitle: 'Résidence El Arich - Tozeur',
  metaDescription: 'Située aux portes du désert et à mi-chemin entre la zone touristique et le centre-ville, la Résidence El Arich vous accueille dans un bâtiment élégant.'
};

export const INITIAL_SECTIONS: SectionVisibility = {
  hero: true,
  features: true,
  about: true,
  gallery: true,
  testimonials: true,
  cta: true
};

export const INITIAL_NAV_LINKS: NavLinkItem[] = [
  { id: '1', label: 'Accueil', path: '/', visible: true, order: 1 },
  { id: '2', label: 'À propos', path: '/#about', visible: true, order: 2 },
  { id: '3', label: 'Chambres', path: '/rooms', visible: true, order: 3 },
  { id: '4', label: 'Services', path: '/amenities', visible: true, order: 4 },
];

export const TRANSLATIONS: { fr: TranslationDictionary; en: TranslationDictionary } = {
  fr: {
    common: {
      loading: "Chargement...",
      available: "Disponible",
      full: "Complet",
      promo: "Promo",
      tnd: "TND",
      perNight: "/ nuit",
      from: "À partir de",
      moreInfo: "En savoir plus",
      capacity: "Capacité",
      size: "Surface",
      features: "Équipements",
      others: "autres",
      viewPhotos: "Voir les photos"
    },
    nav: {
      home: 'Accueil',
      about: 'À propos',
      rooms: 'Chambres',
      services: 'Services',
      contact: 'Réservation',
      book: 'Réserver'
    },
    home: {
      welcome: 'Bienvenue à Tozeur',
      rating: 'Excellent',
      onGoogle: 'sur Google',
      heroSubtitle: 'Élégance et confort aux portes du désert à Tozeur',
      discoverSuites: 'Découvrir les Suites',
      reserve: 'Réserver Maintenant',
      features: {
        location: 'Emplacement Idéal',
        locationDesc: 'Entre centre-ville et zone touristique.',
        charm: 'Charme Authentique',
        charmDesc: 'Architecture traditionnelle et confort.',
        services: 'Services Complets',
        servicesDesc: 'Wifi, Parking, et Petit-déjeuner.'
      },
      featuredRooms: {
        subtitle: 'Hébergement de Luxe',
        title: 'Nos Suites à la Une',
        desc: 'Découvrez le confort et l\'élégance de nos meilleures chambres.',
        from: 'À partir de',
        perNight: '/ nuit',
        viewAll: "Voir toutes les chambres"
      },
      about: {
        subtitle: "L'Esprit du Lieu",
        titleFirst: "Au cœur de la",
        titleSecond: "palmeraie.",
        desc: "L'architecture traditionnelle en briques de Tozeur confère au lieu un charme authentique. Chaque détail a été pensé pour refléter l'héritage culturel de la région tout en offrant le confort moderne d'une résidence haut de gamme.",
        btn: "Découvrir nos services"
      },
      gallery: {
        subtitle: "Galerie Photos",
        titleFirst: "L'Art de Vivre",
        titleSecond: "à la Résidence El Arich Tozeur.",
        follow: "Suivez-nous",
        tourTitle: "Faisons un tour & Découvrons ensemble"
      },
      testimonials: {
        subtitle: "Avis Clients",
        title: "Ce qu'ils pensent de nous",
      },
      cta: {
        subtitle: "Une expérience inoubliable",
        titleFirst: "Vos vacances",
        titleSecond: "commencent ici.",
        desc: "Réservez directement sur notre site et profitez du meilleur tarif garanti ainsi que d'un service personnalisé.",
        btn: "Vérifier les disponibilités"
      }
    },
    rooms: {
      subtitle: "Hébergement",
      title: "Nos Suites & Chambres",
      desc: "Des espaces conçus pour la détente absolue, alliant le charme de l'architecture tozeuroise au confort contemporain.",
      emptyTitle: "Bientôt disponible",
      emptyDesc: "Les détails de nos chambres seront bientôt mis en ligne. Veuillez contacter la réception pour plus d'informations.",
      filter: {
        label: "Trier par :",
        priceAsc: "Prix Croissant",
        priceDesc: "Prix Décroissant",
        capacity: "Capacité"
      },
      contactReception: "Contacter la réception"
    },
    amenities: {
      subtitle: "Prestations",
      title: "Services & Expériences",
      desc: "Tout a été pensé pour votre confort, du petit-déjeuner traditionnel au service de chambre attentionné.",
      concierge: {
        tag: "Conciergerie",
        title: "Un besoin particulier ?",
        desc: "Notre équipe est à votre disposition 24h/24 pour organiser vos excursions dans le désert, réserver un restaurant ou préparer une surprise.",
        btn: "Contacter la Réception"
      }
    },
    contact: {
      subtitle: "Assistance 24/7",
      title: "Contact & Réservation",
      desc: "Planifiez votre séjour dès aujourd'hui.",
      info: {
        address: "Adresse",
        phone: "Téléphone",
        email: "Email",
        whatsapp: "Disponible sur WhatsApp",
        openMaps: "Ouvrir Maps"
      },
      form: {
        directRequest: "Demande directe",
        bookingTitle: "Booking.com",
        bookingDesc: "Vous préférez une réservation instantanée et sécurisée via notre partenaire ?",
        bookingBtn: "Réserver sur Booking",
        labels: {
          name: "Nom Complet",
          email: "Email",
          phone: "Téléphone",
          room: "Chambre",
          checkIn: "Arrivée",
          checkOut: "Départ",
          message: "Message"
        },
        placeholders: {
          name: "Votre nom",
          email: "votre@email.com",
          phone: "+216 ...",
          room: "Sélectionner...",
          message: "Demandes particulières..."
        },
        submit: "Envoyer la demande",
        sending: "Envoi en cours...",
        success: {
          title: "Merci !",
          desc: "Votre demande a bien été envoyée. Notre équipe de réception vous contactera dans les plus brefs délais pour confirmer votre séjour.",
          btn: "Envoyer une autre demande"
        }
      }
    },
    footer: {
      brandDesc: "L'élégance du désert, le confort d'une résidence de luxe. Une expérience unique à Tozeur.",
      explore: "Explore",
      contact: "Coordonnées",
      newsletter: "Restez informés",
      newsletterPlaceholder: "Email",
      subscribe: "S'abonner",
      rights: "Tous droits réservés.",
      legal: "Mentions Légales",
      privacy: "Politique de Confidentialité"
    },
    legalPage: {
      mentions: {
          title: "Mentions Légales",
          updated: "Dernière mise à jour : 01 Janvier 2024",
          sections: [
              {
                  heading: "Éditeur du Site",
                  content: "Le site Résidence El Arich est édité par l'établissement Résidence El Arich, situé à Zone Touristique, 2200 Tozeur, Tunisie.\nEmail : elarichtozeur@gmail.com\nTéléphone : +216 76 462 644"
              },
              {
                  heading: "Hébergement",
                  content: "Ce site est hébergé sur une infrastructure Cloud sécurisée. Les données sont stockées conformément aux réglementations en vigueur."
              },
              {
                  heading: "Propriété Intellectuelle",
                  content: "L'ensemble de ce site relève de la législation tunisienne et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques."
              },
              {
                  heading: "Responsabilité",
                  content: "La Résidence El Arich s'efforce d'assurer au mieux de ses possibilités, l'exactitude et la mise à jour des informations diffusées sur ce site. Toutefois, nous déclinons toute responsabilité pour toute imprécision, inexactitude ou omission portant sur des informations disponibles sur le site."
              }
          ]
      },
      privacy: {
          title: "Politique de Confidentialité",
          updated: "Dernière mise à jour : 01 Janvier 2024",
          sections: [
              {
                  heading: "Collecte des Données",
                  content: "Nous collectons des informations lorsque vous effectuez une demande de réservation sur notre site. Les informations collectées incluent votre nom, votre adresse e-mail, votre numéro de téléphone et les détails de votre séjour."
              },
              {
                  heading: "Utilisation des Données",
                  content: "Toutes les informations que nous recueillons auprès de vous peuvent être utilisées pour :\n- Personnaliser votre expérience et répondre à vos besoins individuels\n- Améliorer notre site Web\n- Améliorer le service client et vos besoins de prise en charge\n- Vous contacter par e-mail ou téléphone concernant votre réservation"
              },
              {
                  heading: "Confidentialité des Données",
                  content: "Nous sommes les seuls propriétaires des informations recueillies sur ce site. Vos informations personnelles ne seront pas vendues, échangées, transférées, ou données à une autre société pour n'importe quelle raison, sans votre consentement, en dehors de ce qui est nécessaire pour répondre à une demande et / ou une transaction."
              },
              {
                  heading: "Vos Droits",
                  content: "Conformément à la réglementation en vigueur, vous disposez d'un droit d'accès, de rectification et de suppression des informations personnelles vous concernant. Vous pouvez exercer ce droit en nous contactant à l'adresse email : elarichtozeur@gmail.com"
              }
          ]
      }
    }
  },
  en: {
    common: {
      loading: "Loading...",
      available: "Available",
      full: "Full",
      promo: "Promo",
      tnd: "TND",
      perNight: "/ night",
      from: "From",
      moreInfo: "More Info",
      capacity: "Capacity",
      size: "Size",
      features: "Features",
      others: "others",
      viewPhotos: "View Photos"
    },
    nav: {
      home: 'Home',
      about: 'About',
      rooms: 'Rooms',
      services: 'Services',
      contact: 'Booking',
      book: 'Book Now'
    },
    home: {
      welcome: 'Welcome to Tozeur',
      rating: 'Excellent',
      onGoogle: 'on Google',
      heroSubtitle: 'Elegance and comfort at the gates of the desert in Tozeur',
      discoverSuites: 'Discover Suites',
      reserve: 'Book Now',
      features: {
        location: 'Ideal Location',
        locationDesc: 'Between city center and tourist zone.',
        charm: 'Authentic Charm',
        charmDesc: 'Traditional architecture and comfort.',
        services: 'Full Services',
        servicesDesc: 'Wifi, Parking, and Breakfast.'
      },
      featuredRooms: {
        subtitle: 'Luxury Accommodation',
        title: 'Featured Suites',
        desc: 'Discover the comfort and elegance of our best rooms.',
        from: 'From',
        perNight: '/ night',
        viewAll: "View all rooms"
      },
      about: {
        subtitle: "The Spirit of the Place",
        titleFirst: "In the heart of the",
        titleSecond: "palm grove.",
        desc: "The traditional brick architecture of Tozeur gives the place an authentic charm. Every detail has been thought out to reflect the cultural heritage of the region while offering the modern comfort of a high-end residence.",
        btn: "Discover our services"
      },
      gallery: {
        subtitle: "Photo Gallery",
        titleFirst: "The Art of Living",
        titleSecond: "at Residence El Arich Tozeur.",
        follow: "Follow us",
        tourTitle: "Let's take a tour & Discover together"
      },
      testimonials: {
        subtitle: "Guest Reviews",
        title: "What they think of us",
      },
      cta: {
        subtitle: "An unforgettable experience",
        titleFirst: "Your holidays",
        titleSecond: "start here.",
        desc: "Book directly on our site and enjoy the best guaranteed rate as well as personalized service.",
        btn: "Check availability"
      }
    },
    rooms: {
      subtitle: "Accommodation",
      title: "Our Suites & Rooms",
      desc: "Spaces designed for absolute relaxation, combining the charm of Tozeur architecture with contemporary comfort.",
      emptyTitle: "Coming soon",
      emptyDesc: "Room details will be online soon. Please contact reception for more information.",
      filter: {
        label: "Sort by:",
        priceAsc: "Price Ascending",
        priceDesc: "Price Descending",
        capacity: "Capacity"
      },
      contactReception: "Contact reception"
    },
    amenities: {
      subtitle: "Services",
      title: "Services & Experiences",
      desc: "Everything has been thought out for your comfort, from traditional breakfast to attentive room service.",
      concierge: {
        tag: "Concierge",
        title: "A special need?",
        desc: "Our team is at your disposal 24/7 to organize your desert excursions, book a restaurant, or prepare a surprise.",
        btn: "Contact Reception"
      }
    },
    contact: {
      subtitle: "24/7 Assistance",
      title: "Contact & Booking",
      desc: "Plan your stay today.",
      info: {
        address: "Address",
        phone: "Phone",
        email: "Email",
        whatsapp: "Available on WhatsApp",
        openMaps: "Open Maps"
      },
      form: {
        directRequest: "Direct Request",
        bookingTitle: "Booking.com",
        bookingDesc: "Prefer an instant and secure booking via our partner?",
        bookingBtn: "Book on Booking",
        labels: {
          name: "Full Name",
          email: "Email",
          phone: "Phone",
          room: "Room",
          checkIn: "Check-in",
          checkOut: "Check-out",
          message: "Message"
        },
        placeholders: {
          name: "Your name",
          email: "your@email.com",
          phone: "+216 ...",
          room: "Select...",
          message: "Special requests..."
        },
        submit: "Send Request",
        sending: "Sending...",
        success: {
          title: "Thank you!",
          desc: "Your request has been sent successfully. Our reception team will contact you as soon as possible to confirm your stay.",
          btn: "Send another request"
        }
      }
    },
    footer: {
      brandDesc: "The elegance of the desert, the comfort of a luxury residence. A unique experience in Tozeur.",
      explore: "Explore",
      contact: "Contact Info",
      newsletter: "Stay informed",
      newsletterPlaceholder: "Email",
      subscribe: "Subscribe",
      rights: "All rights reserved.",
      legal: "Legal Notice",
      privacy: "Privacy Policy"
    },
    legalPage: {
      mentions: {
          title: "Legal Notice",
          updated: "Last updated: January 01, 2024",
          sections: [
              {
                  heading: "Site Publisher",
                  content: "The Residence El Arich site is published by Residence El Arich, located at Zone Touristique, 2200 Tozeur, Tunisia.\nEmail: elarichtozeur@gmail.com\nPhone: +216 76 462 644"
              },
              {
                  heading: "Hosting",
                  content: "This site is hosted on a secure Cloud infrastructure. Data is stored in accordance with current regulations."
              },
              {
                  heading: "Intellectual Property",
                  content: "This entire site is subject to Tunisian and international legislation on copyright and intellectual property. All reproduction rights are reserved, including for downloadable documents and iconographic and photographic representations."
              },
              {
                  heading: "Liability",
                  content: "Residence El Arich strives to ensure the accuracy and updating of the information disseminated on this site to the best of its ability. However, we decline all responsibility for any inaccuracy, inaccuracy or omission concerning information available on the site."
              }
          ]
      },
      privacy: {
          title: "Privacy Policy",
          updated: "Last updated: January 01, 2024",
          sections: [
              {
                  heading: "Data Collection",
                  content: "We collect information when you make a reservation request on our site. The information collected includes your name, email address, phone number, and stay details."
              },
              {
                  heading: "Data Usage",
                  content: "Any information we collect from you may be used to:\n- Personalize your experience and respond to your individual needs\n- Improve our website\n- Improve customer service and your support needs\n- Contact you by email or phone regarding your reservation"
              },
              {
                  heading: "Data Confidentiality",
                  content: "We are the sole owners of the information collected on this site. Your personal information will not be sold, exchanged, transferred, or given to another company for any reason, without your consent, other than what is necessary to respond to a request and/or transaction."
              },
              {
                  heading: "Your Rights",
                  content: "In accordance with current regulations, you have a right of access, rectification, and deletion of personal information concerning you. You can exercise this right by contacting us at the email address: elarichtozeur@gmail.com"
              }
          ]
      }
    }
  }
};
