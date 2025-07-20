import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Moon, Sun, Bell, Shield, Globe, Smartphone, Mail, Lock, Eye, EyeOff, Save } from 'lucide-react';
import { PageType } from '../App';
import { User } from '../types';
import Header from '../components/Header';

interface SettingsPageProps {
  user: User | null;
  onNavigate: (page: PageType) => void;
  darkMode: boolean;
  onDarkModeToggle: (enabled: boolean) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ user, onNavigate, darkMode, onDarkModeToggle }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    applications: true,
    messages: true,
    marketing: false
  });
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showEmail: false,
    showPhone: false,
    allowMessages: true
  });
  const [language, setLanguage] = useState('uz');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  if (!user) {
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

  const tabs = [
    { id: 'general', label: 'Umumiy', icon: Settings },
    { id: 'notifications', label: 'Bildirishnomalar', icon: Bell },
    { id: 'privacy', label: 'Maxfiylik', icon: Shield },
    { id: 'security', label: 'Xavfsizlik', icon: Lock }
  ];

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = () => {
    // Here you would typically save settings to backend
    console.log('Saving settings...');
  };

  const handleChangePassword = () => {
    if (passwordData.new !== passwordData.confirm) {
      alert('Yangi parollar mos kelmaydi');
      return;
    }
    // Here you would typically change password
    console.log('Changing password...');
    setPasswordData({ current: '', new: '', confirm: '' });
  };

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
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Sozlamalar
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Hisobingiz va ilovangiz sozlamalarini boshqaring
              </p>
            </div>
          </div>
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
              {/* General Settings */}
              {activeTab === 'general' && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                    Umumiy Sozlamalar
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Dark Mode */}
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-yellow-100 text-yellow-600'}`}>
                          {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {darkMode ? "Qorong'u rejim" : "Kunduzgi rejim"}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {darkMode ? "Ko'zlaringizni himoya qilish uchun qorong'u mavzuni yoqing" : "Yorqin va qulay kunduzgi mavzuni yoqing"}
                          </p>
                        </div>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onDarkModeToggle(!darkMode)}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${darkMode ? 'bg-teal-600' : 'bg-gray-300'}`}
                      >
                        <motion.div
                          animate={{ x: darkMode ? 24 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                        />
                      </motion.button>
                    </div>

                    {/* Language */}
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                          <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            Til
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Ilova tilini tanlang
                          </p>
                        </div>
                      </div>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="uz">O'zbek tili</option>
                        <option value="ru">Русский язык</option>
                        <option value="en">English</option>
                      </select>
                    </div>

                    {/* Mobile App */}
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                          <Smartphone className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            Mobil ilova
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            JoyBor mobil ilovasini yuklab oling
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button className="flex-1 bg-black text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-800 transition-colors duration-200">
                          App Store
                        </button>
                        <button className="flex-1 bg-green-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-green-700 transition-colors duration-200">
                          Google Play
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Settings */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                    Bildirishnoma Sozlamalari
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Email Notifications */}
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                            <Mail className="w-5 h-5 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              Email bildirishnomalar
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              Muhim yangiliklar haqida email orqali xabar oling
                            </p>
                          </div>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleNotificationChange('email', !notifications.email)}
                          className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                            notifications.email ? 'bg-teal-600' : 'bg-gray-300'
                          }`}
                        >
                          <motion.div
                            animate={{ x: notifications.email ? 24 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                          />
                        </motion.button>
                      </div>
                    </div>

                    {/* Push Notifications */}
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                            <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              Push bildirishnomalar
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              Brauzer orqali tezkor bildirishnomalar oling
                            </p>
                          </div>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleNotificationChange('push', !notifications.push)}
                          className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                            notifications.push ? 'bg-teal-600' : 'bg-gray-300'
                          }`}
                        >
                          <motion.div
                            animate={{ x: notifications.push ? 24 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                          />
                        </motion.button>
                      </div>
                    </div>

                    {/* Specific Notifications */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        Maxsus bildirishnomalar
                      </h3>
                      
                      {[
                        { key: 'applications', label: 'Ariza holati', desc: 'Arizalaringiz holati haqida xabar oling' },
                        { key: 'messages', label: 'Yangi xabarlar', desc: 'Yangi xabarlar kelganda bildirishnoma oling' },
                        { key: 'marketing', label: 'Marketing xabarlari', desc: 'Maxsus takliflar va yangiliklar haqida' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {item.label}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {item.desc}
                            </p>
                          </div>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleNotificationChange(item.key, !notifications[item.key as keyof typeof notifications])}
                            className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
                              notifications[item.key as keyof typeof notifications] ? 'bg-teal-600' : 'bg-gray-300'
                            }`}
                          >
                            <motion.div
                              animate={{ x: notifications[item.key as keyof typeof notifications] ? 20 : 0 }}
                              transition={{ duration: 0.2 }}
                              className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-md"
                            />
                          </motion.button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Settings */}
              {activeTab === 'privacy' && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                    Maxfiylik Sozlamalari
                  </h2>
                  
                  <div className="space-y-6">
                    {[
                      { key: 'profileVisible', label: 'Profil ko\'rinishi', desc: 'Profilingiz boshqalar uchun ko\'rinadimi' },
                      { key: 'showEmail', label: 'Email ko\'rsatish', desc: 'Email manzilingiz profilida ko\'rinadimi' },
                      { key: 'showPhone', label: 'Telefon ko\'rsatish', desc: 'Telefon raqamingiz profilida ko\'rinadimi' },
                      { key: 'allowMessages', label: 'Xabar yuborishga ruxsat', desc: 'Boshqalar sizga xabar yubora oladimi' }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {item.label}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {item.desc}
                          </p>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePrivacyChange(item.key, !privacy[item.key as keyof typeof privacy])}
                          className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                            privacy[item.key as keyof typeof privacy] ? 'bg-teal-600' : 'bg-gray-300'
                          }`}
                        >
                          <motion.div
                            animate={{ x: privacy[item.key as keyof typeof privacy] ? 24 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                          />
                        </motion.button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                    Xavfsizlik Sozlamalari
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Change Password */}
                    <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Parolni O'zgartirish
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Joriy parol
                          </label>
                          <div className="relative">
                            <input
                              type={showCurrentPassword ? 'text' : 'password'}
                              value={passwordData.current}
                              onChange={(e) => handlePasswordChange('current', e.target.value)}
                              className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:text-white"
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                            >
                              {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Yangi parol
                          </label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? 'text' : 'password'}
                              value={passwordData.new}
                              onChange={(e) => handlePasswordChange('new', e.target.value)}
                              className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:text-white"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                            >
                              {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Parolni tasdiqlang
                          </label>
                          <input
                            type="password"
                            value={passwordData.confirm}
                            onChange={(e) => handlePasswordChange('confirm', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:text-white"
                          />
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleChangePassword}
                          className="bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-700 transition-colors duration-200 flex items-center gap-2"
                        >
                          <Lock className="w-4 h-4" />
                          Parolni Yangilash
                        </motion.button>
                      </div>
                    </div>

                    {/* Account Security */}
                    <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Hisob Xavfsizligi
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              Ikki bosqichli tasdiqlash
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              Hisobingizni qo'shimcha himoya qiling
                            </p>
                          </div>
                          <button className="px-4 py-2 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors duration-200">
                            Yoqish
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              Faol seanslar
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              Barcha qurilmalardagi faol seanslarni ko'ring
                            </p>
                          </div>
                          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                            Ko'rish
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="flex justify-end mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveSettings}
                  className="bg-gradient-to-r from-teal-600 to-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Sozlamalarni Saqlash
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;