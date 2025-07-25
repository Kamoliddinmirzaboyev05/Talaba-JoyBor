import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, GraduationCap, MapPin, Edit3, Save, X, Camera, Shield, Lock, FileText, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { PageType } from '../App';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface ProfilePageProps {
  onNavigate: (page: PageType) => void;
}

interface ProfileData {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  image?: string;
  bio?: string;
  phone?: string;
  birth_date?: string;
  address?: string;
  telegram?: string;
}

interface Application {
  id: number;
  user: {
    id: number;
    username: string;
    role: string;
    email: string;
  };
  dormitory: {
    id: number;
    university: {
      id: number;
      name: string;
      address: string;
      description: string;
      contact: string;
      logo: string | null;
    };
    admin: {
      id: number;
      username: string;
      role: string;
      email: string;
    };
    name: string;
    address: string;
    description: string;
    images: Array<{
      id: number;
      dormitory: {
        id: number;
        name: string;
      };
      image: string;
    }>;
    month_price: number;
    year_price: number;
    latitude: number;
    longitude: number;
    amenities: Array<{
      id: number;
      name: string;
      is_active: boolean;
      type: string;
    }>;
    total_capacity: number;
    available_capacity: number;
    total_rooms: number;
    distance_to_university: number;
    rules: string[];
  };
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  comment: string;
  document: string;
  name: string;
  fio: string;
  city: string;
  village: string;
  university: string;
  phone: number;
  passport_image_first: string;
  passport_image_second: string;
  created_at: string;
  user_image: string | null;
  direction: string | null;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { updateUserProfile } = useAuth();
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [editedProfile, setEditedProfile] = useState<ProfileData | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [applications, setApplications] = useState<Application[]>([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [applicationsError, setApplicationsError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('access');
      if (!token) {
        onNavigate('login');
        return;
      }
      try {
        const res = await fetch('https://joyboryangi.pythonanywhere.com/profile/', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (res.status === 401) {
          onNavigate('login');
          return;
        }
        if (!res.ok) {
          setError('Profilni yuklashda xatolik.');
          setLoading(false);
          return;
        }
        const data = await res.json();
        setProfile(data);
        setEditedProfile(data);
        setImageFile(null);
        setPassword('');
      } catch {
        setError('Tarmoq xatosi yoki server ishlamayapti.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  const fetchApplications = async () => {
    setApplicationsLoading(true);
    setApplicationsError('');
    const token = localStorage.getItem('access');
    if (!token) {
      onNavigate('login');
      return;
    }
    try {
      const res = await fetch('https://joyboryangi.pythonanywhere.com/applications/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (res.status === 401) {
        onNavigate('login');
        return;
      }
      if (!res.ok) {
        setApplicationsError('Arizalarni yuklashda xatolik.');
        setApplicationsLoading(false);
        return;
      }
      const data = await res.json();
      setApplications(data);
    } catch {
      setApplicationsError('Tarmoq xatosi yoki server ishlamayapti.');
    } finally {
      setApplicationsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'applications') {
      fetchApplications();
    }
  }, [activeTab]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    setFieldErrors({});
    const token = localStorage.getItem('access');
    if (!token || !editedProfile) {
      onNavigate('login');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('username', editedProfile.username);
      formData.append('first_name', editedProfile.first_name || '');
      formData.append('last_name', editedProfile.last_name || '');
      if (password) formData.append('password', password);
      if (imageFile) formData.append('image', imageFile);
      formData.append('bio', editedProfile.bio || '');
      formData.append('phone', editedProfile.phone || '');
      formData.append('birth_date', editedProfile.birth_date || '');
      formData.append('address', editedProfile.address || '');
      formData.append('telegram', editedProfile.telegram || '');

      const res = await fetch('https://joyboryangi.pythonanywhere.com/profile/', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      if (res.status === 401) {
        onNavigate('login');
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        if (typeof data === 'object') {
          const fieldErrs: Record<string, string> = {};
          Object.keys(data).forEach((key) => {
            if (Array.isArray(data[key])) {
              fieldErrs[key] = data[key][0];
            } else if (typeof data[key] === 'string') {
              fieldErrs[key] = data[key];
            }
          });
          setFieldErrors(fieldErrs);
        }
        setError(data.detail || 'Profilni yangilashda xatolik.');
        setSaving(false);
        return;
      }
      setProfile(data);
      setEditedProfile(data);
      setImageFile(null);
      setPassword('');
      setSuccess('Profil muvaffaqiyatli yangilandi!');
      setIsEditing(false);
      updateUserProfile(data); // Update AuthContext after successful profile update
    } catch {
      setError('Tarmoq xatosi yoki server ishlamayapti.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setImageFile(null);
    setPassword('');
    setIsEditing(false);
    setError('');
    setSuccess('');
    setFieldErrors({});
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setEditedProfile(prev => prev ? { ...prev, [field]: value } : null);
    setFieldErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'APPROVED':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'REJECTED':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Kutilmoqda';
      case 'APPROVED':
        return 'Tasdiqlangan';
      case 'REJECTED':
        return 'Rad etilgan';
      default:
        return 'Noma\'lum';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return theme === 'dark' 
          ? 'bg-yellow-900/30 text-yellow-400' 
          : 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return theme === 'dark' 
          ? 'bg-green-900/30 text-green-400' 
          : 'bg-green-100 text-green-800';
      case 'REJECTED':
        return theme === 'dark' 
          ? 'bg-red-900/30 text-red-400' 
          : 'bg-red-100 text-red-800';
      default:
        return theme === 'dark' 
          ? 'bg-gray-700 text-gray-300' 
          : 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'preferences', label: 'Afzalliklar', icon: MapPin },
    { id: 'applications', label: 'Arizalar', icon: FileText },
    { id: 'security', label: 'Xavfsizlik', icon: Shield }
  ];

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Profil yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <p className={`text-lg ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{error}</p>
        </div>
      </div>
    );
  }

  if (!profile || !editedProfile) {
    return null;
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header onNavigate={onNavigate} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Profil
          </h1>
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
            Shaxsiy ma'lumotlaringizni boshqaring
          </p>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={`rounded-2xl shadow-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
            >
              {/* Profile Picture */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  {editedProfile.image && !imageFile ? (
                    <img
                      src={editedProfile.image}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-teal-500 mx-auto"
                    />
                  ) : imageFile ? (
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="Profile preview"
                      className="w-24 h-24 rounded-full object-cover border-4 border-teal-500 mx-auto"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-r from-teal-600 to-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {editedProfile.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  {isEditing && (
                    <motion.label
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute bottom-0 right-0 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center hover:bg-teal-700 transition-colors duration-200 cursor-pointer"
                    >
                      <Camera className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </motion.label>
                  )}
                </div>
                <h3 className={`text-lg font-semibold mt-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {editedProfile.username}
                </h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {editedProfile.bio || ''}
                </p>
              </div>
              {/* Navigation */}
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeTab === tab.id
                        ? theme === 'dark' 
                          ? 'bg-teal-900/30 text-teal-400'
                          : 'bg-teal-50 text-teal-600'
                        : theme === 'dark'
                          ? 'text-gray-300 hover:bg-gray-700'
                          : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </motion.button>
                ))}
              </nav>
            </motion.div>
          </div>
          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`rounded-2xl shadow-lg p-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
            >
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <form onSubmit={handleSave}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Shaxsiy Ma'lumotlar
                    </h2>
                    {!isEditing ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
                        type="button"
                      >
                        <Edit3 className="w-4 h-4" />
                        Tahrirlash
                      </motion.button>
                    ) : (
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                          type="submit"
                          disabled={saving}
                        >
                          <Save className="w-4 h-4" />
                          {saving ? 'Saqlanmoqda...' : 'Saqlash'}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleCancel}
                          className="flex items-center gap-2 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                          type="button"
                          disabled={saving}
                        >
                          <X className="w-4 h-4" />
                          Bekor qilish
                        </motion.button>
                      </div>
                    )}
                  </div>
                  {success && <div className={`mb-4 p-3 rounded-xl text-sm ${
                    theme === 'dark' 
                      ? 'bg-green-900/20 border border-green-800 text-green-400' 
                      : 'bg-green-50 border border-green-200 text-green-600'
                  }`}>{success}</div>}
                  {error && <div className={`mb-4 p-3 rounded-xl text-sm ${
                    theme === 'dark' 
                      ? 'bg-red-900/20 border border-red-800 text-red-400' 
                      : 'bg-red-50 border border-red-200 text-red-600'
                  }`}>{error}</div>}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Foydalanuvchi nomi
                      </label>
                      <div className="relative">
                        <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                        <input
                          type="text"
                          value={editedProfile.username}
                          onChange={(e) => handleInputChange('username', e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ${
                            theme === 'dark' 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          } ${fieldErrors.username ? 'border-red-500' : ''}`}
                          placeholder="Foydalanuvchi nomi"
                          disabled={!isEditing}
                        />
                        {fieldErrors.username && <div className="text-red-500 text-xs mt-1">{fieldErrors.username}</div>}
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Ism
                      </label>
                      <div className="relative">
                        <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                        <input
                          type="text"
                          value={editedProfile.first_name || ''}
                          onChange={(e) => handleInputChange('first_name', e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ${
                            theme === 'dark' 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          } ${fieldErrors.first_name ? 'border-red-500' : ''}`}
                          placeholder="Ism"
                          disabled={!isEditing}
                        />
                        {fieldErrors.first_name && <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{fieldErrors.first_name}</div>}
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Familiya
                      </label>
                      <div className="relative">
                        <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                        <input
                          type="text"
                          value={editedProfile.last_name || ''}
                          onChange={(e) => handleInputChange('last_name', e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ${
                            theme === 'dark' 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          } ${fieldErrors.last_name ? 'border-red-500' : ''}`}
                          placeholder="Familiya"
                          disabled={!isEditing}
                        />
                        {fieldErrors.last_name && <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{fieldErrors.last_name}</div>}
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Email
                      </label>
                      <div className="relative">
                        <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                        <input
                          type="email"
                          value={editedProfile.email}
                          disabled
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl ${
                            theme === 'dark' 
                              ? 'bg-gray-600 border-gray-500 text-gray-400' 
                              : 'bg-gray-100 border-gray-300 text-gray-500'
                          }`}
                          placeholder="Email"
                        />
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Telefon
                      </label>
                      <div className="relative">
                        <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                        <input
                          type="tel"
                          value={editedProfile.phone || ''}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ${
                            theme === 'dark' 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          } ${fieldErrors.phone ? 'border-red-500' : ''}`}
                          placeholder="Telefon raqam"
                          disabled={!isEditing}
                        />
                        {fieldErrors.phone && <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{fieldErrors.phone}</div>}
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Tug'ilgan sana
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={editedProfile.birth_date || ''}
                          onChange={(e) => handleInputChange('birth_date', e.target.value)}
                          className={`w-full pl-4 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ${
                            theme === 'dark' 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          } ${fieldErrors.birth_date ? 'border-red-500' : ''}`}
                          placeholder="YYYY-MM-DD"
                          disabled={!isEditing}
                        />
                        {fieldErrors.birth_date && <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{fieldErrors.birth_date}</div>}
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Manzil
                      </label>
                      <div className="relative">
                        <MapPin className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                        <input
                          type="text"
                          value={editedProfile.address || ''}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ${
                            theme === 'dark' 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          } ${fieldErrors.address ? 'border-red-500' : ''}`}
                          placeholder="Manzil"
                          disabled={!isEditing}
                        />
                        {fieldErrors.address && <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{fieldErrors.address}</div>}
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Telegram
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={editedProfile.telegram || ''}
                          onChange={(e) => handleInputChange('telegram', e.target.value)}
                          className={`w-full pl-4 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ${
                            theme === 'dark' 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          } ${fieldErrors.telegram ? 'border-red-500' : ''}`}
                          placeholder="@username"
                          disabled={!isEditing}
                        />
                        {fieldErrors.telegram && <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{fieldErrors.telegram}</div>}
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Bio
                      </label>
                      <div className="relative">
                        <textarea
                          value={editedProfile.bio || ''}
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                          className={`w-full pl-4 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ${
                            theme === 'dark' 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          } ${fieldErrors.bio ? 'border-red-500' : ''}`}
                          placeholder="O'zingiz haqida qisqacha ma'lumot"
                          disabled={!isEditing}
                          rows={3}
                        />
                        {fieldErrors.bio && <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{fieldErrors.bio}</div>}
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Parol (ixtiyoriy)
                      </label>
                      <div className="relative">
                        <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ${
                            theme === 'dark' 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          } ${fieldErrors.password ? 'border-red-500' : ''}`}
                          placeholder="Yangi parol (ixtiyoriy)"
                          disabled={!isEditing}
                        />
                        {fieldErrors.password && <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{fieldErrors.password}</div>}
                      </div>
                    </div>
                  </div>
                </form>
              )}

              {/* Applications Tab */}
              {activeTab === 'applications' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Mening Arizalarim
                    </h2>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={fetchApplications}
                      className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
                      type="button"
                      disabled={applicationsLoading}
                    >
                      {applicationsLoading ? 'Yuklanmoqda...' : 'Yangilash'}
                    </motion.button>
                  </div>

                  {applicationsLoading && (
                    <div className="text-center py-8">
                      <div className="w-8 h-8 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Arizalar yuklanmoqda...</p>
                    </div>
                  )}

                  {applicationsError && (
                    <div className={`p-4 rounded-xl text-center ${
                      theme === 'dark' 
                        ? 'bg-red-900/20 border border-red-800 text-red-400' 
                        : 'bg-red-50 border border-red-200 text-red-600'
                    }`}>
                      {applicationsError}
                    </div>
                  )}

                  {!applicationsLoading && !applicationsError && applications.length === 0 && (
                    <div className="text-center py-12">
                      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className={`text-lg font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Hech qanday ariza topilmadi
                      </h3>
                      <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                        Siz hali hech qanday yotoqxonaga ariza bermagansiz.
                      </p>
                    </div>
                  )}

                  {!applicationsLoading && !applicationsError && applications.length > 0 && (
                    <div className="space-y-6">
                      {applications.map((application) => (
                        <motion.div
                          key={application.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 ${
                            theme === 'dark' 
                              ? 'bg-gray-700 border border-gray-600' 
                              : 'bg-white border border-gray-200'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                {application.dormitory.name}
                              </h3>
                              <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                {application.dormitory.university.name} - {application.dormitory.address}
                              </p>
                              <div className="flex items-center gap-2 mb-2">
                                {getStatusIcon(application.status)}
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                                  {getStatusText(application.status)}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                {formatPrice(application.dormitory.month_price)}
                              </p>
                              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>oyiga</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                <strong>F.I.O:</strong> {application.fio}
                              </p>
                              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                <strong>Telefon:</strong> +{application.phone}
                              </p>
                              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                <strong>Shahar:</strong> {application.city}
                              </p>
                              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                <strong>Qishloq:</strong> {application.village}
                              </p>
                            </div>
                            <div>
                              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                <strong>Universitet:</strong> {application.university}
                              </p>
                              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                <strong>Ariza sanasi:</strong> {formatDate(application.created_at)}
                              </p>
                              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                <strong>Sig'im:</strong> {application.dormitory.available_capacity}/{application.dormitory.total_capacity} joy
                              </p>
                            </div>
                          </div>

                          {application.comment && (
                            <div className="mb-4">
                              <p className={`text-sm mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                <strong>Izoh:</strong>
                              </p>
                              <p className={`text-sm p-3 rounded-lg ${
                                theme === 'dark' 
                                  ? 'text-gray-200 bg-gray-600' 
                                  : 'text-gray-700 bg-gray-100'
                              }`}>
                                {application.comment}
                              </p>
                            </div>
                          )}

                          <div className={`flex items-center justify-between pt-4 border-t ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}>
                            <div className="flex items-center gap-4">
                              {application.document && (
                                <a
                                  href={application.document}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`flex items-center gap-2 text-sm ${
                                    theme === 'dark' 
                                      ? 'text-teal-400 hover:text-teal-300' 
                                      : 'text-teal-600 hover:text-teal-700'
                                  }`}
                                >
                                  <FileText className="w-4 h-4" />
                                  Hujjat
                                </a>
                              )}
                              {application.passport_image_first && (
                                <a
                                  href={application.passport_image_first}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`flex items-center gap-2 text-sm ${
                                    theme === 'dark' 
                                      ? 'text-teal-400 hover:text-teal-300' 
                                      : 'text-teal-600 hover:text-teal-700'
                                  }`}
                                >
                                  <Eye className="w-4 h-4" />
                                  Pasport (1-bet)
                                </a>
                              )}
                              {application.passport_image_second && (
                                <a
                                  href={application.passport_image_second}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`flex items-center gap-2 text-sm ${
                                    theme === 'dark' 
                                      ? 'text-teal-400 hover:text-teal-300' 
                                      : 'text-teal-600 hover:text-teal-700'
                                  }`}
                                >
                                  <Eye className="w-4 h-4" />
                                  Pasport (2-bet)
                                </a>
                              )}
                            </div>
                            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                              ID: #{application.id}
                            </div>
                          </div>

                          {application.dormitory.images.length > 0 && (
                            <div className={`mt-4 pt-4 border-t ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}>
                              <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                <strong>Yotoqxona rasmlari:</strong>
                              </p>
                              <div className="flex gap-2 overflow-x-auto">
                                {application.dormitory.images.slice(0, 3).map((image) => (
                                  <img
                                    key={image.id}
                                    src={image.image}
                                    alt={application.dormitory.name}
                                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                                  />
                                ))}
                                {application.dormitory.images.length > 3 && (
                                  <div className={`w-20 h-20 rounded-lg flex items-center justify-center text-xs flex-shrink-0 ${
                                    theme === 'dark' 
                                      ? 'bg-gray-600 text-gray-300' 
                                      : 'bg-gray-200 text-gray-600'
                                  }`}>
                                    +{application.dormitory.images.length - 3}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Other tabs can be implemented as needed */}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;