
import * as React from 'react';
import { useState, useMemo, useEffect } from 'react';
import { useData } from '../../services/DataContext';
import * as ReactRouterDOM from 'react-router-dom';
import { LogOut, FileText, Home, List, Calendar, Upload, Image as ImageIcon, Loader, Plus, Trash2, Save, X, Edit2, CheckSquare, Square, Menu as MenuIcon, Palette, Globe, Layout, Eye, EyeOff, ArrowRight, Grid, Lock, Shield, Mail, Check, XCircle, ChevronDown, ChevronLeft, ChevronRight, Database, Video, Coffee, ArrowLeft, Play, LayoutGrid, User, Maximize, BarChart2, TrendingUp, Users, RefreshCw, MapPin, Phone as PhoneIcon, Link as LinkIcon } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Room, GalleryCardData, Amenity, SiteContent, ThemeSettings, SeoSettings, NavLinkItem } from '../../types';
import { ROOM_CATEGORIES, ROOM_TEMPLATES } from '../../constants';
// Chart.js imports
import { Line } from 'react-chartjs-2';

const { useNavigate, Link } = ReactRouterDOM;

const AVAILABLE_ICONS = [
    "Wifi", "Car", "Utensils", "Wind", "Monitor", "Briefcase", "Coffee", "Tv", 
    "MapPin", "Sun", "Moon", "Music", "Smartphone", "Shield", "Key", "Clock", 
    "Camera", "Umbrella", "Droplet", "Star", "Heart", "Anchor", "Award", "Bell",
    "CheckCircle", "Smile", "ThumbsUp", "Globe", "Zap", "Gift"
];

// ... (Keep existing ImageUploadField, VideoUploadField, IconPicker, AnalyticsDashboard components unchanged) ...
const ImageUploadField = ({ label, value, onChange }: { label: string, value: string, onChange: (url: string) => void }) => {
    const { uploadImage } = useData();
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError('Veuillez sélectionner une image.');
            return;
        }
        if (file.size > 10 * 1024 * 1024) { 
             setError('L\'image est trop volumineuse (max 10MB).');
             return;
        }

        setError('');
        setUploading(true);

        try {
            const url = await uploadImage(file);
            onChange(url);
        } catch (err: any) {
            console.error(err);
            setError('Erreur: ' + err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="mb-4">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{label}</label>
            
            <div className="flex flex-col gap-3">
                {value && (
                    <div className="relative w-full h-48 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 group shadow-sm">
                        <img src={value} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <a href={value} target="_blank" rel="noreferrer" className="text-white text-xs font-bold underline">Voir l'original</a>
                        </div>
                        <button 
                            type="button"
                            onClick={() => onChange('')}
                            className="absolute top-2 right-2 bg-white text-red-500 p-1.5 rounded-full hover:bg-red-50 transition-colors shadow-lg"
                            title="Supprimer l'image"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                )}

                <div className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-300 ${uploading ? 'bg-gray-50 border-gray-300' : 'bg-white border-gray-200 hover:border-primary-400 hover:bg-primary-50/30'}`}>
                    {uploading ? (
                         <div className="flex flex-col items-center justify-center py-2 text-gray-500">
                             <Loader className="animate-spin mb-2 text-primary-500" size={24} />
                             <span className="text-sm font-medium">Téléchargement...</span>
                         </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-2 cursor-pointer relative text-center">
                             <input 
                                type="file" 
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                             />
                             <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-500 flex items-center justify-center mb-1">
                                <Upload size={18} />
                             </div>
                             <span className="text-sm font-bold text-gray-600">
                                 {value ? 'Remplacer l\'image' : 'Glisser ou cliquer pour upload'}
                             </span>
                        </div>
                    )}
                </div>
                {error && <p className="text-red-500 text-xs font-medium">{error}</p>}
            </div>
        </div>
    );
};

const VideoUploadField = ({ label, value, onChange }: { label: string, value: string, onChange: (url: string) => void }) => {
    const { uploadImage } = useData(); 
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('video/')) {
            setError('Veuillez sélectionner une vidéo.');
            return;
        }
        if (file.size > 90 * 1024 * 1024) { 
             setError('La vidéo est trop volumineuse (max 90MB).');
             return;
        }

        setError('');
        setUploading(true);

        try {
            const url = await uploadImage(file);
            onChange(url);
        } catch (err: any) {
            console.error(err);
            setError('Erreur: ' + err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="mb-4">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{label}</label>
            
            <div className="flex flex-col gap-3">
                {value && (
                    <div className="relative w-full h-48 bg-gray-900 rounded-xl overflow-hidden border border-gray-800 group shadow-md">
                        <video src={value} className="w-full h-full object-contain" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Play size={32} className="text-white opacity-50" />
                        </div>
                        <button 
                            type="button"
                            onClick={() => onChange('')}
                            className="absolute top-2 right-2 bg-white text-red-500 p-1.5 rounded-full hover:bg-red-50 transition-colors shadow-lg z-10"
                            title="Supprimer la vidéo"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                )}

                <div className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-300 ${uploading ? 'bg-gray-50 border-gray-300' : 'bg-white border-gray-200 hover:border-primary-400 hover:bg-primary-50/30'}`}>
                    {uploading ? (
                         <div className="flex flex-col items-center justify-center py-2 text-gray-500">
                             <Loader className="animate-spin mb-2 text-primary-500" size={24} />
                             <span className="text-sm font-medium">Upload en cours (Patientez)...</span>
                         </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-2 cursor-pointer relative text-center">
                             <input 
                                type="file" 
                                accept="video/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                             />
                             <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-500 flex items-center justify-center mb-1">
                                <Video size={18} />
                             </div>
                             <span className="text-sm font-bold text-gray-600">
                                 {value ? 'Remplacer la vidéo' : 'Ajouter une vidéo'}
                             </span>
                        </div>
                    )}
                </div>
                {error && <p className="text-red-500 text-xs font-medium">{error}</p>}
            </div>
        </div>
    );
};

const IconPicker = ({ selected, onSelect }: { selected: string, onSelect: (icon: string) => void }) => {
    return (
        <div className="grid grid-cols-6 sm:grid-cols-8 gap-3 p-4 border border-gray-200 rounded-xl bg-gray-100 max-h-60 overflow-y-auto custom-scrollbar shadow-inner">
            {AVAILABLE_ICONS.map(iconName => {
                // Safely access the icon from the namespace
                const IconComponent = (Icons as any)[iconName];
                const isSelected = selected === iconName;
                return (
                    <button
                        key={iconName}
                        type="button"
                        onClick={() => onSelect(iconName)}
                        className={`p-3 rounded-xl flex items-center justify-center transition-all aspect-square shadow-sm ${isSelected ? 'bg-gray-900 text-white ring-2 ring-primary-500 ring-offset-2 scale-110' : 'bg-white text-gray-700 hover:bg-white hover:text-primary-600 hover:scale-105 border border-gray-200'}`}
                        title={iconName}
                    >
                        {IconComponent ? <IconComponent size={24} strokeWidth={1.5} /> : <span className="text-xs text-red-500 font-bold">?</span>}
                    </button>
                )
            })}
        </div>
    );
};

