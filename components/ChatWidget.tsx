import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Mic, Send, Loader, Sparkles, Volume2, StopCircle, User, Bot } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { useData } from '../services/DataContext';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

const GEMINI_API_KEY = "AIzaSyCFo8eWaeqUR_uakk3mg48MWKkXboRlSFw";
const ELEVEN_LABS_KEY = "c4b95f32dca39beae96f60ee283e1317d2e3f8f62342682f87f3f3c9d4199509";
const ELEVEN_LABS_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // Rachel - Professional & Calming

export const ChatWidget = () => {
  const { content, rooms, amenities } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init', role: 'model', text: "Bonjour ! Je suis l'assistant de la Résidence El Arich. Je peux répondre à vos questions en français ou en anglais. 🏨" }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isOpen]);

  // Speech Recognition Setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      // Default to French, but it generally captures accents well enough for mixed use in this context
      recognition.lang = 'fr-FR'; 
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => (prev ? prev + ' ' : '') + transcript);
        setIsListening(false);
        if (inputRef.current) inputRef.current.focus();
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
        alert("La reconnaissance vocale n'est pas supportée par votre navigateur (essayez Chrome ou Edge).");
        return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const speakText = async (text: string) => {
      // Stop any currently playing audio
      if (audioRef.current) {
          audioRef.current.pause();
          setIsPlayingAudio(false);
      }

      // Fallback to browser TTS if no key provided (or quota exceeded logic handled in catch)
      if (!ELEVEN_LABS_KEY) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = /hello|welcome|thank|please/i.test(text) ? 'en-US' : 'fr-FR';
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(utterance);
          return;
      }

      try {
          setIsPlayingAudio(true);
          const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_LABS_VOICE_ID}`, {
              method: 'POST',
              headers: {
                  'xi-api-key': ELEVEN_LABS_KEY,
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  text: text,
                  model_id: "eleven_multilingual_v2",
                  voice_settings: {
                      stability: 0.5,
                      similarity_boost: 0.75
                  }
              })
          });

          if (!response.ok) throw new Error("ElevenLabs API Error");

          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          const audio = new Audio(url);
          audioRef.current = audio;
          
          audio.onended = () => {
              setIsPlayingAudio(false);
              URL.revokeObjectURL(url);
          };
          
          audio.play();

      } catch (error) {
          console.error("TTS Error:", error);
          // Fallback to browser
          setIsPlayingAudio(false);
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'fr-FR';
          window.speechSynthesis.speak(utterance);
      }
  };

  const stopAudio = () => {
      if (audioRef.current) {
          audioRef.current.pause();
          setIsPlayingAudio(false);
      }
      window.speechSynthesis.cancel();
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;
    
    const textToSend = inputText;
    setInputText('');
    
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
        const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
        
        // Context Construction with Real Data
        const context = `
            You are the AI Concierge of "Résidence El Arich" in Tozeur, Tunisia.
            
            HOTEL INFO:
            - Description: ${content.aboutText}
            - Contact: ${content.contactPhone}, ${content.contactEmail}
            - Location: ${content.address}
            
            ROOMS & PRICES (in TND):
            ${rooms.map(r => `- ${r.name}: ${r.price} TND/night. ${r.description} (Cap: ${r.capacity})`).join('\n')}
            
            AMENITIES:
            ${amenities.map(a => `- ${a.name}: ${a.description}`).join('\n')}
            
            GUIDELINES:
            1. Answer politely in the SAME LANGUAGE as the user (French or English).
            2. Be concise, helpful, and welcoming.
            3. If asked about booking, direct them to the contact page or reception.
            4. Do not invent services not listed above.
            5. Keep answers under 50 words unless asked for detail.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: [
                ...messages.filter(m => m.id !== 'init').map(m => ({ role: m.role, parts: [{ text: m.text }] })),
                { role: 'user', parts: [{ text: textToSend }] }
            ],
            config: {
                systemInstruction: context
            }
        });

        const reply = response.text || "Désolé, je n'ai pas compris.";
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: reply }]);
        
        // Auto-play TTS for the answer
        speakText(reply);

    } catch (err: any) {
        console.error("Erreur Chatbot:", err);
        const errorMsg = "Une erreur de connexion est survenue. Veuillez réessayer plus tard.";
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: errorMsg }]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
     <>
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: "bottom right" }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="fixed bottom-24 right-4 md:right-8 z-[60] w-[calc(100vw-2rem)] md:w-[380px] h-[600px] max-h-[80vh] bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col ring-1 ring-black/5"
                >
                    {/* Header */}
                    <div className="bg-gray-900 p-4 px-6 flex justify-between items-center text-white shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center border border-primary-500/30">
                                <Sparkles size={18} className="text-primary-400" />
                            </div>
                            <div>
                                <h3 className="font-serif font-bold tracking-wide">Assistant El Arich</h3>
                                <p className="text-[10px] text-gray-400 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> En ligne
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                        {messages.map((msg) => (
                            <motion.div 
                                key={msg.id} 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-primary-100 text-primary-600' : 'bg-gray-200 text-gray-600'}`}>
                                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                                </div>
                                <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm group relative ${msg.role === 'user' ? 'bg-primary-600 text-white rounded-br-none' : 'bg-white text-gray-700 border border-gray-100 rounded-bl-none'}`}>
                                    {msg.text}
                                    
                                    {msg.role === 'model' && (
                                        <button 
                                            onClick={() => speakText(msg.text)}
                                            className="absolute -right-8 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Écouter"
                                        >
                                            <Volume2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                        
                        {isLoading && (
                            <div className="flex items-center gap-2 text-gray-400 text-xs ml-12">
                                <Loader size={12} className="animate-spin" />
                                <span>L'assistant écrit...</span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white border-t border-gray-100">
                        <div className="relative flex items-center gap-2">
                             <input 
                                ref={inputRef}
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Posez votre question..."
                                className="w-full bg-gray-100 border-0 rounded-full pl-4 pr-24 py-3.5 focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm font-medium outline-none"
                             />
                             
                             <div className="absolute right-1.5 flex items-center gap-1">
                                 {isPlayingAudio ? (
                                     <button 
                                        onClick={stopAudio}
                                        className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors animate-pulse"
                                        title="Arrêter la lecture"
                                     >
                                         <StopCircle size={18} />
                                     </button>
                                 ) : (
                                    <button 
                                        onClick={toggleListening}
                                        className={`p-2 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-gray-400 hover:text-primary-600 hover:bg-gray-200'}`}
                                        title="Dictée vocale"
                                    >
                                        {isListening ? <StopCircle size={18} /> : <Mic size={18} />}
                                    </button>
                                 )}
                                 
                                 <button 
                                    onClick={handleSend}
                                    disabled={!inputText.trim() || isLoading}
                                    className="p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
                                 >
                                    <Send size={16} />
                                 </button>
                             </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        <div className="fixed bottom-6 right-6 z-[60]">
             <span className="absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-30 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] -z-10" />
             <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-16 h-16 bg-gray-900 hover:bg-primary-600 text-white rounded-full shadow-2xl flex items-center justify-center cursor-pointer transition-all duration-300 relative border border-white/10 group"
             >
                <AnimatePresence mode='wait'>
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <X size={28} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="chat"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="relative"
                        >
                            <MessageCircle size={28} className="fill-white/20 stroke-[1.5]" />
                            <Sparkles size={16} className="absolute -top-2 -right-2 text-primary-400 fill-primary-400 animate-pulse" />
                        </motion.div>
                    )}
                </AnimatePresence>
             </motion.button>
        </div>
     </>
  );
};