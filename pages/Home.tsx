
import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useData } from '../services/DataContext';
import { Wifi, MapPin, Star, ArrowRight, ChevronDown, Instagram, ChevronLeft, ChevronRight, Image as ImageIcon, Volume2, VolumeX } from 'lucide-react';
import * as ReactRouterDOM from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Room } from '../types';

const { Link } = ReactRouterDOM;

// --- PREMIUM ANIMATION VARIANTS ---
const premiumTransition = { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }; // Cubic Bezier for "Luxury" feel

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 60, filter: "blur(5px)" },
  visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: premiumTransition 
  }
};

const textReveal: Variants = {
    hidden: { opacity: 0, y: 100, clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" },
    visible: {
        opacity: 1,
        y: 0,
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        transition: { ...premiumTransition, duration: 1 }
    }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
};

const featureCardVariant: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" } 
  }
};

// --- STUNNING RATING COMPONENT ---
const StunningRating = ({ score, label, subLabel }: { score: number, label: string, subLabel: string }) => {
    const stars = Array.from({ length: 5 }, (_, i) => i + 1);
    
    return (
        <motion.a 
            href="https://www.google.com/search?q=residence+el+arich+tozeur+reviews" 
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.8, ease: "backOut" }}
            className="absolute top-28 right-4 md:right-8 md:top-32 z-30 group cursor-pointer"
        >
            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3 md:p-4 flex items-center gap-4 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-lg shrink-0">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-7 md:h-7" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                </div>
                <div className="flex flex-col">
                    <div className="flex items-center gap-1 mb-0.5">
                        <span className="text-white font-bold text-lg md:text-2xl font-serif leading-none tracking-tight">{score}</span>
                        <span className="text-white/60 text-xs md:text-sm font-medium">/ 5</span>
                    </div>
                    <div className="flex gap-0.5 mb-1">
                        {stars.map((star, idx) => (
                            <motion.div key={star} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2 + (idx * 0.1) }}>
                                <Star size={12} className={`${score >= star ? "fill-[#FBBC05] text-[#FBBC05]" : "fill-gray-400 text-gray-400"}`} strokeWidth={0} />
                            </motion.div>
                        ))}
                    </div>
                    <div className="text-[10px] md:text-xs text-white/90 uppercase tracking-widest font-bold">
                        {label} <span className="text-white/50 font-normal normal-case tracking-normal">- {subLabel}</span>
                    </div>
                </div>
            </div>
        </motion.a>
    );
};

// --- INTERNAL COMPONENT: VIDEO TOUR CARD ---
const VideoTourCard = ({ video, poster }: { video: string, poster?: string }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { amount: 0.6, once: false });
    const [isMuted, setIsMuted] = useState(true);

    useEffect(() => {
        if (!videoRef.current) return;
        if (isInView) {
            videoRef.current.play().catch(e => console.warn("Auto-play blocked", e));
        } else {
            videoRef.current.pause();
        }
    }, [isInView]);

    const toggleMute = (e: React.MouseEvent) => {
        e.preventDefault(); e.stopPropagation();
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    };

    return (
        <div ref={containerRef} className="relative w-full h-[500px] md:h-[600px] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)] border border-white/10 group bg-black">
             <video ref={videoRef} src={video} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500" poster={poster} playsInline muted={isMuted} loop />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none" />
             <div className="absolute top-6 right-6 flex items-center gap-3 pointer-events-none">
                 <div className="bg-red-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-white animate-pulse"></span> Live Tour</div>
             </div>
             <button onClick={toggleMute} className="absolute bottom-6 right-6 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all z-20 group/btn">
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
             </button>
        </div>
    );
};

