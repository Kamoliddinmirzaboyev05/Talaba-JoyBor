import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, Shield, Home, Building2, ChevronRight, MessageCircle } from 'lucide-react';
import { PageType } from '../App';
import { User, Listing } from '../types';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import ListingCard from '../components/ListingCard';
import { authAPI } from '../services/api';

interface HomePageProps {
  onNavigate: (page: PageType) => void;
  user: User | null;
  onListingSelect: (listing: Listing) => void;
  onApplicationStart: (listing: Listing) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate, user, onListingSelect }) => {
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  // API dan yotoqxonalarni yuklash
  useEffect(() => {
    const fetchDormitories = async () => {
      try {
        setLoading(true);
        const dormitoriesData = await authAPI.getDormitories();

        // Dormitory ma'lumotlarini Listing formatiga o'tkazish
        const convertedListings: Listing[] = dormitoriesData.slice(0, 3).map((dormitory: any) => ({
          id: dormitory.id.toString(),
          title: dormitory.name,
          type: 'dormitory' as const,
          price: dormitory.month_price,
          location: dormitory.address,
          university: dormitory.university.name,
          images: dormitory.images.map((img: any) => img.image),
          amenities: dormitory.amenities.map((amenity: any) => amenity.name),
          description: dormitory.description,
          capacity: dormitory.total_capacity,
          available: dormitory.available_capacity > 0,
          rating: 4.5, // Default rating
          reviews: 0, // Default reviews
          features: {
            furnished: true,
            wifi: dormitory.amenities.some((a: any) => a.name.toLowerCase().includes('wifi')),
            parking: dormitory.amenities.some((a: any) => a.name.toLowerCase().includes('parking')),
            security: dormitory.amenities.some((a: any) => a.name.toLowerCase().includes('security'))
          },
          rules: dormitory.rules || [],
          coordinates: {
            lat: dormitory.latitude,
            lng: dormitory.longitude
          }
        }));

        setFeaturedListings(convertedListings);
      } catch (error) {
        console.error('Yotoqxonalar yuklanmadi:', error);
        setFeaturedListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDormitories();
  }, []);

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
                O'zingiz uchun qulay
              </span>
              <br />
              Turar Joy Toping
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

            <SearchBar onSearch={() => { }} />
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

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-300">Yotoqxonalar yuklanmoqda...</p>
              </div>
            </div>
          ) : featuredListings.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Yotoqxonalar topilmadi
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Hozircha yotoqxonalar mavjud emas
              </p>
            </div>
          ) : (
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
          )}

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