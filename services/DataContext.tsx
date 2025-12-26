import * as React from 'react';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Room, SiteContent, Amenity, BookingRequest, ThemeSettings, SeoSettings, SectionVisibility, NavLinkItem, TranslationDictionary, GalleryCardData, Testimonial } from '../types';
import { INITIAL_CONTENT, INITIAL_AMENITIES, INITIAL_THEME, INITIAL_SEO, INITIAL_SECTIONS, INITIAL_NAV_LINKS, TRANSLATIONS, INITIAL_ROOMS, INITIAL_GALLERY, INITIAL_TESTIMONIALS } from '../constants';
import { auth, db } from '../firebaseConfig';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  updatePassword as firebaseUpdatePassword,
  sendPasswordResetEmail,
  User,
  createUserWithEmailAndPassword
} from 'firebase/auth';

// --- CLOUDINARY CONFIGURATION ---
const CLOUDINARY_CLOUD_NAME = "diomc7mff"; 
const CLOUDINARY_UPLOAD_PRESET = "residence_upload"; 

interface DataContextType {
  // Content
  content: SiteContent;
  updateContent: (newContent: Partial<SiteContent>) => void;
  // Rooms
  rooms: Room[];
  updateRoom: (id: string, room: Partial<Room>) => void;
  addRoom: (room: Room) => void;
  deleteRoom: (id: string) => void;
  // Amenities
  amenities: Amenity[];
  addAmenity: (amenity: Amenity) => Promise<void>;
  updateAmenity: (id: string, amenity: Partial<Amenity>) => Promise<void>;
  deleteAmenity: (id: string) => Promise<void>;
  resetDefaultServices: () => Promise<void>;
  // Bookings
  bookings: BookingRequest[];
  addBooking: (booking: BookingRequest) => void;
  updateBookingStatus: (id: string, status: BookingRequest['status']) => void;
  deleteBooking: (id: string) => void;
  clearAllBookings: () => Promise<void>;
  // Gallery
  gallery: GalleryCardData[];
  updateGalleryCard: (id: string, data: Partial<GalleryCardData>) => void;
  addGalleryCard: (card: GalleryCardData) => void;
  deleteGalleryCard: (id: string) => void;
  // Testimonials
  testimonials: Testimonial[];
  // Auth
  isAuthenticated: boolean;
  currentUser: User | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  updatePassword: (newPassword: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loading: boolean;
  // CMS - Design
  theme: ThemeSettings;
  updateTheme: (newTheme: Partial<ThemeSettings>) => void;
  sections: SectionVisibility;
  toggleSection: (section: keyof SectionVisibility) => void;
  // CMS - SEO
  seo: SeoSettings;
  updateSeo: (newSeo: Partial<SeoSettings>) => void;
  // CMS - Navigation
  navLinks: NavLinkItem[];
  updateNavLink: (id: string, link: Partial<NavLinkItem>) => void;
  // Utils
  seedDatabase: () => Promise<void>;
  uploadImage: (file: File) => Promise<string>;
  // Language
  language: 'fr' | 'en';
  toggleLanguage: () => void;
  t: TranslationDictionary;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Helper to generate CSS variables for theme
const updateCssVariables = (primaryHex: string, secondaryHex: string) => {
    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
    };
    const generateShade = (rgb: {r:number, g:number, b:number}, factor: number) => {
        const r = Math.min(255, Math.max(0, Math.round(rgb.r * factor)));
        const g = Math.min(255, Math.max(0, Math.round(rgb.g * factor)));
        const b = Math.min(255, Math.max(0, Math.round(rgb.b * factor)));
        return `${r} ${g} ${b}`;
    };

    const root = document.documentElement;
    const primary = hexToRgb(primaryHex);
    const secondary = hexToRgb(secondaryHex);

    if (primary) {
        root.style.setProperty('--primary-50', generateShade(primary, 2.5));
        root.style.setProperty('--primary-100', generateShade(primary, 2.2));
        root.style.setProperty('--primary-200', generateShade(primary, 1.8));
        root.style.setProperty('--primary-300', generateShade(primary, 1.5));
        root.style.setProperty('--primary-400', generateShade(primary, 1.2));
        root.style.setProperty('--primary-500', `${primary.r} ${primary.g} ${primary.b}`);
        root.style.setProperty('--primary-600', generateShade(primary, 0.9));
        root.style.setProperty('--primary-700', generateShade(primary, 0.75));
        root.style.setProperty('--primary-800', generateShade(primary, 0.6));
        root.style.setProperty('--primary-900', generateShade(primary, 0.45));
    }
    if (secondary) {
         root.style.setProperty('--secondary-50', generateShade(secondary, 2.5));
         root.style.setProperty('--secondary-500', `${secondary.r} ${secondary.g} ${secondary.b}`);
         root.style.setProperty('--secondary-600', generateShade(secondary, 0.9));
    }
};

export const DataProvider = ({ children }: { children?: ReactNode }) => {
  // --- State ---
  const [content, setContent] = useState<SiteContent>(INITIAL_CONTENT);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [gallery, setGallery] = useState<GalleryCardData[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);
  
  const [theme, setTheme] = useState<ThemeSettings>(INITIAL_THEME);
  const [seo, setSeo] = useState<SeoSettings>(INITIAL_SEO);
  const [sections, setSections] = useState<SectionVisibility>(INITIAL_SECTIONS);
  const [navLinks, setNavLinks] = useState<NavLinkItem[]>(INITIAL_NAV_LINKS);
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');
  const t = TRANSLATIONS[language];

  // --- Auth Listener ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- Firestore Listeners (Compat Syntax) ---
  
  // Public Collections
  useEffect(() => {
    // Settings
    const unsubSettings = db.collection('settings').doc('global').onSnapshot((s: any) => {
        if (s.exists) { 
            const d = s.data();
            if(d.content) setContent(d.content);
            if(d.theme) setTheme(d.theme);
            if(d.seo) setSeo(d.seo);
            if(d.sections) setSections(d.sections);
            if(d.navLinks) setNavLinks(d.navLinks);
        }
    }, (err: any) => console.log("Settings sync error:", err.code));

    // Rooms
    const unsubRooms = db.collection('rooms').onSnapshot((s: any) => {
      setRooms(s.docs.map((d: any) => ({ id: d.id, ...d.data() } as Room)));
    }, (err: any) => console.log("Rooms sync error:", err.code));

    // Amenities
    const unsubAmenities = db.collection('amenities').onSnapshot((s: any) => {
      setAmenities(s.docs.map((d: any) => ({ id: d.id, ...d.data() } as Amenity)));
    }, (err: any) => console.log("Amenities sync error:", err.code));

    // Gallery
    const unsubGallery = db.collection('gallery').orderBy('order', 'asc').onSnapshot((s: any) => {
      setGallery(s.docs.map((d: any) => ({ id: d.id, ...d.data() } as GalleryCardData)));
    }, (err: any) => console.log("Gallery sync error:", err.code));

    return () => { unsubSettings(); unsubRooms(); unsubAmenities(); unsubGallery(); };
  }, []);

  // Protected Collection (Bookings)
  useEffect(() => {
    if (!currentUser) { 
        setBookings([]); 
        return; 
    }
    
    console.log("Initializing Bookings Listener for user:", currentUser.email);

    // FIX: Removed .orderBy('date', 'desc') here to avoid "Missing Index" errors on initial deploy.
    // If the index is missing, the query fails silently or with error. We sort in JS.
    const unsubBookings = db.collection('bookings').onSnapshot((s: any) => {
      const data = s.docs.map((d: any) => ({ id: d.id, ...d.data() } as BookingRequest));
      
      // Sort client-side to ensure display even if Firestore index is missing
      data.sort((a: BookingRequest, b: BookingRequest) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      
      console.log("Bookings loaded:", data.length);
      setBookings(data);
    }, (err: any) => {
        console.error("Bookings sync error details:", err);
        if (err.code === 'permission-denied') {
            alert("Erreur de permission : Vous n'êtes pas autorisé à voir les réservations.");
        }
    });

    return () => unsubBookings();
  }, [currentUser]);

  // --- Effects ---
  useEffect(() => updateCssVariables(theme.primaryColor, theme.secondaryColor), [theme]);
  
  useEffect(() => {
    document.title = seo.metaTitle;
    document.querySelector('meta[name="description"]')?.setAttribute('content', seo.metaDescription);
  }, [seo]);

  // --- Database Actions (Compat Syntax) ---

  const updateSettings = async (key: string, val: any) => {
      if (!currentUser) return;
      await db.collection('settings').doc('global').set({ [key]: val }, { merge: true });
  };

  const updateContent = (v: Partial<SiteContent>) => updateSettings('content', { ...content, ...v });
  const updateTheme = (v: Partial<ThemeSettings>) => updateSettings('theme', { ...theme, ...v });
  const updateSeo = (v: Partial<SeoSettings>) => updateSettings('seo', { ...seo, ...v });
  const toggleSection = (k: keyof SectionVisibility) => updateSettings('sections', { ...sections, [k]: !sections[k] });
  const updateNavLink = (id: string, v: Partial<NavLinkItem>) => updateSettings('navLinks', navLinks.map(l => l.id === id ? { ...l, ...v } : l));

  // Rooms
  const addRoom = async (room: Room) => {
      if (!currentUser) return;
      const { id, ...data } = room;
      await db.collection('rooms').add(data);
  };
  const updateRoom = async (id: string, room: Partial<Room>) => {
      if (!currentUser) return;
      await db.collection('rooms').doc(id).update(room);
  };
  const deleteRoom = async (id: string) => {
      if (!currentUser) return;
      try {
        await db.collection('rooms').doc(id).delete();
      } catch (error: any) {
        console.error("Error deleting room", error);
        alert(`Impossible de supprimer. Erreur: ${error.message || 'Permissions insuffisantes'}`);
      }
  };

  // Amenities
  const addAmenity = async (amenity: Amenity) => {
      if (!currentUser) return;
      const { id, ...data } = amenity;
      await db.collection('amenities').add(data);
  };
  const updateAmenity = async (id: string, data: Partial<Amenity>) => {
      if (!currentUser) return;
      await db.collection('amenities').doc(id).update(data);
  };
  const deleteAmenity = async (id: string) => {
      if (!currentUser) return;
      try {
        await db.collection('amenities').doc(id).delete();
      } catch (error: any) {
        console.error("Error deleting amenity", error);
        alert(`Impossible de supprimer. Erreur: ${error.code}. Vérifiez votre connexion ou vos droits.`);
      }
  };
  const resetDefaultServices = async () => {
      if (!currentUser) return;
      try {
          const snapshot = await db.collection('amenities').get();
          const batch = db.batch();
          // 1. Delete all existing
          snapshot.forEach((doc: any) => batch.delete(doc.ref));
          // 2. Add new defaults
          INITIAL_AMENITIES.forEach((item) => {
              const docRef = db.collection('amenities').doc();
              const { id, ...data } = item;
              batch.set(docRef, data);
          });
          await batch.commit();
          alert("Les services ont été réinitialisés avec succès !");
      } catch (error: any) {
          console.error("Error resetting services", error);
          alert("Erreur lors de la réinitialisation : " + error.message);
      }
  };

  // Gallery
  const addGalleryCard = async (card: GalleryCardData) => {
      if (!currentUser) return;
      const { id, ...data } = card;
      await db.collection('gallery').add(data);
  };
  const updateGalleryCard = async (id: string, data: Partial<GalleryCardData>) => {
      if (!currentUser) return;
      await db.collection('gallery').doc(id).update(data);
  };
  const deleteGalleryCard = async (id: string) => {
      if (!currentUser) return;
      try {
        await db.collection('gallery').doc(id).delete();
      } catch (error: any) {
        console.error("Error deleting gallery card", error);
        alert(`Impossible de supprimer. Erreur: ${error.message}`);
      }
  };

  // Bookings
  const addBooking = async (booking: BookingRequest) => {
      // Allow public submission without currentUser check
      try {
          const { id, ...data } = booking;
          await db.collection('bookings').add(data);
          console.log("Booking submitted successfully");
      } catch (error) {
          console.error("Error adding booking:", error);
          throw error;
      }
  };
  const updateBookingStatus = async (id: string, status: BookingRequest['status']) => {
      if (!currentUser) return;
      await db.collection('bookings').doc(id).update({ status });
  };
  const deleteBooking = async (id: string) => {
      if (!currentUser) return;
      try {
        await db.collection('bookings').doc(id).delete();
      } catch (error: any) {
        console.error("Error deleting booking", error);
        alert(`Impossible de supprimer. Erreur: ${error.message}`);
      }
  };
  const clearAllBookings = async () => {
      if (!currentUser) return;
      const snapshot = await db.collection('bookings').get();
      const batch = db.batch();
      snapshot.forEach((doc: any) => batch.delete(doc.ref));
      await batch.commit();
  };

  // Auth & Utils
  const login = async (e: string, p: string) => { await signInWithEmailAndPassword(auth, e, p); };
  const logout = async () => { await signOut(auth); };
  const updatePassword = async (p: string) => { if (currentUser) await firebaseUpdatePassword(currentUser, p); };
  const resetPassword = async (e: string) => { await sendPasswordResetEmail(auth, e); };
  const toggleLanguage = () => { setLanguage(prev => prev === 'fr' ? 'en' : 'fr'); };

  const uploadImage = async (file: File): Promise<string> => {
    if (!currentUser) throw new Error("User must be logged in to upload");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`, { method: "POST", body: formData });
    if (!response.ok) throw new Error("Upload failed");
    const data = await response.json();
    return data.secure_url;
  };

  const seedDatabase = async () => {
    // Ensure we are authenticated before seeding
    if (!auth.currentUser) {
        try {
            await createUserWithEmailAndPassword(auth, "elarichtozeur@gmail.com", "admin123");
        } catch (e: any) {
            // If user exists, try logging in
            if (e.code === 'auth/email-already-in-use') {
                try {
                    await signInWithEmailAndPassword(auth, "elarichtozeur@gmail.com", "admin123");
                } catch (loginError) {
                    throw new Error("Impossible de se connecter pour initialiser. Vérifiez les identifiants.");
                }
            } else {
                throw e;
            }
        }
    }

    const batch = db.batch();
    
    // Helper to add batch
    const addToBatch = (col: string, items: any[]) => {
        items.forEach(item => {
            const { id, ...rest } = item;
            // Use existing ID if simple string, else generate new
            const docRef = db.collection(col).doc(); 
            batch.set(docRef, rest);
        });
    };

    addToBatch('rooms', INITIAL_ROOMS);
    addToBatch('amenities', INITIAL_AMENITIES);
    
    // Gallery needs specific handling for order
    INITIAL_GALLERY.forEach(item => {
        const docRef = db.collection('gallery').doc();
        const { id, ...rest } = item;
        batch.set(docRef, rest);
    });

    batch.set(db.collection('settings').doc('global'), {
        content: INITIAL_CONTENT,
        theme: INITIAL_THEME,
        seo: INITIAL_SEO,
        sections: INITIAL_SECTIONS,
        navLinks: INITIAL_NAV_LINKS
    });

    await batch.commit();
  };

  return (
    <DataContext.Provider value={{
      content, updateContent,
      rooms, updateRoom, addRoom, deleteRoom,
      amenities, addAmenity, updateAmenity, deleteAmenity, resetDefaultServices,
      bookings, addBooking, updateBookingStatus, deleteBooking, clearAllBookings,
      gallery, updateGalleryCard, addGalleryCard, deleteGalleryCard,
      testimonials,
      isAuthenticated: !!currentUser, currentUser,
      login, logout, updatePassword, resetPassword,
      loading, theme, updateTheme, sections, toggleSection,
      seo, updateSeo, navLinks, updateNavLink,
      seedDatabase, uploadImage, language, toggleLanguage, t
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};