import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, GraduationCap, MapPin, Edit3, Save, X, Camera, Shield, Star } from 'lucide-react';
import { PageType } from '../App';
import { User as UserType } from '../types';
import Header from '../components/Header';

interface ProfilePageProps {
  user: UserType | null;
  onNavigate: (page: PageType) => void;
  onUserUpdate: (user: UserType) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onNavigate, onUserUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [activeTab, setActiveTab] = useState('profile');

  if (!user || !editedUser) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Tizimga kirish talab etiladi
          </h2>
          <button
            onClick={() => onNavigate('login')}
            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors duration-200"
          >
            Tizimga kirish
          </button>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    onUserUpdate(editedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setEditedUser(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handlePreferencesChange = (field: string, value: string | number | string[]) => {
    setEditedUser(prev => prev ? {
      ...prev,
      preferences: { ...prev.preferences, [field]: value }
    } : null);
  };

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'preferences', label: 'Afzalliklar', icon: MapPin },
    { id: 'applications', label: 'Arizalar', icon: GraduationCap },
    { id: 'security', label: 'Xavfsizlik', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header user={user} onNavigate={onNavigate} />
      
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
                  <div className="w-24 h-24 bg-gradient-to-r from-teal-600 to-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute bottom-0 right-0 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center hover:bg-teal-700 transition-colors duration-200"
                  >
                    <Camera className="w-4 h-4" />
                  </motion.button>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-3">
                  {user.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {user.university}
                </p>
                {user.isVerified && (
                  <div className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs">
                    <Shield className="w-3 h-3" />
                    Tasdiqlangan
                  </div>
                )}
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
                <div>
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
                      >
                        <Edit3 className="w-4 h-4" />
                        Tahrirlash
                      </motion.button>
                    ) : (
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleSave}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                        >
                          <Save className="w-4 h-4" />
                          Saqlash
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleCancel}
                          className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                          <X className="w-4 h-4" />
                          Bekor qilish
                        </motion.button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Ism Familiya
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={editedUser.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          disabled={!isEditing}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                            isEditing 
                              ? 'border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent' 
                              : 'border-gray-200 bg-gray-50 dark:bg-gray-700'
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Manzil
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={editedUser.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          disabled={!isEditing}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                            isEditing 
                              ? 'border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent' 
                              : 'border-gray-200 bg-gray-50 dark:bg-gray-700'
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Telefon Raqam
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          value={editedUser.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          disabled={!isEditing}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                            isEditing 
                              ? 'border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent' 
                              : 'border-gray-200 bg-gray-50 dark:bg-gray-700'
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Universitet
                      </label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={editedUser.university}
                          disabled
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 rounded-xl"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Talaba ID
                      </label>
                      <input
                        type="text"
                        value={editedUser.studentId}
                        disabled
                        className="w-full px-4 py-3 border border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                    Qidiruv Afzalliklari
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Maksimal Narx (so'm)
                      </label>
                      <input
                        type="number"
                        value={editedUser.preferences.maxPrice}
                        onChange={(e) => handlePreferencesChange('maxPrice', parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Xona Turi
                      </label>
                      <select
                        value={editedUser.preferences.roomType}
                        onChange={(e) => handlePreferencesChange('roomType', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="single">Yakka xona</option>
                        <option value="double">Ikki kishilik</option>
                        <option value="triple">Uch kishilik</option>
                        <option value="apartment">Kvartira</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Afzal Ko'rilgan Joylashuv
                      </label>
                      <input
                        type="text"
                        value={editedUser.preferences.location}
                        onChange={(e) => handlePreferencesChange('location', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:text-white"
                        placeholder="Masalan: Chilonzor, Yunusobod"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Kerakli Qulayliklar
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {['WiFi', 'Konditsioner', 'Oshxona', 'Parking', 'Xavfsizlik', 'Sport zali'].map((amenity) => (
                          <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editedUser.preferences.amenities.includes(amenity)}
                              onChange={(e) => {
                                const newAmenities = e.target.checked
                                  ? [...editedUser.preferences.amenities, amenity]
                                  : editedUser.preferences.amenities.filter(a => a !== amenity);
                                handlePreferencesChange('amenities', newAmenities);
                              }}
                              className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{amenity}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSave}
                      className="w-full bg-gradient-to-r from-teal-600 to-green-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                    >
                      Afzalliklarni Saqlash
                    </motion.button>
                  </div>
                </div>
              )}

              {/* Applications Tab */}
              {activeTab === 'applications' && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                    Mening Arizalarim
                  </h2>

                  {user.applications.length === 0 ? (
                    <div className="text-center py-12">
                      <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Hali arizalar yo'q
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Yotoqxona yoki ijara xonadoni topib, birinchi arizangizni yuboring
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onNavigate('home')}
                        className="bg-gradient-to-r from-teal-600 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                      >
                        Qidirishni Boshlash
                      </motion.button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {user.applications.map((application) => (
                        <div key={application.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {application.listingTitle}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              application.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                              application.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                              application.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                              'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                            }`}>
                              {application.status === 'approved' ? 'Tasdiqlangan' :
                               application.status === 'pending' ? 'Kutilmoqda' :
                               application.status === 'rejected' ? 'Rad etilgan' :
                               'Suhbat'}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600 dark:text-gray-300">Yuborilgan:</span>
                              <span className="ml-2 text-gray-900 dark:text-white">
                                {new Date(application.submittedAt).toLocaleDateString('uz-UZ')}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600 dark:text-gray-300">Yangilangan:</span>
                              <span className="ml-2 text-gray-900 dark:text-white">
                                {new Date(application.updatedAt).toLocaleDateString('uz-UZ')}
                              </span>
                            </div>
                          </div>
                          
                          {application.notes && (
                            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                <strong>Izoh:</strong> {application.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                    Xavfsizlik Sozlamalari
                  </h2>

                  <div className="space-y-6">
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Parolni O'zgartirish
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Joriy Parol
                          </label>
                          <input
                            type="password"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Yangi Parol
                          </label>
                          <input
                            type="password"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Parolni Tasdiqlang
                          </label>
                          <input
                            type="password"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-700 transition-colors duration-200"
                        >
                          Parolni Yangilash
                        </motion.button>
                      </div>
                    </div>

                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Hisobni Tasdiqlash
                      </h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600 dark:text-gray-300 mb-1">
                            Email tasdiqlash
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Email manzilingiz tasdiqlangan
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                          <Shield className="w-5 h-5" />
                          <span className="text-sm font-medium">Tasdiqlangan</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;