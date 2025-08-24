import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, CheckCircle, AlertCircle, MapPin, FileText, MessageSquare, Building, Upload, X, Users, Clock } from 'lucide-react';
import Header from '../components/Header';
import { authAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { getGlobalSelectedListing } from '../App';
import { Dormitory } from '../types';

interface ApplicationFormData {
  name: string;
  middle_name: string;
  familiya: string;
  city: string;
  village: string;
  phone: string;
  passport: string;
  faculty: string;
  direction: string;
  course: string;
  group: string;
  user_image?: File | null;
  comment: string;
  document?: File | null;
  passport_image_first?: File | null;
  passport_image_second?: File | null;
}

const ApplicationPage: React.FC = () => {
  const navigate = useNavigate();
  const selectedListing = getGlobalSelectedListing();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { theme } = useTheme();

  // Sahifa yuklanganda yuqoriga scroll qilish
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [formData, setFormData] = useState<ApplicationFormData>({
    name: user?.first_name || '',
    middle_name: '',
    familiya: user?.last_name || '',
    city: '',
    village: '',
    phone: user?.phone || '',
    passport: '',
    faculty: '',
    direction: '',
    course: '',
    group: '',
    user_image: null,
    comment: '',
    document: null,
    passport_image_first: null,
    passport_image_second: null
  });

  const [provinces, setProvinces] = useState<{ id: number; name: string }[]>([]);
  const [districts, setDistricts] = useState<{ id: number; name: string; province: number }[]>([]);
  const [dormitories, setDormitories] = useState<Dormitory[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null);
  const [selectedDormitoryId, setSelectedDormitoryId] = useState<string>(selectedListing?.id || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Debug logging (development only)
  if (process.env.NODE_ENV === 'development') {
    console.log('ApplicationPage - isAuthenticated:', isAuthenticated);
    console.log('ApplicationPage - selectedListing:', selectedListing);
  }

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user?.first_name || '',
        familiya: user?.last_name || '',
        phone: user?.phone || '',
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
  if (!isAuthenticated || !user || !user?.id) {
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
            onClick={() => navigate('/login')}
            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors duration-200"
          >
            Tizimga kirish
          </button>
        </div>
      </div>
    );
  }

  // Pasport raqami validatsiya funksiyasi
  const validatePassportFormat = (passport: string): boolean => {
    // O'zbekiston pasport formati: 2 ta harf + 7 ta raqam (masalan: AA1234567)
    const passportRegex = /^[A-Z]{2}\d{7}$/;
    return passportRegex.test(passport);
  };

  const handlePassportChange = (value: string) => {
    // Faqat lotin harflari va raqamlarni qabul qilish
    const cleanValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');

    // Format bo'yicha tekshirish va to'g'rilash
    let formattedValue = '';
    for (let i = 0; i < cleanValue.length && i < 9; i++) {
      const char = cleanValue[i];
      if (i < 2) {
        // Birinchi 2 ta belgi faqat harflar bo'lishi kerak
        if (/[A-Z]/.test(char)) {
          formattedValue += char;
        }
      } else {
        // Keyingi 7 ta belgi faqat raqamlar bo'lishi kerak
        if (/[0-9]/.test(char)) {
          formattedValue += char;
        }
      }
    }

    setFormData(prev => ({
      ...prev,
      passport: formattedValue
    }));

    // Real-time validatsiya
    if (formattedValue.length > 0) {
      if (formattedValue.length < 2) {
        setErrors(prev => ({ ...prev, passport: 'Avval 2 ta harf kiriting (masalan: AA)' }));
      } else if (formattedValue.length < 9) {
        const remainingChars = 9 - formattedValue.length;
        const needLetters = Math.max(0, 2 - formattedValue.replace(/[0-9]/g, '').length);
        const needNumbers = Math.max(0, 7 - formattedValue.replace(/[A-Z]/g, '').length);

        if (needLetters > 0) {
          setErrors(prev => ({ ...prev, passport: `Yana ${needLetters} ta harf kerak` }));
        } else if (needNumbers > 0) {
          setErrors(prev => ({ ...prev, passport: `Yana ${needNumbers} ta raqam kerak` }));
        } else {
          setErrors(prev => ({ ...prev, passport: `Yana ${remainingChars} ta belgi kerak` }));
        }
      } else if (!validatePassportFormat(formattedValue)) {
        setErrors(prev => ({ ...prev, passport: 'Pasport formati: 2 ta harf + 7 ta raqam (AA1234567)' }));
      } else {
        setErrors(prev => ({ ...prev, passport: '' }));
      }
    } else {
      setErrors(prev => ({ ...prev, passport: '' }));
    }
  };

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

    // Required fields validation (schema bo'yicha faqat name, dormitory, province, district, course majburiy)
    if (!selectedListing) {
      newErrors.general = 'Yotoqxona tanlanmagan. Iltimos, yotoqxona sahifasiga qayting va ariza yuborish tugmasini bosing.';
    }
    if (!formData.name?.trim()) {
      newErrors.name = 'Ism kiritilishi shart';
    }
    if (!formData.city?.trim()) {
      newErrors.city = 'Viloyat tanlanishi shart';
    }
    if (!formData.village?.trim()) {
      newErrors.village = 'Tuman tanlanishi shart';
    }
    if (!formData.course?.trim()) {
      newErrors.course = 'Kurs tanlanishi shart';
    }
    // user_image ixtiyoriy
    
    // Optional fields - faqat format tekshiruvi

    // Phone validation
    if (formData.phone) {
      const phoneNumbers = formData.phone.replace(/\D/g, '');
      if (phoneNumbers.length !== 12) {
        newErrors.phone = 'Telefon raqam 12 ta raqamdan iborat bo\'lishi kerak (998901234567)';
      } else if (!phoneNumbers.startsWith('998')) {
        newErrors.phone = 'Telefon raqam 998 bilan boshlanishi kerak';
      }
    }

    // Passport validation
    if (formData.passport) {
      if (formData.passport.length !== 9) {
        newErrors.passport = 'Pasport raqami 9 ta belgidan iborat bo\'lishi kerak (2 harf + 7 raqam)';
      } else if (!validatePassportFormat(formData.passport)) {
        newErrors.passport = 'Pasport formati noto\'g\'ri. To\'g\'ri format: AA1234567';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    // User authentication tekshiruvi
    if (!user || !user.id) {
      setErrors({ general: 'Foydalanuvchi ma\'lumotlari topilmadi. Iltimos, qaytadan tizimga kiring.' });
      return;
    }

    setIsSubmitting(true);

    try {
      // Telefon raqam validatsiyasi (agar kiritilgan bo'lsa)
      let phoneInt: number | undefined;
      if (formData.phone && formData.phone.trim()) {
        const phoneNumber = formData.phone.replace(/\D/g, '');
        if (phoneNumber.length !== 12 || !phoneNumber.startsWith('998')) {
          setErrors({ phone: 'Telefon raqam noto\'g\'ri formatda. To\'g\'ri format: 998901234567' });
          setIsSubmitting(false);
          return;
        }
        phoneInt = parseInt(phoneNumber);
        if (isNaN(phoneInt)) {
          setErrors({ phone: 'Telefon raqam noto\'g\'ri formatda' });
          setIsSubmitting(false);
          return;
        }
      }

      // Pasport validatsiyasi (agar kiritilgan bo'lsa)
      if (formData.passport && formData.passport.trim() && !validatePassportFormat(formData.passport)) {
        setErrors({ passport: 'Pasport raqami noto\'g\'ri formatda. To\'g\'ri format: AA1234567' });
        setIsSubmitting(false);
        return;
      }

      if (!selectedListing) {
        setErrors({ general: 'Yotoqxona tanlanmagan. Iltimos, yotoqxona sahifasiga qayting va ariza yuborish tugmasini bosing.' });
        setIsSubmitting(false);
        return;
      }

      // Viloyat va tuman ID larini topish
      const selectedProvince = provinces.find(p => p.name === formData.city);
      const selectedDistrict = districts.find(d => d.name === formData.village);

      if (!selectedProvince) {
        setErrors({ city: 'Viloyat tanlanmagan yoki noto\'g\'ri' });
        setIsSubmitting(false);
        return;
      }

      if (!selectedDistrict) {
        setErrors({ village: 'Tuman tanlanmagan yoki noto\'g\'ri' });
        setIsSubmitting(false);
        return;
      }

      // Yotoqxona ID sini to'g'ri formatga o'tkazish
      let dormitoryId: number;
      if (typeof selectedListing.id === 'string') {
        if (selectedListing.id.startsWith('dorm-')) {
          dormitoryId = parseInt(selectedListing.id.replace('dorm-', ''));
        } else {
          dormitoryId = parseInt(selectedListing.id);
        }
      } else {
        dormitoryId = selectedListing.id;
      }

      // API endpoint orqali ariza yuborish
      const applicationData = {
        user: user?.id!,
        dormitory: dormitoryId,
        name: formData.name.trim(),
        last_name: formData.familiya?.trim() || undefined,
        middle_name: formData.middle_name?.trim() || undefined,
        province: selectedProvince.id,
        district: selectedDistrict.id,
        faculty: formData.faculty?.trim() || undefined,
        direction: formData.direction?.trim() || undefined,
        course: formData.course.trim(),
        group: formData.group?.trim() || undefined,
        phone: phoneInt,
        passport: formData.passport?.trim() || undefined,
        comment: formData.comment?.trim() || undefined,
        user_image: formData.user_image,
        document: formData.document,
        passport_image_first: formData.passport_image_first,
        passport_image_second: formData.passport_image_second,
      };

      if (process.env.NODE_ENV === 'development') {
        console.log('Yuborilayotgan ariza ma\'lumotlari:', applicationData);
        console.log('Selected Province:', selectedProvince);
        console.log('Selected District:', selectedDistrict);
        console.log('Dormitory ID:', dormitoryId);
        console.log('User ID:', user?.id);
      }

      // API orqali ariza yuborish
      const response = await authAPI.submitApplication(applicationData);

      if (process.env.NODE_ENV === 'development') {
        console.log('Ariza muvaffaqiyatli yuborildi:', response);
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);

    } catch (error: any) {
      console.error('Ariza yuborishda xatolik:', error);
      let errorMessage = 'Ariza yuborishda xatolik yuz berdi. Qaytadan urinib ko\'ring.';
      let fieldErrors: Record<string, string> = {};

      try {
        if (error.response?.data) {
          const errorData = error.response.data;
          
          // Agar server field-specific xatolarni qaytarsa
          if (typeof errorData === 'object' && !errorData.detail) {
            Object.keys(errorData).forEach(field => {
              const fieldError = errorData[field];
              if (Array.isArray(fieldError)) {
                fieldErrors[field] = fieldError[0];
              } else if (typeof fieldError === 'string') {
                fieldErrors[field] = fieldError;
              }
            });
            
            // Agar field xatolari bo'lsa, ularni ko'rsatish
            if (Object.keys(fieldErrors).length > 0) {
              setErrors(fieldErrors);
              setIsSubmitting(false);
              return;
            }
          }
          
          // Umumiy xato xabari
          if (errorData.detail) {
            errorMessage = errorData.detail;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else if (typeof errorData === 'string') {
            errorMessage = errorData;
          } else if (typeof errorData === 'object') {
            const firstError = Object.values(errorData)[0];
            if (Array.isArray(firstError)) {
              errorMessage = firstError[0];
            } else if (typeof firstError === 'string') {
              errorMessage = firstError;
            }
          }
        } else if (error.message) {
          errorMessage = error.message;
        }
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
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
        <Header />
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
              onClick={() => navigate('/dashboard')}
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
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dormitories')}
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
                {/* Selected Dormitory Display */}
                {selectedListing ? (
                  <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <Building className="w-6 h-6 text-teal-600" />
                      <div>
                        <h3 className="font-semibold text-teal-900 dark:text-teal-100">
                          Ariza Yuborilayotgan Yotoqxona
                        </h3>
                        <p className="text-teal-700 dark:text-teal-300">
                          {selectedListing.title}
                        </p>
                        {selectedListing.university && (
                          <p className="text-sm text-teal-700 dark:text-teal-400">
                            {selectedListing.university}
                          </p>
                        )}
                        <p className="text-xs text-teal-600 dark:text-teal-400 mt-1">
                          ✨ Bu yotoqxona uchun ariza yubormoqdasiz
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-6 h-6 text-red-600" />
                      <div>
                        <h3 className="font-semibold text-red-900 dark:text-red-100">
                          Xatolik
                        </h3>
                        <p className="text-red-700 dark:text-red-300">
                          Yotoqxona tanlanmagan. Iltimos, yotoqxona sahifasiga qayting va ariza yuborish tugmasini bosing.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Familiya, Name and Middle Name */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Familiya
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.familiya}
                        onChange={(e) => handleInputChange('familiya', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 ${theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                          } ${errors.familiya ? 'border-red-500' : ''}`}
                        placeholder="Karimov"
                      />
                    </div>
                    {errors.familiya && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.familiya}
                      </p>
                    )}
                  </div>

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
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 ${theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                          } ${errors.name ? 'border-red-500' : ''}`}
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
                      Otasining ismi
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.middle_name}
                        onChange={(e) => handleInputChange('middle_name', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 ${theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                          } ${errors.middle_name ? 'border-red-500' : ''}`}
                        placeholder="Akramovich"
                      />
                    </div>
                    {errors.middle_name && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.middle_name}
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
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 ${theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                          } ${errors.city ? 'border-red-500' : ''}`}
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
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 ${theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                          } ${errors.village ? 'border-red-500' : ''} ${(!selectedProvinceId || districts.length === 0) ? 'opacity-60 cursor-not-allowed' : ''}`}
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

                {/* Academic Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Building className="w-5 h-5 text-teal-600" />
                    O'quv Ma'lumotlari
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Faculty */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Fakultet
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.faculty}
                          onChange={(e) => handleInputChange('faculty', e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 ${theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                            } ${errors.faculty ? 'border-red-500' : ''}`}
                          placeholder="Kompyuter injiniringi"
                        />
                      </div>
                      {errors.faculty && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.faculty}
                        </p>
                      )}
                    </div>

                    {/* Direction */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Yo'nalish
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.direction}
                          onChange={(e) => handleInputChange('direction', e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 ${theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                            } ${errors.direction ? 'border-red-500' : ''}`}
                          placeholder="Dasturiy injiniring"
                        />
                      </div>
                      {errors.direction && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.direction}
                        </p>
                      )}
                    </div>

                    {/* Course */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Kurs <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          value={formData.course}
                          onChange={(e) => handleInputChange('course', e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 ${theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                            } ${errors.course ? 'border-red-500' : ''}`}
                        >
                          <option value="">Kursni tanlang</option>
                          <option value="1-kurs">1-kurs</option>
                          <option value="2-kurs">2-kurs</option>
                          <option value="3-kurs">3-kurs</option>
                          <option value="4-kurs">4-kurs</option>
                          <option value="5-kurs">5-kurs</option>
                        </select>
                      </div>
                      {errors.course && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.course}
                        </p>
                      )}
                    </div>

                    {/* Group */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Guruh
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.group}
                          onChange={(e) => handleInputChange('group', e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 ${theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                            } ${errors.group ? 'border-red-500' : ''}`}
                          placeholder="KI-21-01"
                        />
                      </div>
                      {errors.group && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.group}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Telefon Raqam
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '');

                          // O'zbekiston telefon raqami formatini to'g'rilash
                          if (value.startsWith('998') && value.length > 3) {
                            // 998 dan keyin 9 ta raqam bo'lishi kerak
                            if (value.length > 12) {
                              value = value.substring(0, 12);
                            }
                          } else if (value.startsWith('8') && value.length > 1) {
                            // 8 dan boshlansa, uni 998 ga o'zgartirish
                            value = '998' + value.substring(1);
                            if (value.length > 12) {
                              value = value.substring(0, 12);
                            }
                          } else if (value.startsWith('+') && value.length > 1) {
                            // + dan boshlansa, uni olib tashlash
                            value = value.substring(1);
                            if (value.length > 12) {
                              value = value.substring(0, 12);
                            }
                          }

                          handleInputChange('phone', value);
                        }}
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 ${theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                          } ${errors.phone ? 'border-red-500' : ''}`}
                        placeholder="998901234567"
                        maxLength={12}
                      />
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Format: 998901234567 yoki 8901234567
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
                      Pasport Raqami
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.passport}
                        onChange={(e) => handlePassportChange(e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 ${theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                          } ${errors.passport ? 'border-red-500' : ''}`}
                        placeholder="AA1234567"
                        maxLength={9}
                      />
                    </div>
                    {errors.passport && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.passport}
                      </p>
                    )}
                    {!errors.passport && formData.passport && formData.passport.length > 0 && (
                      <div className="mt-1">
                        {formData.passport.length < 9 ? (
                          <p className="text-yellow-600 text-xs flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {9 - formData.passport.length} ta belgi qoldi
                          </p>
                        ) : validatePassportFormat(formData.passport) ? (
                          <p className="text-green-600 text-xs flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            To'g'ri format
                          </p>
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>

                {/* User Image Upload */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-teal-600" />
                    O'zingizning Rasmingiz
                  </h3>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      O'zingizning Rasmingiz
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-teal-500 transition-colors duration-200">
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload('user_image', e.target.files?.[0] || null)}
                        className="hidden"
                        id="user-image-upload"
                      />
                      <label htmlFor="user-image-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600 dark:text-gray-300">
                          {formData.user_image ? formData.user_image.name : 'O\'zingizning rasmingizni yuklang'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">JPG, PNG (Max: 5MB)</p>
                      </label>
                      {formData.user_image && (
                        <button
                          onClick={() => handleFileUpload('user_image', null)}
                          className="mt-2 text-red-500 hover:text-red-700 flex items-center gap-1 mx-auto"
                        >
                          <X className="w-4 h-4" />
                          O'chirish
                        </button>
                      )}
                    </div>
                    {errors.user_image && (
                      <p className="text-red-500 text-sm mt-1">{errors.user_image}</p>
                    )}
                  </div>
                </div>

                {/* File Uploads */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Upload className="w-5 h-5 text-teal-600" />
                    Qo'shimcha Hujjatlar (Ixtiyoriy)
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
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 resize-none ${theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                        }`}
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
                {/* Tanlangan yotoqxona ma'lumotlari */}
                {selectedListing && (
                  <div className="bg-gradient-to-r from-teal-50 to-green-50 dark:from-teal-900/20 dark:to-green-900/20 border border-teal-200 dark:border-teal-800 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-green-600 rounded-full flex items-center justify-center">
                        <Building className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-teal-900 dark:text-teal-100">
                          {selectedListing.title}
                        </h4>
                        {selectedListing.university && (
                          <p className="text-sm text-teal-700 dark:text-teal-300">
                            {selectedListing.university}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                      <p className="text-xs text-teal-800 dark:text-teal-200 font-medium">
                        ✨ Siz ushbu yotoqxona uchun ariza yubormoqdasiz
                      </p>
                    </div>
                  </div>
                )}

                {/* Motivatsion xabar */}
                <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-xl">🎯</span>
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                      Muvaffaqiyatga Bir Qadam!
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      Har bir maydonni diqqat bilan to'ldiring. To'liq va aniq ma'lumotlar sizning arizangizni tezroq ko'rib chiqishga yordam beradi.
                    </p>
                  </div>
                </div>

                {/* Foydali maslahatlar */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm">💡</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-amber-900 dark:text-amber-100 mb-2">
                        Foydali Maslahatlar
                      </h4>
                      <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1">
                        <li>• Haqiqiy ma'lumotlarni kiriting</li>
                        <li>• Fakultet va yo'nalish ma'lumotlarini to'g'ri kiriting</li>
                        <li>• O'zingizning rasmingizni aniq tortib yuklang</li>
                        <li>• Telefon raqamingiz doim faol bo'lsin</li>
                        <li>• Hujjat rasmlarini aniq tortib yuklang</li>
                        <li>• Qo'shimcha izohda o'zingiz haqida yozing</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Qo'llab-quvvatlash */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-lg">🤝</span>
                    </div>
                    <h4 className="font-bold text-green-900 dark:text-green-100 mb-1">
                      Biz Sizga Yordam Beramiz!
                    </h4>
                    <p className="text-xs text-green-700 dark:text-green-300">
                      Savollaringiz bo'lsa, biz bilan bog'laning. Sizning muvaffaqiyatingiz - bizning maqsadimiz!
                    </p>
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