
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useData } from '../../services/DataContext';
import { Room, BookingRequest, SiteContent, Amenity, GalleryCardData } from '../../types';
import { 
  LayoutDashboard, BedDouble, CalendarCheck, Settings, Type, Image as ImageIcon, 
  Plus, Trash2, Edit, Save, X, LogOut, CheckCircle, Upload, ArrowLeft, Menu, Loader,
  Search, ExternalLink, RefreshCw, BarChart3, Palette, Globe, List, Shield, Smartphone,
  Coffee, Wifi, Wind, MapPin, Tv, Sun, ShieldCheck, Briefcase, Droplet, ArrowRight, User, Maximize, Phone, Lock, Key,
  ChevronLeft, ChevronRight, CarFront, ConciergeBell, Snowflake, Mountain, Sparkles, Palmtree, Luggage, Flame, Utensils, Bath
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// --- HELPERS ---
const iconList = [
    { name: 'Wifi', icon: <Wifi size={20} /> },
    { name: 'Coffee', icon: <Coffee size={20} /> },
    { name: 'Utensils', icon: <Utensils size={20} /> },
    { name: 'ConciergeBell', icon: <ConciergeBell size={20} /> },
    { name: 'Snowflake', icon: <Snowflake size={20} /> },
    { name: 'Wind', icon: <Wind size={20} /> }, // Keep for legacy or choice
    { name: 'CarFront', icon: <CarFront size={20} /> },
    { name: 'Mountain', icon: <Mountain size={20} /> },
    { name: 'MapPin', icon: <MapPin size={20} /> },
    { name: 'Tv', icon: <Tv size={20} /> },
    { name: 'Sparkles', icon: <Sparkles size={20} /> },
    { name: 'CheckCircle', icon: <CheckCircle size={20} /> },
    { name: 'Palmtree', icon: <Palmtree size={20} /> },
    { name: 'Sun', icon: <Sun size={20} /> },
    { name: 'ShieldCheck', icon: <ShieldCheck size={20} /> },
    { name: 'Luggage', icon: <Luggage size={20} /> },
    { name: 'Briefcase', icon: <Briefcase size={20} /> },
    { name: 'Flame', icon: <Flame size={20} /> },
    { name: 'Droplet', icon: <Droplet size={20} /> },
    { name: 'Bath', icon: <Bath size={20} /> },
];

// --- SUB-COMPONENTS ---

const DashboardStats = ({ bookings, rooms }: { bookings: BookingRequest[], rooms: Room[] }) => {
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
    const pendingBookings = bookings.filter(b => b.status === 'pending');
    
    // Simple revenue estimation
    const revenue = confirmedBookings.reduce((acc, curr) => {
        const start = new Date(curr.checkIn);
        const end = new Date(curr.checkOut);
        const nights = !isNaN(start.getTime()) && !isNaN(end.getTime()) 
            ? Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24))) 
            : 1;
        // Simple fallback price if room not found or no price
        const room = rooms.find(r => r.name === curr.roomType);
        const price = room ? (room.promotionPrice || room.price) : 50;
        return acc + (price * nights);
    }, 0);

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Revenu Total</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{revenue} <span className="text-sm text-gray-400">€</span></h3>
                </div>
                <div className="p-3 bg-green-50 text-green-600 rounded-xl"><span className="font-serif font-bold text-xl">$</span></div>
            </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Réservations</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{bookings.length}</h3>
                </div>
                <div className="p-3 bg-orange-50 text-orange-600 rounded-xl"><CalendarCheck size={24} /></div>
            </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Hébergements</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{rooms.length}</h3>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><BedDouble size={24} /></div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">En Attente</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{pendingBookings.length}</h3>
                </div>
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Loader size={24} /></div>
            </div>
        </div>
    );
};

