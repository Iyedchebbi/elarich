
import { Room, SiteContent, Amenity, ThemeSettings, SeoSettings, SectionVisibility, NavLinkItem, TranslationDictionary, GalleryCardData, Testimonial } from './types';

// --- ROOM TEMPLATES & DATA ---

export const ROOM_CATEGORIES = [
  "Chambre Double",
  "Chambre Triple",
  "Chambre Quadruple",
  "Appartement 2 Pièces"
];

// NOTE: Templates are mostly for quick-fill in Admin, we focus on English data in INITIAL_ROOMS below
export const ROOM_TEMPLATES: Record<string, Partial<Room>> = {
  "Chambre Double": {
    description: `Une chambre confortable et lumineuse avec deux lits simples, réputés pour leur confort (note 7,9). Idéale pour un séjour reposant avec une vue apaisante sur le jardin.`,
    descriptionEn: `A comfortable and bright room with two single beds, renowned for their comfort (rated 7.9). Ideal for a relaxing stay with a soothing view of the garden.`,
    size: "30 m²",
    capacity: 2,
    features: [
      "Wi-Fi Gratuit", 
      "Climatisation", 
      "Télévision à écran plat", 
      "Vue sur le jardin", 
      "Baignoire", 
      "Douche",
      "Réfrigérateur", 
      "Chauffage", 
      "Téléphone",
      "Non-fumeurs"
    ],
    featuresEn: [
      "Free Wi-Fi", 
      "Air Conditioning", 
      "Flat-screen TV", 
      "Garden View", 
      "Bathtub", 
      "Shower",
      "Refrigerator", 
      "Heating", 
      "Telephone",
      "Non-smoking"
    ]
  },
  "Chambre Triple": {
    description: `Spacieuse et conviviale, cette chambre dispose de trois lits simples confortables. Un choix parfait pour les petits groupes ou les familles, offrant calme et intimité.`,
    descriptionEn: `Spacious and friendly, this room features three comfortable single beds. A perfect choice for small groups or families, offering calm and privacy.`,
    size: "36 m²",
    capacity: 3,
    features: ["Wi-Fi Gratuit", "Climatisation", "Télévision", "Douche", "Réfrigérateur"],
    featuresEn: ["Free Wi-Fi", "Air Conditioning", "TV", "Shower", "Fridge"]
  },
  "Chambre Quadruple": {
    description: `Un grand espace de vie de 44 m² équipé de quatre lits simples. Cette chambre offre tout le confort nécessaire pour les familles nombreuses ou les groupes d'amis.`,
    descriptionEn: `A large living space of 44 m² equipped with four single beds. This room offers all the necessary comfort for large families or groups of friends.`,
    size: "44 m²",
    capacity: 4,
    features: ["Wi-Fi Gratuit", "Climatisation", "Télévision", "Douche", "Réfrigérateur"],
    featuresEn: ["Free Wi-Fi", "Air Conditioning", "TV", "Shower", "Fridge"]
  },
  "Appartement 2 Pièces": {
    description: `Un appartement entier de 60 m² pour une indépendance totale. Il se compose de deux chambres séparées : la première avec un grand lit double, la seconde avec trois lits simples.`,
    descriptionEn: `A whole 60 m² apartment for total independence. It consists of two separate bedrooms: the first with a large double bed, the second with three single beds.`,
    size: "60 m²",
    capacity: 5,
    features: ["Appartement entier", "Wi-Fi Gratuit", "Climatisation", "Cuisine", "Salon"],
    featuresEn: ["Entire Apartment", "Free Wi-Fi", "Air Conditioning", "Kitchen", "Living Room"]
  }
};