// --- INTERNAL COMPONENT: GALLERY CARD ---
const GalleryCard: React.FC<{ title: string, category: string, images: string[], description: string }> = ({ title, category, images, description }) => {
    const [current, setCurrent] = useState(0);
    const count = images?.length || 0;
    const nextSlide = (e: React.MouseEvent) => { e.stopPropagation(); if (count <= 1) return; setCurrent((prev) => (prev === count - 1 ? 0 : prev + 1)); };
    const prevSlide = (e: React.MouseEvent) => { e.stopPropagation(); if (count <= 1) return; setCurrent((prev) => (prev === 0 ? count - 1 : prev - 1)); };

    return (
        <motion.div variants={fadeInUp} className="flex flex-col gap-4 group">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-gray-900 shadow-2xl border border-white/10 transition-transform duration-500 hover:-translate-y-2">
                <AnimatePresence mode='wait'>
                    {count > 0 ? (
                        <motion.img key={current} src={images[current]} alt={title} initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} whileHover={{ scale: 1.05 }} transition={{ duration: 0.5 }} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 text-gray-500"><ImageIcon size={48} className="mb-2 opacity-50" /><span className="text-xs uppercase tracking-widest font-bold opacity-50">Image à venir</span></div>
                    )}
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                {count > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button onClick={prevSlide} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all border border-white/20"><ChevronLeft size={20} /></button>
                        <button onClick={nextSlide} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all border border-white/20"><ChevronRight size={20} /></button>
                    </div>
                )}
            </div>
            <div className="px-2">
                <span className="text-primary-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2 block">{category}</span>
                <p className="text-gray-400 text-sm leading-relaxed font-light">{description}</p>
            </div>
        </motion.div>
    );
};

