
export interface Room {
  id: string;
  name: string;
  nameEn?: string;
  category: string;
  categoryEn?: string;
  description: string;
  descriptionEn?: string;
  price: number;
  promotionPrice?: number;
  promotionLabel?: string;
  promotionLabelEn?: string;
  capacity: number;
  size: string;
  images: string[]; 
  features: string[];
  featuresEn?: string[];
  available: boolean;
}

export interface Amenity {
  id: string;
  name: string;
  nameEn?: string;
  icon: string;
  description?: string;
  descriptionEn?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
}

export interface GalleryCardData {
  id: string;
  category: string;
  categoryEn?: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  images: string[];
  video?: string; 
  order: number;
}

export interface SiteContent {
  heroTitle: string;
  heroTitleEn?: string;
  heroSubtitle: string;
  heroSubtitleEn?: string;
  heroImage: string;
  aboutTitle: string;
  aboutTitleEn?: string;
  aboutText: string;
  aboutTextEn?: string;
  aboutImage1: string;
  aboutImage2: string;
  locationTitle: string;
  locationTitleEn?: string;
  locationText: string;
  locationTextEn?: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  addressEn?: string;
  mapUrl: string;
  googleMapsLink: string;
  bookingUrl: string;      
  showBookingUrl: boolean; 
  ratingScore: number;
  ctaImage: string;
  serviceImage: string;
  logo?: string;
  footerImage?: string;
}

export interface BookingRequest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  status: 'pending' | 'confirmed' | 'rejected';
  date: string;
}

// --- CMS Types ---

export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
}

export interface SeoSettings {
  metaTitle: string;
  metaDescription: string;
}

export interface SectionVisibility {
  hero: boolean;
  features: boolean;
  about: boolean;
  gallery: boolean;
  testimonials: boolean;
  cta: boolean;
}

export interface NavLinkItem {
  id: string;
  label: string;
  path: string;
  visible: boolean;
  order: number;
}

export interface LegalSection {
  heading: string;
  content: string;
}

export interface TranslationDictionary {
  common: {
    loading: string;
    available: string;
    full: string;
    promo: string;
    tnd: string;
    perNight: string;
    from: string;
    moreInfo: string;
    capacity: string;
    size: string;
    features: string;
    others: string;
    viewPhotos: string;
  };
  nav: {
    home: string;
    about: string;
    rooms: string;
    services: string;
    contact: string;
    book: string;
  };
  home: {
    welcome: string;
    rating: string;
    onGoogle: string;
    heroSubtitle: string;
    discoverSuites: string;
    reserve: string;
    features: {
      location: string;
      locationDesc: string;
      charm: string;
      charmDesc: string;
      services: string;
      servicesDesc: string;
    };
    featuredRooms: {
      subtitle: string;
      title: string;
      desc: string;
      from: string;
      perNight: string;
      viewAll: string;
    };
    about: {
      subtitle: string;
      titleFirst: string;
      titleSecond: string;
      desc: string;
      btn: string;
    };
    gallery: {
      subtitle: string;
      titleFirst: string;
      titleSecond: string;
      follow: string;
      tourTitle: string;
    };
    testimonials: {
      subtitle: string;
      title: string;
    };
    cta: {
      subtitle: string;
      titleFirst: string;
      titleSecond: string;
      desc: string;
      btn: string;
    };
  };
  rooms: {
    subtitle: string;
    title: string;
    desc: string;
    emptyTitle: string;
    emptyDesc: string;
    filter: {
      label: string;
      priceAsc: string;
      priceDesc: string;
      capacity: string;
    };
    contactReception: string;
  };
  amenities: {
    subtitle: string;
    title: string;
    desc: string;
    concierge: {
      tag: string;
      title: string;
      desc: string;
      btn: string;
    };
  };
  contact: {
    subtitle: string;
    title: string;
    desc: string;
    info: {
      address: string;
      phone: string;
      email: string;
      whatsapp: string;
      openMaps: string;
    };
    form: {
      directRequest: string;
      bookingTitle: string;
      bookingDesc: string;
      bookingBtn: string;
      labels: {
        name: string;
        email: string;
        phone: string;
        room: string;
        checkIn: string;
        checkOut: string;
        message: string;
      };
      placeholders: {
        name: string;
        email: string;
        phone: string;
        room: string;
        message: string;
      };
      submit: string;
      sending: string;
      success: {
        title: string;
        desc: string;
        btn: string;
      };
    };
  };
  footer: {
    brandDesc: string;
    explore: string;
    contact: string;
    newsletter: string;
    newsletterPlaceholder: string;
    subscribe: string;
    rights: string;
    legal: string;
    privacy: string;
  };
  legalPage: {
      mentions: {
          title: string;
          updated: string;
          sections: LegalSection[];
      };
      privacy: {
          title: string;
          updated: string;
          sections: LegalSection[];
      };
  };
}