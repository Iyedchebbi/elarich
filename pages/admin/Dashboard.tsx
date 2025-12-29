
import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { useData } from '../../services/DataContext';
import { Room, BookingRequest, SiteContent, Amenity, GalleryCardData } from '../../types';
import { 
  LayoutDashboard, BedDouble, CalendarCheck, Settings, Type, Image as ImageIcon, 
  Plus, Trash2, Edit, Save, X, LogOut, CheckCircle, Upload, ArrowLeft, Menu, Loader,
  Search, ExternalLink, RefreshCw, BarChart3, Palette, Globe, List, Shield, Smartphone,
  Coffee, Wifi, Wind, MapPin, Tv, Sun, ShieldCheck, Briefcase, Droplet, ArrowRight, User, Maximize, Phone, Lock, Key,
  ChevronLeft, ChevronRight, CarFront, ConciergeBell, Snowflake, Mountain, Sparkles, Palmtree, Luggage, Flame, Utensils, Bath,
  TrendingUp, PieChart, Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

// --- HELPERS ---
const iconList = [
    { name: 'Wifi', icon: <Wifi size={20} /> },
    { name: 'Coffee', icon: <Coffee size={20} /> },
    { name: 'Utensils', icon: <Utensils size={20} /> },
    { name: 'ConciergeBell', icon: <ConciergeBell size={20} /> },
    { name: 'Snowflake', icon: <Snowflake size={20} /> },
    { name: 'Wind', icon: <Wind size={20} /> },
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
    // Estimate revenue based on avg price if room price not linked, or strictly count if complex
    // Simplified: Avg price 60 EUR * confirmed
    const revenue = confirmedBookings.length * 60; 

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center group hover:border-green-200 transition-colors">
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Revenu (Est.)</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{revenue} <span className="text-sm text-gray-400">€</span></h3>
                </div>
                <div className="p-3 bg-green-50 text-green-600 rounded-xl group-hover:bg-green-100 transition-colors"><span className="font-serif font-bold text-xl">$</span></div>
            </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center group hover:border-orange-200 transition-colors">
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Réservations</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{bookings.length}</h3>
                </div>
                <div className="p-3 bg-orange-50 text-orange-600 rounded-xl group-hover:bg-orange-100 transition-colors"><CalendarCheck size={24} /></div>
            </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center group hover:border-blue-200 transition-colors">
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Hébergements</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{rooms.length}</h3>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-100 transition-colors"><BedDouble size={24} /></div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center group hover:border-purple-200 transition-colors">
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">En Attente</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{pendingBookings.length}</h3>
                </div>
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-100 transition-colors"><Loader size={24} /></div>
            </div>
        </div>
    );
};

