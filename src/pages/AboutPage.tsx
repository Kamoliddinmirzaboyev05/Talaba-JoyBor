import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, Award, Heart, MapPin, TrendingUp, Shield, Clock } from 'lucide-react';
import Header from '../components/Header';

const AboutPage: React.FC = () => {
  const stats = [
    { label: 'Faol Talabalar', value: '2,500+', icon: Users, color: 'text-blue-600' },
    { label: 'Yashash Joylari', value: '650+', icon: MapPin, color: 'text-green-600' },
    { label: 'Muvaffaqiyatli Joylashtirishlar', value: '1,200+', icon: Award, color: 'text-purple-600' },
    { label: 'Qoniqish Darajasi', value: '98%', icon: Heart, color: 'text-red-600' }
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
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Biz Haqimizda
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
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
          className="bg-gradient-to-r from-teal-600 to-green-600 rounded-3xl p-12 text-white text-center mb-20"
        >
          <h2 className="text-3xl font-bold mb-6">Bizning Missiyamiz</h2>
          <p className="text-xl text-teal-100 max-w-4xl mx-auto leading-relaxed">
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
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
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
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-green-600 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
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
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Bizning Yo'limiz
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              JoyBor platformasining rivojlanish tarixi
            </p>
          </div>

          <div className="relative">
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
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
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

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-12 text-center shadow-xl"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Bizga Qo'shiling!
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            JoyBor jamoasiga qo'shiling va O'zbekiston talabalarining hayotini 
            yaxshilashda bizga yordam bering.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('contact')}
              className="bg-gradient-to-r from-teal-600 to-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              Bog'lanish
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('register')}
              className="border-2 border-teal-600 text-teal-600 px-8 py-4 rounded-xl font-semibold hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all duration-300"
            >
              Ro'yhatdan O'tish
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;