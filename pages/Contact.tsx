import * as React from 'react';
import { useState } from 'react';
import { useData } from '../services/DataContext';
import * as ReactRouterDOM from 'react-router-dom';
import { Mail, Phone, MapPin, Send, Check, Calendar, User, MessageSquare, ExternalLink, Loader, Star, AlertCircle } from 'lucide-react';
import { BookingRequest } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { send } from '@emailjs/browser';

const { useSearchParams } = ReactRouterDOM;

const Contact = () => {
  const { content, rooms, addBooking, t } = useData();
  const [searchParams] = useSearchParams();
  const preSelectedRoom = searchParams.get('room') || '';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    roomType: preSelectedRoom,
    checkIn: '',
    checkOut: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  // Validation Messages Dictionary (French only)
  const validationMsgs = {
      name: "Le nom doit comporter au moins 3 caractères.",
      email: "Veuillez entrer une adresse email valide.",
      phone: "Veuillez entrer un numéro de téléphone valide (min 8 chiffres).",
      checkIn: "La date d'arrivée est requise.",
      checkOut: "La date de départ doit être ultérieure à l'arrivée.",
      message: "Votre message est trop court (min 10 caractères)."
  };

  const getErrorMsg = (field: keyof typeof validationMsgs) => {
      return validationMsgs[field];
  };

  const validateForm = () => {
      const newErrors: Record<string, string> = {};
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[\d\s\+\-\(\)]{8,}$/;

      if (!formData.name.trim() || formData.name.length < 3) {
          newErrors.name = getErrorMsg('name');
      }

      if (!formData.email || !emailRegex.test(formData.email)) {
          newErrors.email = getErrorMsg('email');
      }

      if (!formData.phone || !phoneRegex.test(formData.phone)) {
          newErrors.phone = getErrorMsg('phone');
      }

      if (!formData.checkIn) {
          newErrors.checkIn = getErrorMsg('checkIn');
      }

      if (!formData.checkOut) {
          // Should be covered by comparison logic, but just in case
          newErrors.checkOut = getErrorMsg('checkOut'); 
      } else if (formData.checkIn && new Date(formData.checkOut) <= new Date(formData.checkIn)) {
          newErrors.checkOut = getErrorMsg('checkOut');
      }

      if (!formData.message.trim() || formData.message.length < 10) {
          newErrors.message = getErrorMsg('message');
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field when user types
    if (errors[name]) {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
        });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }

    setIsSending(true);

    // Get the actual room name and calculation details
    const selectedRoomName = rooms.find(r => r.id === formData.roomType)?.name || formData.roomType || 'Non spécifié';
    
    // Calculate nights with safety check
    let diffDays = 0;
    // Format dates to be very readable
    let formattedCheckIn = formData.checkIn; 
    let formattedCheckOut = formData.checkOut;

    if (formData.checkIn && formData.checkOut) {
        const start = new Date(formData.checkIn);
        const end = new Date(formData.checkOut);
        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
            const timeDiff = Math.abs(end.getTime() - start.getTime());
            diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            
            // Format dates friendly (e.g. "12 Juin 2026")
            const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
            formattedCheckIn = start.toLocaleDateString('fr-FR', opts);
            formattedCheckOut = end.toLocaleDateString('fr-FR', opts);
        }
    }

    // --- PLAIN TEXT MESSAGE FORMATTING ---
    // Using plain text structure instead of HTML ensures it displays correctly
    // even if the email client or template treats the variable as text.
    const richMessageContent = `
NOUVELLE DEMANDE DE RÉSERVATION
================================

👤 CLIENT
--------------------------------
Nom      : ${formData.name}
Email    : ${formData.email}
Téléphone: ${formData.phone}

🏨 HÉBERGEMENT
--------------------------------
Chambre  : ${selectedRoomName}
Arrivée  : ${formattedCheckIn}
Départ   : ${formattedCheckOut}
Durée    : ${diffDays} nuit(s)

💬 MESSAGE DU CLIENT
--------------------------------
${formData.message}
================================
    `.trim();

    const currentTime = new Date().toLocaleString('fr-FR', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });

    const templateParams = {
        name: formData.name,
        time: currentTime, 
        message: richMessageContent, 
        
        // Pass individual fields as well
        email: formData.email,
        phone: formData.phone,
        room: selectedRoomName,
        check_in: formattedCheckIn,
        check_out: formattedCheckOut,
        nights: diffDays,
        raw_message: formData.message
    };

    try {
        await send(
            'service_bke57ol',
            'template_c11z1lf',
            templateParams,
            { publicKey: '9j0HOi1f_BUl4i-NU' }
        );

        // Also save to Firebase
        const newBooking: BookingRequest = {
            id: Date.now().toString(),
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            roomType: selectedRoomName,
            checkIn: formData.checkIn,
            checkOut: formData.checkOut,
            status: 'pending',
            date: new Date().toISOString().split('T')[0]
        };
        addBooking(newBooking);
        setSubmitted(true);
    } catch (error: any) {
        console.error('EmailJS Error:', error);
        const errorText = error?.text ? error.text : (typeof error === 'string' ? error : JSON.stringify(error));
        alert(`Une erreur est survenue lors de l'envoi de l'email: ${errorText}. Veuillez vérifier votre connexion.`);
    } finally {
        setIsSending(false);
    }
  };

  return (
    <div className="bg-[#FDFBF9] min-h-screen pt-28 md:pt-36 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-20">
          <motion.span 
             initial={{ opacity: 0 }} 
             animate={{ opacity: 1 }} 
             className="text-primary-600 font-bold uppercase tracking-[0.2em] text-xs block mb-4"
          >
            {t.contact.subtitle}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-serif font-bold text-gray-900 mb-6"
          >
              {t.contact.title}
          </motion.h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-light">
            {t.contact.desc}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Information Side (Dark Theme) */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-5 space-y-8"
          >
            <div className="bg-gray-900 text-white rounded-[2.5rem] shadow-xl p-8 md:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
              
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-8 md:mb-10 relative z-10">{t.contact.title}</h2>
              <div className="space-y-8 md:space-y-10 relative z-10">
                
                {/* Clickable Address */}
                <a 
                  href={content.googleMapsLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-start space-x-6 group cursor-pointer hover:bg-white/5 p-2 -ml-2 rounded-2xl transition-all"
                >
                  <div className="bg-white/10 p-4 rounded-2xl text-primary-400 shrink-0 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300">
                     <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg mb-1 opacity-80 group-hover:text-primary-500 transition-colors">{t.contact.info.address}</h3>
                    <p className="text-gray-300 leading-relaxed font-light text-sm md:text-base group-hover:text-white transition-colors">{content.address}</p>
                  </div>
                </a>

                {/* Clickable Phone */}
                <a 
                  href={`tel:${content.contactPhone.replace(/\s+/g, '')}`} 
                  className="flex items-start space-x-6 group cursor-pointer hover:bg-white/5 p-2 -ml-2 rounded-2xl transition-all"
                >
                   <div className="bg-white/10 p-4 rounded-2xl text-primary-400 shrink-0 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300">
                     <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg mb-1 opacity-80 group-hover:text-primary-500 transition-colors">{t.contact.info.phone}</h3>
                    <p className="text-white text-lg md:text-xl font-serif tracking-wide mb-1 group-hover:text-primary-400 transition-colors">{content.contactPhone}</p>
                    <p className="text-xs text-gray-400 uppercase tracking-widest group-hover:text-gray-300">{t.contact.info.whatsapp}</p>
                  </div>
                </a>

                {/* Clickable Email */}
                <a 
                  href={`mailto:${content.contactEmail}`}
                  className="flex items-start space-x-6 group cursor-pointer hover:bg-white/5 p-2 -ml-2 rounded-2xl transition-all"
                >
                   <div className="bg-white/10 p-4 rounded-2xl text-primary-400 shrink-0 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300">
                     <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg mb-1 opacity-80 group-hover:text-primary-500 transition-colors">{t.contact.info.email}</h3>
                    <p className="text-gray-300 text-base md:text-lg break-all group-hover:text-white transition-colors">{content.contactEmail}</p>
                  </div>
                </a>

              </div>
            </div>

            <div className="rounded-[2.5rem] overflow-hidden shadow-lg h-64 md:h-80 border border-gray-200 relative">
               {/* Google Rating Overlay */}
               <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-100 z-10">
                   <div className="bg-[#4285F4] p-2.5 rounded-xl text-white shadow-md">
                       <MapPin size={18} fill="currentColor" />
                   </div>
                   <div>
                       <div className="flex items-center gap-0.5 text-[#FBBC05]">
                            <Star size={14} fill="currentColor" strokeWidth={0} />
                            <Star size={14} fill="currentColor" strokeWidth={0} />
                            <Star size={14} fill="currentColor" strokeWidth={0} />
                            <Star size={14} fill="currentColor" strokeWidth={0} />
                            <Star size={14} className="text-gray-300" strokeWidth={0} fill="currentColor" />
                       </div>
                       <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-1">
                           4.0/5 {t.home.onGoogle}
                       </div>
                   </div>
               </div>

               <iframe 
                 src={content.mapUrl} 
                 width="100%" 
                 height="100%" 
                 style={{ border: 0 }} 
                 loading="lazy"
                 title="Location Map"
                 className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700 opacity-80 hover:opacity-100"
               ></iframe>
            </div>
          </motion.div>

          {/* Form Side (Light Theme) */}
          <motion.div 
             initial={{ opacity: 0, x: 50 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
             className="lg:col-span-7 space-y-8"
          >
             {/* Booking.com Card - DYNAMICALLY MANAGED */}
             {content.showBookingUrl && (
               <div className="bg-[#003580] rounded-[2rem] p-6 md:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 transform hover:-translate-y-1 transition-transform duration-300">
                  <div className="text-center sm:text-left">
                     <h3 className="text-xl font-bold font-serif mb-2 flex items-center justify-center sm:justify-start gap-2">
                        <span className="bg-white text-[#003580] px-2 py-0.5 rounded text-xs font-black">B.</span> {t.contact.form.bookingTitle}
                     </h3>
                     <p className="text-blue-100 text-sm max-w-sm">{t.contact.form.bookingDesc}</p>
                  </div>
                  <a 
                     href={content.bookingUrl} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="whitespace-nowrap bg-white text-[#003580] hover:bg-blue-50 px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2 group"
                  >
                     {t.contact.form.bookingBtn} <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
                  </a>
               </div>
             )}

            <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] p-6 md:p-14 border border-gray-100 relative overflow-hidden">
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-8 text-gray-900 relative z-10">{t.contact.form.directRequest}</h2>
              
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, type: "spring" }}
                  className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center p-8 md:p-12 text-center"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mb-8 border-4 border-green-100 shadow-xl"
                  >
                      <Check className="h-10 w-10 text-green-600 stroke-[3]" />
                  </motion.div>
                  
                  <motion.h3 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-green-900 font-bold font-serif text-3xl md:text-5xl mb-4"
                  >
                    {t.contact.form.success.title}
                  </motion.h3>
                  
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-500 text-base md:text-lg mb-10 leading-relaxed max-w-md"
                  >
                    {t.contact.form.success.desc}
                  </motion.p>
                  
                  <motion.button 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    onClick={() => { setSubmitted(false); setFormData({...formData, message: ''}); }} 
                    className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:bg-primary-600 transition-colors shadow-lg"
                  >
                    {t.contact.form.success.btn}
                  </motion.button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-2 md:space-y-3">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">{t.contact.form.labels.name} <span className="text-red-500">*</span></label>
                      <div className="relative">
                          <User className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.name ? 'text-red-400' : 'text-gray-300'}`} size={20} />
                          <input 
                              type="text" 
                              name="name" 
                              value={formData.name}
                              placeholder={t.contact.form.placeholders.name}
                              onChange={handleChange} 
                              className={`w-full pl-12 pr-4 py-3 md:py-4 bg-gray-50 border rounded-2xl text-gray-900 focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all placeholder-gray-400 font-medium text-base ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-0'}`}
                          />
                      </div>
                      <AnimatePresence>
                        {errors.name && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-1.5 text-red-500 text-xs font-bold pl-1">
                                <AlertCircle size={12} /> {errors.name}
                            </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="space-y-2 md:space-y-3">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">{t.contact.form.labels.email} <span className="text-red-500">*</span></label>
                      <div className="relative">
                          <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.email ? 'text-red-400' : 'text-gray-300'}`} size={20} />
                          <input 
                              type="email" 
                              name="email" 
                              value={formData.email}
                              placeholder={t.contact.form.placeholders.email}
                              onChange={handleChange} 
                              className={`w-full pl-12 pr-4 py-3 md:py-4 bg-gray-50 border rounded-2xl text-gray-900 focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all placeholder-gray-400 font-medium text-base ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-0'}`}
                          />
                      </div>
                      <AnimatePresence>
                        {errors.email && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-1.5 text-red-500 text-xs font-bold pl-1">
                                <AlertCircle size={12} /> {errors.email}
                            </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-2 md:space-y-3">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">{t.contact.form.labels.phone} <span className="text-red-500">*</span></label>
                      <div className="relative">
                          <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.phone ? 'text-red-400' : 'text-gray-300'}`} size={20} />
                          <input 
                              type="tel" 
                              name="phone" 
                              value={formData.phone}
                              placeholder={t.contact.form.placeholders.phone}
                              onChange={handleChange} 
                              className={`w-full pl-12 pr-4 py-3 md:py-4 bg-gray-50 border rounded-2xl text-gray-900 focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all placeholder-gray-400 font-medium text-base ${errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-0'}`}
                          />
                      </div>
                      <AnimatePresence>
                        {errors.phone && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-1.5 text-red-500 text-xs font-bold pl-1">
                                <AlertCircle size={12} /> {errors.phone}
                            </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="space-y-2 md:space-y-3">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">{t.contact.form.labels.room}</label>
                      <div className="relative">
                          <select 
                              name="roomType" 
                              value={formData.roomType} 
                              onChange={handleChange} 
                              className="w-full pl-4 pr-10 py-3 md:py-4 bg-gray-50 border-0 rounded-2xl text-gray-900 focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all appearance-none font-medium cursor-pointer text-base"
                          >
                          <option value="" className="text-gray-500">{t.contact.form.placeholders.room}</option>
                          {rooms.map(room => (
                              <option key={room.id} value={room.id}>{room.name}</option>
                          ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-500">
                              <ArrowDownIcon />
                          </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-2 md:space-y-3">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">{t.contact.form.labels.checkIn} <span className="text-red-500">*</span></label>
                      <div className="relative">
                          <Calendar className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.checkIn ? 'text-red-400' : 'text-gray-300'}`} size={20} />
                          <input 
                              type="date" 
                              name="checkIn" 
                              value={formData.checkIn}
                              onChange={handleChange} 
                              className={`w-full pl-12 pr-4 py-3 md:py-4 bg-gray-50 border rounded-2xl text-gray-900 focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all font-medium text-base ${errors.checkIn ? 'border-red-500 focus:ring-red-500' : 'border-0'}`} 
                          />
                      </div>
                      <AnimatePresence>
                        {errors.checkIn && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-1.5 text-red-500 text-xs font-bold pl-1">
                                <AlertCircle size={12} /> {errors.checkIn}
                            </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="space-y-2 md:space-y-3">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">{t.contact.form.labels.checkOut} <span className="text-red-500">*</span></label>
                      <div className="relative">
                          <Calendar className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.checkOut ? 'text-red-400' : 'text-gray-300'}`} size={20} />
                          <input 
                              type="date" 
                              name="checkOut" 
                              value={formData.checkOut}
                              onChange={handleChange} 
                              className={`w-full pl-12 pr-4 py-3 md:py-4 bg-gray-50 border rounded-2xl text-gray-900 focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all font-medium text-base ${errors.checkOut ? 'border-red-500 focus:ring-red-500' : 'border-0'}`} 
                          />
                      </div>
                      <AnimatePresence>
                        {errors.checkOut && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-1.5 text-red-500 text-xs font-bold pl-1">
                                <AlertCircle size={12} /> {errors.checkOut}
                            </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="space-y-2 md:space-y-3">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">{t.contact.form.labels.message} <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <MessageSquare className={`absolute left-4 top-6 ${errors.message ? 'text-red-400' : 'text-gray-300'}`} size={20} />
                      <textarea 
                          name="message" 
                          value={formData.message}
                          rows={4} 
                          placeholder={t.contact.form.placeholders.message}
                          onChange={handleChange} 
                          className={`w-full pl-12 pr-4 py-3 md:py-4 bg-gray-50 border rounded-2xl text-gray-900 focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all font-medium text-base ${errors.message ? 'border-red-500 focus:ring-red-500' : 'border-0'}`}
                      ></textarea>
                    </div>
                    <AnimatePresence>
                        {errors.message && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-1.5 text-red-500 text-xs font-bold pl-1">
                                <AlertCircle size={12} /> {errors.message}
                            </motion.div>
                        )}
                    </AnimatePresence>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSending}
                    className="w-full bg-primary-600 text-white font-bold py-4 md:py-5 rounded-2xl hover:bg-primary-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex justify-center items-center text-lg shadow-lg group disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSending ? (
                        <>
                            <Loader className="animate-spin mr-3" size={24} />
                            {t.contact.form.sending}
                        </>
                    ) : (
                        <>
                            {t.contact.form.submit} <Send size={20} className="ml-3 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const ArrowDownIcon = () => (
    <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
);

export default Contact;