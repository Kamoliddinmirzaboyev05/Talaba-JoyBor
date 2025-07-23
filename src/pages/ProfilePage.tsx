import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, GraduationCap, MapPin, Edit3, Save, X, Camera, Shield, Lock } from 'lucide-react';
import { PageType } from '../App';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';

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

const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { updateUserProfile } = useAuth();
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

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'preferences', label: 'Afzalliklar', icon: MapPin },
    { id: 'applications', label: 'Arizalar', icon: GraduationCap },
    { id: 'security', label: 'Xavfsizlik', icon: Shield }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Profil yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile || !editedProfile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header onNavigate={onNavigate} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Profil
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
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
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
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
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-3">
                  {editedProfile.username}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
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
                        ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
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
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
            >
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <form onSubmit={handleSave}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
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
                          className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                          type="button"
                          disabled={saving}
                        >
                          <X className="w-4 h-4" />
                          Bekor qilish
                        </motion.button>
                      </div>
                    )}
                  </div>
                  {success && <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-400 text-sm">{success}</div>}
                  {error && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">{error}</div>}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Foydalanuvchi nomi
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={editedProfile.username}
                          onChange={(e) => handleInputChange('username', e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${fieldErrors.username ? 'border-red-500' : ''}`}
                          placeholder="Foydalanuvchi nomi"
                          disabled={!isEditing}
                        />
                        {fieldErrors.username && <div className="text-red-500 text-xs mt-1">{fieldErrors.username}</div>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Ism
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={editedProfile.first_name || ''}
                          onChange={(e) => handleInputChange('first_name', e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${fieldErrors.first_name ? 'border-red-500' : ''}`}
                          placeholder="Ism"
                          disabled={!isEditing}
                        />
                        {fieldErrors.first_name && <div className="text-red-500 text-xs mt-1">{fieldErrors.first_name}</div>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Familiya
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={editedProfile.last_name || ''}
                          onChange={(e) => handleInputChange('last_name', e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${fieldErrors.last_name ? 'border-red-500' : ''}`}
                          placeholder="Familiya"
                          disabled={!isEditing}
                        />
                        {fieldErrors.last_name && <div className="text-red-500 text-xs mt-1">{fieldErrors.last_name}</div>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={editedProfile.email}
                          disabled
                          className="w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400"
                          placeholder="Email"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Telefon
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          value={editedProfile.phone || ''}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${fieldErrors.phone ? 'border-red-500' : ''}`}
                          placeholder="Telefon raqam"
                          disabled={!isEditing}
                        />
                        {fieldErrors.phone && <div className="text-red-500 text-xs mt-1">{fieldErrors.phone}</div>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tug'ilgan sana
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={editedProfile.birth_date || ''}
                          onChange={(e) => handleInputChange('birth_date', e.target.value)}
                          className={`w-full pl-4 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${fieldErrors.birth_date ? 'border-red-500' : ''}`}
                          placeholder="YYYY-MM-DD"
                          disabled={!isEditing}
                        />
                        {fieldErrors.birth_date && <div className="text-red-500 text-xs mt-1">{fieldErrors.birth_date}</div>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Manzil
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={editedProfile.address || ''}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${fieldErrors.address ? 'border-red-500' : ''}`}
                          placeholder="Manzil"
                          disabled={!isEditing}
                        />
                        {fieldErrors.address && <div className="text-red-500 text-xs mt-1">{fieldErrors.address}</div>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Telegram
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={editedProfile.telegram || ''}
                          onChange={(e) => handleInputChange('telegram', e.target.value)}
                          className={`w-full pl-4 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${fieldErrors.telegram ? 'border-red-500' : ''}`}
                          placeholder="@username"
                          disabled={!isEditing}
                        />
                        {fieldErrors.telegram && <div className="text-red-500 text-xs mt-1">{fieldErrors.telegram}</div>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bio
                      </label>
                      <div className="relative">
                        <textarea
                          value={editedProfile.bio || ''}
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                          className={`w-full pl-4 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${fieldErrors.bio ? 'border-red-500' : ''}`}
                          placeholder="O'zingiz haqida qisqacha ma'lumot"
                          disabled={!isEditing}
                          rows={3}
                        />
                        {fieldErrors.bio && <div className="text-red-500 text-xs mt-1">{fieldErrors.bio}</div>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Parol (ixtiyoriy)
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${fieldErrors.password ? 'border-red-500' : ''}`}
                          placeholder="Yangi parol (ixtiyoriy)"
                          disabled={!isEditing}
                        />
                        {fieldErrors.password && <div className="text-red-500 text-xs mt-1">{fieldErrors.password}</div>}
                      </div>
                    </div>
                  </div>
                </form>
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