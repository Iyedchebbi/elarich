import * as React from 'react';
import { useState, useMemo, useEffect } from 'react';
import { useData } from '../services/DataContext';
import { Check, User, Maximize, ArrowRight, Info, Coffee, Wifi, Wind, Filter, ChevronLeft, ChevronRight, Image as ImageIcon, ZoomIn, X, Home as HomeIcon, Search } from 'lucide-react';
import * as ReactRouterDOM from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const { Link, useLocation } = ReactRouterDOM;

// --- Helper for Icons ---
const getFeatureIcon = (feature: string) => {
  const lower = feature.toLowerCase();
  if (lower.includes('wifi')) return <Wifi size={14} className="mr-1.5" />;
  if (lower.includes('clim') || lower.includes('air')) return <Wind size={14} className="mr-1.5" />;
  if (lower.includes('déjeuner') || lower.includes('café') || lower.includes('breakfast') || lower.includes('coffee')) return <Coffee size={14} className="mr-1.5" />;
  return <Check size={14} className="mr-1.5" />;
};

// --- LIGHTBOX COMPONENT ---
const Lightbox = ({ images, initialIndex, onClose }: { images: string[], initialIndex: number, onClose: () => void }) => {
  const [index, setIndex] = useState(initialIndex);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const next = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIndex((prev) => (prev + 1) % images.length);
  };
  const prev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 touch-none"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-50">
        <X size={32} />
      </button>

      <div className="relative w-full max-w-7xl h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
         <AnimatePresence mode='wait'>
            <motion.img 
                key={index}
                src={images[index]}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-sm select-none"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = offset.x;
                  if (swipe < -100) next();
                  else if (swipe > 100) prev();
                }}
            />
         </AnimatePresence>

         {images.length > 1 && (
             <>
                <button onClick={prev} className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 p-4 bg-black/50 hover:bg-white text-white hover:text-black rounded-full transition-all shadow-lg backdrop-blur-sm border border-white/10">
                    <ChevronLeft size={32} />
                </button>
                <button onClick={next} className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 p-4 bg-black/50 hover:bg-white text-white hover:text-black rounded-full transition-all shadow-lg backdrop-blur-sm border border-white/10">
                    <ChevronRight size={32} />
                </button>
             </>
         )}
         
         <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white font-medium bg-black/60 px-6 py-2 rounded-full backdrop-blur-md border border-white/10 tracking-widest text-sm">
            {index + 1} / {images.length}
         </div>
      </div>
    </motion.div>
  );
};

