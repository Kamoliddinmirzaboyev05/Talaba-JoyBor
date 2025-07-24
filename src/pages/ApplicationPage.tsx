import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Phone, Mail, GraduationCap, CheckCircle, AlertCircle, MapPin, FileText, Building } from 'lucide-react';
import { PageType } from '../App';
import { User as UserType, Listing } from '../types';
import Header from '../components/Header';
import { authAPI } from '../services/api';

interface ApplicationPageProps {
  listing: Listing | null;
  onNavigate: (page: PageType) => void;
  user: UserType | null;
}

interface ApplicationFormData {
  name: string;
  fio: string;
  city: string;
  village: string;
  university: string;
  phone: string;
  passport: string;
  comment: string;
}

const ApplicationPage: React.FC<ApplicationPageProps> = ({ listing, onNavigate, user }) => {
  const [formData, setFormData] = useState<ApplicationFormData>({
    name: user?.name || '',
    fio: user?.name || '',
    city: '',
    village: '',
    university: user?.university || '',
    phone: user?.phone || '',
    passport: '',
    comment: ''
  });

  const [provinces, setProvinces] = useState<{ id: number; name: string }[]>([]);
  const [districts, setDistricts] = useState<{ id: number; name: string; province: number }[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // API dan viloyatlar ro'yxatini yuklash
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const data = await authAPI.getProvinces();
        setProvinces(data);
      } catch (error) {
        console.error('Viloyatlar yuklanmadi:', error);
      }
    };
    fetchProvinces();
  }, []);
  
  // Tanlangan viloyat o'zgarganda tumanlarni yuklash
  useEffect(() => {
    if (selectedProvinceId) {
      const fetchDistricts = async () => {
        try {
          const data = await authAPI.getDistricts(selectedProvinceId);
          setDistricts(data);
        } catch (error) {
          console.error('Tumanlar yuklanmadi:', error);
          setDistricts([]);
        }
      };
      fetchDistricts();
    } else {
      setDistricts([]);
    }
  }, [selectedProvinceId]);

  if (!listing || !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {!user ? 'Tizimga kirish talab etiladi' : 'Elon topilmadi'}
          </h2>
          <button
            onClick={() => onNavigate(!user ? 'login' : 'home')}
            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors duration-200"
          >
            {!user ? 'Tizimga kirish' : 'Bosh sahifaga qaytish'}
          </button>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: keyof ApplicationFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Ism kiritilishi shart';
    if (!formData.fio.trim()) newErrors.fio = 'F.I.O kiritilishi shart';
    if (!formData.city.trim()) newErrors.city = 'Shahar tanlanishi shart';
    if (!formData.village.trim()) newErrors.village = 'Tuman/Shahar kiritilishi shart';
    if (!formData.university.trim()) newErrors.university = 'Universitet kiritilishi shart';
    if (!formData.phone.trim()) newErrors.phone = 'Telefon raqam kiritilishi shart';
    if (!formData.passport.trim()) newErrors.passport = 'Pasport seriya raqami kiritilishi shart';

    // Phone validation - faqat raqamlar
    const phoneNumbers = formData.phone.replace(/\D/g, '');
    if (formData.phone && (phoneNumbers.length < 9 || phoneNumbers.length > 12)) {
      newErrors.phone = 'Telefon raqam 9-12 raqamdan iborat bo\'lishi kerak';
    }

    // Passport validation - faqat raqamlar
    if (formData.passport && !/^[0-9]+$/.test(formData.passport.replace(/\s/g, ''))) {
      newErrors.passport = 'Pasport raqami faqat raqamlardan iborat bo\'lishi kerak';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Telefon va pasport raqamlarini to'g'ri formatda tayyorlash
      const phoneNumber = formData.phone.replace(/\D/g, '');
      const passportNumber = formData.passport.replace(/\D/g, '');

      // API ga yuborish uchun ma'lumotlarni tayyorlash
      const applicationData = {
        user: Number(user.id),
        dormitory: Number(listing.id), // listing ID ni dormitory sifatida ishlatamiz
        room: 0, // Default room, keyinchalik tanlash mumkin
        status: 'PENDING',
        comment: formData.comment || '',
        name: formData.name,
        fio: formData.fio,
        city: formData.city,
        village: formData.village,
        university: formData.university,
        phone: Number(phoneNumber), // Faqat raqamlar
        passport: Number(passportNumber) // Faqat raqamlar
      };

      // API orqali arizani yuborish
      await authAPI.submitApplication(applicationData);

      // Muvaffaqiyatli yuborilganda
      setSubmitSuccess(true);

      // 2 soniyadan keyin dashboard ga yo'naltirish
      setTimeout(() => {
        onNavigate('dashboard');
      }, 2000);

    } catch (error) {
      console.error('Ariza yuborishda xatolik:', error);
      setErrors({ general: 'Ariza yuborishda xatolik yuz berdi. Qaytadan urinib ko\'ring.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m';
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header user={user} onNavigate={onNavigate} />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center"
          >
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ariza Muvaffaqiyatli Yuborildi!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Sizning arizangiz ko'rib chiqilmoqda. Tez orada javob oling.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('dashboard')}
              className="bg-gradient-to-r from-teal-600 to-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              Dashboard ga o'tish
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header user={user} onNavigate={onNavigate} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigate('listing-detail')}
          className="flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          Orqaga
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Ariza Yuborish
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {listing.title} uchun ariza to'ldiring
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Shaxsiy Ma'lumotlar
              </h2>

              {errors.general && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <p className="text-red-700 dark:text-red-300">{errors.general}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ism *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Aziz"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* FIO */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    F.I.O *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.fio}
                      onChange={(e) => handleInputChange('fio', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.fio ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Karimov Aziz Akmalovich"
                    />
                  </div>
                  {errors.fio && (
                    <p className="text-red-500 text-sm mt-1">{errors.fio}</p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Viloyat *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={formData.city}
                      onChange={(e) => {
                        const selectedProvince = provinces.find(p => p.name === e.target.value);
                        handleInputChange('city', e.target.value);
                        setSelectedProvinceId(selectedProvince ? selectedProvince.id : null);
                        // Tuman qiymatini tozalash
                        handleInputChange('village', '');
                      }}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                    >
                      <option value="">Viloyatni tanlang</option>
                      {provinces.map((province) => (
                        <option key={province.id} value={province.name}>
                          {province.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>

                {/* Village */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tuman/Shahar *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={formData.village}
                      onChange={(e) => handleInputChange('village', e.target.value)}
                      disabled={!selectedProvinceId || districts.length === 0}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                        errors.village ? 'border-red-500' : 'border-gray-300'
                      } ${(!selectedProvinceId || districts.length === 0) ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      <option value="">
                        {!selectedProvinceId 
                          ? 'Avval viloyatni tanlang' 
                          : districts.length === 0 
                            ? 'Yuklanmoqda...' 
                            : 'Tumanni tanlang'}
                      </option>
                      {districts.map((district) => (
                        <option key={district.id} value={district.name}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.village && (
                    <p className="text-red-500 text-sm mt-1">{errors.village}</p>
                  )}
                </div>

                {/* University */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Universitet *
                  </label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.university}
                      onChange={(e) => handleInputChange('university', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.university ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="TATU"
                    />
                  </div>
                  {errors.university && (
                    <p className="text-red-500 text-sm mt-1">{errors.university}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Telefon Raqam *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        handleInputChange('phone', value);
                      }}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="998901234567"
                      maxLength={12}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Passport */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pasport Raqami *
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.passport}
                      onChange={(e) => handleInputChange('passport', e.target.value.replace(/\D/g, ''))}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.passport ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="1234567890"
                      maxLength={10}
                    />
                  </div>
                  {errors.passport && (
                    <p className="text-red-500 text-sm mt-1">{errors.passport}</p>
                  )}
                </div>
              </div>

              {/* Comment */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Qo'shimcha Izoh
                </label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => handleInputChange('comment', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:text-white resize-none"
                  placeholder="Maxsus talablar yoki qo'shimcha ma'lumotlar..."
                />
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-teal-600 to-green-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Yuborilmoqda...
                    </>
                  ) : (
                    'Ariza Yuborish'
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-8"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Ariza Xulosasi
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Elon:</span>
                  <span className="font-medium text-gray-900 dark:text-white text-right">
                    {listing.title}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Narx:</span>
                  <span className="font-semibold text-teal-600">
                    {formatPrice(listing.price)}/oy
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Joylashuv:</span>
                  <span className="font-medium text-gray-900 dark:text-white text-right">
                    {listing.location}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Sig'im:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {listing.capacity} kishi
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-900 dark:text-green-100 mb-1">
                        Ariza yuborilgandan so'ng
                      </h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        24 soat ichida javob oling va keyingi qadamlar haqida xabar oling
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationPage;