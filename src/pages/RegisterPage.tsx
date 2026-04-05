import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, ArrowLeft, UserPlus, Check, X, Loader2, Phone } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';
import GoogleLoginButton from '../components/GoogleLoginButton';

const RegisterPage: React.FC = () => {
  const { theme } = useTheme();
  const { login } = useAuth();

  // Sahifa yuklanganda yuqoriga scroll qilish
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/dashboard';
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    phone: '+998 ',
    password: '',
    password2: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailability, setUsernameAvailability] = useState<{
    available: boolean;
    message: string;
  } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState('');

  // Username mavjudligini tekshirish
  useEffect(() => {
    const checkUsernameAvailability = async () => {
      const username = formData.username.trim();
      
      if (username.length < 3) {
        setUsernameAvailability(null);
        return;
      }

      setIsCheckingUsername(true);
      try {
        const result = await authAPI.checkUsername(username);
        setUsernameAvailability({
          available: result.available,
          message: result.message
        });
        
        if (!result.available) {
          setErrors(prev => ({ ...prev, username: result.message }));
        } else {
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.username;
            return newErrors;
          });
        }
      } catch (error) {
        // Silent error
      } finally {
        setIsCheckingUsername(false);
      }
    };

    const timeoutId = setTimeout(() => {
      checkUsernameAvailability();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.username]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setGeneralError('');

    // Frontend validation
    const newErrors: Record<string, string> = {};
    
    // Ism va familiya validatsiyasi
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'Ism kiritilishi shart';
    } else if (formData.first_name.trim().length < 2) {
      newErrors.first_name = 'Ism kamida 2 ta belgidan iborat bo\'lishi kerak';
    }
    
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Familiya kiritilishi shart';
    } else if (formData.last_name.trim().length < 2) {
      newErrors.last_name = 'Familiya kamida 2 ta belgidan iborat bo\'lishi kerak';
    }
    
    // Username validatsiyasi
    if (!formData.username.trim()) {
      newErrors.username = 'Foydalanuvchi nomi kiritilishi shart';
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'Foydalanuvchi nomi kamida 3 ta belgidan iborat bo\'lishi kerak';
    } else if (usernameAvailability && !usernameAvailability.available) {
      newErrors.username = usernameAvailability.message;
    }
    
    // Telefon raqami validatsiyasi
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (!formData.phone.trim() || formData.phone === '+998') {
      newErrors.phone = 'Telefon raqami kiritilishi shart';
    } else if (phoneDigits.length < 12) {
      newErrors.phone = 'Telefon raqami to\'liq kiritilmagan';
    }
    
    // Parol validatsiyasi
    if (!formData.password) {
      newErrors.password = 'Parol kiritilishi shart';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak';
    }
    
    // Parolni tasdiqlash
    if (!formData.password2) {
      newErrors.password2 = 'Parolni tasdiqlash shart';
    } else if (formData.password !== formData.password2) {
      newErrors.password2 = 'Parollar mos kelmaydi';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      // 1-qadam: Ro'yxatdan o'tish
      await authAPI.register({
        username: formData.username.trim(),
        password: formData.password,
        password2: formData.password2,
        phone: formData.phone.replace(/\s/g, ''),
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        role: 'student',
      });

      // 2-qadam: Darhol login qilish
      try {
        const loginData = await authAPI.login({
          username: formData.username.trim(),
          password: formData.password,
        });

        // Login funksiyasini chaqirish - bu user ma'lumotlarini yuklaydi
        // AuthContext already handles sessionStorage inside login, but we can pass it directly
        login(loginData.access, loginData.refresh);
        
        // Dashboard ga yo'naltirish
        navigate(from, { replace: true });
      } catch (loginError) {
        setGeneralError('Ro\'yxatdan o\'tish muvaffaqiyatli, lekin tizimga kirishda xatolik yuz berdi. Iltimos, login sahifasidan kiring.');
      }

    } catch (error: any) {
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Show field errors if available
        if (typeof errorData === 'object') {
          const fieldErrors: Record<string, string> = {};
          Object.keys(errorData).forEach((key) => {
            if (Array.isArray(errorData[key])) {
              // Xatolarni o'zbek tiliga tarjima qilish
              const errorMsg = errorData[key][0];
              if (errorMsg.includes('already exists')) {
                fieldErrors[key] = key === 'username' 
                  ? 'Bu foydalanuvchi nomi band' 
                  : key === 'phone' 
                  ? 'Bu telefon raqami allaqachon ro\'yxatdan o\'tgan' 
                  : errorMsg;
              } else {
                fieldErrors[key] = errorMsg;
              }
            } else if (typeof errorData[key] === 'string') {
              fieldErrors[key] = errorData[key];
            }
          });
          setErrors(fieldErrors);
          
          // Umumiy xato xabarini ko'rsatish
          if (Object.keys(fieldErrors).length > 0) {
            setGeneralError('Iltimos, xatolarni to\'g\'rilang');
          } else {
            setGeneralError(errorData.detail || 'Ro\'yhatdan o\'tishda xatolik yuz berdi');
          }
        } else {
          setGeneralError('Ro\'yhatdan o\'tishda xatolik yuz berdi');
        }
      } else {
        setGeneralError('Tarmoq xatosi yoki server ishlamayapti. Iltimos, qaytadan urinib ko\'ring.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Telefon raqamini formatlash (+998 00 000 00 00)
  const formatPhoneNumber = (value: string) => {
    // Faqat raqamlarni qoldirish
    const numbers = value.replace(/\D/g, '');
    
    // Agar +998 bilan boshlanmasa, qo'shish
    let formatted = '';
    if (numbers.startsWith('998')) {
      const parts = [
        '+998',
        numbers.substring(3, 5),
        numbers.substring(5, 8),
        numbers.substring(8, 10),
        numbers.substring(10, 12)
      ].filter(Boolean);
      
      if (parts.length > 1) {
        formatted = parts[0] + ' ' + parts.slice(1).join(' ');
      } else {
        formatted = parts[0] + ' ';
      }
    } else {
      formatted = '+998 ';
    }
    
    return formatted.trimEnd();
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'phone') {
      // Faqat raqamlar va bo'shliqlarni qoldirish
      let val = value;
      if (!val.startsWith('+998')) {
        val = '+998 ' + val.replace(/\D/g, '');
      }
      
      const numbers = val.replace(/\D/g, '');
      
      // Maksimal uzunlikni cheklash (998 + 9 ta raqam)
      if (numbers.length <= 12) {
        setFormData(prev => ({ ...prev, [field]: formatPhoneNumber(val) }));
      }
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const nextStep = () => {
    const step1Errors: Record<string, string> = {};
    if (currentStep === 1) {
      if (!formData.first_name.trim()) {
        step1Errors.first_name = 'Ism kiritilishi shart';
      } else if (formData.first_name.trim().length < 2) {
        step1Errors.first_name = 'Ism kamida 2 ta belgidan iborat bo\'lishi kerak';
      }
      
      if (!formData.last_name.trim()) {
        step1Errors.last_name = 'Familiya kiritilishi shart';
      } else if (formData.last_name.trim().length < 2) {
        step1Errors.last_name = 'Familiya kamida 2 ta belgidan iborat bo\'lishi kerak';
      }
      
      if (!formData.username.trim()) {
        step1Errors.username = 'Foydalanuvchi nomi kiritilishi shart';
      } else if (formData.username.trim().length < 3) {
        step1Errors.username = 'Foydalanuvchi nomi kamida 3 ta belgidan iborat bo\'lishi kerak';
      } else if (usernameAvailability && !usernameAvailability.available) {
        step1Errors.username = usernameAvailability.message;
      }
      
      // Telefon raqami validatsiyasi
      const phoneDigits = formData.phone.replace(/\D/g, '');
      if (!formData.phone.trim() || formData.phone === '+998') {
        step1Errors.phone = 'Telefon raqami kiritilishi shart';
      } else if (phoneDigits.length < 12) {
        step1Errors.phone = 'Telefon raqami to\'liq kiritilmagan';
      }
      
      if (Object.keys(step1Errors).length > 0) {
        setErrors(step1Errors);
        return;
      }
      setCurrentStep(2);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-16 h-16 bg-slate-900 dark:bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
          >
            <UserPlus className="w-8 h-8 text-white dark:text-slate-900" />
          </motion.div>
          
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Ro'yhatdan O'tish
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Hisobingizni yarating va yashash joyingizni toping
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {currentStep}/2 qadam
            </span>
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              {Math.round((currentStep / 2) * 100)}%
            </span>
          </div>
          <div className={`w-full rounded-full h-1.5 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`}>
            <motion.div
              initial={{ width: '50%' }}
              animate={{ width: `${(currentStep / 2) * 100}%` }}
              transition={{ duration: 0.3 }}
              className="bg-slate-900 dark:bg-white h-1.5 rounded-full"
            />
          </div>
        </div>

        {/* Registration Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-none p-8 border border-slate-100 dark:border-slate-700"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Error */}
            {generalError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-600 dark:text-rose-400 text-sm"
              >
                {generalError}
              </motion.div>
            )}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                {/* First Name Field */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Ism
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) => handleInputChange('first_name', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent transition-all duration-200 ${
                        theme === 'dark' 
                          ? 'bg-slate-900 border-slate-700 text-white' 
                          : 'bg-slate-50 border-slate-200 text-slate-900'
                      } ${errors.first_name ? 'border-rose-500' : ''}`}
                      placeholder="Aziz"
                    />
                  </div>
                  {errors.first_name && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-rose-500 text-xs mt-1 font-medium"
                    >
                      {errors.first_name}
                    </motion.p>
                  )}
                </div>

                {/* Last Name Field */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Familiya
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) => handleInputChange('last_name', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent transition-all duration-200 ${
                        theme === 'dark' 
                          ? 'bg-slate-900 border-slate-700 text-white' 
                          : 'bg-slate-50 border-slate-200 text-slate-900'
                      } ${errors.last_name ? 'border-rose-500' : ''}`}
                      placeholder="Karimov"
                    />
                  </div>
                  {errors.last_name && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-rose-500 text-xs mt-1 font-medium"
                    >
                      {errors.last_name}
                    </motion.p>
                  )}
                </div>

                {/* Username Field */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Foydalanuvchi Nomi
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className={`w-full pl-10 pr-10 py-3.5 border rounded-xl focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent transition-all duration-200 ${
                        theme === 'dark' 
                          ? 'bg-slate-900 border-slate-700 text-white' 
                          : 'bg-slate-50 border-slate-200 text-slate-900'
                      } ${
                        errors.username 
                          ? 'border-rose-500' 
                          : usernameAvailability?.available 
                            ? 'border-emerald-500' 
                            : ''
                      }`}
                      placeholder="aziz_karimov"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {isCheckingUsername ? (
                        <Loader2 className="w-5 h-5 text-slate-500 animate-spin" />
                      ) : usernameAvailability ? (
                        usernameAvailability.available ? (
                          <Check className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <X className="w-5 h-5 text-rose-500" />
                        )
                      ) : null}
                    </div>
                  </div>
                  {usernameAvailability && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`text-xs mt-1 font-medium ${usernameAvailability.available ? 'text-emerald-500' : 'text-rose-500'}`}
                    >
                      {usernameAvailability.message}
                    </motion.p>
                  )}
                  {errors.username && !usernameAvailability && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-rose-500 text-xs mt-1 font-medium"
                    >
                      {errors.username}
                    </motion.p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Telefon raqami
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent transition-all duration-200 ${
                        theme === 'dark' 
                          ? 'bg-slate-900 border-slate-700 text-white' 
                          : 'bg-slate-50 border-slate-200 text-slate-900'
                      } ${errors.phone ? 'border-rose-500' : ''}`}
                      placeholder="+998 00 000 00 00"
                    />
                  </div>
                  {errors.phone && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-rose-500 text-xs mt-1 font-medium"
                    >
                      {errors.phone}
                    </motion.p>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="button"
                  onClick={nextStep}
                  className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3.5 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all duration-300 shadow-xl shadow-slate-200 dark:shadow-none"
                >
                  Keyingi Qadam
                </motion.button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase tracking-widest font-semibold">
                    <span className="px-4 bg-white dark:bg-slate-800 text-gray-400">Yoki</span>
                  </div>
                </div>

                {/* Google Login */}
                <GoogleLoginButton text="Google orqali ro'yxatdan o'tish" />
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                {/* Password Field */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Parol
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`w-full pl-10 pr-12 py-3.5 border rounded-xl focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent transition-all duration-200 ${
                        theme === 'dark' 
                          ? 'bg-slate-900 border-slate-700 text-white' 
                          : 'bg-slate-50 border-slate-200 text-slate-900'
                      } ${errors.password ? 'border-rose-500' : ''}`}
                      placeholder="Parol kiriting (kamida 6 ta belgi)"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors duration-200"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-rose-500 text-xs mt-1 font-medium"
                    >
                      {errors.password}
                    </motion.p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Parolni Tasdiqlang
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.password2}
                      onChange={(e) => handleInputChange('password2', e.target.value)}
                      className={`w-full pl-10 pr-12 py-3.5 border rounded-xl focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent transition-all duration-200 ${
                        theme === 'dark' 
                          ? 'bg-slate-900 border-slate-700 text-white' 
                          : 'bg-slate-50 border-slate-200 text-slate-900'
                      } ${errors.password2 ? 'border-rose-500' : ''}`}
                      placeholder="Parolni qayta kiriting"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors duration-200"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password2 && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-rose-500 text-xs mt-1 font-medium"
                    >
                      {errors.password2}
                    </motion.p>
                  )}
                </div>

                <div className="flex flex-col gap-4">
                  {/* Orqaga button removed from here as per request */}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-bold hover:bg-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl shadow-emerald-200 dark:shadow-none"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5" />
                        Ro'yhatdan O'tish
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              Hisobingiz bormi?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-teal-600 hover:text-teal-700 font-medium transition-colors duration-200"
              >
                Kirish
              </button>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
