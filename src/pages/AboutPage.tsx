import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Users, Award, Heart, MapPin, TrendingUp, Shield, Clock } from 'lucide-react';
import Header from '../components/Header';
import { authAPI } from '../services/api';

interface Statistics {
  dormitories_count: number;
  apartments_count: number;
  users_count: number;
  applications_count: number;
}

const AboutPage: React.FC = () => {
  // Sahifa yuklanganda yuqoriga scroll qilish
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [statistics, setStatistics] = useState<Statistics>({
    dormitories_count: 0,
    apartments_count: 0,
    users_count: 0,
    applications_count: 0
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const stats = await authAPI.getStatistics();
        setStatistics(stats);
      } catch (error) {
        console.error('Statistikalar yuklanmadi:', error);
      }
    };

    fetchStatistics();
  }, []);

  const stats = [
    { 
      label: 'Yotoqxonalar', 
      value: `${statistics.dormitories_count}`, 
      icon: Users, 
      color: 'text-blue-600' 
    },
    { 
      label: 'Talabalar', 
      value: `${statistics.users_count}`, 
      icon: MapPin, 
      color: 'text-green-600' 
    },
    { 
      label: 'Xizmat Vaqti', 
      value: '24/7', 
      icon: Heart, 
      color: 'text-red-600' 
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Xavfsiz va Ishonchli',
      description: 'Barcha elonlar tekshiriladi va tasdiqlangan uy egalari bilan ishlaymiz'
    },
    {
      icon: Clock,
      title: '24/7 Yordam',
      description: 'Har qanday vaqtda yordam olish uchun bizning jamoamiz tayyor'
    },
    {
      icon: TrendingUp,
      title: 'Tez va Oson',
      description: 'Bir necha daqiqada o\'zingizga mos yashash joyini toping'
    },
    {
      icon: Users,
      title: 'Talabalar Uchun',
      description: 'Maxsus talabalar ehtiyojlari uchun mo\'ljallangan platforma'
    }
  ];

  const team = [
    {
      name: 'Kamoliddin Mirzaboyev',
      role: 'Founder & Lead Frontend Developer',
      image: 'imgs/Kamoliddin.png',
      description: 'Loyhaning asoschisi va asosiy frontend dasturchi'
    },
    {
      name: 'Asadbek Mirmahmudov',
      role: 'Project Manager & Frontend Developer',
      image: 'imgs/Asadbek.png',
      description: 'Frontendda ishlaydi, jamoani boshqaradi va resurslarni ta’minlaydi'
    },
    {
      name: 'Vohobjonov Sardorbek',
      role: 'Core Backend Developer',
      image: 'imgs/Sardorbek.png',
      description: 'Loyhaning asosiy backend qismini ishlab chiqmoqda'
    },
    {
      name: 'Akbarkhojayev Abboskhoja',
      role: 'DevOps Engineer & Support Backend Developer',
      image: 'imgs/Abboskhoja.png',
      description: 'Serverga joylash, hosting va backenddagi texnik muammolarni hal qiladi'
    }
  ];
  
  const timeline = [
    {
      year: '2024',
      title: 'Loyiha Boshlandi',
      description: 'JoyBor g\'oyasi tug\'ildi va dastlabki ishlanma yaratildi'
    },
    {
      year: '2025',
      title: 'Beta Versiya',
      description: 'Birinchi foydalanuvchilar bilan beta test o\'tkazildi'
    },
    {
      year: '2025',
      title: 'Rasmiy Ishga Tushirish',
      description: 'Platforma rasmiy ravishda ishga tushirildi'
    },
    {
      year: '2026',
      title: 'Kengayish',
      description: 'Barcha viloyatlarga xizmat ko\'rsatish rejalashtirilmoqda'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-teal-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <Target className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Biz Haqimizda
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
            JoyBor - O'zbekiston talabalarining yashash joy muammosini hal qilish uchun yaratilgan 
            zamonaviy platforma. Bizning maqsadimiz har bir talabaga qulay, xavfsiz va arzon yashash 
            joyini topishda yordam berishdir.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-r from-teal-600 to-green-600 rounded-3xl p-6 sm:p-12 text-white text-center mb-20"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">Bizning Missiyamiz</h2>
          <p className="text-lg sm:text-xl text-teal-100 max-w-4xl mx-auto leading-relaxed px-4">
            Har bir talabaning ta'lim olish jarayonida eng muhim ehtiyojlaridan biri - qulay yashash joyi. 
            Biz bu muammoni hal qilish uchun ishonchli, tez va oson foydalaniladigan platforma yaratdik. 
            Maqsadimiz - O'zbekistondagi barcha talabalar uchun sifatli yashash joylarini topishni 
            osonlashtirish va ularning ta'lim jarayoniga to'sqinlik qilmaydigan muhit yaratish.
          </p>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Nima Uchun JoyBor?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Bizning platformamizning asosiy afzalliklari va xususiyatlari
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-green-600 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Timeline Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Bizning Yo'limiz
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
              JoyBor platformasining rivojlanish tarixi
            </p>
          </div>

          {/* Desktop Timeline */}
          <div className="relative hidden md:block">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-teal-600 to-green-600 rounded-full"></div>
            
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                      <div className="text-2xl font-bold text-teal-600 mb-2">
                        {item.year}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="w-4 h-4 bg-gradient-to-r from-teal-600 to-green-600 rounded-full"></div>
                  </div>
                  
                  <div className="w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile Timeline */}
          <div className="md:hidden space-y-8">
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
                className="relative"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-teal-600 to-green-600 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                    <div className="text-2xl sm:text-3xl font-bold text-teal-600 mb-3">
                      {item.year}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                      {item.title}
                    </h3>
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
                
                {/* Connecting line for mobile */}
                {index < timeline.length - 1 && (
                  <div className="absolute left-3 top-8 w-0.5 h-8 bg-gradient-to-b from-teal-600 to-green-600 rounded-full"></div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Bizning Jamoa
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              JoyBor ortidagi professional jamoa a'zolari
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 + index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-teal-600 dark:text-teal-400 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-12 text-center shadow-xl"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Biz Bilan Bog'laning!
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Savollaringiz bormi? Yordam kerakmi? Bizga murojaat qiling!
          </p>
          
          {/* Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 max-w-2xl mx-auto">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4 sm:p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Telefon
              </h3>
              <a 
                href="tel:+998889563848" 
                className="text-teal-600 dark:text-teal-400 hover:underline font-medium"
              >
                +998 88 956 38 48
              </a>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4 sm:p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Telegram Bot
              </h3>
              <a 
                href="https://t.me/Joyboronlinebot" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-teal-600 dark:text-teal-400 hover:underline font-medium"
              >
                @Joyboronlinebot
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="https://t.me/Joyboronlinebot"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-teal-600 to-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 inline-flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              Telegram Orqali Bog'lanish
            </motion.a>
            <motion.a
              href="tel:+998889563848"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-teal-600 text-teal-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all duration-300 inline-flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              Qo'ng'iroq Qilish
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;