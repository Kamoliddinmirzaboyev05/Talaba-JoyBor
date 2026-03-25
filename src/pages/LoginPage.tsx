import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { authAPI } from '../services/api';
import GoogleLoginButton from '../components/GoogleLoginButton';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Sahifa yuklanganda yuqoriga scroll qilish
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  const { theme } = useTheme();
  
  // Register sahifasidan kelgan xabar
  const registerMessage = (location.state as { message?: string })?.message;
  const registeredUsername = (location.state as { username?: string })?.username;
  
  const [formData, setFormData] = useState({
    username: registeredUsername || '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState('');
  const [successMessage] = useState(registerMessage || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setGeneralError('');

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.username) newErrors.username = 'Foydalanuvchi nomi kiritilishi shart';
    if (!formData.password) newErrors.password = 'Parol kiritilishi shart';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const data = await authAPI.login({
        username: formData.username,
        password: formData.password,
      });

      // Tokenlarni localStorage ga saqlash (AuthContext ularni sessionStorage ga ko'chiradi)
      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);
      
      await login(data.access, data.refresh);
      navigate('/dashboard', { replace: true });
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response?.data?.detail) {
        setGeneralError(error.response.data.detail);
      } else {
        setGeneralError('Kirishda xatolik yuz berdi. Server ishlamayotgan bo\'lishi mumkin.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
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
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 mb-6 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Orqaga
          </motion.button>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-16 h-16 bg-slate-900 dark:bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
          >
            <LogIn className="w-8 h-8 text-white dark:text-slate-900" />
          </motion.div>
          
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Xush Kelibsiz!
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Hisobingizga kiring va yashash joyingizni toping
          </p>
        </div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-none p-8 border border-slate-100 dark:border-slate-700"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Success Message */}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-600 dark:text-emerald-400 text-sm"
              >
                {successMessage}
              </motion.div>
            )}
            
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

            {/* Username Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Foydalanuvchi Nomi
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent transition-all duration-200 ${
                    theme === 'dark' 
                      ? 'bg-slate-900 border-slate-700 text-white' 
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  } ${errors.username ? 'border-rose-500' : ''}`}
                  placeholder="foydalanuvchi_nomi"
                />
              </div>
              {errors.username && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-rose-500 text-xs mt-1 font-medium"
                >
                  {errors.username}
                </motion.p>
              )}
            </div>

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
                  placeholder="Parolingizni kiriting"
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

            {/* Forgot Password */}
            <div className="text-right">
              <button
                type="button"
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm font-medium transition-colors duration-200"
              >
                Parolni unutdingizmi?
              </button>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3.5 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl shadow-slate-200 dark:shadow-none"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Kirish
                </>
              )}
            </motion.button>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest font-semibold">
                <span className="px-4 bg-white dark:bg-gray-800 text-gray-400">Yoki</span>
              </div>
            </div>

            {/* Google Login */}
            <GoogleLoginButton text="signin_with" />
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              Hisobingiz yo'qmi?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-teal-600 hover:text-teal-700 font-medium transition-colors duration-200"
              >
                Ro'yhatdan o'ting
              </button>
            </p>
          </div>
        </motion.div>


      </motion.div>
    </div>
  );
};

export default LoginPage;