// --- ROOM CARD COMPONENT ---
const RoomListCard: React.FC<{ room: any, index: number }> = ({ room, index }) => {
  const { t, gt } = useData();
  const [current, setCurrent] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const count = room.images?.length || 0;

  const nextSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (count > 1) setCurrent((prev) => (prev === count - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (count > 1) setCurrent((prev) => (prev === 0 ? count - 1 : prev - 1));
  };

  // Determine features to show based on default language (Features list is just the features array)
  const featuresList = room.features;

  return (
    <>
    <motion.div 
      id={room.id}
      initial={{ opacity: 0, y: 80, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: index * 0.1 }}
      className="group relative flex flex-col h-auto min-h-[550px] scroll-mt-32 mb-16"
    >
      {/* --- STICKY HEADER PILL --- */}
      <div className="sticky top-24 md:top-28 z-40 w-full flex justify-center pointer-events-none mb-[-50px] transform translate-y-4">
        <div className="bg-white/90 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/40 text-gray-900 pl-6 pr-2 py-2.5 rounded-full flex gap-4 md:gap-6 items-center pointer-events-auto transition-all duration-300 hover:scale-[1.02] max-w-[90vw]">
            <h3 className="font-serif font-bold text-sm md:text-base truncate max-w-[150px] md:max-w-xs">{gt(room, 'category')}</h3>
            
            <div className="flex items-center gap-3">
              <div className="w-px h-4 bg-gray-300 hidden sm:block"></div>
              {room.promotionPrice ? (
                 <div className="flex flex-col md:flex-row md:items-baseline md:gap-2 leading-none">
                    <span className="text-[10px] md:text-xs text-gray-400 line-through">{room.price}</span>
                    <span className="text-sm md:text-base font-bold text-red-600">{room.promotionPrice} <span className="text-[10px] font-normal text-gray-500">{t.common.tnd}</span></span>
                 </div>
              ) : (
                 <span className="text-sm md:text-base font-bold text-primary-600">{room.price} <span className="text-[10px] font-normal text-gray-500">{t.common.tnd}</span></span>
              )}
            </div>

            <Link 
              to={`/contact?room=${room.id}`} 
              className="bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors shadow-md"
              title={t.nav.book}
            >
                <ArrowRight size={14} />
            </Link>
        </div>
      </div>

      {/* --- INNER CARD CONTENT (Actual Card Visuals) --- */}
      <div className="flex flex-col lg:flex-row bg-white rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 flex-grow z-20 mt-4">
        
        {/* Image Slider Section */}
        <div 
          className="lg:w-[60%] relative h-[350px] sm:h-[450px] lg:h-auto overflow-hidden bg-gray-50 cursor-zoom-in group/image"
          onClick={() => setShowLightbox(true)}
        >
          <AnimatePresence mode='wait'>
            {count > 0 ? (
              <motion.img 
                key={current}
                src={room.images[current]} 
                alt={`${gt(room, 'category')} - Image ${current + 1}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-105"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-300 bg-gray-100">
                <ImageIcon size={64} opacity={0.5} />
              </div>
            )}
          </AnimatePresence>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Zoom Hint */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="bg-black/40 backdrop-blur-md text-white px-5 py-2.5 rounded-full flex items-center gap-2 font-medium">
                  <ZoomIn size={18} /> {t.common.viewPhotos}
              </div>
          </div>

          {/* Badges */}
          <div className="absolute top-6 left-6 flex flex-col gap-2 z-10 pointer-events-none">
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-md backdrop-blur-xl ${
                room.available ? 'bg-white/95 text-green-700 border border-green-100' : 'bg-gray-900 text-white'
            }`}>
                {room.available ? t.common.available : t.common.full}
            </span>
            {room.promotionPrice && (
              <span className="bg-red-600/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-md">
                  {gt(room, 'promotionLabel') || t.common.promo}
              </span>
            )}
          </div>

          {/* Navigation Controls */}
          {count > 1 && (
            <>
              <button 
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 hover:bg-black/50 backdrop-blur-md text-white flex items-center justify-center transition-all z-20 hover:scale-110 border border-white/20"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 hover:bg-black/50 backdrop-blur-md text-white flex items-center justify-center transition-all z-20 hover:scale-110 border border-white/20"
              >
                <ChevronRight size={20} />
              </button>
              
              {/* Dots */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20 px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-sm">
                {room.images.map((_: any, idx: number) => (
                  <div 
                    key={idx} 
                    className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${idx === current ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content Section */}
        <div className="lg:w-[40%] p-8 lg:p-10 flex flex-col relative bg-white">
          <div className="flex-grow pt-8"> {/* Added padding top to clear the sticky header visually if needed, though structure handles it */}
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-3xl lg:text-3xl font-serif font-bold text-gray-900 leading-tight">
                {gt(room, 'category')}
              </h2>
            </div>
            
            <p className="text-gray-500 leading-relaxed font-light text-base mb-8 line-clamp-4">
              {gt(room, 'description')}
            </p>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-4 py-6 border-t border-b border-gray-100 mb-8">
              <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">{t.common.capacity}</p>
                    <p className="font-bold text-gray-900">{room.capacity} Pers.</p>
                  </div>
              </div>
              <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
                    <Maximize size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">{t.common.size}</p>
                    <p className="font-bold text-gray-900">{room.size}</p>
                  </div>
              </div>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-2 mb-8">
              {featuresList.slice(0, 4).map((f: string, i: number) => (
                  <span key={i} className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 text-xs font-medium border border-gray-100">
                    {getFeatureIcon(f)} {f}
                  </span>
              ))}
              {featuresList.length > 4 && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gray-50 text-gray-400 text-xs font-medium border border-gray-100 italic">
                    +{featuresList.length - 4} {t.common.others}
                  </span>
              )}
            </div>
          </div>

          {/* Footer / Price & Action */}
          <div className="mt-auto pt-6 border-t border-gray-100">
            <div className="flex flex-col gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-gray-400 font-medium">{t.common.from}</span>
                  {room.promotionPrice ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg text-gray-400 line-through decoration-red-500/50">{room.price} {t.common.tnd}</span>
                        <span className="text-4xl font-bold text-red-600">{room.promotionPrice} <span className="text-lg text-gray-500 font-normal">{t.common.tnd}</span></span>
                      </div>
                  ) : (
                      <span className="text-4xl font-bold text-gray-900">{room.price} <span className="text-lg text-gray-500 font-normal">{t.common.tnd}</span></span>
                  )}
                </div>
                
                <Link 
                  to={`/contact?room=${room.id}`}
                  className="group w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-primary-600 transition-all duration-300 shadow-xl hover:shadow-primary-500/30 hover:-translate-y-1"
                >
                  {t.home.reserve} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
    
    {/* Portal for Lightbox */}
    <AnimatePresence>
        {showLightbox && (
            <Lightbox 
                images={room.images} 
                initialIndex={current} 
                onClose={() => setShowLightbox(false)} 
            />
        )}
    </AnimatePresence>
    </>
  );
};

const Rooms = () => {
  const { rooms, t, gt } = useData();
  const [sortOption, setSortOption] = useState<'priceAsc' | 'priceDesc' | 'capacity'>('priceAsc');
  const [searchQuery, setSearchQuery] = useState('');
  const { hash } = useLocation();

  // Scroll to room if hash exists and rooms are loaded
  useEffect(() => {
    if (hash && rooms.length > 0) {
        // Small delay to ensure rendering of room cards
        setTimeout(() => {
            const id = hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                const headerOffset = 120; // Adjust for fixed navbar
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        }, 500);
    }
  }, [hash, rooms]);

  // Filtering and Sorting Logic
  const sortedRooms = useMemo(() => {
    let result = [...rooms];

    // Filter
    if (searchQuery.trim()) {
        const lowerQuery = searchQuery.toLowerCase();
        result = result.filter(room => 
            gt(room, 'category').toLowerCase().includes(lowerQuery) || 
            gt(room, 'description').toLowerCase().includes(lowerQuery)
        );
    }

    // Sort
    return result.sort((a, b) => {
      // Calculate effective prices (use promotion price if available)
      const priceA = a.promotionPrice || a.price;
      const priceB = b.promotionPrice || b.price;

      if (sortOption === 'priceAsc') return priceA - priceB;
      if (sortOption === 'priceDesc') return priceB - priceA;
      if (sortOption === 'capacity') return b.capacity - a.capacity; // Largest first
      return 0;
    });
  }, [rooms, sortOption, searchQuery]);

  return (
    <div className="bg-[#FDFBF9] min-h-screen pt-28 md:pt-36 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8 animate-fade-in-up">
            <Link to="/" className="hover:text-primary-600 transition-colors flex items-center gap-1">
                <HomeIcon size={14} />
                {t.nav.home}
            </Link>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="font-bold text-gray-900">{t.nav.rooms}</span>
        </nav>

        <div className="text-center mb-10 md:mb-16">
          <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, ease: "easeOut" }}
          >
             <span className="text-primary-600 font-bold uppercase tracking-[0.2em] text-xs block mb-4">{t.rooms.subtitle}</span>
             <h1 className="text-4xl md:text-7xl font-serif font-bold text-gray-900 mb-6">
                 {t.rooms.title}
             </h1>
          </motion.div>
          <motion.p 
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
             className="text-lg md:text-xl text-gray-600 font-light max-w-2xl mx-auto leading-relaxed"
          >
              {t.rooms.desc}
          </motion.p>
        </div>

        {/* Controls: Search & Sort */}
        {rooms.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-12 gap-6"
          >
            {/* Search Bar */}
            <div className="relative w-full md:w-96 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-primary-500 transition-colors" size={20} />
                <input 
                    type="text" 
                    placeholder="Rechercher une chambre..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all shadow-sm group-hover:shadow-md"
                />
            </div>

            {/* Sorting */}
            <div className="inline-flex items-center bg-white rounded-full p-2 shadow-sm border border-gray-200 overflow-x-auto max-w-full no-scrollbar">
               <span className="px-3 md:px-4 text-xs md:text-sm font-bold text-gray-400 flex items-center gap-2 whitespace-nowrap">
                 <Filter className="w-3.5 h-3.5 md:w-4 md:h-4" /> <span className="hidden sm:inline">{t.rooms.filter.label}</span>
               </span>
               <button 
                  onClick={() => setSortOption('priceAsc')}
                  className={`px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${sortOption === 'priceAsc' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
               >
                 {t.rooms.filter.priceAsc}
               </button>
               <button 
                  onClick={() => setSortOption('priceDesc')}
                  className={`px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${sortOption === 'priceDesc' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
               >
                 {t.rooms.filter.priceDesc}
               </button>
               <button 
                  onClick={() => setSortOption('capacity')}
                  className={`px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${sortOption === 'capacity' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
               >
                 {t.rooms.filter.capacity}
               </button>
            </div>
          </motion.div>
        )}

        {sortedRooms.length === 0 ? (
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center"
           >
             <div className="bg-primary-50 p-6 rounded-full mb-6">
                <Info size={40} className="text-primary-500" />
             </div>
             {rooms.length > 0 ? (
                 <>
                    <h3 className="text-2xl font-serif text-gray-900 mb-2">Aucun résultat trouvé</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">Essayez de modifier votre recherche.</p>
                    <button 
                        onClick={() => setSearchQuery('')}
                        className="text-primary-600 font-bold hover:underline"
                    >
                        Effacer la recherche
                    </button>
                 </>
             ) : (
                 <>
                    <h3 className="text-3xl font-serif text-gray-900 mb-3">{t.rooms.emptyTitle}</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-8">
                    {t.rooms.emptyDesc}
                    </p>
                    <Link to="/contact" className="bg-gray-900 text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">
                    {t.rooms.contactReception}
                    </Link>
                 </>
             )}
           </motion.div>
        ) : (
          <div className="space-y-4">
            {sortedRooms.map((room, index) => (
              <RoomListCard key={room.id} room={room} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Rooms;