export const INITIAL_CONTENT: SiteContent = {
  heroTitle: "Résidence El Arich",
  heroTitleEn: "Residence El Arich",
  heroSubtitle: "Élégance et confort aux portes du désert à Tozeur",
  heroSubtitleEn: "Elegance and comfort at the gates of the desert in Tozeur",
  heroImage: "https://yourimageshare.com/ib/0mqzi7WnZt.png",
  aboutTitle: "À propos de la Résidence",
  aboutTitleEn: "About the Residence",
  aboutText: `Située aux portes du désert et à mi-chemin entre la zone touristique et le centre-ville, la Résidence El Arich vous accueille dans un bâtiment élégant à 3 kilomètres seulement de l'aéroport.

La Résidence El Arich vous propose des chambres et suites, chacune dotées d'équipements tout confort, notamment des chaînes satellite. Certaines chambres offrent une vue panoramique sur les palmiers de l'oasis.

Pendant votre séjour, profitez du calme absolu de la Résidence El Arich. L'architecture traditionnelle en briques de Tozeur confère au lieu un charme authentique et apaisant.

La résidence vous permet d'accéder à de nombreuses attractions, notamment des sources, le zoo et différents musées. Elle se trouve à 5 minutes en taxi du centre-ville.`,
  aboutTextEn: `Located at the gates of the desert and halfway between the tourist zone and the city center, Residence El Arich welcomes you in an elegant building just 3 kilometers from the airport.

Residence El Arich offers rooms and suites, each equipped with comfortable amenities, including satellite channels. Some rooms offer a panoramic view of the oasis palms.

During your stay, enjoy the absolute calm of Residence El Arich. The traditional brick architecture of Tozeur gives the place an authentic and soothing charm.

The residence gives you access to many attractions, including springs, the zoo, and various museums. It is a 5-minute taxi ride from the city center.`,
  aboutImage1: "https://yourimageshare.com/ib/yjeVdEpl4E.webp",
  aboutImage2: "https://yourimageshare.com/ib/hXhaF9aDB3.webp",
  locationTitle: "Notre Emplacement",
  locationTitleEn: "Our Location",
  locationText: "Zone Touristique, 2200 Tozeur, Tunisie. À 2.8km de l'Aéroport international de Tozeur-Nefta.",
  locationTextEn: "Tourist Zone, 2200 Tozeur, Tunisia. 2.8km from Tozeur-Nefta International Airport.",
  contactEmail: "elarichtozeur@gmail.com",
  contactPhone: "+216 76 462 644",
  address: "Zone Touristique, 2200 Tozeur, Tunisie",
  addressEn: "Tourist Zone, 2200 Tozeur, Tunisia",
  mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3316.5!2d8.12!3d33.91!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDU0JzUxLjgiTiA4wrAwNyc0My42IkU!5e0!3m2!1sfr!2stn!4v1600000000000!5m2!1sfr!2stn",
  googleMapsLink: "https://www.google.com/maps/place/R%C3%A9sidence+El+Arich/@33.914389,8.128778,17z/",
  bookingUrl: "https://www.booking.com/hotel/tn/residence-el-arich.fr.html",
  showBookingUrl: true,
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
    nameEn: '2-Room Apartment',
    category: 'Appartement 2 Pièces',
    categoryEn: '2-Room Apartment',
    ...ROOM_TEMPLATES["Appartement 2 Pièces"] as any,
    price: 90,
    promotionPrice: 75,
    promotionLabel: 'Promo Famille',
    promotionLabelEn: 'Family Promo',
    images: ['https://yourimageshare.com/ib/biUl3r9yAc.jpg'],
    available: true
  },
  {
    id: 'chambre-double',
    name: 'Chambre Double',
    nameEn: 'Double Room',
    category: 'Chambre Double',
    categoryEn: 'Double Room',
    ...ROOM_TEMPLATES["Chambre Double"] as any,
    price: 40,
    images: ['https://yourimageshare.com/ib/cRJlQyb1ll.jpg'],
    available: true
  },
  {
    id: 'chambre-triple',
    name: 'Chambre Triple',
    nameEn: 'Triple Room',
    category: 'Chambre Triple',
    categoryEn: 'Triple Room',
    ...ROOM_TEMPLATES["Chambre Triple"] as any,
    price: 55,
    images: ['https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=800&auto=format&fit=crop'],
    available: true
  },
  {
    id: 'chambre-quad',
    name: 'Chambre Quadruple',
    nameEn: 'Quadruple Room',
    category: 'Chambre Quadruple',
    categoryEn: 'Quadruple Room',
    ...ROOM_TEMPLATES["Chambre Quadruple"] as any,
    price: 65,
    images: ['https://yourimageshare.com/ib/idRsEuzhr8.jpg'],
    available: true
  }
];

