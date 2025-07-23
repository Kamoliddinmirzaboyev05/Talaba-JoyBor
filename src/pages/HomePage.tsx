import React from 'react';
import { motion } from 'framer-motion';
import { Search, Users, Shield, Home, Building2, ChevronRight, MessageCircle } from 'lucide-react';
import { PageType } from '../App';
import { User, Listing } from '../types';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import ListingCard from '../components/ListingCard';

interface HomePageProps {
  onNavigate: (page: PageType) => void;
  user: User | null;
  onListingSelect: (listing: Listing) => void;
  onApplicationStart: (listing: Listing) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate, user, onListingSelect }) => {

  const featuredListings: Listing[] = [
    {
      id: '1',
      title: 'TATU Yotoqxonasi - Zamonaviy Xonalar',
      type: 'dormitory',
      price: 300000,
      location: 'Chilonzor, Toshkent',
      university: 'TATU',
      images: ['https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg'],
      amenities: ['WiFi', 'Konditsioner', 'Oshxona', 'Xavfsizlik'],
      description: 'Zamonaviy jihozlangan yotoqxona xonalari',
      capacity: 2,
      available: true,
      rating: 4.8,
      reviews: 124,
      features: {
        furnished: true,
        wifi: true,
        parking: true,
        security: true
      },
      rules: ['Sigaret chekish taqiqlanadi', 'Mehmonlar 22:00 gacha'],
      coordinates: { lat: 41.2995, lng: 69.2401 }
    },
    {
      id: '2',
      title: 'Mirzo Ulug\'bek Yotoqxonasi',
      type: 'dormitory',
      price: 250000,
      location: 'Mirzo Ulug\'bek, Toshkent',
      university: 'MirU',
      images: ['https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg'],
      amenities: ['WiFi', 'Oshxona', 'O\'quv xonasi', 'Sport zali'],
      description: 'Qulay va arzon yotoqxona',
      capacity: 3,
      available: true,
      rating: 4.5,
      reviews: 89,
      features: {
        furnished: true,
        wifi: true,
        parking: false,
        security: true
      },
      rules: ['Ovqat tayyorlash ruxsat etiladi', 'Shovqin qilish taqiqlanadi'],
      coordinates: { lat: 41.3111, lng: 69.2797 }
    },
    {
      id: '3',
      title: 'Zamonaviy 2-Xonali Kvartira',
      type: 'rental',
      price: 2500000,
      location: 'Yunusobod, Toshkent',
      university: 'TDTU yaqinida',
      images: ['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg'],
      amenities: ['WiFi', 'Konditsioner', 'Kir yuvish mashinasi', 'Balkon'],
      description: 'To\'liq jihozlangan zamonaviy kvartira',
      capacity: 4,
      available: true,
      rating: 4.9,
      reviews: 67,
      landlord: {
        name: 'Aziz Karimov',
        phone: '+998901234567',
        email: 'aziz@example.com',
        verified: true,
        rating: 4.8
      },
      features: {
        furnished: true,
        wifi: true,
        parking: true,
        security: true
      },
      rules: ['Hayvonlar ruxsat etilmaydi', 'Sigaret chekish balkondan'],
      coordinates: { lat: 41.3775, lng: 69.2718 }
    }
  ];

  const stats = [
    { icon: Home, label: 'Yotoqxonalar', value: '150+', color: 'text-teal-600' },
    { icon: Building2, label: 'Ijara Xonadonlar', value: '500+', color: 'text-green-600' },
    { icon: Users, label: 'Faol Talabalar', value: '2,500+', color: 'text-indigo-600' },
    { icon: Shield, label: 'Tasdiqlangan Elonlar', value: '98%', color: 'text-purple-600' }
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Qidiring',
      description: 'O\'zingizga mos yotoqxona yoki kvartira toping',
      icon: Search,
      color: 'bg-teal-100 text-teal-600'
    },
    {
      step: 2,
      title: 'Ariza Yuboring',
      description: 'Tanlagan joyingizga onlayn ariza yuboring',
      icon: MessageCircle,
      color: 'bg-green-100 text-green-600'
    },
    {
      step: 3,
      title: 'Ko\'chib O\'ting',
      description: 'Tasdiqlangandan so\'ng yangi uyingizga ko\'chib o\'ting',
      icon: Home,
      color: 'bg-indigo-100 text-indigo-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Header onNavigate={onNavigate} />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600/10 to-green-600/10 dark:from-teal-600/20 dark:to-green-600/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              <span className="bg-gradient-to-r from-teal-600 to-green-600 bg-clip-text text-transparent">
                Mukammal Talaba
              </span>
              <br />
              Uyini Toping
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              O'zbekistondagi eng yaxshi yotoqxonalar va ijara xonadonlarini bir joyda. 
              Tez, oson va ishonchli.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('dormitories')}
                className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Home className="w-5 h-5" />
                Yotoqxona Topish
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('rentals')}
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Building2 className="w-5 h-5" />
                Ijara Topish
              </motion.button>
            </div>

            <SearchBar onSearch={() => {}} />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4`}>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</div>
                <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Mashhur Elonlar
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Talabalar orasida eng mashhur va yuqori baholangan yashash joylari
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredListings.map((listing, index) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ListingCard
                  listing={listing}
                  onSelect={() => onListingSelect(listing)}
                  user={user}
                />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <button
              onClick={() => onNavigate('dormitories')}
              className="bg-gradient-to-r from-teal-600 to-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 inline-flex items-center gap-2"
            >
              Barcha Elonlarni Ko'rish
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Qanday Ishlaydi?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Uch oddiy qadamda o'zingizga mos yashash joyini toping
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center relative"
              >
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-teal-200 to-green-200 dark:from-teal-800 dark:to-green-800 transform translate-x-1/2" />
                )}
                <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${step.color} mb-6 relative z-10`}>
                  <step.icon className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {step.step}. {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-teal-600 to-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Bugun O'z Uyingizni Toping!
            </h2>
            <p className="text-teal-100 mb-8 max-w-2xl mx-auto">
              Minglab talabalar bizning platformamiz orqali o'zlariga mos yashash joyini topdilar. 
              Endi sizning navbatingiz!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate(user ? 'dashboard' : 'register')}
                className="bg-white text-teal-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-300"
              >
                {user ? 'Dashboard' : 'Ro\'yhatdan O\'tish'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('about')}
                className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-teal-600 transition-all duration-300"
              >
                Batafsil Ma'lumot
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;