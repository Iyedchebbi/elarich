
import * as React from 'react';
import { useState, useMemo, useEffect } from 'react';
import { useData } from '../services/DataContext';
import { Check, User, Maximize, ArrowRight, Info, Coffee, Wifi, Wind, Filter, ChevronLeft, ChevronRight, Image as ImageIcon, ZoomIn, X, Home as HomeIcon, Search } from 'lucide-react';
import * as ReactRouterDOM from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const { Link, useLocation } = ReactRouterDOM;

// --- LIGHTBOX COMPONENT ---
const Lightbox = ({ images, initialIndex, onClose }: { images: string[], initialIndex: number, onClose: () => void }) => {
  const [index, setIndex] = useState(initialIndex);
  useEffect(() => { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = 'unset'; }; }, []);
  const next = (e?: React.MouseEvent) => { e?.stopPropagation(); setIndex((prev) => (prev + 1) % images.length); };
  const prev = (e?: React.MouseEvent) => { e?.stopPropagation(); setIndex((prev) => (prev - 1 + images.length) % images.length); };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 touch-none" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-50"><X size={32} /></button>
      <div className="relative w-full max-w-7xl h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
         <AnimatePresence mode='wait'>
            <motion.img key={index} src={images[index]} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }} className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-sm select-none" drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.2} onDragEnd={(e, { offset, velocity }) => { const swipe = offset.x; if (swipe < -100) next(); else if (swipe > 100) prev(); }} />
         </AnimatePresence>
         {images.length > 1 && (<><button onClick={prev} className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 p-4 bg-black/50 hover:bg-white text-white hover:text-black rounded-full transition-all shadow-lg backdrop-blur-sm border border-white/10"><ChevronLeft size={32} /></button><button onClick={next} className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 p-4 bg-black/50 hover:bg-white text-white hover:text-black rounded-full transition-all shadow-lg backdrop-blur-sm border border-white/10"><ChevronRight size={32} /></button></>)}
         <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white font-medium bg-black/60 px-6 py-2 rounded-full backdrop-blur-md border border-white/10 tracking-widest text-sm">{index + 1} / {images.length}</div>
      </div>
    </motion.div>
  );
};

// --- SIMPLIFIED ROOM LIST CARD COMPONENT ---
const RoomListCard: React.FC<{ room: any, index: number }> = ({ room, index }) => {
  const { t } = useData();
  const [current, setCurrent] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const count = room.images?.length || 0;
  const nextSlide = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); if (count > 1) setCurrent((prev) => (prev === count - 1 ? 0 : prev + 1)); };
  const prevSlide = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); if (count > 1) setCurrent((prev) => (prev === 0 ? count - 1 : prev - 1)); };

  return (
    <>
    <motion.div 
      id={room.id}
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
      className="group relative flex flex-col h-auto min-h-[500px] mb-12"
    >
      <div className="flex flex-col bg-white rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 flex-grow z-20">
        
        {/* Full Image Slider Section */}
        <div 
          className="relative h-[500px] w-full overflow-hidden bg-gray-50 cursor-zoom-in group/image"
          onClick={() => setShowLightbox(true)}
        >
          <AnimatePresence mode='wait'>
            {count > 0 ? (
              <motion.img key={current} src={room.images[current]} alt={`Hébergement - Image ${current + 1}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-105" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-300 bg-gray-100"><ImageIcon size={64} opacity={0.5} /></div>
            )}
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 pointer-events-none"><div className="bg-black/40 backdrop-blur-md text-white px-5 py-2.5 rounded-full flex items-center gap-2 font-medium"><ZoomIn size={18} /> {t.common.viewPhotos}</div></div>

          {/* Reserve Button Overlay */}
          <div className="absolute bottom-6 left-6 z-20">
             <Link 
               to={`/contact?room=${room.id}`} 
               onClick={(e) => e.stopPropagation()}
               className="bg-white text-gray-900 px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-500 hover:text-white transition-all shadow-lg"
             >
                {t.home.reserve} <ArrowRight size={16} />
             </Link>
          </div>

          {count > 1 && (
            <>
              <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 hover:bg-black/50 backdrop-blur-md text-white flex items-center justify-center transition-all z-20 hover:scale-110 border border-white/20"><ChevronLeft size={20} /></button>
              <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 hover:bg-black/50 backdrop-blur-md text-white flex items-center justify-center transition-all z-20 hover:scale-110 border border-white/20"><ChevronRight size={20} /></button>
              <div className="absolute bottom-6 right-6 flex gap-2 z-20 px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-sm">
                {room.images.map((_: any, idx: number) => <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${idx === current ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`} />)}
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
    <AnimatePresence>
        {showLightbox && <Lightbox images={room.images} initialIndex={current} onClose={() => setShowLightbox(false)} />}
    </AnimatePresence>
    </>
  );
};

const Rooms = () => {
  const { rooms, t } = useData();
  const { hash } = useLocation();

  useEffect(() => {
    if (hash && rooms.length > 0) {
        setTimeout(() => {
            const id = hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                const headerOffset = 120;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            }
        }, 500);
    }
  }, [hash, rooms]);

  return (
    <div className="bg-[#FDFBF9] min-h-screen pt-28 md:pt-36 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8 animate-fade-in-up">
            <Link to="/" className="hover:text-primary-600 transition-colors flex items-center gap-1"><HomeIcon size={14} />{t.nav.home}</Link>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="font-bold text-gray-900">{t.nav.rooms}</span>
        </nav>

        <div className="text-center mb-10 md:mb-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
             <span className="text-primary-600 font-bold uppercase tracking-[0.2em] text-xs block mb-4">{t.rooms.subtitle}</span>
             <h1 className="text-4xl md:text-7xl font-serif font-bold text-gray-900 mb-6">{t.rooms.title}</h1>
          </motion.div>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }} className="text-lg md:text-xl text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">{t.rooms.desc}</motion.p>
        </div>

        {rooms.length === 0 ? (
           <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center">
             <div className="bg-primary-50 p-6 rounded-full mb-6"><Info size={40} className="text-primary-500" /></div>
             <h3 className="text-3xl font-serif text-gray-900 mb-3">{t.rooms.emptyTitle}</h3>
             <p className="text-gray-500 max-w-md mx-auto mb-8">{t.rooms.emptyDesc}</p>
             <Link to="/contact" className="bg-gray-900 text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">{t.rooms.contactReception}</Link>
           </motion.div>
        ) : (
          <div className="space-y-4">
            {rooms.map((room, index) => (
              <RoomListCard key={room.id} room={room} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Rooms;