export const INITIAL_AMENITIES: Amenity[] = [
  { 
    id: '1', 
    name: 'Parking Privé',
    nameEn: 'Private Parking',
    icon: 'CarFront', 
    description: 'Un parking gratuit et sécurisé est disponible sur place (sans réservation préalable).',
    descriptionEn: 'Free and secure parking is available on site (reservation not needed).'
  },
  { 
    id: '2', 
    name: 'Wi-Fi Gratuit',
    nameEn: 'Free Wi-Fi',
    icon: 'Wifi', 
    description: 'Une connexion Wi-Fi haut débit est disponible dans tout l\'établissement gratuitement.',
    descriptionEn: 'High-speed Wi-Fi is available throughout the property free of charge.'
  },
  { 
    id: '3', 
    name: 'Petit-Déjeuner',
    nameEn: 'Breakfast',
    icon: 'Coffee', 
    description: 'Savourez un petit-déjeuner continental varié servi chaque matin dans notre salle dédiée.',
    descriptionEn: 'Enjoy a varied continental breakfast served every morning in our dedicated room.'
  },
  { 
    id: '4', 
    name: 'Réception 24h/24',
    nameEn: '24/7 Reception',
    icon: 'ConciergeBell', 
    description: 'Notre équipe vous accueille et vous assiste à toute heure du jour et de la nuit.',
    descriptionEn: 'Our team welcomes and assists you at any time of the day or night.'
  },
  { 
    id: '5', 
    name: 'Climatisation',
    nameEn: 'Air Conditioning',
    icon: 'Snowflake', 
    description: 'Toutes nos chambres sont équipées de climatisation réversible pour votre confort.',
    descriptionEn: 'All our rooms are equipped with reversible air conditioning for your comfort.'
  },
  { 
    id: '6', 
    name: 'Excursions 4x4',
    nameEn: '4x4 Excursions',
    icon: 'Mountain', 
    description: 'Organisation de sorties vers les oasis de montagne, Chebika, Tamerza et Ong Jemel.',
    descriptionEn: 'Organization of trips to the mountain oases, Chebika, Tamerza, and Ong Jemel.'
  },
  { 
    id: '7', 
    name: 'TV Satellite',
    nameEn: 'Satellite TV',
    icon: 'Tv', 
    description: 'Télévision à écran plat avec chaînes satellite internationales dans chaque chambre.',
    descriptionEn: 'Flat-screen TV with international satellite channels in every room.'
  },
  { 
    id: '8', 
    name: 'Service de Ménage',
    nameEn: 'Housekeeping',
    icon: 'Sparkles', 
    description: 'Un service de ménage quotidien est assuré pour garantir une propreté irréprochable.',
    descriptionEn: 'Daily housekeeping service is provided to ensure impeccable cleanliness.'
  },
  { 
    id: '9', 
    name: 'Jardin & Terrasse',
    nameEn: 'Garden & Terrace',
    icon: 'Palmtree', 
    description: 'Détendez-vous dans notre jardin arboré ou sur la terrasse ensoleillée.',
    descriptionEn: 'Relax in our tree-filled garden or on the sunny terrace.'
  },
  { 
    id: '10', 
    name: 'Sécurité 24/7',
    nameEn: '24/7 Security',
    icon: 'ShieldCheck', 
    description: 'Surveillance et gardiennage pour assurer votre tranquillité tout au long du séjour.',
    descriptionEn: 'Surveillance and security to ensure your peace of mind throughout your stay.'
  },
  { 
    id: '11', 
    name: 'Bagagerie',
    nameEn: 'Luggage Storage',
    icon: 'Luggage', 
    description: 'Service de bagagerie sécurisé pour profiter de votre dernière journée les mains libres.',
    descriptionEn: 'Secure luggage service so you can enjoy your last day hands-free.'
  },
  { 
    id: '12', 
    name: 'Chauffage',
    nameEn: 'Heating',
    icon: 'Flame', 
    description: 'Chauffage central performant pour les nuits fraîches du désert en hiver.',
    descriptionEn: 'Efficient central heating for cool desert nights in winter.'
  }
];

export const INITIAL_GALLERY: GalleryCardData[] = [
  {
    id: 'card-interior',
    order: 1,
    category: "Réception, Intérieur & Petit Déjeuner",
    categoryEn: "Reception, Interior & Breakfast",
    title: "Accueil & Gourmandise",
    titleEn: "Welcome & Delicacies",
    description: "Élégance, luxe, saveurs locales...",
    descriptionEn: "Elegance, luxury, local flavors...",
    images: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=800&auto=format&fit=crop", 
      "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=800&auto=format&fit=crop", 
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=800&auto=format&fit=crop"
    ]
  },
  {
    id: 'card-exterior',
    order: 2,
    category: "Oasis & Loisirs",
    categoryEn: "Oasis & Leisure",
    title: "Oasis & Loisirs",
    titleEn: "Oasis & Leisure",
    description: "Détente, Fraîcheur, Évasion.",
    descriptionEn: "Relaxation, Freshness, Escape.",
    images: [
      "https://placehold.co/800x1000/1a1a1a/FFFFFF/png?text=Oasis+Loisirs"
    ]
  },
  {
    id: 'card-parking',
    order: 3,
    category: "Parking",
    categoryEn: "Parking",
    title: "Parking",
    titleEn: "Parking",
    description: "Sécurité, Espace, Tranquillité.",
    descriptionEn: "Security, Space, Tranquility.",
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
      tnd: "€",
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
  },
  en: {
    common: {
      loading: "Loading...",
      available: "Available",
      full: "Full",
      promo: "Promo",
      tnd: "€", 
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
      contactReception: "Contact Reception"
    },
    amenities: {
      subtitle: "Services",
      title: "Services & Experiences",
      desc: "Everything has been thought of for your comfort, from traditional breakfast to attentive room service.",
      concierge: {
        tag: "Concierge",
        title: "A special need?",
        desc: "Our team is available 24/7 to organize your excursions in the desert, book a restaurant or prepare a surprise.",
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
        bookingDesc: "Prefer instant and secure booking via our partner?",
        bookingBtn: "Book on Booking.com",
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
          desc: "Your request has been sent successfully. Our reception team will contact you shortly to confirm your stay.",
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
          updated: "Last update: January 01, 2024",
          sections: [
              {
                  heading: "Site Publisher",
                  content: "The Residence El Arich site is published by the Residence El Arich establishment, located at Tourist Zone, 2200 Tozeur, Tunisia.\nEmail: elarichtozeur@gmail.com\nPhone: +216 76 462 644"
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
                  content: "Residence El Arich strives to ensure the accuracy and updating of the information disseminated on this site to the best of its ability. However, we decline all responsibility for any inaccuracy, inaccuracy or omission regarding information available on the site."
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