// --- ANALYTICS DASHBOARD COMPONENT ---
const AnalyticsDashboard = () => {
    // Generate Mock Data for 30 Days
    const mockData = useMemo(() => {
        const labels = [];
        const data = [];
        const today = new Date();
        
        for (let i = 29; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            labels.push(d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }));
            // Random traffic between 50 and 200
            data.push(Math.floor(Math.random() * (200 - 50 + 1) + 50));
        }
        return { labels, data };
    }, []);

    const topPages = [
        { path: '/', title: 'Accueil', views: 3420 },
        { path: '/rooms', title: 'Nos Chambres', views: 1850 },
        { path: '/contact', title: 'Réservation', views: 920 },
        { path: '/amenities', title: 'Services', views: 640 },
        { path: '/legal', title: 'Mentions Légales', views: 120 },
    ];

    const chartData = {
        labels: mockData.labels,
        datasets: [
            {
                label: 'Visiteurs (30 jours)',
                data: mockData.data,
                fill: true,
                backgroundColor: 'rgba(245, 110, 30, 0.1)',
                borderColor: '#f56e1e',
                tension: 0.4,
                pointRadius: 2,
                pointHoverRadius: 6,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#111827',
                padding: 12,
                titleFont: { family: "'Plus Jakarta Sans', sans-serif", size: 13 },
                bodyFont: { family: "'Plus Jakarta Sans', sans-serif", size: 13 },
                cornerRadius: 8,
                displayColors: false,
            }
        },
        scales: {
            y: {
                grid: {
                    color: '#f3f4f6',
                },
                ticks: {
                    font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 },
                    color: '#9ca3af'
                }
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    font: { family: "'Plus Jakarta Sans', sans-serif", size: 10 },
                    color: '#9ca3af',
                    maxTicksLimit: 10
                }
            }
        }
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Visiteurs (30j)</h3>
                    <div className="flex items-end gap-3">
                        <span className="text-3xl font-black text-gray-900">4,285</span>
                        <span className="text-green-500 text-xs font-bold flex items-center mb-1 bg-green-50 px-2 py-0.5 rounded-full">
                            <TrendingUp size={12} className="mr-1" /> +12%
                        </span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Temps Moyen</h3>
                    <div className="flex items-end gap-3">
                        <span className="text-3xl font-black text-gray-900">2m 45s</span>
                        <span className="text-gray-400 text-xs font-medium mb-1">par session</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Taux de Rebond</h3>
                    <div className="flex items-end gap-3">
                        <span className="text-3xl font-black text-gray-900">42%</span>
                        <span className="text-green-500 text-xs font-bold flex items-center mb-1 bg-green-50 px-2 py-0.5 rounded-full">
                            -5%
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Chart */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Trafic du Site</h2>
                        <p className="text-sm text-gray-500">Aperçu des 30 derniers jours</p>
                    </div>
                    <div className="bg-gray-50 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-500">
                        Google Analytics 4
                    </div>
                </div>
                <div className="h-80 w-full">
                    <Line data={chartData} options={chartOptions} />
                </div>
            </div>

            {/* Top Pages */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 md:p-8 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Top 5 Pages Vues</h2>
                    <p className="text-sm text-gray-500">Les pages les plus populaires de votre site</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                <th className="px-6 md:px-8 py-4 font-bold">Page</th>
                                <th className="px-6 md:px-8 py-4 font-bold text-right">Vues</th>
                                <th className="px-6 md:px-8 py-4 font-bold text-right hidden sm:table-cell">% Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {topPages.map((page, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 md:px-8 py-4">
                                        <div className="flex items-center gap-3">
                                            <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center">
                                                {idx + 1}
                                            </span>
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">{page.title}</p>
                                                <p className="text-xs text-gray-400 font-mono">{page.path}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 md:px-8 py-4 text-right font-bold text-gray-700">
                                        {page.views.toLocaleString()}
                                    </td>
                                    <td className="px-6 md:px-8 py-4 text-right hidden sm:table-cell">
                                        <div className="flex items-center justify-end gap-2">
                                            <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-primary-500 rounded-full" 
                                                    style={{ width: `${(page.views / 4285) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs text-gray-400 font-medium w-8">
                                                {Math.round((page.views / 4285) * 100)}%
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const AdminDashboard = () => {
  const { 
    content, updateContent, 
    rooms, updateRoom, addRoom, deleteRoom, 
    amenities, addAmenity, updateAmenity, deleteAmenity, resetDefaultServices,
    bookings, updateBookingStatus, deleteBooking,
    gallery, updateGalleryCard, addGalleryCard, deleteGalleryCard,
    logout, isAuthenticated, login, updatePassword, resetPassword, loading,
    theme, updateTheme,
    seo, updateSeo,
    sections, toggleSection,
    navLinks, updateNavLink,
    uploadImage,
    seedDatabase 
  } = useData();
  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'content' | 'rooms' | 'bookings' | 'design' | 'seo' | 'menu' | 'gallery' | 'security' | 'services' | 'analytics'>('bookings');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Configuration Local States (To avoid 1000 database writes while typing)
  const [localContent, setLocalContent] = useState<SiteContent>(content);
  const [localTheme, setLocalTheme] = useState<ThemeSettings>(theme);
  const [localSeo, setLocalSeo] = useState<SeoSettings>(seo);
  
  // Sync when context updates (initial load)
  useEffect(() => { setLocalContent(content); }, [content]);
  useEffect(() => { setLocalTheme(theme); }, [theme]);
  useEffect(() => { setLocalSeo(seo); }, [seo]);

  // Login State
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  
  // Password Change State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState({ text: '', type: '' });

  // Room Management State
  const [isEditingRoom, setIsEditingRoom] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<Partial<Room>>({});
  const [isUploadingRoomImage, setIsUploadingRoomImage] = useState(false);

  // Gallery Management State
  const [isEditingCard, setIsEditingCard] = useState(false);
  const [isAddingVideo, setIsAddingVideo] = useState(false); 
  const [currentCard, setCurrentCard] = useState<Partial<GalleryCardData>>({});
  const [isUploadingGalleryImage, setIsUploadingGalleryImage] = useState(false);
  const [galleryTab, setGalleryTab] = useState<'photos' | 'videos'>('photos');

  // Amenities Management State
  const [isEditingService, setIsEditingService] = useState(false);
  const [currentService, setCurrentService] = useState<Partial<Amenity>>({});

  // AUTO-MATIC DATA MAP
  const CATEGORY_MAP: Record<string, string> = {
      "Réception, Intérieur & Petit Déjeuner": "Élégance, luxe, saveurs locales...",
      "Oasis & Loisirs": "Détente, Fraîcheur, Évasion.",
      "Parking": "Sécurité, Espace, Tranquillité."
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoggingIn(true);
      setLoginError('');
      try {
          await login(emailInput, passwordInput);
      } catch (err: any) {
          console.error("Login Error:", err.code, err.message);
          if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
              setLoginError('Email ou mot de passe incorrect.');
          } else {
              setLoginError('Une erreur est survenue (' + err.code + ').');
          }
      } finally {
          setIsLoggingIn(false);
      }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
      e.preventDefault();
      if (newPassword.length < 6) {
          setPasswordMsg({ text: 'Le mot de passe doit contenir au moins 6 caractères.', type: 'error' });
          return;
      }
      if (newPassword !== confirmPassword) {
          setPasswordMsg({ text: 'Les mots de passe ne correspondent pas.', type: 'error' });
          return;
      }
      try {
        await updatePassword(newPassword);
        setPasswordMsg({ text: 'Mot de passe mis à jour avec succès.', type: 'success' });
        setNewPassword('');
        setConfirmPassword('');
      } catch (err: any) {
        if (err.code === 'auth/requires-recent-login') {
             setPasswordMsg({ text: 'Pour changer le mot de passe, veuillez vous déconnecter et vous reconnecter.', type: 'error' });
        } else {
             setPasswordMsg({ text: 'Erreur lors de la mise à jour: ' + err.message, type: 'error' });
        }
      }
      setTimeout(() => setPasswordMsg({ text: '', type: '' }), 6000);
  };

  // --- SAVE HANDLERS ---
  const saveContentSettings = async () => {
      try {
          await updateContent(localContent);
          alert("Contenu mis à jour avec succès !");
      } catch (e) {
          alert("Erreur lors de la mise à jour.");
      }
  };

  const saveThemeSettings = async () => {
      try {
          await updateTheme(localTheme);
          alert("Thème mis à jour avec succès !");
      } catch (e) {
          alert("Erreur lors de la mise à jour.");
      }
  };

  const saveSeoSettings = async () => {
      try {
          await updateSeo(localSeo);
          alert("Paramètres SEO mis à jour !");
      } catch (e) {
          alert("Erreur lors de la mise à jour.");
      }
  };

  // ... (Existing helper functions like getStatusColor, removeImageFromRoom etc.) ...
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmé';
      case 'rejected': return 'Refusé';
      default: return 'En attente';
    }
  };

  // ... (Room, Service, Gallery handler functions remain unchanged)
  // ROOMS
  const openAddRoom = () => {
      setCurrentRoom({
          name: '',
          category: ROOM_CATEGORIES[0],
          description: ROOM_TEMPLATES[ROOM_CATEGORIES[0]].description,
          price: 0,
          images: [],
          features: ROOM_TEMPLATES[ROOM_CATEGORIES[0]].features || [],
          capacity: ROOM_TEMPLATES[ROOM_CATEGORIES[0]].capacity || 2,
          size: ROOM_TEMPLATES[ROOM_CATEGORIES[0]].size || '',
          available: true
      });
      setIsEditingRoom(true);
  };

  const openEditRoom = (room: Room) => {
      setCurrentRoom(room);
      setIsEditingRoom(true);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const category = e.target.value;
      const template = ROOM_TEMPLATES[category] || {};
      setCurrentRoom({ 
          ...currentRoom, 
          category, 
          description: template.description,
          features: template.features,
          capacity: template.capacity,
          size: template.size
      });
  };

  const handleRoomImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          setIsUploadingRoomImage(true);
          try {
              const url = await uploadImage(e.target.files[0]);
              const currentImages = currentRoom.images || [];
              setCurrentRoom({ ...currentRoom, images: [...currentImages, url] });
          } catch(err: any) {
              console.error(err);
              alert("Erreur: " + err.message);
          } finally {
              setIsUploadingRoomImage(false);
          }
      }
  };

  const removeImageFromRoom = (index: number) => {
      const newImages = [...(currentRoom.images || [])];
      newImages.splice(index, 1);
      setCurrentRoom({ ...currentRoom, images: newImages });
  };

  const moveRoomImage = (index: number, direction: 'left' | 'right') => {
      const images = [...(currentRoom.images || [])];
      if (direction === 'left' && index > 0) {
          [images[index - 1], images[index]] = [images[index], images[index - 1]];
      } else if (direction === 'right' && index < images.length - 1) {
          [images[index + 1], images[index]] = [images[index], images[index + 1]];
      }
      setCurrentRoom({ ...currentRoom, images });
  };

  const saveRoom = async () => {
      if (!currentRoom.category || !currentRoom.price) {
          alert("Veuillez remplir les informations principales.");
          return;
      }
      const roomToSave = {
          ...currentRoom,
          name: currentRoom.category,
          id: currentRoom.id // keep existing ID if editing
      } as Room;

      try {
          if (currentRoom.id) {
              await updateRoom(currentRoom.id, roomToSave);
          } else {
              await addRoom(roomToSave);
          }
          setIsEditingRoom(false);
      } catch (e: any) {
          alert("Erreur lors de la sauvegarde: " + e.message);
      }
  };

  // SERVICES
  const openAddService = () => {
      setCurrentService({ name: '', icon: 'Check', description: '' });
      setIsEditingService(true);
  };

  const openEditService = (amenity: Amenity) => {
      setCurrentService(amenity);
      setIsEditingService(true);
  };

  const saveService = async () => {
      if (!currentService.name) return;
      try {
          if (currentService.id) {
              await updateAmenity(currentService.id, currentService);
          } else {
              await addAmenity(currentService as Amenity);
          }
          setIsEditingService(false);
      } catch (e: any) {
          alert("Erreur: " + e.message);
      }
  };

  // GALLERY
  const openAddCard = () => {
      setCurrentCard({ title: '', category: '', images: [], description: '', order: gallery.length + 1 });
      setIsAddingVideo(false);
      setIsEditingCard(true);
  };

  const openAddVideo = () => {
      setCurrentCard({ title: 'Nouveau Tour', category: 'Vidéo', images: [], video: '', description: '', order: gallery.length + 1 });
      setIsAddingVideo(true);
      setIsEditingCard(true);
  };

  const openEditCard = (card: GalleryCardData) => {
      setCurrentCard(card);
      setIsAddingVideo(!!card.video);
      setIsEditingCard(true);
  };

  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          setIsUploadingGalleryImage(true);
          try {
              const newUrls = [];
              for(let i=0; i < e.target.files.length; i++) {
                   const url = await uploadImage(e.target.files[i]);
                   newUrls.push(url);
              }
              const currentImages = currentCard.images || [];
              setCurrentCard({ ...currentCard, images: [...currentImages, ...newUrls] });
          } catch(err: any) {
              console.error(err);
              alert("Erreur: " + err.message);
          } finally {
              setIsUploadingGalleryImage(false);
          }
      }
  };

  const removeImageFromCard = (index: number) => {
      const newImages = [...(currentCard.images || [])];
      newImages.splice(index, 1);
      setCurrentCard({ ...currentCard, images: newImages });
  };

  const moveImage = (index: number, direction: 'left' | 'right') => {
      const images = [...(currentCard.images || [])];
      if (direction === 'left' && index > 0) {
          [images[index - 1], images[index]] = [images[index], images[index - 1]];
      } else if (direction === 'right' && index < images.length - 1) {
          [images[index + 1], images[index]] = [images[index], images[index + 1]];
      }
      setCurrentCard({ ...currentCard, images });
  };

  const saveCard = async () => {
      if (!currentCard.title) return;
      try {
          if (currentCard.id) {
              await updateGalleryCard(currentCard.id, currentCard);
          } else {
              await addGalleryCard(currentCard as GalleryCardData);
          }
          setIsEditingCard(false);
      } catch (e: any) {
          alert("Erreur: " + e.message);
      }
  };

  if (loading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
              <Loader className="animate-spin text-primary-500" size={48} />
          </div>
      );
  }

  if (!isAuthenticated) {
     return (
       <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 relative overflow-hidden">
         <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors z-20 font-medium px-4 py-2 rounded-full hover:bg-white/80">
            <ArrowLeft size={20} /> Retour au site
         </Link>
         <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary-100 rounded-full blur-[100px] opacity-60"></div>
         <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-blue-100 rounded-full blur-[100px] opacity-60"></div>

         <div className="bg-white/80 backdrop-blur-xl p-10 md:p-14 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] max-w-md w-full text-center border border-white relative z-10">
            <div className="mb-8 flex justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-3xl shadow-lg flex items-center justify-center rotate-3 hover:rotate-0 transition-transform duration-300">
                    <Shield size={36} />
                </div>
            </div>
            <h2 className="text-3xl font-bold mb-2 font-serif text-gray-900">Espace Admin</h2>
            <p className="text-gray-500 mb-10 text-sm font-medium">Connectez-vous pour gérer votre établissement.</p>
            
            <form onSubmit={handleLoginSubmit} className="space-y-5 text-left">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email</label>
                    <div className="relative">
                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="email" 
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            placeholder="votre@email.com"
                            required
                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all outline-none font-medium"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Mot de passe</label>
                    <div className="relative">
                        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="password" 
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            placeholder="••••••••"
                            required={!resetEmailSent}
                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all outline-none font-medium"
                        />
                    </div>
                </div>
                
                {loginError && (
                    <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-bold flex items-center gap-2">
                        <XCircle size={16} /> {loginError}
                    </div>
                )}
                
                <button 
                    type="submit" 
                    disabled={isLoggingIn}
                    className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-primary-600 transition-all shadow-lg hover:shadow-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center hover:-translate-y-1"
                >
                    {isLoggingIn ? <Loader className="animate-spin" size={20} /> : 'Connexion sécurisée'}
                </button>
            </form>
         </div>
       </div>
     )
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const NavButton = ({ tab, label, icon: Icon }: any) => (
    <button 
      type="button"
      onClick={() => { setActiveTab(tab); setIsMobileMenuOpen(false); }}
      className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all mb-1 font-medium text-sm group relative overflow-hidden ${activeTab === tab ? 'text-white bg-primary-600 shadow-lg shadow-primary-900/20' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
    >
      <Icon size={18} className={`mr-3 transition-transform ${activeTab === tab ? 'scale-110' : 'group-hover:scale-110'}`} /> 
      <span className="relative z-10">{label}</span>
      {activeTab === tab && <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col md:flex-row font-sans">
      {/* ... (Mobile Header, Menu, Desktop Sidebar unchanged) ... */}
      {/* Mobile Header */}
      <div className="md:hidden bg-gray-900 text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
          <span className="text-lg font-bold font-serif">El Arich Admin</span>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
             {isMobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-16 bg-gray-900 z-40 p-4 space-y-2 overflow-y-auto pb-20">
              <NavButton tab="bookings" label="Réservations" icon={Calendar} />
              <NavButton tab="rooms" label="Hébergements" icon={Home} />
              <NavButton tab="services" label="Services" icon={Coffee} />
              <NavButton tab="gallery" label="Galerie" icon={Grid} />
              <NavButton tab="analytics" label="Analytique" icon={BarChart2} />
              <NavButton tab="content" label="Contenu" icon={FileText} />
              <NavButton tab="design" label="Design" icon={Palette} />
              <NavButton tab="seo" label="SEO" icon={Globe} />
              <NavButton tab="menu" label="Menu" icon={List} />
              <NavButton tab="security" label="Sécurité" icon={Lock} />
              <div className="border-t border-gray-800 pt-4 mt-4">
                  <button onClick={handleLogout} className="flex items-center text-red-400 hover:text-white transition-colors w-full px-4 py-3">
                    <LogOut size={20} className="mr-2" /> Déconnexion
                  </button>
              </div>
          </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="w-72 bg-[#111827] text-white hidden md:flex flex-col h-screen sticky top-0 border-r border-gray-800 shadow-2xl z-30">
        <div className="p-8 pb-6 border-b border-gray-800">
            <div className="flex items-center gap-3 text-2xl font-bold font-serif tracking-tight text-white mb-1">
                <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-900/50">
                    <LayoutGrid size={18} /> 
                </div>
                Admin
            </div>
            <p className="text-xs text-gray-500 pl-11 uppercase tracking-widest font-bold">Dashboard</p>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 custom-scrollbar">
            <div>
                <div className="px-4 text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-8 h-[1px] bg-gray-700"></span> Gestion
                </div>
                <nav className="space-y-1">
                    <NavButton tab="bookings" label="Réservations" icon={Calendar} />
                    <NavButton tab="rooms" label="Hébergements" icon={Home} />
                    <NavButton tab="services" label="Services" icon={Coffee} />
                    <NavButton tab="gallery" label="Galerie Multimédia" icon={Grid} />
                    <NavButton tab="analytics" label="Analytique" icon={BarChart2} />
                </nav>
            </div>

            <div>
                <div className="px-4 text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-8 h-[1px] bg-gray-700"></span> Configuration
                </div>
                <nav className="space-y-1">
                    <NavButton tab="content" label="Contenu Textuel" icon={FileText} />
                    <NavButton tab="design" label="Design & Thème" icon={Palette} />
                    <NavButton tab="seo" label="Référencement (SEO)" icon={Globe} />
                    <NavButton tab="menu" label="Navigation" icon={List} />
                </nav>
            </div>

            <div>
                <div className="px-4 text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-8 h-[1px] bg-gray-700"></span> Compte
                </div>
                <nav className="space-y-1">
                    <NavButton tab="security" label="Sécurité" icon={Lock} />
                </nav>
            </div>
        </div>

        <div className="p-4 border-t border-gray-800 bg-[#0f1522]">
          <button onClick={handleLogout} className="flex items-center justify-center text-red-400 bg-red-500/10 hover:bg-red-500 hover:text-white transition-all w-full font-bold py-3 rounded-xl text-sm group">
            <LogOut size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto h-auto md:h-screen scroll-smooth">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
              <div className="text-sm font-bold text-primary-600 mb-1 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
                  Espace Administration
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-serif">
                {activeTab === 'bookings' && 'Demandes de Réservation'}
                {activeTab === 'services' && 'Services & Équipements'}
                {activeTab === 'design' && 'Design & Apparence'}
                {activeTab === 'seo' && 'Optimisation SEO'}
                {activeTab === 'content' && 'Contenu du Site'}
                {activeTab === 'menu' && 'Menu de Navigation'}
                {activeTab === 'gallery' && 'Galerie Photos & Vidéos'}
                {activeTab === 'rooms' && 'Gestion des Chambres'}
                {activeTab === 'security' && 'Paramètres de Sécurité'}
                {activeTab === 'analytics' && 'Tableau de Bord Analytique'}
              </h1>
          </div>
          <a href="/" target="_blank" className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary-600 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 hover:shadow-md transition-all">
              Voir le site en direct <ArrowRight size={16} />
          </a>
        </header>

        <div className="animate-fade-in-up">
            {/* TABS CONTENT */}
            
            {activeTab === 'analytics' && <AnalyticsDashboard />}

            {activeTab === 'content' && (
                <div className="space-y-10 animate-fade-in-up">
                    
                    {/* KEY IMAGES MANAGEMENT */}
                    <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <ImageIcon size={20} className="text-primary-600" /> Images Clés du Site
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <ImageUploadField label="Logo Principal" value={localContent.logo || ''} onChange={(url) => setLocalContent({...localContent, logo: url})} />
                            <ImageUploadField label="Image de couverture (Accueil)" value={localContent.heroImage} onChange={(url) => setLocalContent({...localContent, heroImage: url})} />
                            <ImageUploadField label="Image 'À Propos' (Extérieur)" value={localContent.aboutImage1} onChange={(url) => setLocalContent({...localContent, aboutImage1: url})} />
                            <ImageUploadField label="Image 'À Propos' (Intérieur)" value={localContent.aboutImage2} onChange={(url) => setLocalContent({...localContent, aboutImage2: url})} />
                            <ImageUploadField label="Image CTA (Espace Famille)" value={localContent.ctaImage} onChange={(url) => setLocalContent({...localContent, ctaImage: url})} />
                            <ImageUploadField label="Image Services (Conciergerie)" value={localContent.serviceImage} onChange={(url) => setLocalContent({...localContent, serviceImage: url})} />
                            <ImageUploadField label="Image de Fond (Pied de page)" value={localContent.footerImage || ''} onChange={(url) => setLocalContent({...localContent, footerImage: url})} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* GENERAL INFO */}
                        <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <FileText size={20} className="text-primary-600" /> Informations Générales
                            </h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Titre Principal (Hero)</label>
                                    <input type="text" value={localContent.heroTitle} onChange={(e) => setLocalContent({...localContent, heroTitle: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-bold" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Sous-titre (Hero)</label>
                                    <textarea rows={2} value={localContent.heroSubtitle} onChange={(e) => setLocalContent({...localContent, heroSubtitle: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Texte 'À Propos'</label>
                                    <textarea rows={6} value={localContent.aboutText} onChange={(e) => setLocalContent({...localContent, aboutText: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm leading-relaxed" />
                                </div>
                            </div>
                        </div>

                        {/* CONTACT INFO */}
                        <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100 h-fit">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <PhoneIcon size={20} className="text-primary-600" /> Coordonnées
                            </h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email de contact</label>
                                    <input type="email" value={localContent.contactEmail} onChange={(e) => setLocalContent({...localContent, contactEmail: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Téléphone</label>
                                    <input type="text" value={localContent.contactPhone} onChange={(e) => setLocalContent({...localContent, contactPhone: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Adresse Complète</label>
                                    <input type="text" value={localContent.address} onChange={(e) => setLocalContent({...localContent, address: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Lien Google Maps</label>
                                    <input type="text" value={localContent.googleMapsLink} onChange={(e) => setLocalContent({...localContent, googleMapsLink: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-xs" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-gray-200">
                        <button onClick={saveContentSettings} className="px-10 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-primary-600 shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2">
                            <Save size={20} /> Sauvegarder le contenu
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'design' && (
                <div className="max-w-2xl mx-auto space-y-8 animate-fade-in-up">
                    <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Palette size={20} className="text-primary-600" /> Thème & Couleurs
                        </h2>
                        <div className="space-y-8">
                            <div className="flex items-center gap-6">
                                <input 
                                    type="color" 
                                    value={localTheme.primaryColor} 
                                    onChange={(e) => setLocalTheme({...localTheme, primaryColor: e.target.value})}
                                    className="w-24 h-24 rounded-2xl border-4 border-gray-100 cursor-pointer shadow-sm" 
                                />
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-1">Couleur Principale</label>
                                    <p className="text-xs text-gray-500 mb-2">Utilisée pour les boutons, liens et accents.</p>
                                    <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">{localTheme.primaryColor}</code>
                                </div>
                            </div>
                            <div className="h-px bg-gray-100"></div>
                            <div className="flex items-center gap-6">
                                <input 
                                    type="color" 
                                    value={localTheme.secondaryColor} 
                                    onChange={(e) => setLocalTheme({...localTheme, secondaryColor: e.target.value})}
                                    className="w-24 h-24 rounded-2xl border-4 border-gray-100 cursor-pointer shadow-sm" 
                                />
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-1">Couleur Secondaire</label>
                                    <p className="text-xs text-gray-500 mb-2">Utilisée pour les éléments décoratifs.</p>
                                    <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">{localTheme.secondaryColor}</code>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button onClick={saveThemeSettings} className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-primary-600 shadow-lg transition-all flex items-center gap-2">
                            <Save size={18} /> Appliquer le thème
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'seo' && (
                <div className="max-w-2xl mx-auto space-y-8 animate-fade-in-up">
                    <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Globe size={20} className="text-primary-600" /> Référencement (SEO)
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Méta Titre</label>
                                <input type="text" value={localSeo.metaTitle} onChange={(e) => setLocalSeo({...localSeo, metaTitle: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-bold" />
                                <p className="text-[10px] text-gray-400 mt-1">Le titre qui apparaît dans l'onglet du navigateur et sur Google.</p>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Méta Description</label>
                                <textarea rows={4} value={localSeo.metaDescription} onChange={(e) => setLocalSeo({...localSeo, metaDescription: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
                                <p className="text-[10px] text-gray-400 mt-1">La description courte qui apparaît sous le titre dans les résultats de recherche.</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button onClick={saveSeoSettings} className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-primary-600 shadow-lg transition-all flex items-center gap-2">
                            <Save size={18} /> Sauvegarder SEO
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'menu' && (
                <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up">
                    <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <List size={20} className="text-primary-600" /> Menu de Navigation
                        </h2>
                        <div className="space-y-4">
                            {navLinks.sort((a,b) => a.order - b.order).map((link) => (
                                <div key={link.id} className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <div className="bg-white p-2 rounded-lg text-gray-400 cursor-move">
                                        <MenuIcon size={16} />
                                    </div>
                                    <div className="flex-grow">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Label</label>
                                        <input 
                                            type="text" 
                                            value={link.label} 
                                            onChange={(e) => updateNavLink(link.id, { label: e.target.value })}
                                            className="w-full bg-transparent font-bold text-gray-900 outline-none border-b border-transparent focus:border-primary-500 transition-colors"
                                        />
                                    </div>
                                    <div className="w-20">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Ordre</label>
                                        <input 
                                            type="number" 
                                            value={link.order} 
                                            onChange={(e) => updateNavLink(link.id, { order: Number(e.target.value) })}
                                            className="w-full bg-white px-2 py-1 rounded border border-gray-200 text-center font-bold outline-none focus:border-primary-500"
                                        />
                                    </div>
                                    <button 
                                        onClick={() => updateNavLink(link.id, { visible: !link.visible })}
                                        className={`p-3 rounded-xl transition-all ${link.visible ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-400'}`}
                                        title={link.visible ? "Visible" : "Masqué"}
                                    >
                                        {link.visible ? <Eye size={18} /> : <EyeOff size={18} />}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="text-center text-xs text-gray-400">
                        Les modifications du menu sont enregistrées automatiquement.
                    </div>
                </div>
            )}

            {activeTab === 'bookings' && (
                // ... (Bookings Tab Content) ...
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bookings.length === 0 && (
                            <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-dashed border-gray-300 text-gray-400">
                                <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                                <p>Aucune demande de réservation pour le moment.</p>
                            </div>
                        )}
                        {bookings.map((booking) => (
                            <div key={booking.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all relative overflow-hidden group">
                                <div className={`absolute top-0 left-0 w-1.5 h-full ${getStatusColor(booking.status).split(' ')[0].replace('bg', 'bg')}`}></div>
                                <div className="flex justify-between items-start mb-4 pl-3">
                                    <div>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(booking.status)} uppercase tracking-wide`}>
                                            {getStatusLabel(booking.status)}
                                        </span>
                                        <h3 className="text-lg font-bold text-gray-900 mt-2">{booking.name}</h3>
                                        <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                            <Mail size={14} /> <a href={`mailto:${booking.email}`} className="hover:text-primary-600 underline decoration-dotted">{booking.email}</a>
                                        </div>
                                        <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                            <Icons.Phone size={14} /> <a href={`tel:${booking.phone}`} className="hover:text-primary-600 underline decoration-dotted">{booking.phone || 'Non renseigné'}</a>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Demande du</p>
                                        <p className="text-sm font-medium text-gray-700">{new Date(booking.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                
                                <div className="bg-gray-50 rounded-xl p-4 mb-4 pl-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold text-gray-500 uppercase">Chambre</span>
                                        <span className="text-sm font-bold text-gray-900 text-right">{booking.roomType}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-gray-500 uppercase">Séjour</span>
                                        <div className="text-right">
                                            <span className="text-sm font-bold text-gray-900 block">{new Date(booking.checkIn).toLocaleDateString()}</span>
                                            <span className="text-xs text-gray-400 block text-center">au</span>
                                            <span className="text-sm font-bold text-gray-900 block">{new Date(booking.checkOut).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 pl-3">
                                    <button 
                                        onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                        className="flex-1 bg-green-50 text-green-600 py-2.5 rounded-lg font-bold text-xs hover:bg-green-100 transition-colors flex items-center justify-center gap-1.5"
                                        title="Accepter"
                                    >
                                        <Check size={16} /> Accepter
                                    </button>
                                    <button 
                                        onClick={() => updateBookingStatus(booking.id, 'rejected')}
                                        className="flex-1 bg-red-50 text-red-600 py-2.5 rounded-lg font-bold text-xs hover:bg-red-100 transition-colors flex items-center justify-center gap-1.5"
                                        title="Refuser"
                                    >
                                        <X size={16} /> Refuser
                                    </button>
                                    <button 
                                        onClick={() => { if(window.confirm('Supprimer définitivement cette demande ?')) deleteBooking(booking.id) }}
                                        className="px-3 bg-gray-100 text-gray-500 py-2.5 rounded-lg hover:bg-gray-200 transition-colors"
                                        title="Supprimer"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'rooms' && (
                // ... (Keep existing Rooms Tab code) ...
                <div className="space-y-6">
                {!isEditingRoom ? (
                  <>
                    <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                      <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                         <Home size={20} className="text-primary-600" /> Liste des Chambres
                      </h2>
                      <button 
                        onClick={openAddRoom}
                        className="flex items-center bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/30 font-bold"
                      >
                        <Plus size={20} className="mr-2" /> Ajouter une Chambre
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                      {rooms.length === 0 && (
                        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                          <p className="text-gray-400 font-medium">Aucune chambre configurée.</p>
                        </div>
                      )}
                      {rooms.map(room => (
                        <div key={room.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 flex flex-col md:flex-row gap-8 items-center border border-gray-100 group">
                          <div className="w-full md:w-72 h-48 relative rounded-xl overflow-hidden shrink-0 shadow-md">
                            <img src={room.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'} alt={room.category} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            {room.promotionPrice && (
                                 <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">Promo</div>
                            )}
                            <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md">
                                {(room.images?.length || 0)} photos
                            </div>
                          </div>
                          
                          <div className="flex-1 w-full text-center md:text-left">
                            <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-3 gap-2">
                               <div>
                                 <h3 className="text-2xl font-bold text-gray-900 font-serif">{room.category}</h3>
                                 <p className="text-gray-500 text-sm line-clamp-2 mt-2 leading-relaxed">{room.description}</p>
                               </div>
                               <div className="text-center md:text-right bg-gray-50 px-4 py-2 rounded-xl">
                                 {room.promotionPrice ? (
                                    <div className="flex flex-col items-center md:items-end">
                                        <span className="text-gray-400 line-through text-xs font-bold">{room.price} TND</span>
                                        <span className="text-red-600 font-bold text-2xl">{room.promotionPrice} <span className="text-sm">TND</span></span>
                                    </div>
                                 ) : (
                                    <span className="text-gray-900 font-bold text-2xl">{room.price} <span className="text-sm text-gray-500">TND</span></span>
                                 )}
                               </div>
                            </div>

                            <div className="flex flex-wrap gap-2 md:gap-3 text-sm text-gray-500 mt-4 justify-center md:justify-start">
                               <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-gray-200 font-bold text-xs uppercase tracking-wide text-gray-600 shadow-sm"><User size={12}/> {room.capacity} Pers.</span>
                               <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-gray-200 font-bold text-xs uppercase tracking-wide text-gray-600 shadow-sm"><Maximize size={12}/> {room.size}</span>
                               <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs uppercase tracking-wide shadow-sm ${room.available ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                                  {room.available ? <Check size={12}/> : <X size={12}/>} {room.available ? 'Disponible' : 'Complet'}
                               </span>
                            </div>
                          </div>

                          <div className="flex flex-row md:flex-col gap-3 shrink-0 w-full md:w-auto justify-center">
                             <button onClick={() => openEditRoom(room)} className="p-3 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors shadow-sm" title="Modifier">
                              <Edit2 size={20} />
                            </button>
                            <button onClick={() => { if(window.confirm('Supprimer cette chambre ?')) deleteRoom(room.id); }} className="p-3 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors shadow-sm" title="Supprimer">
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  // Edit Room Form
                  <div className="bg-white rounded-3xl shadow-xl p-10 border border-gray-200 animate-fade-in-up">
                     <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                        <h2 className="text-2xl font-bold font-serif text-gray-900">
                            {currentRoom.id ? 'Modifier la Chambre' : 'Nouvelle Chambre'}
                        </h2>
                        <button onClick={() => setIsEditingRoom(false)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                            <X size={20} />
                        </button>
                     </div>

                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Catégorie</label>
                                <div className="relative">
                                    <select 
                                        value={currentRoom.category} 
                                        onChange={handleCategoryChange}
                                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all appearance-none cursor-pointer font-bold text-gray-900 outline-none"
                                    >
                                        {ROOM_CATEGORIES.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Description</label>
                                <textarea 
                                    rows={6}
                                    value={currentRoom.description} 
                                    onChange={(e) => setCurrentRoom({...currentRoom, description: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all text-sm leading-relaxed outline-none"
                                    placeholder="Décrivez l'ambiance et le confort..."
                                />
                            </div>
                             <div className="grid grid-cols-2 gap-4">
                                 <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Prix (TND)</label>
                                    <input 
                                        type="number" 
                                        value={currentRoom.price} 
                                        onChange={(e) => setCurrentRoom({...currentRoom, price: Number(e.target.value)})}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 font-bold text-lg outline-none"
                                    />
                                 </div>
                             </div>
                        </div>

                        <div className="space-y-6">
                             <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                <div className="flex justify-between items-center mb-4">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Photos</label>
                                    <div className={`relative px-4 py-2 bg-primary-100 text-primary-700 rounded-lg font-bold text-xs cursor-pointer hover:bg-primary-200 transition-colors flex items-center gap-2 ${isUploadingRoomImage ? 'opacity-50 pointer-events-none' : ''}`}>
                                        {isUploadingRoomImage ? <Loader className="animate-spin" size={14} /> : <Upload size={14} />}
                                        {isUploadingRoomImage ? '...' : 'Ajouter des photos'}
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            multiple
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={handleRoomImageUpload}
                                        />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 min-h-[150px]">
                                    {currentRoom.images?.map((img, idx) => (
                                        <div key={idx} className="relative group aspect-square bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                            {idx === 0 && (
                                                <div className="absolute top-2 left-2 bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm z-10 uppercase">Principal</div>
                                            )}
                                            <button 
                                                type="button"
                                                onClick={() => removeImageFromRoom(idx)}
                                                className="absolute top-2 right-2 bg-white text-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10"
                                            >
                                                <X size={12} />
                                            </button>
                                            <div className="absolute inset-x-0 bottom-0 p-1 flex justify-between items-end bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    type="button"
                                                    onClick={() => moveRoomImage(idx, 'left')}
                                                    disabled={idx === 0}
                                                    className={`p-1 rounded-full bg-white/20 text-white hover:bg-white/40 backdrop-blur-sm ${idx === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
                                                >
                                                    <ChevronLeft size={12} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => moveRoomImage(idx, 'right')}
                                                    disabled={idx === (currentRoom.images?.length || 0) - 1}
                                                    className={`p-1 rounded-full bg-white/20 text-white hover:bg-white/40 backdrop-blur-sm ${idx === (currentRoom.images?.length || 0) - 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
                                                >
                                                    <ChevronRight size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                             </div>

                             <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                <h3 className="text-xs font-bold uppercase text-gray-400 mb-4 tracking-widest">Détails Techniques</h3>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Capacité</label>
                                        <input 
                                            type="number" 
                                            value={currentRoom.capacity} 
                                            onChange={(e) => setCurrentRoom({...currentRoom, capacity: Number(e.target.value)})}
                                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Surface</label>
                                        <input 
                                            type="text" 
                                            value={currentRoom.size} 
                                            onChange={(e) => setCurrentRoom({...currentRoom, size: e.target.value})}
                                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Équipements (Liste)</label>
                                    <input 
                                        type="text" 
                                        value={Array.isArray(currentRoom.features) ? currentRoom.features.join(', ') : currentRoom.features}
                                        onChange={(e) => setCurrentRoom({...currentRoom, features: e.target.value.split(',')})}
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <button 
                                        onClick={() => setCurrentRoom({...currentRoom, available: !currentRoom.available})}
                                        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all font-bold shadow-sm ${currentRoom.available ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                                    >
                                        {currentRoom.available ? <CheckSquare size={18} /> : <Square size={18} />}
                                        {currentRoom.available ? 'Statut: Disponible' : 'Statut: Complet'}
                                    </button>
                                </div>
                             </div>

                             <div className="bg-red-50 p-6 rounded-2xl border border-red-100 relative overflow-hidden">
                                <h3 className="text-xs font-bold uppercase text-red-800 mb-4 flex items-center gap-2 tracking-widest"><CheckSquare size={14} /> Promotion</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-red-900 mb-1">Prix Promo</label>
                                        <input 
                                            type="number" 
                                            value={currentRoom.promotionPrice || ''} 
                                            onChange={(e) => setCurrentRoom({...currentRoom, promotionPrice: e.target.value ? Number(e.target.value) : undefined})}
                                            className="w-full px-3 py-2 bg-white border border-red-200 rounded-lg text-red-600 font-bold outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-red-900 mb-1">Label</label>
                                        <input 
                                            type="text" 
                                            value={currentRoom.promotionLabel || ''} 
                                            onChange={(e) => setCurrentRoom({...currentRoom, promotionLabel: e.target.value})}
                                            className="w-full px-3 py-2 bg-white border border-red-200 rounded-lg outline-none"
                                            placeholder="-20%"
                                        />
                                    </div>
                                </div>
                             </div>
                        </div>
                     </div>

                     <div className="mt-10 flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-100">
                        <button onClick={() => setIsEditingRoom(false)} className="px-8 py-3.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Annuler</button>
                        <button onClick={saveRoom} className="px-10 py-3.5 rounded-xl font-bold text-white bg-gray-900 hover:bg-primary-600 shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                            <Save size={20} /> Enregistrer
                        </button>
                     </div>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'services' && (
                <div className="space-y-6">
                    {!isEditingService ? (
                        <>
                            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                        <Coffee size={20} className="text-primary-600" /> Services & Équipements
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">Gérez la liste des services affichés sur le site.</p>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={async () => {
                                            if(window.confirm("Attention : Cela va SUPPRIMER tous les services actuels et les remplacer par les 12 services par défaut. Continuer ?")) {
                                                await resetDefaultServices();
                                            }
                                        }}
                                        className="flex items-center bg-gray-100 text-gray-600 px-4 py-3 rounded-xl hover:bg-gray-200 transition-all font-bold text-sm"
                                        title="Réinitialiser avec les exemples"
                                    >
                                        <RefreshCw size={18} className="mr-2" /> Charger les exemples
                                    </button>
                                    <button 
                                        onClick={openAddService}
                                        className="flex items-center bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30 font-bold hover:-translate-y-1"
                                    >
                                        <Plus size={20} className="mr-2" /> Ajouter un Service
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {amenities.length === 0 && (
                                    <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-dashed border-gray-300 text-gray-400">
                                        <Coffee size={48} className="mx-auto mb-4 opacity-50" />
                                        <p>Aucun service ajouté.</p>
                                    </div>
                                )}
                                {amenities.map(service => {
                                    // @ts-ignore
                                    const ServiceIcon = Icons[service.icon] || Icons.HelpCircle;
                                    return (
                                        <div key={service.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all group flex flex-col h-full relative">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors shadow-sm">
                                                    <ServiceIcon size={28} />
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => openEditService(service)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Modifier">
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button onClick={() => { if(window.confirm('Supprimer ce service ?')) deleteAmenity(service.id) }} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2 font-serif">{service.name}</h3>
                                            <p className="text-sm text-gray-500 leading-relaxed flex-grow">{service.description}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        // ... (Keep Service Edit Form unchanged) ...
                        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-gray-200 max-w-3xl mx-auto relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-[100px] -mr-10 -mt-10 z-0"></div>
                            
                            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100 relative z-10">
                                <h2 className="text-2xl font-bold font-serif text-gray-900 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                                        <Coffee size={20} />
                                    </div>
                                    {currentService.id ? 'Modifier le Service' : 'Nouveau Service'}
                                </h2>
                                <button onClick={() => setIsEditingService(false)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-8 relative z-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Nom du Service</label>
                                        <input
                                            type="text"
                                            value={currentService.name}
                                            onChange={(e) => setCurrentService({...currentService, name: e.target.value})}
                                            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-bold text-lg"
                                            placeholder="Ex: Wifi Gratuit"
                                        />
                                        
                                        <div className="mt-6">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Description</label>
                                            <textarea
                                                rows={5}
                                                value={currentService.description}
                                                onChange={(e) => setCurrentService({...currentService, description: e.target.value})}
                                                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm leading-relaxed"
                                                placeholder="Une courte description du service..."
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Sélectionner une icône</label>
                                        <IconPicker 
                                            selected={currentService.icon || ''} 
                                            onSelect={(icon) => setCurrentService({...currentService, icon})} 
                                        />
                                        <div className="mt-4 flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-200">
                                            <span className="text-xs font-bold text-gray-400 uppercase">Sélectionné:</span>
                                            <div className="flex items-center gap-2 font-bold text-primary-600">
                                                {/* @ts-ignore */}
                                                {Icons[currentService.icon] && React.createElement(Icons[currentService.icon], { size: 20 })}
                                                <span>{currentService.icon}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 flex justify-end gap-4 pt-6 border-t border-gray-100 relative z-10">
                                <button onClick={() => setIsEditingService(false)} className="px-8 py-3.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Annuler</button>
                                <button onClick={saveService} className="px-10 py-3.5 rounded-xl font-bold text-white bg-gray-900 hover:bg-primary-600 shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2">
                                    <Save size={20} /> Enregistrer
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
            
            {/* ... (Keep other tabs) ... */}
            {activeTab === 'gallery' && (
                <div className="space-y-8">
                    {!isEditingCard ? (
                        <>
                            {/* Gallery Sub-Tabs */}
                            <div className="flex p-1 bg-white rounded-xl shadow-sm border border-gray-200 w-fit mb-6">
                                <button 
                                    onClick={() => setGalleryTab('photos')}
                                    className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${galleryTab === 'photos' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    <ImageIcon size={16} /> Cartes Photos
                                </button>
                                <button 
                                    onClick={() => setGalleryTab('videos')}
                                    className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${galleryTab === 'videos' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    <Video size={16} /> Vidéos Immersives
                                </button>
                            </div>

                            {galleryTab === 'photos' && (
                                <>
                                    <div className="flex justify-between items-center mb-6">
                                        <p className="text-gray-500 text-sm">Gérez les cartes illustrées qui apparaissent dans la galerie.</p>
                                        <button 
                                            onClick={openAddCard}
                                            className="flex items-center bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30 font-bold hover:-translate-y-1"
                                        >
                                            <Plus size={20} className="mr-2" /> Ajouter une Carte Photo
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {[...gallery].filter(i => !i.video).sort((a,b) => a.order - b.order).map(card => (
                                            <div key={card.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-5 border border-gray-100 flex flex-col h-full group">
                                                <div className="h-48 rounded-xl bg-gray-100 mb-4 overflow-hidden relative border border-gray-100">
                                                    <img src={card.images[0] || 'https://via.placeholder.com/400'} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-md">
                                                        {card.images.length} photos
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest mb-2 block">{card.category}</span>
                                                <h3 className="font-bold text-gray-900 text-lg mb-2 leading-tight">{card.title}</h3>
                                                <p className="text-gray-500 text-sm mb-6 flex-grow line-clamp-3">{card.description}</p>
                                                <div className="flex gap-3 pt-4 border-t border-gray-50">
                                                    <button onClick={() => openEditCard(card)} className="flex-1 bg-gray-50 text-gray-700 py-2.5 rounded-lg font-bold hover:bg-gray-100 transition-colors text-sm flex items-center justify-center gap-2">
                                                        <Edit2 size={16} /> Modifier
                                                    </button>
                                                    <button 
                                                        type="button"
                                                        onClick={() => {if(window.confirm("Supprimer cette carte ?")) deleteGalleryCard(card.id)}} 
                                                        className="bg-red-50 text-red-500 p-2.5 rounded-lg hover:bg-red-100 transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {gallery.filter(i => !i.video).length === 0 && (
                                            <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-dashed border-gray-300 text-gray-400">
                                                Aucune carte photo.
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {galleryTab === 'videos' && (
                                <>
                                    <div className="flex justify-between items-center mb-6">
                                        <p className="text-gray-500 text-sm">Gérez les vidéos qui apparaissent dans la section "Live Tour".</p>
                                        <button 
                                            onClick={openAddVideo}
                                            className="flex items-center bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all shadow-lg font-bold hover:-translate-y-1"
                                        >
                                            <Video size={20} className="mr-2" /> Ajouter une Vidéo
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {[...gallery].filter(i => i.video).sort((a,b) => a.order - b.order).map(card => (
                                            <div key={card.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-4 border border-gray-100 group">
                                                <div className="aspect-[9/16] md:aspect-video rounded-xl bg-black mb-4 overflow-hidden relative shadow-inner">
                                                    <video src={card.video} className="w-full h-full object-cover opacity-80" />
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                                                            <Play size={20} className="text-white fill-white ml-1" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs font-bold text-gray-400">Vidéo ID: {card.id.slice(0,6)}</span>
                                                    <button 
                                                        type="button"
                                                        onClick={() => {if(window.confirm("Supprimer cette vidéo ?")) deleteGalleryCard(card.id)}} 
                                                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold"
                                                    >
                                                        <Trash2 size={14} /> Supprimer
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {gallery.filter(i => i.video).length === 0 && (
                                            <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-dashed border-gray-300 text-gray-400">
                                                Aucune vidéo.
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        // Card Edit Form
                        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-gray-200 max-w-4xl mx-auto relative overflow-hidden">
                            {/* ... (Keep existing gallery form logic) ... */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-[100px] -mr-10 -mt-10 z-0"></div>
                            
                            <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100 relative z-10">
                                <div>
                                    <h2 className="text-2xl font-bold font-serif text-gray-900 flex items-center gap-3">
                                        {isAddingVideo ? <Video size={28} className="text-primary-600" /> : <ImageIcon size={28} className="text-primary-600" />}
                                        {currentCard.id ? 'Modifier' : 'Ajouter'} {isAddingVideo ? 'une Vidéo' : 'une Carte Photo'}
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">Remplissez les informations ci-dessous.</p>
                                </div>
                                <button onClick={() => setIsEditingCard(false)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
                                {/* Left Column: Inputs (Hidden for videos mostly) */}
                                <div className={`${isAddingVideo ? 'hidden' : 'lg:col-span-5'} space-y-6`}>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Catégorie</label>
                                        <input
                                            type="text"
                                            value={currentCard.category}
                                            onChange={(e) => setCurrentCard({...currentCard, category: e.target.value})}
                                            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all font-bold text-primary-600 outline-none"
                                            placeholder="Ex: Piscine"
                                        />
                                        {/* Quick Select */}
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {Object.keys(CATEGORY_MAP).map((cat, idx) => (
                                                <button 
                                                    key={idx} 
                                                    onClick={() => {
                                                        const autoDesc = CATEGORY_MAP[cat];
                                                        setCurrentCard({ ...currentCard, category: cat, title: cat, description: autoDesc || currentCard.description });
                                                    }}
                                                    className="text-[10px] px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full font-bold text-gray-600 transition-colors"
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Titre</label>
                                        <input
                                            type="text"
                                            value={currentCard.title}
                                            onChange={(e) => setCurrentCard({...currentCard, title: e.target.value})}
                                            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all outline-none font-bold text-gray-900"
                                            placeholder="Titre principal de la carte"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Description</label>
                                        <textarea 
                                            rows={4}
                                            value={currentCard.description} 
                                            onChange={(e) => setCurrentCard({...currentCard, description: e.target.value})}
                                            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all outline-none text-sm leading-relaxed"
                                            placeholder="Description affichée sous l'image..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Ordre d'affichage</label>
                                        <input 
                                            type="number" 
                                            value={currentCard.order} 
                                            onChange={(e) => setCurrentCard({...currentCard, order: Number(e.target.value)})}
                                            className="w-24 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all outline-none font-bold"
                                        />
                                    </div>
                                </div>

                                {/* Right Column: Media Upload */}
                                <div className={`${isAddingVideo ? 'lg:col-span-12' : 'lg:col-span-7'} space-y-6`}>
                                    
                                    {isAddingVideo ? (
                                        <div className="bg-gray-900 p-8 rounded-3xl text-white text-center">
                                            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary-400">
                                                <Video size={32} />
                                            </div>
                                            <h3 className="text-xl font-bold mb-2">Fichier Vidéo</h3>
                                            <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">Téléchargez une courte vidéo (MP4) pour la section "Live Tour". Max 90MB.</p>
                                            
                                            <div className="max-w-md mx-auto text-left">
                                                <VideoUploadField 
                                                    label=""
                                                    value={currentCard.video || ''}
                                                    onChange={(url) => setCurrentCard({...currentCard, video: url})}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-6">
                                            <div className="flex justify-between items-center mb-6">
                                                <label className="block text-sm font-bold text-gray-700">Photos de la carte</label>
                                                <div className={`relative px-5 py-2.5 bg-primary-600 text-white rounded-xl font-bold text-xs cursor-pointer hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/20 flex items-center gap-2 ${isUploadingGalleryImage ? 'opacity-50 pointer-events-none' : ''}`}>
                                                    {isUploadingGalleryImage ? <Loader className="animate-spin" size={14} /> : <Upload size={14} />}
                                                    {isUploadingGalleryImage ? 'Envoi...' : 'Ajouter des photos'}
                                                    <input 
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                        onChange={handleGalleryImageUpload}
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 min-h-[200px]">
                                                {currentCard.images?.map((img, idx) => (
                                                    <div key={idx} className="relative group aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                                        <button 
                                                            type="button"
                                                            onClick={() => removeImageFromCard(idx)}
                                                            className="absolute top-2 right-2 bg-white text-red-500 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md z-10 hover:scale-110"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                        <div className="absolute inset-x-0 bottom-0 p-2 flex justify-between items-end bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                type="button"
                                                                onClick={() => moveImage(idx, 'left')}
                                                                disabled={idx === 0}
                                                                className={`p-1 rounded-full bg-white/20 text-white hover:bg-white/40 backdrop-blur-sm ${idx === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
                                                            >
                                                                <ChevronLeft size={14} />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => moveImage(idx, 'right')}
                                                                disabled={idx === (currentCard.images?.length || 0) - 1}
                                                                className={`p-1 rounded-full bg-white/20 text-white hover:bg-white/40 backdrop-blur-sm ${idx === (currentCard.images?.length || 0) - 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
                                                            >
                                                                <ChevronRight size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                                {(!currentCard.images || currentCard.images.length === 0) && (
                                                    <div className="col-span-full flex flex-col items-center justify-center text-gray-300 py-10">
                                                        <ImageIcon size={48} className="mb-2 opacity-50" />
                                                        <span className="text-xs font-bold uppercase tracking-widest">Aucune image</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-10 flex justify-end gap-4 pt-6 border-t border-gray-100 relative z-10">
                                <button onClick={() => setIsEditingCard(false)} className="px-8 py-3.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Annuler</button>
                                <button onClick={saveCard} className="px-10 py-3.5 rounded-xl font-bold text-white bg-gray-900 hover:bg-primary-600 shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                                    <Save size={20} /> Enregistrer {isAddingVideo ? 'la Vidéo' : 'la Carte'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ... (Keep Security Tab) ... */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 max-w-2xl animate-fade-in-up">
                  <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                     <Lock size={20} className="text-primary-600" /> Sécurité du Compte
                  </h2>
                  <form onSubmit={handlePasswordChange} className="space-y-6">
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Nouveau mot de passe</label>
                          <input 
                              type="password" 
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                              placeholder="••••••••"
                          />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Confirmer le mot de passe</label>
                          <input 
                              type="password" 
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                              placeholder="••••••••"
                          />
                      </div>
                      {passwordMsg.text && (
                          <div className={`p-3 rounded-lg text-sm font-bold flex items-center gap-2 ${passwordMsg.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                              {passwordMsg.type === 'error' ? <XCircle size={16} /> : <Check size={16} />}
                              {passwordMsg.text}
                          </div>
                      )}
                      <div className="flex justify-end pt-4 border-t border-gray-100">
                          <button type="submit" className="bg-gray-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-primary-600 transition-colors shadow-lg hover:shadow-primary-500/30">
                              Mettre à jour le mot de passe
                          </button>
                      </div>
                  </form>
              </div>
            )}
            
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
