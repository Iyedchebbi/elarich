
import * as React from 'react';
import { useState, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { Menu, X, Phone, ArrowRight, Globe } from 'lucide-react';
import { useData } from '../services/DataContext';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

const { Link, useLocation, useNavigate } = ReactRouterDOM;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { content, navLinks, t, gt, language, setLanguage } = useData();
  const location = useLocation();
  const navigate = useNavigate();
  const { scrollY } = useScroll();

  // Route check
  const isHome = location.pathname === '/';

  // --- SCROLL ANIMATIONS ---
  const headerWidth = useTransform(scrollY, [0, 100], ['100%', '90%']);
  const headerTop = useTransform(scrollY, [0, 100], ['0px', '20px']);
  const headerRadius = useTransform(scrollY, [0, 100], ['0px', '50px']);
  
  const headerBg = useTransform(
    scrollY, 
    [0, 100], 
    isHome ? ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.95)'] : ['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.95)']
  );
  
  const headerBackdrop = useTransform(scrollY, [0, 100], ['blur(0px)', 'blur(12px)']);
  
  const headerShadow = useTransform(
    scrollY, 
    [0, 100], 
    ['0px 0px 0px rgba(0,0,0,0)', '0px 10px 40px -10px rgba(0,0,0,0.1)']
  );

  const headerBorderColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(255,255,255,0)', 'rgba(229,231,235,1)']
  );

  const textColor = useTransform(
    scrollY,
    [0, 100],
    isHome ? ['#ffffff', '#111827'] : ['#111827', '#111827']
  );

  const logoScale = useTransform(scrollY, [0, 100], [1, 0.95]);

  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setIsScrolled(latest > 30);
    });
    return () => unsubscribe();
  }, [scrollY]);

  const visibleLinks = navLinks
    .filter(link => link.visible)
    .sort((a, b) => a.order - b.order);

  const getLinkLabel = (label: string) => {
      switch(label.toLowerCase()) {
          case 'accueil': return t.nav.home;
          case 'à propos': return t.nav.about;
          case 'chambres': return t.nav.rooms;
          case 'services': return t.nav.services;
          default: return label;
      }
  };

  const handleLinkClick = (path: string) => {
    setIsOpen(false);
    if (path === location.pathname && !path.includes('#')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    navigate(path);
  };

  const toggleLanguage = () => {
      setLanguage(language === 'fr' ? 'en' : 'fr');
  };

  const displayTitle = gt(content, 'heroTitle');

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 flex justify-center pointer-events-none">
        <motion.nav 
          style={{
            width: headerWidth,
            top: headerTop,
            borderRadius: headerRadius,
            backgroundColor: headerBg,
            backdropFilter: headerBackdrop,
            boxShadow: headerShadow,
            border: '1px solid',
            borderColor: headerBorderColor
          }}
          className={`pointer-events-auto transition-all duration-500 max-w-7xl mx-auto px-6 md:px-8 py-4 flex justify-between items-center`}
        >
          {/* Logo */}
          <Link to="/" className="group relative z-50">
            <motion.div style={{ scale: logoScale }} className="flex flex-col">
              {content.logo ? (
                  <motion.img 
                    src={content.logo} 
                    alt="Logo" 
                    className="h-10 md:h-12 w-auto object-contain"
                  />
              ) : (
                  <>
                    <motion.span 
                        style={{ color: textColor }}
                        className="font-serif text-2xl md:text-3xl font-black tracking-tighter transition-colors duration-300"
                    >
                        {displayTitle.split(' ')[0]}
                        <span className="text-primary-500">.</span>
                        {displayTitle.split(' ').slice(1).join(' ')}
                    </motion.span>
                    <motion.span 
                        style={{ color: textColor }}
                        className="text-[10px] tracking-[0.3em] uppercase font-bold opacity-80 transition-colors duration-300"
                    >
                        Tozeur
                    </motion.span>
                  </>
              )}
            </motion.div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
             <div className={`flex items-center rounded-full p-1 transition-colors duration-300`}>
                {visibleLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  const label = getLinkLabel(link.label);
                  
                  return (
                    <div key={link.id} className="relative">
                        <button
                          onClick={() => handleLinkClick(link.path)}
                          className={`relative px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 overflow-hidden group`}
                        >
                           <motion.span style={{ color: isActive ? '#f56e1e' : textColor }} className="relative z-10 transition-colors hover:text-primary-500">
                             {label}
                           </motion.span>
                           {isActive && !link.path.includes('#') && (
                              <motion.div 
                                layoutId="activeNav"
                                className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-500 rounded-full"
                              />
                           )}
                           <motion.div className="absolute inset-0 bg-gray-200/50 opacity-0 group-hover:opacity-100 rounded-full transition-opacity" />
                        </button>
                    </div>
                  );
                })}
             </div>

             <button
                onClick={toggleLanguage}
                className="ml-2 relative px-4 py-2 rounded-full font-bold text-sm transition-all hover:bg-gray-100 flex items-center gap-1 group"
             >
                 <motion.span style={{ color: textColor }} className="flex items-center gap-2">
                    <Globe size={16} /> 
                    <span className="uppercase">{language}</span>
                 </motion.span>
             </button>

             <Link 
                to="/contact" 
                className="ml-2 overflow-hidden relative group bg-gray-900 text-white px-7 py-3 rounded-full text-sm font-bold shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)] transition-all hover:shadow-[0_15px_30px_-5px_rgba(245,110,30,0.4)] hover:-translate-y-0.5"
             >
                <span className="relative z-10 flex items-center gap-2">
                   {t.nav.book} <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-primary-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
             </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-3 md:hidden">
              <button
                onClick={toggleLanguage}
                className="p-2 rounded-full transition-colors relative z-50 bg-white/20 backdrop-blur-sm"
              >
                 <motion.span style={{ color: isOpen ? '#111827' : textColor }} className="flex items-center justify-center font-bold text-xs uppercase w-6 h-6">
                    {language}
                 </motion.span>
              </button>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-full transition-colors relative z-50`}
              >
                {isOpen ? <X size={24} className="text-gray-900" /> : (
                    <motion.div style={{ color: textColor }}>
                         <Menu size={24} />
                    </motion.div>
                )}
              </button>
          </div>
        </motion.nav>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="fixed inset-0 z-40 bg-gray-900 text-white flex flex-col items-center justify-center p-6"
          >
             <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
                 <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-600 rounded-full blur-[100px] animate-blob" />
                 <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary-600 rounded-full blur-[100px] animate-blob animation-delay-2000" />
             </div>

             <nav className="relative z-10 flex flex-col items-center space-y-6 w-full max-w-md">
                {visibleLinks.map((link, idx) => (
                  <motion.div
                    key={link.id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + idx * 0.1, duration: 0.5 }}
                    className="w-full text-center"
                  >
                     <button
                        onClick={() => { handleLinkClick(link.path); }}
                        className="block w-full text-5xl font-serif font-bold hover:text-primary-500 transition-colors py-2"
                     >
                       {getLinkLabel(link.label)}
                     </button>
                  </motion.div>
                ))}
                
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="w-full pt-8 space-y-4"
                >
                   <Link 
                    to="/contact"
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center justify-center bg-primary-600 text-white px-8 py-5 rounded-2xl text-xl font-bold shadow-2xl hover:bg-primary-500 transition-all transform active:scale-95"
                  >
                    {t.home.reserve} <ArrowRight size={24} className="ml-2" />
                  </Link>
                  <div className="flex justify-center gap-6 pt-4">
                     <div className="flex flex-col items-center text-gray-400">
                        <Phone className="mb-2" />
                        <span>{content.contactPhone}</span>
                     </div>
                  </div>
                </motion.div>
             </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