const BookingsTable = ({ bookings, updateBookingStatus, deleteBooking }: any) => {
    const sorted = [...bookings].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-bold text-gray-900 uppercase text-xs tracking-wider">Client</th>
                            <th className="px-6 py-4 font-bold text-gray-900 uppercase text-xs tracking-wider">Chambre Demandée</th>
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
                                    <span className="font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">{booking.roomType}</span>
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
    // 1. Prepare Data for Line Chart (Bookings per month)
    const lineChartData = useMemo(() => {
        const last6Months = Array.from({ length: 6 }, (_, i) => {
            const d = new Date();
            d.setMonth(d.getMonth() - (5 - i));
            return d.toLocaleString('fr-FR', { month: 'short' });
        });

        const data = new Array(6).fill(0);
        bookings.forEach(b => {
            const date = new Date(b.date);
            const monthIdx = 5 - (new Date().getMonth() - date.getMonth());
            if (monthIdx >= 0 && monthIdx < 6) {
                data[monthIdx]++;
            }
        });

        return {
            labels: last6Months,
            datasets: [
                {
                    label: 'Réservations',
                    data: data,
                    borderColor: '#f56e1e',
                    backgroundColor: 'rgba(245, 110, 30, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#f56e1e',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                }
            ]
        };
    }, [bookings]);

    // 2. Prepare Data for Doughnut Chart (Status)
    const statusData = useMemo(() => {
        const counts = { confirmed: 0, pending: 0, rejected: 0 };
        bookings.forEach(b => {
            if (counts[b.status] !== undefined) counts[b.status]++;
        });

        return {
            labels: ['Confirmé', 'En Attente', 'Refusé'],
            datasets: [
                {
                    data: [counts.confirmed, counts.pending, counts.rejected],
                    backgroundColor: ['#22c55e', '#f97316', '#ef4444'],
                    borderWidth: 0,
                    hoverOffset: 4
                }
            ]
        };
    }, [bookings]);

    // 3. Prepare Data for Bar Chart (Room Popularity)
    const roomData = useMemo(() => {
        const counts: Record<string, number> = {};
        bookings.forEach(b => {
            // Normalize room name key
            const key = b.roomType || 'Autre';
            counts[key] = (counts[key] || 0) + 1;
        });

        const sortedRooms = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);

        return {
            labels: sortedRooms.map(r => r[0].length > 15 ? r[0].substring(0, 15) + '...' : r[0]),
            datasets: [
                {
                    label: 'Demandes',
                    data: sortedRooms.map(r => r[1]),
                    backgroundColor: '#0F172A',
                    borderRadius: 8,
                }
            ]
        };
    }, [bookings]);

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'bottom' as const, labels: { usePointStyle: true, boxWidth: 8 } },
            title: { display: false }
        },
        scales: {
            y: { beginAtZero: true, grid: { color: '#f3f4f6' }, ticks: { stepSize: 1 } },
            x: { grid: { display: false } }
        }
    };

    const doughnutOptions = {
        cutout: '70%',
        plugins: {
            legend: { position: 'right' as const, labels: { usePointStyle: true, boxWidth: 8 } }
        }
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Line Chart */}
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold font-serif text-gray-900 flex items-center gap-2"><TrendingUp size={20} className="text-primary-500"/> Évolution des Réservations</h3>
                            <p className="text-sm text-gray-400">Tendance sur les 6 derniers mois</p>
                        </div>
                    </div>
                    <div className="h-64">
                        <Line data={lineChartData} options={options} />
                    </div>
                </div>

                {/* Status Doughnut */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold font-serif text-gray-900 mb-6 flex items-center gap-2"><PieChart size={20} className="text-primary-500"/> État des Demandes</h3>
                    <div className="h-64 flex items-center justify-center relative">
                        <Doughnut data={statusData} options={doughnutOptions} />
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-bold text-gray-900">{bookings.length}</span>
                            <span className="text-xs text-gray-400 uppercase tracking-wide">Total</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Room Popularity Bar Chart */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                 <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-bold font-serif text-gray-900 flex items-center gap-2"><Activity size={20} className="text-primary-500"/> Popularité des Hébergements</h3>
                        <p className="text-sm text-gray-400">Top 5 des chambres les plus demandées</p>
                    </div>
                </div>
                <div className="h-64">
                    <Bar data={roomData} options={options} />
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
                             <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Nom du Service</label>
                             <input type="text" value={current.name} onChange={(e) => setCurrent({...current, name: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-primary-500" placeholder="ex: Wifi Gratuit" />
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
    toggleSection, sections,
    loading, uploadImage
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
  
  // Local Content State
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
    if (!currentRoom.images || currentRoom.images.length === 0) return alert("Veuillez ajouter au moins une image.");
    setIsSaving(true);
    
    // AUTO-FILL Hidden Fields
    const timestamp = Date.now();
    const roomToSave: any = {
        ...currentRoom,
        name: currentRoom.name || `Hébergement ${timestamp}`, // Generic Name
        nameEn: currentRoom.name || `Accommodation ${timestamp}`,
        category: "Hébergement", // Generic Category
        price: 0, // No Price
        description: '',
        capacity: 2, 
        available: true,
        images: currentRoom.images
    };

    try {
      if (currentRoom.id) await updateRoom(currentRoom.id, roomToSave);
      else await addRoom(roomToSave as Room);
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
            const file = files[0];
            const url = await uploadImage(file);
            setLocalContent(prev => prev ? ({ ...prev, [field]: url }) : null);
        } else {
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
            { id: 'rooms', icon: BedDouble, label: 'Hébergements (Photos)' },
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
            { id: 'content', icon: Type, label: 'Contenu Visuel' },
            { id: 'design', icon: Palette, label: 'Design & Thème' },
            { id: 'seo', icon: Globe, label: 'Référencement (SEO)' },
            { id: 'navigation', icon: List, label: 'Navigation & Liens' },
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

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
            <div>
                 <span className="text-xs font-bold text-primary-600 uppercase tracking-widest flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span> Espace Administration
                 </span>
                 <h2 className="text-3xl font-serif font-bold text-gray-900">
                    {activeTab === 'overview' && "Tableau de Bord"}
                    {activeTab === 'bookings' && "Réservations"}
                    {activeTab === 'rooms' && "Gestion Photos Hébergements"}
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
                       <h3 className="text-2xl font-bold font-serif text-gray-900">{currentRoom.id ? 'Modifier Photos' : 'Ajouter Photos'}</h3>
                       <button onClick={() => setIsEditingRoom(false)}><X className="text-gray-400 hover:text-gray-900" /></button>
                   </div>
                   
                   <div className="grid grid-cols-1 gap-8">
                       <div className="space-y-4">
                           <label className="block text-sm font-bold text-gray-600">Galerie Photos</label>
                           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                               {currentRoom.images?.map((img, i) => (
                                   <div key={i} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-200 shadow-sm">
                                       <img src={img} className="w-full h-full object-cover" />
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
                               <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-primary-500 hover:text-primary-500 hover:bg-gray-50 transition-colors">
                                   <Upload size={24} /> <span className="text-xs font-bold mt-2 text-center">Ajouter Images<br/>(Multiple)</span>
                                   <input type="file" multiple className="hidden" onChange={e => handleImageUpload(e, 'room')} />
                               </label>
                           </div>
                       </div>
                   </div>

                   <div className="mt-8 flex justify-end gap-3">
                       <button onClick={() => setIsEditingRoom(false)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100">Annuler</button>
                       <button onClick={handleSaveRoom} disabled={isSaving} className="px-8 py-3 rounded-xl font-bold bg-gray-900 text-white hover:bg-primary-600 shadow-lg flex items-center gap-2">{isSaving ? <Loader className="animate-spin" /> : 'Enregistrer'}</button>
                   </div>
               </div>
            ) : (
                <>
                    <div className="flex justify-end mb-6">
                        <button onClick={() => { setCurrentRoom({ available: true, images: [] }); setIsEditingRoom(true); }} className="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-lg flex items-center gap-2">
                            <Plus size={20} /> Ajouter Photos Hébergement
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {rooms.map(room => (
                            <div key={room.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-all relative">
                                <div className="aspect-square relative bg-gray-100">
                                    <img src={room.images?.[0]} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button onClick={() => { setCurrentRoom(room); setIsEditingRoom(true); }} className="p-2 bg-white rounded-full shadow-md text-gray-700 hover:text-primary-600"><Edit size={16} /></button>
                                        <button onClick={() => { if(confirm('Supprimer ?')) deleteRoom(room.id); }} className="p-2 bg-white rounded-full shadow-md text-red-500 hover:bg-red-50"><Trash2 size={16} /></button>
                                    </div>
                                    {room.images && room.images.length > 1 && (
                                        <span className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded-md text-[10px] font-bold">
                                            +{room.images.length - 1}
                                        </span>
                                    )}
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
                                <input type="text" placeholder="Titre (FR)" value={currentGallery.title || ''} onChange={e => setCurrentGallery({...currentGallery, title: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl font-bold" />
                                <input type="text" placeholder="Titre (EN)" value={currentGallery.titleEn || ''} onChange={e => setCurrentGallery({...currentGallery, titleEn: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl font-bold" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" placeholder="Catégorie (FR)" value={currentGallery.category || ''} onChange={e => setCurrentGallery({...currentGallery, category: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl" />
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
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                            <button onClick={(e) => { e.preventDefault(); moveImage(i, 'left', 'gallery'); }} disabled={i === 0} className="p-1 bg-white/20 hover:bg-white hover:text-black text-white rounded"><ChevronLeft size={14} /></button>
                                            <button onClick={() => setCurrentGallery(p => ({...p, images: p.images?.filter((_, idx) => idx !== i)}))} className="p-1 bg-red-500 hover:bg-red-600 text-white rounded"><Trash2 size={14} /></button>
                                            <button onClick={(e) => { e.preventDefault(); moveImage(i, 'right', 'gallery'); }} disabled={i === (currentGallery.images?.length || 0) - 1} className="p-1 bg-white/20 hover:bg-white hover:text-black text-white rounded"><ChevronRight size={14} /></button>
                                        </div>
                                    </div>
                                ))}
                                <label className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-primary-500 hover:text-primary-500 bg-gray-50">
                                   <Upload size={20} />
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
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                 )}
             </div>
        )}

        {activeTab === 'design' && (
          <div className="animate-fade-in-up max-w-4xl mx-auto space-y-8">
             <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold font-serif mb-6 flex items-center gap-2"><Palette size={20} className="text-primary-500"/> Couleurs du Thème</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Couleur Principale</label>
                        <div className="flex items-center gap-4">
                            <div className="relative overflow-hidden w-16 h-16 rounded-2xl shadow-sm border border-gray-200">
                                <input type="color" value={theme.primaryColor} onChange={(e) => updateTheme({ primaryColor: e.target.value })} className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer p-0 border-0" />
                            </div>
                            <div>
                                <p className="font-mono text-gray-600 font-bold">{theme.primaryColor}</p>
                                <p className="text-xs text-gray-400">Utilisé pour les boutons, liens, etc.</p>
                            </div>
                        </div>
                    </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Couleur Secondaire</label>
                        <div className="flex items-center gap-4">
                             <div className="relative overflow-hidden w-16 h-16 rounded-2xl shadow-sm border border-gray-200">
                                <input type="color" value={theme.secondaryColor} onChange={(e) => updateTheme({ secondaryColor: e.target.value })} className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer p-0 border-0" />
                            </div>
                            <div>
                                <p className="font-mono text-gray-600 font-bold">{theme.secondaryColor}</p>
                                <p className="text-xs text-gray-400">Utilisé pour les accents.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold font-serif mb-6 flex items-center gap-2"><LayoutDashboard size={20} className="text-primary-500"/> Visibilité des Sections</h3>
                <p className="text-sm text-gray-500 mb-6">Activez ou désactivez les sections de la page d'accueil.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(sections).map(([key, isVisible]) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <span className="capitalize font-bold text-gray-700">{key === 'cta' ? 'Appel à l\'action (CTA)' : key}</span>
                            <button 
                                onClick={() => toggleSection(key as any)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${isVisible ? 'bg-green-500' : 'bg-gray-300'}`}
                            >
                                <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm ${isVisible ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
             <div className="animate-fade-in-up max-w-3xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 mb-8">
                     <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><Globe size={24} /></div>
                     <div>
                         <h3 className="text-xl font-bold font-serif text-gray-900">Référencement (SEO)</h3>
                         <p className="text-sm text-gray-500">Optimisez votre visibilité sur Google.</p>
                     </div>
                </div>
                
                <div className="space-y-6">
                    <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">Aperçu Google</p>
                        <div className="font-sans">
                            <div className="text-[#1a0dab] text-xl cursor-pointer hover:underline truncate">{seo.metaTitle}</div>
                            <div className="text-[#006621] text-sm truncate">https://residence-elarich.com</div>
                            <div className="text-[#545454] text-sm line-clamp-2">{seo.metaDescription}</div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Méta Titre</label>
                        <input type="text" value={seo.metaTitle} onChange={(e) => updateSeo({ metaTitle: e.target.value })} className="w-full p-4 bg-gray-50 rounded-xl font-bold text-gray-900 border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Méta Description</label>
                        <textarea value={seo.metaDescription} onChange={(e) => updateSeo({ metaDescription: e.target.value })} rows={4} className="w-full p-4 bg-gray-50 rounded-xl font-medium text-gray-700 border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all" />
                    </div>
                </div>
           </div>
        )}

        {activeTab === 'navigation' && (
            <div className="animate-fade-in-up max-w-3xl mx-auto space-y-8">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold font-serif mb-6 flex items-center gap-2"><List size={20} className="text-primary-500"/> Liens du Menu</h3>
                    <div className="space-y-3">
                        {navLinks.sort((a,b) => a.order - b.order).map((link) => (
                            <div key={link.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-xs font-bold text-gray-400 border shadow-sm">{link.order}</div>
                                    <div>
                                        <p className="font-bold text-gray-800">{link.label}</p>
                                        <p className="text-xs text-gray-400 font-mono">{link.path}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => updateNavLink(link.id, { visible: !link.visible })}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all border ${link.visible ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'}`}
                                >
                                    {link.visible ? 'Visible' : 'Masqué'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-[#003580]/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    <div className="relative z-10">
                        <div className="flex items-start justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-[#003580] text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
                                    <ExternalLink size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold font-serif text-[#003580]">Réservation Booking.com</h3>
                                    <p className="text-sm text-gray-500">Gérez le lien externe vers votre partenaire.</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500">{content.showBookingUrl ? 'Activé' : 'Désactivé'}</span>
                                    <button 
                                        onClick={() => updateContent({ showBookingUrl: !content.showBookingUrl })}
                                        className={`w-14 h-8 rounded-full transition-all duration-300 relative border ${content.showBookingUrl ? 'bg-[#003580] border-[#003580]' : 'bg-gray-100 border-gray-200'}`}
                                    >
                                        <span className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full transition-transform shadow-sm ${content.showBookingUrl ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </button>
                                </label>
                            </div>
                        </div>

                        <div className={`transition-all duration-300 ${content.showBookingUrl ? 'opacity-100' : 'opacity-50 pointer-events-none grayscale'}`}>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Lien Direct (URL)</label>
                            <div className="flex gap-2">
                                <div className="relative flex-grow">
                                    <input 
                                        type="text" 
                                        value={localContent?.bookingUrl || ''} 
                                        onChange={(e) => setLocalContent(prev => prev ? ({...prev, bookingUrl: e.target.value}) : null)}
                                        className="w-full pl-4 pr-4 py-4 bg-gray-50 rounded-xl font-medium text-blue-900 border border-gray-200 focus:ring-2 focus:ring-[#003580] outline-none transition-all"
                                        placeholder="https://www.booking.com/..."
                                    />
                                </div>
                                <button 
                                    onClick={() => updateContent({ bookingUrl: localContent?.bookingUrl })}
                                    className="px-6 bg-[#003580] text-white rounded-xl font-bold hover:bg-blue-900 transition-colors shadow-lg flex items-center gap-2"
                                >
                                    <Save size={20} />
                                    <span className="hidden md:inline">Enregistrer</span>
                                </button>
                            </div>
                            <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                                <ShieldCheck size={12} /> Ce lien apparaîtra sur la page Contact et dans certaines sections promotionnelles.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'security' && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-2xl mx-auto animate-fade-in-up">
                 <h3 className="text-2xl font-serif font-bold mb-8 flex items-center gap-2"><Lock className="text-primary-500" /> Sécurité & Mot de Passe</h3>
                 <div className="space-y-6">
                     <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Nouveau Mot de Passe</label>
                         <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-xl" />
                     </div>
                     <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Confirmer</label>
                         <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-xl" />
                     </div>
                     {securityMsg.text && (
                         <div className={`p-4 rounded-xl font-bold text-sm ${securityMsg.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{securityMsg.text}</div>
                     )}
                 </div>
                 <div className="mt-8 flex justify-end">
                      <button onClick={handleUpdatePassword} disabled={isSaving} className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-primary-600 shadow-lg">{isSaving ? <Loader className="animate-spin" size={18} /> : <Save size={18} />} Mettre à jour</button>
                 </div>
            </div>
        )}
        
        {activeTab === 'content' && localContent && (
            <div className="animate-fade-in-up bg-white rounded-3xl shadow-sm border border-gray-100 p-8 max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8 sticky top-0 bg-white z-20 py-4 border-b border-gray-100">
                    <h3 className="text-2xl font-bold font-serif text-gray-900">Images Clés du Site</h3>
                    <button onClick={saveContent} disabled={isSaving} className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-primary-600 transition-colors shadow-lg flex items-center gap-2">
                        {isSaving ? <Loader className="animate-spin" size={20} /> : <Save size={20} />} Enregistrer
                    </button>
                </div>
                <div className="space-y-12">
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
                                         <img src={localContent[item.field]} className="w-full h-full object-cover" />
                                     ) : (
                                         <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 pointer-events-none"><Upload size={32} /></div>
                                     )}
                                     <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={e => handleImageUpload(e, 'content', item.field)} />
                                 </div>
                             </div>
                         ))}
                     </div>
                </div>
            </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;
