import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, User as UserIcon, Mail, Phone, MessageSquare, CheckCircle2, AlertCircle, LogIn, Sparkles } from 'lucide-react';
import { formatPhoneInput, normalizePhoneForApi } from '../utils/format';
import { authAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface FormState {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const subjects = [
  'Umumiy savol',
  'Yotoqxona band qilish',
  'Ariza holati',
  "To'lov masalalari",
  'Texnik yordam',
  'Hamkorlik va taklif',
  'Shikoyat',
];

const ContactForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    subject: 'Umumiy savol',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState('');

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.name || user.username || '',
        email: prev.email || user.email || '',
        phone: prev.phone || (user.phone ? formatPhoneInput(user.phone) : ''),
      }));
    }
  }, [user]);

  const handleInputChange = (field: keyof FormState, value: string) => {
    if (field === 'phone') {
      value = formatPhoneInput(value);
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Ismingizni kiriting';
    if (!formData.email.trim()) newErrors.email = 'Email manzilingizni kiriting';
    if (!formData.phone.trim()) newErrors.phone = 'Telefon raqamingizni kiriting';
    if (!formData.subject) newErrors.subject = 'Mavzuni tanlang';
    if (!formData.message.trim()) newErrors.message = 'Xabar matnini yozing';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Email manzil formati noto'g'ri";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    if (!validateForm()) return;

    if (!user) {
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      const phone = normalizePhoneForApi(formData.phone);
      await authAPI.sendComplaint('superadmin', {
        type: formData.subject === 'Shikoyat' ? 'complaint' : 'suggestion',
        category: 'other',
        title: formData.subject,
        description: [
          `Ism: ${formData.name}`,
          `Email: ${formData.email}`,
          `Tel: ${phone}`,
          '',
          `Mavzu: ${formData.subject}`,
          '',
          `Xabar:`,
          formData.message,
        ].join('\n'),
      });
      setFormData({
        name: user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.name || user.username || '' : '',
        email: user?.email || '',
        phone: user?.phone ? formatPhoneInput(user.phone) : '',
        subject: 'Umumiy savol',
        message: '',
      });
      setSuccess("Xabaringiz muvaffaqiyatli qabul qilindi! Mutaxassislarimiz tez orada siz bilan bog'lanishadi.");
    } catch (err) {
      setErrors({
        form:
          err instanceof Error
            ? err.message
            : "Xabarni yuborishda xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-surface-900 rounded-3xl border border-surface-200 dark:border-surface-800 shadow-sm p-6 sm:p-8 relative overflow-hidden">
      {/* Decorative top accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-600" />

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200/60 dark:border-brand-800/40 text-brand-600 dark:text-brand-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            To'g'ridan-to'g'ri aloqa
          </div>
          <h2 className="text-2xl font-bold text-surface-900 dark:text-white">
            Bizga xabar yuboring
          </h2>
          <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">
            Savol, ariza holati yoki takliflaringiz bo'yicha ma'lumot qoldiring.
          </p>
        </div>
      </div>

      {!user && (
        <div className="mb-6 p-4 rounded-2xl bg-brand-50/80 dark:bg-brand-950/40 border border-brand-200/70 dark:border-brand-800/50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center flex-shrink-0">
              <LogIn className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-brand-900 dark:text-brand-200">
                Tizimga kirmagansiz
              </p>
              <p className="text-xs text-brand-700/80 dark:text-brand-400">
                Murojaat holatini kuzatish uchun profilingizga kiring
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium transition-colors whitespace-nowrap shadow-sm"
          >
            Kirish
          </button>
        </div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-2xl bg-success-50 dark:bg-success-950/30 border border-success-200 dark:border-success-800 text-success-800 dark:text-success-300 text-sm flex items-start gap-3"
        >
          <CheckCircle2 className="w-5 h-5 text-success-600 dark:text-success-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Muvaffaqiyatli!</p>
            <p className="mt-0.5 text-xs text-success-700 dark:text-success-300/90">{success}</p>
          </div>
        </motion.div>
      )}

      {errors.form && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-2xl bg-danger-50 dark:bg-danger-950/30 border border-danger-200 dark:border-danger-800 text-danger-800 dark:text-danger-300 text-sm flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-danger-600 dark:text-danger-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Xatolik</p>
            <p className="mt-0.5 text-xs">{errors.form}</p>
          </div>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Subject quick selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-surface-600 dark:text-surface-400 mb-2">
            Murojaat mavzusi
          </label>
          <div className="flex flex-wrap gap-1.5">
            {subjects.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => handleInputChange('subject', s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                  formData.subject === s
                    ? 'bg-brand-600 text-white shadow-sm ring-2 ring-brand-600/30'
                    : 'bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-surface-600 dark:text-surface-400 mb-1.5">
              Ism va Familiya
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-surface-400">
                <UserIcon className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Masalan: Azizbek Rahimov"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border ${
                  errors.name
                    ? 'border-danger-500 focus:ring-danger-500/20'
                    : 'border-surface-200 dark:border-surface-700 focus:border-brand-500 focus:ring-brand-500/20'
                } bg-surface-50/50 dark:bg-surface-800/60 text-surface-900 dark:text-white text-sm focus:outline-none focus:ring-2 transition-all`}
              />
            </div>
            {errors.name && <p className="text-xs text-danger-600 mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-surface-600 dark:text-surface-400 mb-1.5">
              Email manzil
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-surface-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                placeholder="azizbek@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border ${
                  errors.email
                    ? 'border-danger-500 focus:ring-danger-500/20'
                    : 'border-surface-200 dark:border-surface-700 focus:border-brand-500 focus:ring-brand-500/20'
                } bg-surface-50/50 dark:bg-surface-800/60 text-surface-900 dark:text-white text-sm focus:outline-none focus:ring-2 transition-all`}
              />
            </div>
            {errors.email && <p className="text-xs text-danger-600 mt-1">{errors.email}</p>}
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-surface-600 dark:text-surface-400 mb-1.5">
            Telefon raqam
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-surface-400">
              <Phone className="w-4 h-4" />
            </div>
            <input
              type="tel"
              placeholder="+998 90 123 45 67"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border ${
                errors.phone
                  ? 'border-danger-500 focus:ring-danger-500/20'
                  : 'border-surface-200 dark:border-surface-700 focus:border-brand-500 focus:ring-brand-500/20'
              } bg-surface-50/50 dark:bg-surface-800/60 text-surface-900 dark:text-white text-sm focus:outline-none focus:ring-2 transition-all`}
            />
          </div>
          {errors.phone && <p className="text-xs text-danger-600 mt-1">{errors.phone}</p>}
        </div>

        {/* Message */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-surface-600 dark:text-surface-400 mb-1.5">
            Xabar matni
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3.5 pointer-events-none text-surface-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <textarea
              rows={4}
              placeholder="Savolingiz yoki taklifingizni batafsil yozing..."
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border ${
                errors.message
                  ? 'border-danger-500 focus:ring-danger-500/20'
                  : 'border-surface-200 dark:border-surface-700 focus:border-brand-500 focus:ring-brand-500/20'
              } bg-surface-50/50 dark:bg-surface-800/60 text-surface-900 dark:text-white text-sm focus:outline-none focus:ring-2 transition-all resize-none`}
            />
          </div>
          {errors.message && <p className="text-xs text-danger-600 mt-1">{errors.message}</p>}
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Yuborilmoqda...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>{user ? 'Xabarni yuborish' : 'Kirish va yuborish'}</span>
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
};

export default ContactForm;
