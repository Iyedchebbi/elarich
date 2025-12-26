
import * as React from 'react';
import { useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { DataProvider, useData } from './services/DataContext';
import Navbar from './components/Navbar';
import { Home } from './pages/Home';
import Rooms from './pages/Rooms';
import Amenities from './pages/Amenities';
import Contact from './pages/Contact';
import Legal from './pages/Legal';
import AdminDashboard from './pages/admin/Dashboard';
import { ChatWidget } from './components/ChatWidget';
import { Facebook, Instagram, ShieldCheck, ArrowRight } from 'lucide-react';
import { analytics } from './firebaseConfig';
import { logEvent } from 'firebase/analytics';

const { HashRouter: Router, Routes, Route, Navigate, Link, useLocation } = ReactRouterDOM;

// --- GOOGLE ANALYTICS PAGE TRACKER ---
const GoogleAnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Log page_view event to Firebase Analytics on route change
    logEvent(analytics, 'page_view', {
      page_path: location.pathname + location.search,
      page_title: document.title
    });
  }, [location]);

  return null;
};

// --- SCROLL HANDLER COMPONENT ---
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Handle Hash Links (Anchors)
    if (hash) {
      // Small timeout to allow DOM to update if necessary
      const timer = setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          // Calculate offset for fixed header
          const headerOffset = 100; 
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      }, 100);
      return () => clearTimeout(timer);
    } 
    // Handle Standard Page Navigation
    else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

const Footer = () => {
    const { content, t } = useData();

    return (
        <footer className="relative bg-[#050505] dark:bg-black text-white py-12 lg:py-16 overflow-hidden border-t border-white/5 dark:border-white/10">
            {content.footerImage && (
                <div className="absolute inset-0 z-0">
                    <img src={content.footerImage} alt="Footer Background" className="w-full h-full object-cover opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                </div>
            )}
            
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full select-none pointer-events-none overflow-hidden flex justify-center items-end opacity-[0.03]">
                <span className="text-[15vw] font-serif font-black leading-[0.7] text-white whitespace-nowrap tracking-tighter">
                    EL ARICH
                </span>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
                    <div className="col-span-1 md:col-span-5 lg:col-span-5 space-y-6">
                        <Link to="/" className="inline-block group">
                            {content.logo ? (
                                <img src={content.logo} alt={content.heroTitle} className="h-12 md:h-16 w-auto object-contain brightness-0 invert" />
                            ) : (
                                <h3 className="text-3xl font-serif font-black text-white tracking-tighter group-hover:text-primary-500 transition-colors duration-500 leading-none">
                                    {content.heroTitle}
                                </h3>
                            )}
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
                            {t.footer.brandDesc}
                        </p>
                        <div className="flex space-x-3">
                            {[
                                { icon: Facebook, href: "https://www.facebook.com/elarichtozeur/" },
                                { icon: Instagram, href: "https://www.instagram.com/hotel_elarich/" }
                            ].map((social, idx) => (
                                <a 
                                    key={idx}
                                    href={social.href} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white hover:border-primary-500 transition-all duration-300 group hover:scale-110"
                                >
                                    <social.icon size={18} className="transition-transform" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-3 lg:col-span-3">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-6">{t.footer.explore}</h3>
                        <ul className="space-y-4">
                            {[
                                { label: t.nav.home, path: "/" },
                                { label: t.nav.rooms, path: "/rooms" },
                                { label: t.nav.services, path: "/amenities" },
                                { label: t.nav.contact, path: "/contact" }
                            ].map((link, idx) => (
                                <li key={idx}>
                                    <Link to={link.path} className="text-gray-400 hover:text-white transition-all flex items-center gap-2 group text-sm font-medium">
                                        <span className="w-1 h-1 rounded-full bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        <span className="group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    <div className="col-span-1 md:col-span-4 lg:col-span-4">
                         <h3 className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-6">{t.footer.newsletter}</h3>
                         <p className="text-gray-500 text-sm mb-4">Inscrivez-vous pour des offres exclusives et les dernières nouvelles.</p>
                         <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                            <div className="relative">
                                <input 
                                    type="email" 
                                    placeholder={t.footer.newsletterPlaceholder} 
                                    className="w-full bg-white/5 border border-white/10 text-white px-5 py-3 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white/10 transition-all placeholder-gray-600 text-sm" 
                                />
                                <button 
                                    type="submit" 
                                    className="absolute right-2 top-1.5 bottom-1.5 bg-white text-gray-900 px-4 rounded-lg hover:bg-primary-600 hover:text-white transition-all duration-300 font-bold text-xs flex items-center justify-center gap-2"
                                >
                                    OK
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600 font-medium">
                     <p>
                        © {new Date().getFullYear()} {content.heroTitle}. {t.footer.rights}
                    </p>
                     <div className="flex gap-6">
                        <Link to="/legal" className="hover:text-white transition-colors">{t.footer.legal}</Link>
                        <Link to="/privacy" className="hover:text-white transition-colors">{t.footer.privacy}</Link>
                         <Link to="/admin" className="hover:text-primary-500 transition-colors flex items-center gap-1 group">
                             <ShieldCheck size={12} className="text-gray-600 group-hover:text-primary-500 transition-colors" /> Admin
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

const AppContent = () => {
    return (
        <div className="flex flex-col min-h-screen bg-[#FDFBF9] dark:bg-[#0a0a0a] transition-colors duration-500">
            <GoogleAnalyticsTracker />
            <Routes>
                <Route path="/admin/*" element={<AdminDashboard />} />
                <Route path="/login" element={<AdminDashboard />} />
                <Route path="*" element={
                    <>
                        <Navbar />
                        <main className="flex-grow">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/rooms" element={<Rooms />} />
                                <Route path="/amenities" element={<Amenities />} />
                                <Route path="/contact" element={<Contact />} />
                                <Route path="/legal" element={<Legal />} />
                                <Route path="/privacy" element={<Legal />} />
                                <Route path="*" element={<Navigate to="/" />} />
                            </Routes>
                        </main>
                        <Footer />
                        <ChatWidget />
                    </>
                } />
            </Routes>
        </div>
    );
};

const App = () => {
  return (
    <DataProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </DataProvider>
  );
};

export default App;
