
import * as React from 'react';
import { useData } from '../services/DataContext';
import { LucideProps } from 'lucide-react';
import * as Icons from 'lucide-react';
import * as ReactRouterDOM from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

const { Link } = ReactRouterDOM;

const Amenities = () => {
  const { amenities, content, t } = useData();

  const renderIcon = (iconName: string) => {
    // @ts-ignore
    const IconComponent = Icons[iconName] as React.ComponentType<LucideProps>;
    return IconComponent ? <IconComponent size={32} strokeWidth={1.5} /> : null;
  };

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    show: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } 
    }
  };

  return (
    <div className="bg-[#FDFBF9] min-h-screen pt-28 md:pt-36 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 md:mb-24">
          <motion.span 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="text-primary-600 font-bold uppercase tracking-[0.2em] text-xs block mb-4"
          >
            {t.amenities.subtitle}
          </motion.span>
          <motion.h1 
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.1 }}
             className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-6"
          >
             {t.amenities.title}
          </motion.h1>
          <motion.p 
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.2 }}
             className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed"
          >
            {t.amenities.desc}
          </motion.p>
        </div>

        <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mb-16 md:mb-24"
        >
          {amenities.map((amenity) => (
            <motion.div 
                key={amenity.id} 
                variants={item}
                className="group relative bg-white rounded-[2.5rem] p-8 md:p-10 transition-all duration-500 hover:shadow-[0_30px_60px_-12px_rgba(245,110,30,0.15)] hover:-translate-y-2 border border-gray-100 hover:border-primary-100/50 overflow-hidden flex flex-col"
            >
              {/* Decorative Gradients */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-primary-50 to-primary-100/30 rounded-bl-[100px] -mr-12 -mt-12 transition-transform duration-700 group-hover:scale-[3] z-0 opacity-100 group-hover:opacity-100" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary-50/40 rounded-tr-[80px] -ml-8 -mb-8 transition-transform duration-700 scale-0 group-hover:scale-[2] z-0" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white border border-primary-100 text-primary-600 rounded-2xl mb-6 md:mb-8 flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-primary-500 group-hover:to-primary-600 group-hover:text-white group-hover:border-transparent group-hover:rotate-3 group-hover:scale-110 transition-all duration-300 shadow-sm group-hover:shadow-lg group-hover:shadow-primary-500/30">
                  {renderIcon(amenity.icon)}
                </div>
                
                <h3 className="text-xl md:text-3xl font-bold mb-4 font-serif text-gray-900 group-hover:text-primary-800 transition-colors">{amenity.name}</h3>
                
                <div className="w-12 h-1 bg-primary-100 rounded-full mb-5 group-hover:w-full group-hover:bg-primary-200/50 transition-all duration-500" />
                
                <p className="text-gray-500 leading-relaxed text-base md:text-lg font-light group-hover:text-gray-600 transition-colors">
                  {amenity.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Parallax CTA */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
           whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
           viewport={{ once: true }}
           transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
           className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl h-[500px] group"
        >
             <div className="absolute inset-0">
                <img 
                  src={content.serviceImage || "https://yourimageshare.com/ib/cMif5GzVtg.jpg"} 
                  alt="Service Conciergerie" 
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" 
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
             </div>
             
             <div className="absolute bottom-0 left-0 w-full p-8 md:p-20 text-center md:text-left flex flex-col md:flex-row items-center md:items-end justify-between gap-8">
                 <div className="max-w-2xl text-white">
                    <span className="uppercase tracking-[0.2em] text-xs md:text-sm font-bold text-primary-400 mb-4 block">{t.amenities.concierge.tag}</span>
                    <h2 className="text-3xl md:text-5xl font-bold font-serif mb-4 md:mb-6 leading-tight">{t.amenities.concierge.title}</h2>
                    <p className="text-lg md:text-xl font-light text-white/90 leading-relaxed">
                        {t.amenities.concierge.desc}
                    </p>
                 </div>
                 
                 <Link to="/contact" className="shrink-0 bg-white text-gray-900 font-bold py-4 px-10 md:py-5 md:px-12 rounded-full hover:bg-primary-50 transition-all transform hover:scale-105 shadow-xl flex items-center gap-3 text-base md:text-lg group/btn">
                    {t.amenities.concierge.btn} <Icons.ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                 </Link>
             </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Amenities;
