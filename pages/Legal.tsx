
import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { useData } from '../services/DataContext';
import { motion } from 'framer-motion';
import { Shield, FileText, Calendar } from 'lucide-react';

export const Legal = () => {
  const { t } = useData();
  const location = useLocation();
  
  // Determine if we are on the Privacy page or Legal page based on path
  const isPrivacy = location.pathname === '/privacy';
  
  const content = isPrivacy ? t.legalPage.privacy : t.legalPage.mentions;

  return (
    <div className="bg-[#FDFBF9] min-h-screen pt-28 md:pt-36 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6 }}
             className="inline-flex items-center justify-center p-3 bg-gray-100 rounded-full mb-6 text-gray-500"
          >
             {isPrivacy ? <Shield size={24} /> : <FileText size={24} />}
          </motion.div>
          
          <motion.h1 
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.1 }}
             className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-6"
          >
             {content.title}
          </motion.h1>
          
          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 0.8, delay: 0.3 }}
             className="flex items-center justify-center gap-2 text-gray-500 text-sm font-medium bg-white inline-flex px-4 py-2 rounded-full border border-gray-100 shadow-sm mx-auto"
          >
             <Calendar size={14} />
             <span>{content.updated}</span>
          </motion.div>
        </div>

        {/* Content Card */}
        <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-gray-100/50"
        >
            <div className="space-y-12">
                {content.sections.map((section, idx) => (
                    <div key={idx} className="relative pl-0 md:pl-8 border-l-0 md:border-l-2 border-gray-100">
                        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <span className="flex md:hidden w-2 h-8 bg-primary-500 rounded-full"></span>
                            {section.heading}
                        </h2>
                        <div className="prose prose-lg text-gray-600 leading-relaxed whitespace-pre-line">
                            {section.content}
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-16 pt-8 border-t border-gray-100 text-center">
                <p className="text-gray-400 text-sm">
                   Résidence El Arich - Tozeur. Tous droits réservés.
                </p>
            </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Legal;
