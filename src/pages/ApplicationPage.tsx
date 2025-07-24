import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Phone, GraduationCap, CheckCircle, AlertCircle, MapPin, FileText, MessageSquare, Building, Upload, X } from 'lucide-react';
import { PageType } from '../App';
import { User as UserType } from '../types';
import Header from '../components/Header';
import { authAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface ApplicationPageProps {
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
  document?: File | null;
  passport_image_first?: File | null;
  passport_image_second?: File | null;
}

const ApplicationPage: React.FC<ApplicationPageProps> = ({ onNavigate, user: propUser }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // Debug logging
  console.log('ApplicationPage - isAuthenticated:', isAuthenticated);
  console.log('ApplicationPage - user:', user);
  console.log('ApplicationPage - isLoading:', isLoading);
  const [formData, setFormData] = useState<ApplicationFormData>({
    name: user?.first_name || '',
    fio: `${user?.first_name || ''} ${user?.last_name || ''}`.trim(),
    city: '',
    village: '',
    university: '',
    phone: user?.phone || '',
    passport: '',
    comment: '',
    document: null,
    passport_image_first: null,
    passport_image_second: null
  });
  
  const [provinces, setProvinces] = useState<{ id: number; name: string }[]>([]);
  const [districts, setDistricts] = useState<{ id: number; name: string; province: number }[]>([]);
  const [dormitories, setDormitories] = useState<any[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null);
  const [selectedDormitoryId, setSelectedDormitoryId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.first_name || '',
        fio: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
        phone: user.phone || '',
      }));
    }
  }, [user]);

  // API dan viloyatlar va yotoqxonalar ro'yxatini yuklash
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [provincesData, dormitoriesData] = await Promise.all([
          authAPI.getProvinces(),
          authAPI.getDormitories()
        ]);
        setProvinces(provincesData);
        setDormitories(dormitoriesData);
      } catch (error) {
        console.error('Ma\'lumotlar yuklanmadi:', error);
      }
    };
    fetchData();
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

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  // Authentication check
  if (!isAuthenticated || !user || !user.id) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Tizimga kirish talab etiladi
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Ariza yuborish uchun avval tizimga kirishingiz kerak
          </p>
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

  const handleInputChange = (field: keyof ApplicationFormData, value: string | File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (field: keyof ApplicationFormData, file: File | null) => {
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, [field]: 'Fayl hajmi 5MB dan oshmasligi kerak' }));
        return;
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, [field]: 'Faqat JPG, PNG yoki PDF fayllar qabul qilinadi' }));
        return;
      }
    }
    
    handleInputChange(field, file);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!selectedDormitoryId) newErrors.dormitory = 'Yotoqxona tanlanishi shart';
    if (!formData.name.trim()) newErrors.name = 'Ism kiritilishi shart';
    if (!formData.fio.trim()) newErrors.fio = 'F.I.O kiritilishi shart';
    if (!formData.city.trim()) newErrors.city = 'Viloyat tanlanishi shart';
    if (!formData.village.trim()) newErrors.village = 'Tuman tanlanishi shart';
    if (!formData.university.trim()) newErrors.university = 'Universitet kiritilishi shart';
    if (!formData.phone.trim()) newErrors.phone = 'Telefon raqam kiritilishi shart';
    if (!formData.passport.trim()) newErrors.passport = 'Pasport raqami kiritilishi shart';

    // Phone validation
    const phoneNumbers = formData.phone.replace(/\D/g, '');
    if (formData.phone && (phoneNumbers.length < 9 || phoneNumbers.length > 12)) {
      newErrors.phone = 'Telefon raqam 9-12 raqamdan iborat bo\'lishi kerak';
    }

    // Passport validation
    const passportNumbers = formData.passport.replace(/\D/g, '');
    if (formData.passport && (passportNumbers.length < 8 || passportNumbers.length > 10)) {
      newErrors.passport = 'Pasport raqami 8-10 raqamdan iborat bo\'lishi kerak';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const phoneNumber = formData.phone.replace(/\D/g, '');
      const passportNumber = formData.passport.replace(/\D/g, '');
      
      if (!phoneNumber || phoneNumber.length < 9) {
        setErrors({ phone: 'Telefon raqam noto\'g\'ri formatda' });
        setIsSubmitting(false);
        return;
      }
      
      if (!passportNumber || passportNumber.length < 8) {
        setErrors({ passport: 'Pasport raqami noto\'g\'ri formatda' });
        setIsSubmitting(false);
        return;
      }

      if (!selectedDormitoryId) {
        setErrors({ general: 'Yotoqxona tanlanishi shart.' });
        setIsSubmitting(false);
        return;
      }

      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Add required fields
      formDataToSend.append('user', user.id.toString());
      formDataToSend.append('dormitory', selectedDormitoryId.toString());
      formDataToSend.append('room', '0');
      formDataToSend.append('status', 'PENDING');
      formDataToSend.append('comment', formData.comment.trim() || '');
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('fio', formData.fio.trim());
      formDataToSend.append('city', formData.city.trim());
      formDataToSend.append('village', formData.village.trim());
      formDataToSend.append('university', formData.university.trim());
      formDataToSend.append('phone', phoneNumber);
      formDataToSend.append('passport', passportNumber);
      
      // Add files if they exist
      if (formData.document) {
        formDataToSend.append('document', formData.document);
      }
      if (formData.passport_image_first) {
        formDataToSend.append('passport_image_first', formData.passport_image_first);
      }
      if (formData.passport_image_second) {
        formDataToSend.append('passport_image_second', formData.passport_image_second);
      }

      // Submit with FormData
      const response = await fetch('https://joyboryangi.pythonanywhere.com/application/create/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access') || localStorage.getItem('access_token')}`,
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(JSON.stringify(errorData));
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        onNavigate('dashboard');
      }, 3000);
      
    } catch (error: any) {
      console.error('Ariza yuborishda xatolik:', error);
      let errorMessage = 'Ariza yuborishda xatolik yuz berdi. Qaytadan urinib ko\'ring.';
      
      try {
        const errorData = JSON.parse(error.message);
        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (typeof errorData === 'object') {
          const firstError = Object.values(errorData)[0];
          if (Array.isArray(firstError)) {
            errorMessage = firstError[0];
          } else {
            errorMessage = firstError as string;
          }
        }
      } catch {
        errorMessage = error.message || errorMessage;
      }
      
      setErrors({ general: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header onNavigate={onNavigate} />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center"
          >
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ariza Muvaffaqiyatli Yuborildi!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Sizning arizangiz ko'rib chiqilmoqda.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Tez orada javob oling va keyingi qadamlar haqida xabar oling.
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
      <Header onNavigate={onNavigate} />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigate('dormitories')}
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
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Yotoqxona Uchun Ariza
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Barcha maydonlarni to'ldiring va kerakli hujjatlarni yuklang
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
            >
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <User className="w-6 h-6 text-teal-600" />
                Ariza Ma'lumotlari
              </h2>
              
              {errors.general && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <p className="text-red-700 dark:text-red-300">{errors.general}</p>
                  </div>
                </motion.div>
              )}
              
              <div className="space-y-6">
                {/* Dormitory Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Yotoqxona <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={selectedDormitoryId}
                      onChange={(e) => setSelectedDormitoryId(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                        errors.dormitory ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Yotoqxonani tanlang</option>
                      {dormitories.map((dormitory) => (
                        <option key={dormitory.id} value={dormitory.id}>
                          {dormitory.name} - {dormitory.university.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.dormitory && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.dormitory}
                    </p>
                  )}
                </div>

                {/* Name and FIO */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Ism <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Aziz"
                      />
                    </div>
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      F.I.O <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.fio}
                        onChange={(e) => handleInputChange('fio', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                          errors.fio ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Karimov Aziz Akmalovich"
                      />
                    </div>
                    {errors.fio && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.fio}
                      </p>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Viloyat <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        value={formData.city}
                        onChange={(e) => {
                          const selectedProvince = provinces.find(p => p.name === e.target.value);
                          handleInputChange('city', e.target.value);
                          setSelectedProvinceId(selectedProvince ? selectedProvince.id : null);
                          handleInputChange('village', '');
                        }}
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                          errors.city ? 'border-red-500' : 'border-gray-300'
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
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.city}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Tuman/Shahar <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        value={formData.village}
                        onChange={(e) => handleInputChange('village', e.target.value)}
                        disabled={!selectedProvinceId || districts.length === 0}
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
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
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.village}
                      </p>
                    )}
                  </div>
                </div>

                {/* University */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Universitet <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.university}
                      onChange={(e) => handleInputChange('university', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                        errors.university ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="TATU"
                    />
                  </div>
                  {errors.university && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.university}
                    </p>
                  )}
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Telefon Raqam <span className="text-red-500">*</span>
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
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="998901234567"
                        maxLength={12}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Pasport Raqami <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.passport}
                        onChange={(e) => handleInputChange('passport', e.target.value.replace(/\D/g, ''))}
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                          errors.passport ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="123456789"
                        maxLength={10}
                      />
                    </div>
                    {errors.passport && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.passport}
                      </p>
                    )}
                  </div>
                </div>

                {/* File Uploads */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Upload className="w-5 h-5 text-teal-600" />
                    Hujjatlar (Ixtiyoriy)
                  </h3>

                  {/* Document Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Qo'shimcha Hujjat
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-teal-500 transition-colors duration-200">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload('document', e.target.files?.[0] || null)}
                        className="hidden"
                        id="document-upload"
                      />
                      <label htmlFor="document-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600 dark:text-gray-300">
                          {formData.document ? formData.document.name : 'Hujjat yuklash uchun bosing'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max: 5MB)</p>
                      </label>
                      {formData.document && (
                        <button
                          onClick={() => handleFileUpload('document', null)}
                          className="mt-2 text-red-500 hover:text-red-700 flex items-center gap-1 mx-auto"
                        >
                          <X className="w-4 h-4" />
                          O'chirish
                        </button>
                      )}
                    </div>
                    {errors.document && (
                      <p className="text-red-500 text-sm mt-1">{errors.document}</p>
                    )}
                  </div>

                  {/* Passport Images */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Pasport (1-bet)
                      </label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 text-center hover:border-teal-500 transition-colors duration-200">
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload('passport_image_first', e.target.files?.[0] || null)}
                          className="hidden"
                          id="passport-first-upload"
                        />
                        <label htmlFor="passport-first-upload" className="cursor-pointer">
                          <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {formData.passport_image_first ? formData.passport_image_first.name : 'Rasm yuklash'}
                          </p>
                        </label>
                        {formData.passport_image_first && (
                          <button
                            onClick={() => handleFileUpload('passport_image_first', null)}
                            className="mt-2 text-red-500 hover:text-red-700 flex items-center gap-1 mx-auto"
                          >
                            <X className="w-4 h-4" />
                            O'chirish
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Pasport (2-bet)
                      </label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 text-center hover:border-teal-500 transition-colors duration-200">
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload('passport_image_second', e.target.files?.[0] || null)}
                          className="hidden"
                          id="passport-second-upload"
                        />
                        <label htmlFor="passport-second-upload" className="cursor-pointer">
                          <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {formData.passport_image_second ? formData.passport_image_second.name : 'Rasm yuklash'}
                          </p>
                        </label>
                        {formData.passport_image_second && (
                          <button
                            onClick={() => handleFileUpload('passport_image_second', null)}
                            className="mt-2 text-red-500 hover:text-red-700 flex items-center gap-1 mx-auto"
                          >
                            <X className="w-4 h-4" />
                            O'chirish
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Qo'shimcha Izoh
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      value={formData.comment}
                      onChange={(e) => handleInputChange('comment', e.target.value)}
                      rows={4}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 dark:bg-gray-700 dark:text-white resize-none"
                      placeholder="Maxsus talablar yoki qo'shimcha ma'lumotlar..."
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-teal-600 to-green-600 text-white py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Yuborilmoqda...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-6 h-6" />
                        Ariza Yuborish
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sticky top-8"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Building className="w-5 h-5 text-teal-600" />
                Ariza Ma'lumotlari
              </h3>
              
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Avtomatik Belgilanadigan:
                  </h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <li>• Foydalanuvchi: {user?.first_name} {user?.last_name}</li>
                    <li>• Xona: Avtomatik</li>
                    <li>• Holat: Kutilmoqda</li>
                  </ul>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Siz To'ldirasiz:
                  </h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Yotoqxona tanlash</li>
                    <li>• Shaxsiy ma'lumotlar</li>
                    <li>• Manzil (viloyat/tuman)</li>
                    <li>• Aloqa ma'lumotlari</li>
                    <li>• Hujjatlar (ixtiyoriy)</li>
                    <li>• Qo'shimcha izohlar</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
                  <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                    Eslatma:
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Barcha majburiy maydonlar (*) to'ldirilishi shart. 
                    Hujjatlar ixtiyoriy, lekin arizangizni tezroq ko'rib chiqish uchun tavsiya etiladi.
                  </p>
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