// --- INTERNAL COMPONENT: ROOM CARD (PHOTO ONLY - ENLARGED) ---
const RoomCard: React.FC<{ room: Room }> = ({ room }) => {
    const { t } = useData();
    const [current, setCurrent] = useState(0);
    const count = room.images?.length || 0;
    const nextSlide = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); if (count <= 1) return; setCurrent((prev) => (prev === count - 1 ? 0 : prev + 1)); };
    const prevSlide = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); if (count <= 1) return; setCurrent((prev) => (prev === 0 ? count - 1 : prev - 1)); };

    return (
        <motion.div variants={featureCardVariant} className="w-full max-w-3xl mx-auto transform transition-all hover:scale-[1.02]">
            <div className="group relative bg-white rounded-[3rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] hover:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.25)] transition-all duration-500 h-[600px] md:h-[750px] border border-gray-100/50">
                <div className="relative w-full h-full overflow-hidden bg-gray-100">
                    <AnimatePresence mode='wait'>
                        {count > 0 ? (
                            <motion.img key={current} src={room.images[current]} alt="Hébergement" initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7 }} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400"><ImageIcon size={64} opacity={0.5} /></div>
                        )}
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40" />
                    
                    {/* Only Show Reserve Button */}
                    <div className="absolute bottom-0 left-0 w-full p-10 z-10 flex flex-col items-center justify-center">
                        <Link to={`/contact?room=${room.id}`} className="bg-white/95 backdrop-blur-md text-gray-900 px-10 py-4 rounded-full font-bold flex items-center justify-center gap-3 hover:bg-primary-500 hover:text-white transition-all shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:-translate-y-1 text-lg tracking-wide">
                            <span>{t.home.reserve}</span> <ArrowRight size={20} />
                        </Link>
                    </div>

                    {count > 1 && (
                        <>
                            <button onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/30 backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 border border-white/20 hover:scale-110"><ChevronLeft size={32} /></button>
                            <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/30 backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 border border-white/20 hover:scale-110"><ChevronRight size={32} /></button>
                            <div className="absolute bottom-10 right-10 flex gap-2 z-20 px-4 py-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10">
                                {room.images.map((_, idx) => <div key={idx} className={`h-2 rounded-full transition-all duration-300 shadow-sm ${idx === current ? 'w-8 bg-white' : 'w-2 bg-white/50'}`} />)}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export const Home = () => {
  // ... (Hooks remain same)
  const { content, rooms, sections, t, gt, gallery } = useData(); 
  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 1000], [0, 400]);
  const yAbout1 = useTransform(scrollY, [0, 1200], [0, -80]); 
  const yAbout2 = useTransform(scrollY, [0, 1200], [0, 60]); 
  const ctaRef = useRef(null);
  const { scrollYProgress: ctaScrollProgress } = useScroll({ target: ctaRef, offset: ["start end", "end start"] });
  const yCta = useTransform(ctaScrollProgress, [0, 1], [-100, 100]);
  const gallerySorted = [...gallery].sort((a,b) => a.order - b.order);
  const videoItems = gallerySorted.filter(item => item.video && item.video.length > 0);
  const imageItems = gallerySorted.filter(item => !item.video || item.video.length === 0);

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF9]">
      {/* ... Hero Section ... */}
      {sections.hero && (
        <div className="relative h-[100dvh] w-full overflow-hidden bg-gray-900">
            <StunningRating score={content.ratingScore || 4.5} label={t.home.rating} subLabel={t.home.onGoogle} />
            <motion.div style={{ y: yHero }} className="absolute inset-0 w-full h-full">
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/70 z-10" /> 
            <motion.img src={content.heroImage} alt="Résidence El Arich" className="w-full h-full object-cover" initial={{ scale: 1.2 }} animate={{ scale: 1 }} transition={{ duration: 10, ease: "linear" }} />
            </motion.div>
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pt-24 px-4">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="text-center w-full max-w-7xl mx-auto">
                <motion.div variants={fadeInUp} className="mb-8"><span className="inline-flex items-center gap-2 py-2 px-6 border border-white/30 rounded-full text-white text-xs md:text-sm font-bold tracking-[0.2em] uppercase backdrop-blur-md bg-white/10 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:bg-white/20 transition-all cursor-default"><Star size={12} className="text-primary-500 fill-primary-500" /> {t.home.welcome}</span></motion.div>
                <motion.h1 variants={textReveal} className="text-5xl md:text-7xl lg:text-[9rem] font-serif font-black text-white mb-8 shadow-sm tracking-tighter leading-[0.9]">{gt(content, 'heroTitle').split(' ').map((word: string, i: number) => <span key={i} className="inline-block mx-2 hover:text-primary-500 transition-colors duration-500">{word}</span>)}</motion.h1>
                <motion.p variants={fadeInUp} className="text-lg md:text-3xl text-white/90 mb-12 font-light max-w-3xl mx-auto leading-relaxed font-sans mix-blend-screen">{gt(content, 'heroSubtitle')}</motion.p>
                <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-5 justify-center items-center w-full px-6 sm:px-0">
                <Link to="/contact" className="w-full sm:w-auto group relative overflow-hidden bg-primary-600 text-white px-10 md:px-14 py-5 md:py-6 rounded-full text-lg font-bold transition-all duration-300 hover:shadow-[0_0_50px_rgba(245,110,30,0.6)] hover:scale-105 hover:-translate-y-1">
                    <span className="relative z-10 flex items-center justify-center gap-3">{t.home.reserve} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/></span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Link>
                <Link to="/rooms" className="w-full sm:w-auto flex justify-center items-center gap-3 text-white px-10 md:px-12 py-5 md:py-6 rounded-full text-lg font-bold transition-all duration-300 hover:bg-white/10 backdrop-blur-md border border-white/30 hover:border-white group">{t.home.discoverSuites}</Link>
                </motion.div>
            </motion.div>
            <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50" animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}><ChevronDown size={32} /></motion.div>
            </div>
        </div>
      )}

      {sections.features && (
        <div className="relative z-30 -mt-16 px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="max-w-7xl mx-auto bg-white/90 backdrop-blur-2xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.15)] rounded-[2.5rem] p-6 md:p-12 border border-white">
            <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-200/60">
                {[{ icon: MapPin, title: t.home.features.location, desc: t.home.features.locationDesc }, { icon: Star, title: t.home.features.charm, desc: t.home.features.charmDesc }, { icon: Wifi, title: t.home.features.services, desc: t.home.features.servicesDesc }].map((item, idx) => (
                <motion.div variants={featureCardVariant} key={idx} className="flex flex-col items-center p-4 group cursor-default transition-all duration-300 pt-8 md:pt-4">
                    <div className="w-20 h-20 flex items-center justify-center bg-gray-50 text-gray-900 border border-gray-200 rounded-2xl mb-6 group-hover:bg-gray-900 group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-xl group-hover:scale-110"><item.icon className="w-9 h-9 stroke-[1.5]" /></div>
                    <h3 className="font-serif text-2xl font-bold mb-3 text-gray-900">{item.title}</h3>
                    <p className="text-gray-500 font-medium leading-relaxed max-w-xs mx-auto">{item.desc}</p>
                </motion.div>
                ))}
            </motion.div>
            </motion.div>
        </div>
      )}

      {/* --- FEATURED ROOMS SECTION (UPDATED LAYOUT) --- */}
      {rooms.length > 0 && sections.features && (
          <section className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 relative z-10">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center">
                    <motion.span variants={fadeInUp} className="text-primary-600 font-black uppercase tracking-[0.2em] text-sm block mb-4">{t.home.featuredRooms.subtitle}</motion.span>
                    <motion.h2 variants={textReveal} className="text-4xl md:text-6xl font-serif font-black text-gray-900 leading-none tracking-tight mb-4">{t.home.featuredRooms.title}</motion.h2>
                    <motion.p variants={fadeInUp} className="text-gray-500 max-w-2xl mx-auto">{t.home.featuredRooms.desc}</motion.p>
                </motion.div>
            </div>
            
            {/* Centered Large Card Layout */}
            <motion.div 
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true, margin: "50px" }} 
                variants={staggerContainer} 
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-center gap-10"
            >
                {rooms.map((room) => (
                    <div key={room.id} className="w-full lg:w-[48%] flex-grow-0 flex-shrink-0">
                        <RoomCard room={room} />
                    </div>
                ))}
            </motion.div>
            
            <div className="flex justify-center mt-16">
                <Link to="/rooms" className="text-gray-900 hover:text-primary-600 font-bold flex items-center gap-3 group transition-colors px-10 py-5 bg-gray-50 rounded-full shadow-sm hover:shadow-lg border border-gray-100 text-lg"><span className="flex items-center gap-2">{t.home.featuredRooms.viewAll} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></span></Link>
            </div>
          </section>
      )}

      {/* ... About, Gallery, CTA ... */}
      {sections.about && (
        <section id="about" className="py-24 relative overflow-hidden bg-gray-50">
            {/* ... (Existing About Code) ... */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-20 items-center">
                <motion.div className="lg:col-span-6 mb-16 lg:mb-0 relative z-10" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
                <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-8"><div className="h-1 w-12 bg-primary-500 rounded-full"></div><span className="text-primary-600 font-bold uppercase tracking-[0.2em] text-xs">{t.home.about.subtitle}</span></motion.div>
                <motion.h2 variants={textReveal} className="text-5xl md:text-7xl font-serif font-black text-gray-900 mb-8 leading-[1]">{t.home.about.titleFirst} <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">{t.home.about.titleSecond}</span></motion.h2>
                <motion.div variants={fadeInUp} className="prose prose-lg text-gray-600 mb-10 font-medium leading-loose"><p className="mb-6">{gt(content, 'aboutText').split('\n')[0]}</p><p>{t.home.about.desc}</p></motion.div>
                <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-center gap-8"><Link to="/amenities" className="bg-gray-900 text-white px-10 py-5 rounded-full font-bold transition-all hover:bg-primary-600 hover:shadow-xl hover:-translate-y-1 text-center sm:text-left shadow-lg">{t.home.about.btn}</Link></motion.div>
                </motion.div>
                <div className="lg:col-span-6 relative h-[650px] hidden lg:block">
                    <motion.div style={{ y: yAbout1 }} initial={{ opacity: 0, x: 100, scale: 0.8 }} whileInView={{ opacity: 1, x: 0, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.2 }} className="absolute top-0 right-0 w-3/4 h-3/4 rounded-[3rem] overflow-hidden shadow-2xl z-0"><img src={content.aboutImage1} alt="Exterior" className="w-full h-full object-cover" /><div className="absolute inset-0 bg-primary-900/10 mix-blend-multiply"></div></motion.div>
                    <motion.div style={{ y: yAbout2 }} initial={{ opacity: 0, y: 100, x: -50, scale: 0.9 }} whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 }} className="absolute bottom-0 left-0 w-3/5 h-3/5 rounded-[3rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] z-10 border-[10px] border-gray-50"><img src={content.aboutImage2} alt="Interior" className="w-full h-full object-cover" /></motion.div>
                </div>
                <div className="lg:hidden mt-8 grid grid-cols-2 gap-4">
                    <motion.img initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} src={content.aboutImage1} alt="Exterior" className="w-full h-48 md:h-64 object-cover rounded-3xl shadow-lg" />
                    <motion.img initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} src={content.aboutImage2} alt="Interior" className="w-full h-48 md:h-64 object-cover rounded-3xl shadow-lg mt-8" />
                </div>
            </div>
            </div>
        </section>
      )}

      {sections.gallery && (
        <section className="py-24 bg-[#0F0F0F] text-white relative overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-900/10 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-[128px] pointer-events-none" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="max-w-2xl">
                        <motion.span variants={fadeInUp} className="text-primary-500 font-bold tracking-[0.2em] uppercase text-xs mb-4 block">{t.home.gallery.subtitle}</motion.span>
                        <motion.h2 variants={textReveal} className="text-4xl md:text-6xl font-serif font-black mb-4">{t.home.gallery.titleFirst} <br/> <span className="text-white/50">{t.home.gallery.titleSecond}</span></motion.h2>
                    </motion.div>
                    <motion.a href="https://www.instagram.com/hotel_elarich/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-6 py-3 rounded-full border border-white/20 hover:border-primary-500 hover:bg-white/5 transition-all group" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.8 }}><Instagram size={18} className="group-hover:text-primary-500 transition-colors" /> <span className="font-bold text-sm tracking-wide">{t.home.gallery.follow}</span></motion.a>
                </div>
                {videoItems.length > 0 && (
                    <div className="mb-20">
                        {videoItems.map(item => <motion.div key={item.id} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="w-full"><div className="flex items-center gap-6 mb-8 w-full max-w-4xl mx-auto text-center justify-center"><div className="h-px bg-gradient-to-r from-transparent to-white/30 flex-grow hidden md:block"></div><h3 className="text-2xl md:text-3xl font-serif text-white uppercase tracking-widest leading-relaxed px-4">{t.home.gallery.tourTitle}</h3><div className="h-px bg-gradient-to-r from-white/30 to-transparent flex-grow hidden md:block"></div></div><VideoTourCard video={item.video || ''} poster={item.images?.[0]} /></motion.div>)}
                    </div>
                )}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {imageItems.map(card => <GalleryCard key={card.id} category={gt(card, 'category')} title={gt(card, 'title')} description={gt(card, 'description')} images={card.images} />)}
                </motion.div>
            </div>
        </section>
      )}

      {sections.cta && (
        <section ref={ctaRef} className="relative py-32 md:py-48 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0 overflow-hidden"><motion.img style={{ y: yCta, scale: 1.1 }} src={content.ctaImage} className="w-full h-full object-cover filter brightness-50" alt="Espace Famille" loading="lazy" /><div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-black/50 mix-blend-multiply"></div></div>
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 50 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} className="relative z-10 text-center max-w-5xl mx-auto px-4">
            <span className="text-white/80 font-bold uppercase tracking-[0.3em] text-sm mb-6 block">{t.home.cta.subtitle}</span>
            <h2 className="text-5xl md:text-8xl font-serif font-black text-white mb-8 leading-[1.1] drop-shadow-2xl">{t.home.cta.titleFirst} <br/> <span className="text-primary-500">{t.home.cta.titleSecond}</span></h2>
            <p className="text-xl md:text-2xl text-white/90 mb-12 font-medium max-w-2xl mx-auto">{t.home.cta.desc}</p>
            <Link to="/contact" className="bg-white text-primary-900 px-12 md:px-16 py-6 rounded-full font-black text-lg hover:bg-primary-500 hover:text-white transition-all shadow-[0_30px_60px_rgba(0,0,0,0.5)] transform hover:-translate-y-2 inline-flex items-center gap-3">{t.home.cta.btn} <ArrowRight size={24} /></Link>
            </motion.div>
        </section>
      )}
    </div>
  );
};