const BookingsTable = ({ bookings, updateBookingStatus, deleteBooking }: any) => {
    // Sorting bookings by date desc
    const sorted = [...bookings].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-bold text-gray-900 uppercase text-xs tracking-wider">Client</th>
                            <th className="px-6 py-4 font-bold text-gray-900 uppercase text-xs tracking-wider">Chambre</th>
                            <th className="px-6 py-4 font-bold text-gray-900 uppercase text-xs tracking-wider">Dates</th>
                            <th className="px-6 py-4 font-bold text-gray-900 uppercase text-xs tracking-wider">Statut</th>
                            <th className="px-6 py-4 font-bold text-gray-900 uppercase text-xs tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {sorted.map((booking: any) => (
                            <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <p className="font-bold text-gray-900">{booking.name}</p>
                                    <p className="text-xs text-gray-500">{booking.email}</p>
                                    <p className="text-xs text-gray-500">{booking.phone}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="font-medium text-gray-700">{booking.roomType}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-gray-900 font-medium">Arrivée: {booking.checkIn}</p>
                                    <p className="text-gray-500">Départ: {booking.checkOut}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                        booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                        booking.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                        'bg-orange-100 text-orange-700'
                                    }`}>
                                        {booking.status === 'pending' ? 'En attente' : 
                                         booking.status === 'confirmed' ? 'Confirmé' : 'Refusé'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    {booking.status === 'pending' && (
                                        <>
                                            <button onClick={() => updateBookingStatus(booking.id, 'confirmed')} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Confirmer"><CheckCircle size={18} /></button>
                                            <button onClick={() => updateBookingStatus(booking.id, 'rejected')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Refuser"><X size={18} /></button>
                                        </>
                                    )}
                                    <button onClick={() => { if(confirm('Supprimer cette réservation ?')) deleteBooking(booking.id); }} className="p-2 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded-lg" title="Supprimer"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                        {sorted.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">Aucune réservation pour le moment.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const AnalyticsTab = ({ bookings, rooms }: { bookings: BookingRequest[], rooms: Room[] }) => {
    // Mock Data generation based on real counts
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
    const revenue = confirmedBookings.reduce((acc, curr) => {
        // Estimate nights (random 1-3 for demo if dates invalid)
        const start = new Date(curr.checkIn);
        const end = new Date(curr.checkOut);
        const nights = !isNaN(start.getTime()) && !isNaN(end.getTime()) 
            ? Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24))) 
            : 2;
        // Find room price
        const room = rooms.find(r => r.name === curr.roomType) || rooms[0];
        const price = room ? (room.promotionPrice || room.price) : 50;
        return acc + (price * nights);
    }, 0);

    const roomPopularity = rooms.map(r => {
        return bookings.filter(b => b.roomType === r.name).length;
    });

    const lineData = {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil'],
        datasets: [
            {
                label: 'Visiteurs (Estimé)',
                data: [65, 59, 80, 81, 56, 55, 40].map(n => n * (bookings.length + 1)),
                borderColor: 'rgb(245, 110, 30)',
                backgroundColor: 'rgba(245, 110, 30, 0.5)',
                tension: 0.4,
            }
        ],
    };

    const doughnutData = {
        labels: rooms.map(r => r.category),
        datasets: [
            {
                data: roomPopularity,
                backgroundColor: [
                    'rgba(245, 110, 30, 0.8)',
                    'rgba(20, 184, 166, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(168, 85, 247, 0.8)',
                ],
                borderWidth: 0,
            },
        ],
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Revenu Estimé</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-2">{revenue} <span className="text-sm text-gray-400">€</span></h3>
                        <p className="text-[10px] text-gray-400 mt-1">Basé sur les réservations confirmées</p>
                    </div>
                    <div className="p-3 bg-green-50 text-green-600 rounded-xl"><span className="font-serif font-bold text-xl">$</span></div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Demandes</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-2">{bookings.length}</h3>
                         <div className="flex gap-2 mt-1">
                             <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded text-[10px] font-bold">{bookings.filter(b => b.status === 'pending').length} en attente</span>
                             <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-bold">{confirmedBookings.length} confirmés</span>
                         </div>
                    </div>
                    <div className="p-3 bg-orange-50 text-orange-600 rounded-xl"><CalendarCheck size={24} /></div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                     <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Visiteurs (30j)</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-2">4,285 <span className="text-xs text-green-500 font-bold">↗ +12%</span></h3>
                        <p className="text-[10px] text-gray-400 mt-1">Données simulées Google Analytics</p>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><BarChart3 size={24} /></div>
                </div>
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                     <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Temps Moyen</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-2">2m 45s</h3>
                        <p className="text-[10px] text-gray-400 mt-1">Durée moyenne par session</p>
                    </div>
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Loader size={24} /></div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="font-serif font-bold text-gray-900">Trafic du Site</h4>
                        <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Live</span>
                    </div>
                    <div className="h-64">
                         <Line options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { grid: { display: false } } } }} data={lineData} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                     <h4 className="font-serif font-bold text-gray-900 mb-6 flex items-center gap-2"><Loader size={16} /> Popularité</h4>
                     <p className="text-xs text-gray-400 mb-4">Réservations par type de chambre</p>
                     <div className="h-48 flex justify-center">
                        <Doughnut data={doughnutData} options={{ cutout: '70%', plugins: { legend: { display: false } } }} />
                     </div>
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h4 className="font-serif font-bold text-gray-900 mb-4">Top 5 Pages Vues</h4>
                <div className="space-y-4">
                    {[{p: 'Accueil', u: '/', v: '3420'}, {p: 'Nos Chambres', u: '/rooms', v: '1850'}, {p: 'Réservation', u: '/contact', v: '920'}, {p: 'Services', u: '/amenities', v: '640'}, {p: 'Mentions Légales', u: '/legal', v: '120'}].map((page, i) => (
                        <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">{i + 1}</div>
                                <div>
                                    <p className="font-bold text-sm text-gray-900">{page.p}</p>
                                    <p className="text-[10px] text-gray-400">{page.u}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="font-bold text-gray-900">{page.v}</span>
                                <div className="w-24 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                                    <div className="h-full bg-primary-500 rounded-full" style={{ width: `${Math.max(10, 100 - (i * 20))}%` }}></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ServicesTab = ({ amenities, addAmenity, updateAmenity, deleteAmenity, resetDefaultServices }: any) => {
    const [isEditing, setIsEditing] = useState(false);
    const [current, setCurrent] = useState<Partial<Amenity>>({});

    const handleSave = async () => {
        if(!current.name || !current.icon) return alert("Nom et Icône requis");
        if(current.id) {
            await updateAmenity(current.id, current);
        } else {
            await addAmenity(current);
        }
        setIsEditing(false);
        setCurrent({});
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                     <h3 className="font-serif font-bold text-xl text-gray-900 flex items-center gap-2"><Coffee size={24} className="text-primary-500" /> Services & Équipements</h3>
                     <p className="text-sm text-gray-500">Gérez la liste des services affichés sur le site.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={resetDefaultServices} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-bold text-sm transition-colors flex items-center gap-2">
                        <RefreshCw size={16} /> Charger les exemples
                    </button>
                    <button onClick={() => { setCurrent({ name: '', description: '', icon: 'CheckCircle' }); setIsEditing(true); }} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-sm transition-colors flex items-center gap-2 shadow-lg shadow-primary-500/30">
                        <Plus size={16} /> Ajouter un Service
                    </button>
                </div>
            </div>

            {isEditing && (
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-primary-100 relative">
                     <button onClick={() => setIsEditing(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900"><X size={20} /></button>
                     <h4 className="font-bold text-lg mb-6">{current.id ? 'Modifier' : 'Nouveau Service'}</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                         <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Nom du Service (FR)</label>
                             <input type="text" value={current.name} onChange={(e) => setCurrent({...current, name: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-primary-500" placeholder="ex: Wifi Gratuit" />
                         </div>
                         <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Nom du Service (EN)</label>
                             <input type="text" value={current.nameEn || ''} onChange={(e) => setCurrent({...current, nameEn: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-primary-500" placeholder="ex: Free Wifi" />
                         </div>
                         <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Icône</label>
                             <div className="flex flex-wrap gap-2">
                                 {iconList.map(item => (
                                     <button 
                                        key={item.name} 
                                        onClick={() => setCurrent({...current, icon: item.name})}
                                        className={`p-2 rounded-lg border transition-all ${current.icon === item.name ? 'bg-primary-500 text-white border-primary-500' : 'bg-gray-50 border-gray-200 text-gray-400 hover:bg-white hover:border-primary-200'}`}
                                        title={item.name}
                                     >
                                         {item.icon}
                                     </button>
                                 ))}
                             </div>
                         </div>
                         <div className="md:col-span-2">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Description (FR)</label>
                                    <textarea rows={2} value={current.description} onChange={(e) => setCurrent({...current, description: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500" placeholder="Description courte..." />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Description (EN)</label>
                                    <textarea rows={2} value={current.descriptionEn || ''} onChange={(e) => setCurrent({...current, descriptionEn: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500" placeholder="Short description..." />
                                </div>
                             </div>
                         </div>
                     </div>
                     <div className="flex justify-end">
                         <button onClick={handleSave} className="px-6 py-2 bg-gray-900 text-white rounded-xl font-bold">Enregistrer</button>
                     </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {amenities.map((item: Amenity) => (
                    <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group hover:border-primary-200 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center">
                                {iconList.find(i => i.name === item.icon)?.icon || <CheckCircle />}
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => { setCurrent(item); setIsEditing(true); }} className="p-1.5 text-gray-400 hover:text-primary-600"><Edit size={16} /></button>
                                <button onClick={() => { if(confirm('Supprimer ?')) deleteAmenity(item.id); }} className="p-1.5 text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                            </div>
                        </div>
                        <h4 className="font-serif font-bold text-lg mb-2">{item.name}</h4>
                        <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- MAIN DASHBOARD COMPONENT ---

const AdminDashboard = () => {
  const { 
    isAuthenticated, login, logout, currentUser, updatePassword,
    rooms, addRoom, updateRoom, deleteRoom,
    amenities, addAmenity, updateAmenity, deleteAmenity, resetDefaultServices,
    bookings, updateBookingStatus, deleteBooking,
    gallery, addGalleryCard, updateGalleryCard, deleteGalleryCard,
    content, updateContent, 
    theme, updateTheme,
    seo, updateSeo,
    navLinks, updateNavLink,
    loading, uploadImage, seedDatabase
  } = useData();
  const navigate = useNavigate();

  // Auth State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Security Update State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityMsg, setSecurityMsg] = useState({ type: '', text: '' });

  // Dashboard State
  const [activeTab, setActiveTab] = useState('overview');
  
  // Room Editing
  const [isEditingRoom, setIsEditingRoom] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<Partial<Room>>({});
  
  // Gallery Editing
  const [isEditingGallery, setIsEditingGallery] = useState(false);
  const [currentGallery, setCurrentGallery] = useState<Partial<GalleryCardData>>({});

  const [isSaving, setIsSaving] = useState(false);
  
  // Local Content State for "Content" tab
  const [localContent, setLocalContent] = useState<SiteContent | null>(null);

  useEffect(() => {
    if (content) setLocalContent(content);
  }, [content]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err: any) {
      setAuthError("Email ou mot de passe incorrect.");
    }
  };

  // -- IMAGE ORDERING HELPER --
  const moveImage = (index: number, direction: 'left' | 'right', type: 'room' | 'gallery') => {
    const setter = type === 'room' ? setCurrentRoom : setCurrentGallery;
    setter(prev => {
        const images = [...(prev.images || [])];
        if (direction === 'left' && index > 0) {
            [images[index], images[index - 1]] = [images[index - 1], images[index]];
        } else if (direction === 'right' && index < images.length - 1) {
            [images[index], images[index + 1]] = [images[index + 1], images[index]];
        }
        return { ...prev, images };
    });
  };

  // -- ROOM HANDLERS --
  const handleSaveRoom = async () => {
    if (!currentRoom.category || !currentRoom.price) return alert("Veuillez remplir les champs obligatoires");
    setIsSaving(true);
    try {
      if (currentRoom.id) await updateRoom(currentRoom.id, currentRoom);
      else await addRoom(currentRoom as Room);
      setIsEditingRoom(false);
      setCurrentRoom({});
    } catch (e) { alert("Erreur lors de l'enregistrement"); } 
    finally { setIsSaving(false); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'room' | 'content' | 'gallery', field?: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsSaving(true);
    try {
        if (target === 'content' && field) {
            // Single file upload for content
            const file = files[0];
            const url = await uploadImage(file);
            setLocalContent(prev => prev ? ({ ...prev, [field]: url }) : null);
        } else {
            // Multiple file upload for room/gallery
            const uploadPromises = Array.from(files).map(file => uploadImage(file));
            const urls = await Promise.all(uploadPromises);

            if (target === 'room') {
                setCurrentRoom(prev => ({ ...prev, images: [...(prev.images || []), ...urls] }));
            } else if (target === 'gallery') {
                setCurrentGallery(prev => ({ ...prev, images: [...(prev.images || []), ...urls] }));
            }
        }
    } catch (error) { 
        alert("Erreur upload image"); 
        console.error(error);
    } finally { 
        setIsSaving(false); 
    }
  };

  // -- GALLERY HANDLERS --
  const handleSaveGallery = async () => {
      if(!currentGallery.title || !currentGallery.images?.length) return alert("Titre et au moins une image requis");
      setIsSaving(true);
      try {
          if(currentGallery.id) await updateGalleryCard(currentGallery.id, currentGallery);
          else await addGalleryCard(currentGallery as GalleryCardData);
          setIsEditingGallery(false);
          setCurrentGallery({});
      } catch(e) { alert("Erreur"); }
      finally { setIsSaving(false); }
  };

  const saveContent = async () => {
      if (localContent) {
          setIsSaving(true);
          await updateContent(localContent);
          setIsSaving(false);
          alert("Contenu mis à jour !");
      }
  };

  const handleUpdatePassword = async () => {
      if (newPassword.length < 6) {
          setSecurityMsg({ type: 'error', text: 'Le mot de passe doit contenir au moins 6 caractères.' });
          return;
      }
      if (newPassword !== confirmPassword) {
          setSecurityMsg({ type: 'error', text: 'Les mots de passe ne correspondent pas.' });
          return;
      }
      setIsSaving(true);
      try {
          await updatePassword(newPassword);
          setSecurityMsg({ type: 'success', text: 'Mot de passe mis à jour avec succès !' });
          setNewPassword('');
          setConfirmPassword('');
      } catch (error: any) {
          setSecurityMsg({ type: 'error', text: 'Erreur: ' + error.message });
      } finally {
          setIsSaving(false);
      }
  };

  // --- RENDER ---
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader className="animate-spin text-primary-500" /></div>;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl font-bold text-gray-900">Administration</h1>
            <p className="text-gray-500 mt-2">Résidence El Arich</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Mot de passe</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all" required />
            </div>
            {authError && <p className="text-red-500 text-sm text-center font-bold">{authError}</p>}
            <button type="submit" className="w-full bg-primary-600 text-white font-bold py-4 rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/30">Se connecter</button>
          </form>
          <div className="mt-8 text-center">
             <button onClick={() => navigate('/')} className="text-gray-400 hover:text-gray-600 text-sm font-medium flex items-center justify-center gap-2 w-full"><ArrowLeft size={16} /> Retour au site</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans text-gray-800">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#0F172A] text-white p-4 flex flex-col h-auto md:h-screen sticky top-0 z-50 shadow-xl">
        <div className="mb-8 flex items-center gap-3 px-2 pt-4">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/50">
                A
            </div>
            <div>
                <h1 className="font-bold text-lg leading-none font-serif">Admin</h1>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Dashboard</p>
            </div>
        </div>
        
        <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar pb-4">
          <div className="px-2 mb-2 text-[10px] uppercase tracking-wider text-gray-500 font-bold mt-4">Gestion</div>
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Vue d\'ensemble' },
            { id: 'bookings', icon: CalendarCheck, label: 'Réservations' },
            { id: 'rooms', icon: BedDouble, label: 'Hébergements' },
            { id: 'services', icon: Coffee, label: 'Services' },
            { id: 'gallery', icon: ImageIcon, label: 'Galerie Multimédia' },
            { id: 'analytics', icon: BarChart3, label: 'Analytique' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsEditingRoom(false); setIsEditingGallery(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-all ${
                activeTab === item.id ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/50' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}

          <div className="px-2 mb-2 text-[10px] uppercase tracking-wider text-gray-500 font-bold mt-6">Configuration</div>
          {[
            { id: 'content', icon: Type, label: 'Contenu Textuel' },
            { id: 'design', icon: Palette, label: 'Design & Thème' },
            { id: 'seo', icon: Globe, label: 'Référencement (SEO)' },
            { id: 'navigation', icon: List, label: 'Navigation' },
          ].map((item) => (
             <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsEditingRoom(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-all ${
                activeTab === item.id ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/50' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
          
           <div className="px-2 mb-2 text-[10px] uppercase tracking-wider text-gray-500 font-bold mt-6">Compte</div>
           <button 
                onClick={() => { setActiveTab('security'); setIsEditingRoom(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-all ${
                    activeTab === 'security' ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/50' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
           >
               <ShieldCheck size={18} /> Sécurité
           </button>
        </nav>

        <div className="pt-4 border-t border-white/10 mt-2">
             <button onClick={logout} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg font-bold text-xs transition-all border border-red-500/20 hover:border-red-500">
                <LogOut size={14} /> Déconnexion
             </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
            <div>
                 <span className="text-xs font-bold text-primary-600 uppercase tracking-widest flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span> Espace Administration
                 </span>
                 <h2 className="text-3xl font-serif font-bold text-gray-900">
                    {activeTab === 'overview' && "Tableau de Bord"}
                    {activeTab === 'bookings' && "Réservations"}
                    {activeTab === 'rooms' && "Hébergements"}
                    {activeTab === 'services' && "Services & Équipements"}
                    {activeTab === 'gallery' && "Galerie Multimédia"}
                    {activeTab === 'analytics' && "Tableau de Bord Analytique"}
                    {activeTab === 'content' && "Contenu du Site"}
                    {activeTab === 'design' && "Design & Apparence"}
                    {activeTab === 'seo' && "Optimisation SEO"}
                    {activeTab === 'navigation' && "Menu de Navigation"}
                    {activeTab === 'security' && "Sécurité & Accès"}
                </h2>
            </div>
            
             <a href="/" target="_blank" className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-50 hover:text-primary-600 transition-colors flex items-center gap-2 shadow-sm">
                 Voir le site en direct <ArrowRight size={14} />
             </a>
        </header>

        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in-up">
            <DashboardStats bookings={bookings} rooms={rooms} />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-lg mb-1">Réservations Récentes</h3>
                        <p className="text-sm text-gray-400">Dernières demandes reçues</p>
                    </div>
                    <button onClick={() => setActiveTab('bookings')} className="text-primary-600 text-sm font-bold hover:underline">Voir tout</button>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                         <h3 className="font-bold text-lg mb-1">Taux d'occupation</h3>
                         <div className="w-48 h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
                             <div className="h-full bg-green-500 w-[65%] rounded-full"></div>
                         </div>
                    </div>
                    <span className="text-2xl font-bold text-gray-900">65%</span>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && <AnalyticsTab bookings={bookings} rooms={rooms} />}

        {activeTab === 'services' && (
            <ServicesTab 
                amenities={amenities} 
                addAmenity={addAmenity} 
                updateAmenity={updateAmenity} 
                deleteAmenity={deleteAmenity}
                resetDefaultServices={resetDefaultServices}
            />
        )}

        {activeTab === 'bookings' && (
           <div className="animate-fade-in-up">
               <BookingsTable bookings={bookings} updateBookingStatus={updateBookingStatus} deleteBooking={deleteBooking} />
           </div>
        )}

        {activeTab === 'rooms' && (
          <div className="animate-fade-in-up">
            {isEditingRoom ? (
               <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 max-w-4xl mx-auto">
                   <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                       <h3 className="text-2xl font-bold font-serif text-gray-900">{currentRoom.id ? 'Modifier' : 'Ajouter'}</h3>
                       <button onClick={() => setIsEditingRoom(false)}><X className="text-gray-400 hover:text-gray-900" /></button>
                   </div>
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                       <div className="space-y-4">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <input type="text" placeholder="Catégorie (FR) (ex: Suite Royale)" value={currentRoom.category || ''} onChange={e => setCurrentRoom({...currentRoom, category: e.target.value, name: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border-none outline-none font-bold text-gray-900" />
                               <input type="text" placeholder="Catégorie (EN)" value={currentRoom.categoryEn || ''} onChange={e => setCurrentRoom({...currentRoom, categoryEn: e.target.value, nameEn: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border-none outline-none font-bold text-gray-900" />
                           </div>
                           
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <textarea rows={5} placeholder="Description (FR)..." value={currentRoom.description || ''} onChange={e => setCurrentRoom({...currentRoom, description: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border-none outline-none resize-none text-sm text-gray-600" />
                                <textarea rows={5} placeholder="Description (EN)..." value={currentRoom.descriptionEn || ''} onChange={e => setCurrentRoom({...currentRoom, descriptionEn: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border-none outline-none resize-none text-sm text-gray-600" />
                           </div>

                           <div className="flex gap-4">
                               <input type="number" placeholder="Prix" value={currentRoom.price || ''} onChange={e => setCurrentRoom({...currentRoom, price: Number(e.target.value)})} className="w-full p-3 bg-gray-50 rounded-xl font-bold" />
                               <input type="number" placeholder="Promo (opt)" value={currentRoom.promotionPrice || ''} onChange={e => setCurrentRoom({...currentRoom, promotionPrice: Number(e.target.value)})} className="w-full p-3 bg-red-50 text-red-500 rounded-xl font-bold placeholder-red-300" />
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" placeholder="Label Promo (FR)" value={currentRoom.promotionLabel || ''} onChange={e => setCurrentRoom({...currentRoom, promotionLabel: e.target.value})} className="w-full p-3 bg-red-50 rounded-xl text-sm" />
                                <input type="text" placeholder="Label Promo (EN)" value={currentRoom.promotionLabelEn || ''} onChange={e => setCurrentRoom({...currentRoom, promotionLabelEn: e.target.value})} className="w-full p-3 bg-red-50 rounded-xl text-sm" />
                           </div>

                           <div className="flex gap-4">
                               <input type="number" placeholder="Capacité" value={currentRoom.capacity || ''} onChange={e => setCurrentRoom({...currentRoom, capacity: Number(e.target.value)})} className="w-full p-3 bg-gray-50 rounded-xl font-bold" />
                               <input type="text" placeholder="Taille (30m²)" value={currentRoom.size || ''} onChange={e => setCurrentRoom({...currentRoom, size: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl font-bold" />
                           </div>
                           <label className="flex items-center gap-2 font-bold text-gray-700 cursor-pointer">
                               <input type="checkbox" checked={currentRoom.available || false} onChange={e => setCurrentRoom({...currentRoom, available: e.target.checked})} className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500" />
                               Disponible à la réservation
                           </label>
                       </div>
                       <div className="space-y-4">
                           <div className="grid grid-cols-2 gap-2">
                               {currentRoom.images?.map((img, i) => (
                                   <div key={i} className="relative aspect-video rounded-lg overflow-hidden group border border-gray-200">
                                       <img src={img} className="w-full h-full object-cover" />
                                       {/* Image Controls Overlay */}
                                       <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <button 
                                                onClick={(e) => { e.preventDefault(); moveImage(i, 'left', 'room'); }}
                                                disabled={i === 0}
                                                className={`p-1.5 bg-white/20 hover:bg-white hover:text-black text-white rounded transition-colors ${i===0 ? 'opacity-30 cursor-not-allowed':''}`}
                                            >
                                                <ChevronLeft size={16} />
                                            </button>
                                            <button 
                                                onClick={() => setCurrentRoom(p => ({...p, images: p.images?.filter((_, idx) => idx !== i)}))} 
                                                className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            <button 
                                                onClick={(e) => { e.preventDefault(); moveImage(i, 'right', 'room'); }}
                                                disabled={i === (currentRoom.images?.length || 0) - 1}
                                                className={`p-1.5 bg-white/20 hover:bg-white hover:text-black text-white rounded transition-colors ${i===(currentRoom.images?.length||0)-1 ? 'opacity-30 cursor-not-allowed':''}`}
                                            >
                                                <ChevronRight size={16} />
                                            </button>
                                       </div>
                                       <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full pointer-events-none">
                                            {i + 1}
                                       </div>
                                   </div>
                               ))}
                               <label className="aspect-video rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-primary-500 hover:text-primary-500 bg-gray-50">
                                   <Upload size={20} /> <span className="text-xs font-bold mt-1 text-center">Ajouter Images<br/>(Multiple)</span>
                                   <input type="file" multiple className="hidden" onChange={e => handleImageUpload(e, 'room')} />
                               </label>
                           </div>
                           <textarea placeholder="Équipements (séparés par virgules)..." value={currentRoom.features?.join(', ') || ''} onChange={e => setCurrentRoom({...currentRoom, features: e.target.value.split(',').map(s => s.trim())})} className="w-full p-3 bg-gray-50 rounded-xl border-none outline-none text-sm h-32" />
                       </div>
                   </div>
                   <div className="mt-8 flex justify-end gap-3">
                       <button onClick={() => setIsEditingRoom(false)} className="px-6 py-2 rounded-xl font-bold text-gray-500 hover:bg-gray-100">Annuler</button>
                       <button onClick={handleSaveRoom} disabled={isSaving} className="px-6 py-2 rounded-xl font-bold bg-gray-900 text-white hover:bg-primary-600 shadow-lg">{isSaving ? <Loader className="animate-spin" /> : 'Enregistrer'}</button>
                   </div>
               </div>
            ) : (
                <>
                    <div className="flex justify-end mb-6">
                        <button onClick={() => { setCurrentRoom({ available: true, images: [] }); setIsEditingRoom(true); }} className="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-lg flex items-center gap-2">
                            <Plus size={20} /> Ajouter une Chambre
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {rooms.map(room => (
                            <div key={room.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-all">
                                <div className="h-48 relative bg-gray-100">
                                    <img src={room.images?.[0]} className="w-full h-full object-cover" />
                                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => { setCurrentRoom(room); setIsEditingRoom(true); }} className="p-2 bg-white rounded-lg shadow-md text-gray-700 hover:text-primary-600"><Edit size={16} /></button>
                                        <button onClick={() => { if(confirm('Supprimer ?')) deleteRoom(room.id); }} className="p-2 bg-white rounded-lg shadow-md text-red-500 hover:bg-red-50"><Trash2 size={16} /></button>
                                    </div>
                                    <span className={`absolute bottom-2 left-2 px-2 py-1 rounded-md text-[10px] font-bold uppercase ${room.available ? 'bg-green-500 text-white' : 'bg-gray-800 text-white'}`}>{room.available ? 'Disponible' : 'Complet'}</span>
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-baseline mb-2">
                                        <h3 className="font-bold text-gray-900">{room.category}</h3>
                                        <span className="font-bold text-primary-600">{room.price} €</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <span className="flex items-center gap-1"><User size={12}/> {room.capacity} pers.</span>
                                        <span className="flex items-center gap-1"><Maximize size={12}/> {room.size}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
          </div>
        )}

        {activeTab === 'gallery' && (
             <div className="animate-fade-in-up">
                 {isEditingGallery ? (
                    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 max-w-2xl mx-auto">
                        <h3 className="text-xl font-bold mb-6">{currentGallery.id ? 'Modifier la carte' : 'Ajouter à la galerie'}</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" placeholder="Titre (FR) (ex: Oasis & Loisirs)" value={currentGallery.title || ''} onChange={e => setCurrentGallery({...currentGallery, title: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl font-bold" />
                                <input type="text" placeholder="Titre (EN)" value={currentGallery.titleEn || ''} onChange={e => setCurrentGallery({...currentGallery, titleEn: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl font-bold" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" placeholder="Catégorie (FR) (ex: Extérieur)" value={currentGallery.category || ''} onChange={e => setCurrentGallery({...currentGallery, category: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl" />
                                <input type="text" placeholder="Catégorie (EN)" value={currentGallery.categoryEn || ''} onChange={e => setCurrentGallery({...currentGallery, categoryEn: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl" />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <textarea placeholder="Description (FR)..." value={currentGallery.description || ''} onChange={e => setCurrentGallery({...currentGallery, description: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl h-24 resize-none" />
                                <textarea placeholder="Description (EN)..." value={currentGallery.descriptionEn || ''} onChange={e => setCurrentGallery({...currentGallery, descriptionEn: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl h-24 resize-none" />
                            </div>

                            <input type="text" placeholder="Lien Vidéo (MP4/WebM) - Optionnel" value={currentGallery.video || ''} onChange={e => setCurrentGallery({...currentGallery, video: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl text-sm" />
                            <input type="number" placeholder="Ordre d'affichage" value={currentGallery.order || 0} onChange={e => setCurrentGallery({...currentGallery, order: Number(e.target.value)})} className="w-full p-3 bg-gray-50 rounded-xl font-bold" />
                            
                            <div className="grid grid-cols-3 gap-2">
                                {currentGallery.images?.map((img, i) => (
                                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden group border border-gray-200">
                                        <img src={img} className="w-full h-full object-cover" />
                                        {/* Image Controls Overlay */}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                            <button 
                                                onClick={(e) => { e.preventDefault(); moveImage(i, 'left', 'gallery'); }}
                                                disabled={i === 0}
                                                className={`p-1 bg-white/20 hover:bg-white hover:text-black text-white rounded transition-colors ${i===0 ? 'opacity-30 cursor-not-allowed':''}`}
                                            >
                                                <ChevronLeft size={14} />
                                            </button>
                                            <button 
                                                onClick={() => setCurrentGallery(p => ({...p, images: p.images?.filter((_, idx) => idx !== i)}))} 
                                                className="p-1 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                            <button 
                                                onClick={(e) => { e.preventDefault(); moveImage(i, 'right', 'gallery'); }}
                                                disabled={i === (currentGallery.images?.length || 0) - 1}
                                                className={`p-1 bg-white/20 hover:bg-white hover:text-black text-white rounded transition-colors ${i===(currentGallery.images?.length||0)-1 ? 'opacity-30 cursor-not-allowed':''}`}
                                            >
                                                <ChevronRight size={14} />
                                            </button>
                                        </div>
                                        <div className="absolute top-1 left-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full pointer-events-none">
                                            {i + 1}
                                        </div>
                                    </div>
                                ))}
                                <label className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-primary-500 hover:text-primary-500 bg-gray-50">
                                   <Upload size={20} />
                                   <span className="text-[10px] font-bold text-center mt-1">Importer<br/>(Multiple)</span>
                                   <input type="file" multiple className="hidden" onChange={e => handleImageUpload(e, 'gallery')} />
                                </label>
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end gap-3">
                            <button onClick={() => setIsEditingGallery(false)} className="px-6 py-2 rounded-xl font-bold text-gray-500 hover:bg-gray-100">Annuler</button>
                            <button onClick={handleSaveGallery} disabled={isSaving} className="px-6 py-2 rounded-xl font-bold bg-gray-900 text-white hover:bg-primary-600 shadow-lg">{isSaving ? <Loader className="animate-spin" /> : 'Enregistrer'}</button>
                        </div>
                    </div>
                 ) : (
                    <>
                        <div className="flex justify-end mb-6">
                            <button onClick={() => { setCurrentGallery({ images: [], order: gallery.length + 1 }); setIsEditingGallery(true); }} className="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-lg flex items-center gap-2">
                                <Plus size={20} /> Ajouter un Élément
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {gallery.map(card => (
                                <div key={card.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
                                    <div className="h-48 relative">
                                        {card.video ? (
                                            <div className="w-full h-full bg-black flex items-center justify-center text-white"><span className="text-xs uppercase font-bold border px-2 py-1 rounded">Vidéo</span></div>
                                        ) : (
                                            <img src={card.images?.[0]} className="w-full h-full object-cover" />
                                        )}
                                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => { setCurrentGallery(card); setIsEditingGallery(true); }} className="p-2 bg-white rounded-lg shadow-md text-gray-700 hover:text-primary-600"><Edit size={16} /></button>
                                            <button onClick={() => { if(confirm('Supprimer ?')) deleteGalleryCard(card.id); }} className="p-2 bg-white rounded-lg shadow-md text-red-500 hover:bg-red-50"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-bold text-gray-900">{card.title}</h4>
                                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">{card.category}</p>
                                        <p className="text-sm text-gray-400 line-clamp-2">{card.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                 )}
             </div>
        )}

        {/* --- SECURITY TAB --- */}
        {activeTab === 'security' && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-2xl mx-auto animate-fade-in-up">
                 <h3 className="text-2xl font-serif font-bold mb-8 flex items-center gap-2"><Lock className="text-primary-500" /> Sécurité & Mot de Passe</h3>
                 <div className="space-y-6">
                     <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100 text-yellow-800 text-sm mb-6 flex items-start gap-3">
                         <ShieldCheck className="shrink-0 mt-0.5" size={18} />
                         <p>Pour des raisons de sécurité, choisissez un mot de passe fort (minimum 6 caractères) que vous n'utilisez pas ailleurs.</p>
                     </div>

                     <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Nouveau Mot de Passe</label>
                         <div className="relative">
                             <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                             <input 
                                type="password" 
                                value={newPassword} 
                                onChange={(e) => setNewPassword(e.target.value)} 
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="••••••••" 
                             />
                         </div>
                     </div>
                     <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Confirmer le Mot de Passe</label>
                         <div className="relative">
                             <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                             <input 
                                type="password" 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="••••••••" 
                             />
                         </div>
                     </div>

                     {securityMsg.text && (
                         <div className={`p-4 rounded-xl font-bold text-sm ${securityMsg.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                             {securityMsg.text}
                         </div>
                     )}
                 </div>
                 <div className="mt-8 flex justify-end">
                      <button 
                        onClick={handleUpdatePassword}
                        disabled={isSaving}
                        className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-primary-600 transition-colors shadow-lg disabled:opacity-50"
                      >
                          {isSaving ? <Loader className="animate-spin" size={18} /> : <Save size={18} />} 
                          Mettre à jour
                      </button>
                 </div>
            </div>
        )}

        {/* ... Rest of existing tabs (Content, Design, SEO, Navigation) ... */}
        {activeTab === 'content' && localContent && (
            <div className="animate-fade-in-up bg-white rounded-3xl shadow-sm border border-gray-100 p-8 max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8 sticky top-0 bg-white z-20 py-4 border-b border-gray-100">
                    <h3 className="text-2xl font-bold font-serif text-gray-900">Images Clés du Site</h3>
                    <button onClick={saveContent} disabled={isSaving} className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-primary-600 transition-colors shadow-lg flex items-center gap-2">
                        {isSaving ? <Loader className="animate-spin" size={20} /> : <Save size={20} />} Enregistrer
                    </button>
                </div>
                
                <div className="space-y-12">
                     {/* Image Management Section */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         {[
                             { label: 'Logo Principal', field: 'logo', aspect: 'aspect-video' },
                             { label: 'Image de Couverture (Accueil)', field: 'heroImage', aspect: 'aspect-video' },
                             { label: 'Image "À Propos" (Extérieur)', field: 'aboutImage1', aspect: 'aspect-video' },
                             { label: 'Image "À Propos" (Intérieur)', field: 'aboutImage2', aspect: 'aspect-video' },
                             { label: 'Image CTA (Espace Famille)', field: 'ctaImage', aspect: 'aspect-video' },
                             { label: 'Image Services (Conciergerie)', field: 'serviceImage', aspect: 'aspect-video' },
                             { label: 'Image de Fond (Pied de page)', field: 'footerImage', aspect: 'aspect-video' },
                         ].map((item, i) => (
                             <div key={i} className={item.field === 'heroImage' ? 'md:col-span-2' : ''}>
                                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{item.label}</p>
                                 <div className={`relative ${item.aspect} bg-gray-100 rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 hover:border-primary-500 transition-colors group`}>
                                     {/* @ts-ignore */}
                                     {localContent[item.field] ? (
                                         <>
                                            {/* @ts-ignore */}
                                            <img src={localContent[item.field]} className="w-full h-full object-cover" />
                                            <button onClick={() => setLocalContent(prev => prev ? ({...prev, [item.field]: ''}) : null)} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
                                         </>
                                     ) : (
                                         <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                                             <Upload size={32} className="mb-2" />
                                             <span className="text-xs font-bold">Glisser ou cliquer pour upload</span>
                                         </div>
                                     )}
                                     <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleImageUpload(e, 'content', item.field)} />
                                     <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                         <Upload size={24} className="mb-2" />
                                         <span className="text-xs font-bold">Remplacer l'image</span>
                                     </div>
                                 </div>
                             </div>
                         ))}
                     </div>

                     <div className="h-px bg-gray-100 my-8"></div>
                     
                     {/* Text & Config Section */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-6">
                             <h4 className="font-serif font-bold text-lg text-gray-900 flex items-center gap-2"><Type size={20} className="text-primary-500" /> Informations Générales</h4>
                             
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Titre Principal (FR / EN)</label>
                                <div className="grid gap-2">
                                    <input type="text" placeholder="Français" value={localContent.heroTitle} onChange={(e) => setLocalContent({...localContent, heroTitle: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none" />
                                    <input type="text" placeholder="English" value={localContent.heroTitleEn || ''} onChange={(e) => setLocalContent({...localContent, heroTitleEn: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none" />
                                </div>
                             </div>
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Sous-titre (FR / EN)</label>
                                <div className="grid gap-2">
                                    <textarea rows={2} placeholder="Français" value={localContent.heroSubtitle} onChange={(e) => setLocalContent({...localContent, heroSubtitle: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none resize-none" />
                                    <textarea rows={2} placeholder="English" value={localContent.heroSubtitleEn || ''} onChange={(e) => setLocalContent({...localContent, heroSubtitleEn: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none resize-none" />
                                </div>
                             </div>
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Texte "À Propos" (FR / EN)</label>
                                <div className="grid gap-2">
                                    <textarea rows={6} placeholder="Français" value={localContent.aboutText} onChange={(e) => setLocalContent({...localContent, aboutText: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none resize-none" />
                                    <textarea rows={6} placeholder="English" value={localContent.aboutTextEn || ''} onChange={(e) => setLocalContent({...localContent, aboutTextEn: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none resize-none" />
                                </div>
                             </div>
                         </div>

                         <div className="space-y-6">
                             <h4 className="font-serif font-bold text-lg text-gray-900 flex items-center gap-2"><Phone size={20} className="text-primary-500" /> Coordonnées & Réservations</h4>
                             
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email de Contact</label>
                                <input type="email" value={localContent.contactEmail} onChange={(e) => setLocalContent({...localContent, contactEmail: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
                             </div>
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Téléphone</label>
                                <input type="text" value={localContent.contactPhone} onChange={(e) => setLocalContent({...localContent, contactPhone: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
                             </div>
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Adresse Complète</label>
                                <input type="text" value={localContent.address} onChange={(e) => setLocalContent({...localContent, address: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
                             </div>
                             
                             <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                                 <h5 className="font-bold text-blue-900 mb-4 flex items-center gap-2"><ExternalLink size={16} /> Réservations Externes</h5>
                                 <label className="flex items-center gap-3 mb-4 cursor-pointer">
                                     <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${localContent.showBookingUrl ? 'bg-blue-600' : 'bg-gray-300'}`}>
                                         <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${localContent.showBookingUrl ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                     </div>
                                     <input type="checkbox" className="hidden" checked={localContent.showBookingUrl} onChange={e => setLocalContent({...localContent, showBookingUrl: e.target.checked})} />
                                     <span className="text-sm font-bold text-blue-800">Afficher le bouton Booking.com</span>
                                 </label>
                                 {localContent.showBookingUrl && (
                                     <div>
                                        <label className="block text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Lien vers Booking.com</label>
                                        <input type="text" value={localContent.bookingUrl} onChange={(e) => setLocalContent({...localContent, bookingUrl: e.target.value})} className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl outline-none text-blue-600 text-sm" />
                                     </div>
                                 )}
                             </div>
                         </div>
                     </div>
                </div>
            </div>
        )}

        {activeTab === 'design' && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-2xl mx-auto animate-fade-in-up">
                 <h3 className="text-2xl font-serif font-bold mb-8 flex items-center gap-2"><Palette className="text-primary-500" /> Thème & Couleurs</h3>
                 <div className="space-y-6">
                     <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                         <div className="flex items-center gap-4">
                             <input type="color" value={theme.primaryColor} onChange={(e) => updateTheme({ primaryColor: e.target.value })} className="w-12 h-12 rounded-lg cursor-pointer border-0 bg-transparent" />
                             <div>
                                 <p className="font-bold text-gray-900">Couleur Principale</p>
                                 <p className="text-xs text-gray-500">Utilisée pour les boutons, liens et accents.</p>
                             </div>
                         </div>
                         <span className="text-xs font-mono bg-white px-2 py-1 rounded border border-gray-200">{theme.primaryColor}</span>
                     </div>
                     <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                         <div className="flex items-center gap-4">
                             <input type="color" value={theme.secondaryColor} onChange={(e) => updateTheme({ secondaryColor: e.target.value })} className="w-12 h-12 rounded-lg cursor-pointer border-0 bg-transparent" />
                             <div>
                                 <p className="font-bold text-gray-900">Couleur Secondaire</p>
                                 <p className="text-xs text-gray-500">Utilisée pour les éléments décoratifs.</p>
                             </div>
                         </div>
                         <span className="text-xs font-mono bg-white px-2 py-1 rounded border border-gray-200">{theme.secondaryColor}</span>
                     </div>
                 </div>
                 <div className="mt-8 flex justify-end">
                      <button className="px-6 py-2 bg-gray-900 text-white rounded-xl font-bold flex items-center gap-2"><Save size={16} /> Appliquer le thème</button>
                 </div>
            </div>
        )}

        {activeTab === 'seo' && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-2xl mx-auto animate-fade-in-up">
                 <h3 className="text-2xl font-serif font-bold mb-8 flex items-center gap-2"><Globe className="text-primary-500" /> Référencement (SEO)</h3>
                 <div className="space-y-6">
                     <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Méta Titre</label>
                         <input type="text" value={seo.metaTitle} onChange={e => updateSeo({ metaTitle: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none" />
                         <p className="text-[10px] text-gray-400 mt-1">Le titre qui apparaît dans l'onglet du navigateur et sur Google.</p>
                     </div>
                     <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Méta Description</label>
                         <textarea rows={3} value={seo.metaDescription} onChange={e => updateSeo({ metaDescription: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none resize-none" />
                         <p className="text-[10px] text-gray-400 mt-1">La description courte qui apparaît sous le titre dans les résultats de recherche.</p>
                     </div>
                 </div>
                 <div className="mt-8 flex justify-end">
                      <button className="px-6 py-2 bg-gray-900 text-white rounded-xl font-bold flex items-center gap-2"><Save size={16} /> Sauvegarder SEO</button>
                 </div>
            </div>
        )}

        {activeTab === 'navigation' && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-2xl mx-auto animate-fade-in-up">
                 <h3 className="text-2xl font-serif font-bold mb-8 flex items-center gap-2"><List className="text-primary-500" /> Menu de Navigation</h3>
                 <div className="space-y-4">
                     {navLinks.sort((a,b) => a.order - b.order).map(link => (
                         <div key={link.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 group">
                             <div className="p-2 cursor-grab text-gray-400 hover:text-gray-600"><Menu size={16} /></div>
                             <div className="flex-1">
                                 <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Label</label>
                                 <input type="text" value={link.label} onChange={(e) => updateNavLink(link.id, { label: e.target.value })} className="w-full bg-transparent font-bold text-gray-900 outline-none" />
                             </div>
                             <div className="w-20">
                                 <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ordre</label>
                                 <input type="number" value={link.order} onChange={(e) => updateNavLink(link.id, { order: Number(e.target.value) })} className="w-full bg-transparent font-bold text-gray-900 outline-none" />
                             </div>
                             <button 
                                onClick={() => updateNavLink(link.id, { visible: !link.visible })}
                                className={`p-2 rounded-lg transition-colors ${link.visible ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'}`}
                             >
                                 <CheckCircle size={20} />
                             </button>
                         </div>
                     ))}
                 </div>
                 <p className="text-center text-xs text-gray-400 mt-6">Les modifications du menu sont enregistrées automatiquement.</p>
            </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;
