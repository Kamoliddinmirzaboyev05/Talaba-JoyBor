import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, FileText, User, Phone, Mail, GraduationCap, CheckCircle, AlertCircle } from 'lucide-react';
import { PageType } from '../App';
import { User as UserType, Listing } from '../types';
import Header from '../components/Header';

interface ApplicationPageProps {
  listing: Listing | null;
  onNavigate: (page: PageType) => void;
  user: UserType | null;
}

const ApplicationPage: React.FC<ApplicationPageProps> = ({ listing, onNavigate, user }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      university: user?.university || '',
      studentId: user?.studentId || '',
      course: '',
      faculty: ''
    },
    documents: {
      studentId: false,
      transcript: false,
      recommendation: false,
      passport: false
    },
    preferences: {
      moveInDate: '',
      duration: '',
      roommate: '',
      additionalInfo: ''
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const totalSteps = 3;

  const handleInputChange = (section: string, field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
    
    // Clear error when user starts typing
    const errorKey = `${section}.${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.personalInfo.fullName) newErrors['personalInfo.fullName'] = 'Ism familiya kiritilishi shart';
      if (!formData.personalInfo.email) newErrors['personalInfo.email'] = 'Email manzil kiritilishi shart';
      if (!formData.personalInfo.phone) newErrors['personalInfo.phone'] = 'Telefon raqam kiritilishi shart';
      if (!formData.personalInfo.course) newErrors['personalInfo.course'] = 'Kurs tanlanishi shart';
      if (!formData.personalInfo.faculty) newErrors['personalInfo.faculty'] = 'Fakultet kiritilishi shart';
    }

    if (step === 2) {
      const requiredDocs = ['studentId', 'transcript'];
      requiredDocs.forEach(doc => {
        if (!formData.documents[doc as keyof typeof formData.documents]) {
          newErrors[`documents.${doc}`] = 'Bu hujjat majburiy';
        }
      });
    }

    if (step === 3) {
      if (!formData.preferences.moveInDate) newErrors['preferences.moveInDate'] = 'Ko\'chib o\'tish sanasi tanlanishi shart';
      if (!formData.preferences.duration) newErrors['preferences.duration'] = 'Yashash muddati tanlanishi shart';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onNavigate('dashboard');
    }, 2000);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m';
  };

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

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {currentStep}/{totalSteps} qadam
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {Math.round((currentStep / totalSteps) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              initial={{ width: '33%' }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-r from-teal-600 to-green-600 h-2 rounded-full"
            />
          </div>
          
          <div className="flex justify-between mt-4">
            <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-teal-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 1 ? 'bg-teal-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
              }`}>
                {currentStep > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
              </div>
              <span className="text-sm font-medium">Shaxsiy Ma'lumotlar</span>
            </div>
            <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-teal-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 2 ? 'bg-teal-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
              }`}>
                {currentStep > 2 ? <CheckCircle className="w-5 h-5" /> : '2'}
              </div>
              <span className="text-sm font-medium">Hujjatlar</span>
            </div>
            <div className={`flex items-center gap-2 ${currentStep >= 3 ? 'text-teal-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 3 ? 'bg-teal-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
              }`}>
                3
              </div>
              <span className="text-sm font-medium">Afzalliklar</span>
            </div>
          </div>
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
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                    Shaxsiy Ma'lumotlar
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Ism Familiya *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.personalInfo.fullName}
                          onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                            errors['personalInfo.fullName'] ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Aziz Karimov"
                        />
                      </div>
                      {errors['personalInfo.fullName'] && (
                        <p className="text-red-500 text-sm mt-1">{errors['personalInfo.fullName']}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Manzil *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={formData.personalInfo.email}
                          onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                            errors['personalInfo.email'] ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="aziz@student.tatu.uz"
                        />
                      </div>
                      {errors['personalInfo.email'] && (
                        <p className="text-red-500 text-sm mt-1">{errors['personalInfo.email']}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Telefon Raqam *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          value={formData.personalInfo.phone}
                          onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                            errors['personalInfo.phone'] ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="+998901234567"
                        />
                      </div>
                      {errors['personalInfo.phone'] && (
                        <p className="text-red-500 text-sm mt-1">{errors['personalInfo.phone']}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Universitet
                      </label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.personalInfo.university}
                          readOnly
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Kurs *
                      </label>
                      <select
                        value={formData.personalInfo.course}
                        onChange={(e) => handleInputChange('personalInfo', 'course', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                          errors['personalInfo.course'] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Kursni tanlang</option>
                        <option value="1">1-kurs</option>
                        <option value="2">2-kurs</option>
                        <option value="3">3-kurs</option>
                        <option value="4">4-kurs</option>
                        <option value="magistr">Magistratura</option>
                      </select>
                      {errors['personalInfo.course'] && (
                        <p className="text-red-500 text-sm mt-1">{errors['personalInfo.course']}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Fakultet *
                      </label>
                      <input
                        type="text"
                        value={formData.personalInfo.faculty}
                        onChange={(e) => handleInputChange('personalInfo', 'faculty', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                          errors['personalInfo.faculty'] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Axborot texnologiyalari"
                      />
                      {errors['personalInfo.faculty'] && (
                        <p className="text-red-500 text-sm mt-1">{errors['personalInfo.faculty']}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Documents */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                    Hujjatlar
                  </h2>
                  
                  <div className="space-y-6">
                    {[
                      { key: 'studentId', label: 'Talaba guvohnomasi', required: true },
                      { key: 'transcript', label: 'O\'quv ma\'lumotnomasi', required: true },
                      { key: 'recommendation', label: 'Tavsiya xati', required: false },
                      { key: 'passport', label: 'Pasport nusxasi', required: false }
                    ].map((doc) => (
                      <div key={doc.key} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-gray-400" />
                            <span className="font-medium text-gray-900 dark:text-white">
                              {doc.label}
                              {doc.required && <span className="text-red-500 ml-1">*</span>}
                            </span>
                          </div>
                          {formData.documents[doc.key as keyof typeof formData.documents] && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleInputChange('documents', doc.key, true)}
                            className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-teal-500 transition-colors duration-200"
                          >
                            <Upload className="w-4 h-4" />
                            <span className="text-sm">Fayl yuklash</span>
                          </motion.button>
                          
                          {formData.documents[doc.key as keyof typeof formData.documents] && (
                            <span className="text-sm text-green-600 dark:text-green-400">
                              Yuklandi ✓
                            </span>
                          )}
                        </div>
                        
                        {errors[`documents.${doc.key}`] && (
                          <p className="text-red-500 text-sm mt-2">{errors[`documents.${doc.key}`]}</p>
                        )}
                      </div>
                    ))}
                    
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                            Hujjatlar haqida
                          </h4>
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            Barcha hujjatlar PDF, JPG yoki PNG formatida bo'lishi kerak. 
                            Maksimal fayl hajmi: 5MB
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Preferences */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                    Afzalliklar
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Ko'chib o'tish sanasi *
                        </label>
                        <input
                          type="date"
                          value={formData.preferences.moveInDate}
                          onChange={(e) => handleInputChange('preferences', 'moveInDate', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                            errors['preferences.moveInDate'] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors['preferences.moveInDate'] && (
                          <p className="text-red-500 text-sm mt-1">{errors['preferences.moveInDate']}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Yashash muddati *
                        </label>
                        <select
                          value={formData.preferences.duration}
                          onChange={(e) => handleInputChange('preferences', 'duration', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                            errors['preferences.duration'] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Muddatni tanlang</option>
                          <option value="1-semester">1 semestr</option>
                          <option value="1-year">1 yil</option>
                          <option value="2-years">2 yil</option>
                          <option value="full-course">To'liq kurs davomida</option>
                        </select>
                        {errors['preferences.duration'] && (
                          <p className="text-red-500 text-sm mt-1">{errors['preferences.duration']}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Xonadosh haqida ma'lumot
                      </label>
                      <select
                        value={formData.preferences.roommate}
                        onChange={(e) => handleInputChange('preferences', 'roommate', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">Farqi yo'q</option>
                        <option value="same-university">Bir universitetdan</option>
                        <option value="same-faculty">Bir fakultetdan</option>
                        <option value="same-course">Bir kursdan</option>
                        <option value="no-roommate">Yakka xona</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Qo'shimcha ma'lumot
                      </label>
                      <textarea
                        value={formData.preferences.additionalInfo}
                        onChange={(e) => handleInputChange('preferences', 'additionalInfo', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:text-white resize-none"
                        placeholder="Maxsus talablar yoki qo'shimcha ma'lumotlar..."
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                {currentStep > 1 ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={prevStep}
                    className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
                  >
                    Orqaga
                  </motion.button>
                ) : (
                  <div />
                )}

                {currentStep < totalSteps ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={nextStep}
                    className="px-6 py-3 bg-gradient-to-r from-teal-600 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Keyingi
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-gradient-to-r from-teal-600 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                )}
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