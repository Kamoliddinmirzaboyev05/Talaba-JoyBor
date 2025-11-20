import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Users, Shield, Home, Building2, ChevronRight, MessageCircle } from 'lucide-react';
import { Listing } from '../types';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import ListingCard from '../components/ListingCard';
import DormitoryCard from '../components/DormitoryCard';
import { authAPI } from '../services/api';

interface Statistics {
  dormitories_count: number;
  apartments_count: number;
  users_count: number;
  applications_count: number;
}

interface HomePageProps {
  onListingSelect: (listing: Listing) => void;
  onApplicationStart: (listing: Listing) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onListingSelect }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);

  const [statistics, setStatistics] = useState<Statistics>({
    dormitories_count: 0,
    apartments_count: 0,
    users_count: 0,
    applications_count: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);

  // Sahifa yuklanganda yuqoriga scroll qilish
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Qidiruv funksiyasi
  const handleSearch = (searchData: any) => {
    const query = searchData.query.toLowerCase().trim();
    setSearchQuery(query);
    
    if (query) {
      // Mashhur elonlar ichidan qidirish
      const filtered = featuredListings.filter(listing => 
        listing.title.toLowerCase().includes(query) ||
        listing.location.toLowerCase().includes(query) ||
        listing.university.toLowerCase().includes(query) ||
        listing.description.toLowerCase().includes(query) ||
        listing.amenities.some(amenity => amenity.toLowerCase().includes(query))
      );
      setFilteredListings(filtered);
    } else {
      setFilteredListings([]);
    }
  };



  // API dan yotoqxonalar va apartments ni yuklash
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        
        // Yotoqxonalar va apartments ni parallel yuklash
        const [dormitoriesData, apartmentsData] = await Promise.all([
          authAPI.getDormitories().catch((error) => {
            console.error('Dormitories fetch error:', error);
            return [];
          }),
          authAPI.getApartments().catch((error) => {
            console.error('Apartments fetch error:', error);
            return [];
          })
        ]);

        console.log('Dormitories data:', dormitoriesData);
        console.log('Apartments data:', apartmentsData);

        // Dormitory ma'lumotlarini Listing formatiga o'tkazish
        const convertedDormitories: Listing[] = dormitoriesData.map((dormitory: any) => ({
          id: `dorm-${dormitory.id}`,
          title: dormitory.name,
          type: 'dormitory' as const,
          price: dormitory.month_price,
          location: dormitory.address,
          university: dormitory.university_name || 'Universitet nomi mavjud emas',
          images: dormitory.images?.map((img: any) => img.image || img) || [],
          amenities: dormitory.amenities_list || [],
          description: dormitory.description || 'Tavsif mavjud emas',
          capacity: 1,
          available_capacity: 0,
          available: dormitory.is_active,
          rating: dormitory.rating || 4.5,
          reviews: 12,
          features: {
            furnished: true,
            wifi: dormitory.amenities_list?.some((a: string) => a.toLowerCase().includes('wifi')) || false,
            parking: dormitory.amenities_list?.some((a: string) => a.toLowerCase().includes('parking')) || false,
            security: dormitory.amenities_list?.some((a: string) => a.toLowerCase().includes('xavfsizlik') || a.toLowerCase().includes('security')) || false,
          },
          rules: [],
          coordinates: {
            lat: dormitory.latitude || 0,
            lng: dormitory.longitude || 0,
          },
        }));

        // Apartments ma'lumotlarini Listing formatiga o'tkazish
        const convertedApartments: Listing[] = apartmentsData.map((apartment: any) => ({
          id: `apt-${apartment.id}`,
          title: apartment.name || apartment.title,
          type: 'rental' as const,
          price: apartment.month_price || apartment.price,
          location: apartment.address || apartment.location,
          university: apartment.university_name || 'Umumiy',
          images: apartment.images?.map((img: any) => img.image || img) || [],
          amenities: apartment.amenities_list || [],
          description: apartment.description || 'Tavsif mavjud emas',
          capacity: apartment.capacity || 1,
          available: apartment.is_active !== false,
          rating: apartment.rating || 4.3,
          reviews: 8,
          landlord: apartment.landlord || apartment.admin_name,
          features: {
            furnished: true,
            wifi: apartment.amenities_list?.some((a: string) => a.toLowerCase().includes('wifi')) || false,
            parking: apartment.amenities_list?.some((a: string) => a.toLowerCase().includes('parking')) || false,
            security: apartment.amenities_list?.some((a: string) => a.toLowerCase().includes('xavfsizlik') || a.toLowerCase().includes('security')) || false,
          },
          rules: [],
          coordinates: {
            lat: apartment.latitude || 0,
            lng: apartment.longitude || 0,
          },
        }));

        // Yotoqxonalar va apartments ni birlashtirish
        const allListingsData = [...convertedDormitories, ...convertedApartments];
        console.log('Converted data:', allListingsData);
        console.log('Featured listings:', allListingsData);
        
        // Agar ma'lumotlar bo'sh bo'lsa, fallback data ko'rsatish
        if (allListingsData.length === 0) {
          console.log('No data received, showing fallback data');
          const fallbackData: Listing[] = [
            {
              id: 'fallback-1',
              title: 'Toshkent Davlat Universiteti Yotoqxonasi',
              type: 'dormitory',
              price: 500000,
              location: 'Toshkent, Chilonzor tumani',
              university: 'Toshkent Davlat Universiteti',
              images: ['/placeholder-dormitory.svg'],
              amenities: ['WiFi', 'Xavfsizlik', 'Parking'],
              description: 'Toshkent Davlat Universiteti talabalari uchun qulay yotoqxona',
              capacity: 4,
              available: true,
              rating: 4.5,
              reviews: 25,
              features: { furnished: true, wifi: true, parking: true, security: true },
              rules: ['Tartib-intizom saqlash', 'Ovozni pasaytirish'],
              coordinates: { lat: 41.2995, lng: 69.2401 }
            },
            {
              id: 'fallback-2',
              title: 'Samarqand Davlat Universiteti Yotoqxonasi',
              type: 'dormitory',
              price: 400000,
              location: 'Samarqand, Registon ko\'chasi',
              university: 'Samarqand Davlat Universiteti',
              images: ['/placeholder-dormitory.svg'],
              amenities: ['WiFi', 'Xavfsizlik'],
              description: 'Samarqand Davlat Universiteti talabalari uchun qulay yotoqxona',
              capacity: 3,
              available: true,
              rating: 4.3,
              reviews: 18,
              features: { furnished: true, wifi: true, parking: false, security: true },
              rules: ['Tartib-intizom saqlash'],
              coordinates: { lat: 39.6270, lng: 66.9749 }
            }
          ];
          setFeaturedListings(fallbackData);
        } else {
          setFeaturedListings(allListingsData);
        }
        
        // Statistikalarni yuklash
        try {
          const stats = await authAPI.getStatistics();
          setStatistics(stats);
        } catch (error) {
          console.error('Statistics fetch error:', error);
          // Fallback statistika
          setStatistics({
            dormitories_count: 15,
            apartments_count: 8,
            users_count: 120,
            applications_count: 45
          });
        }
        
      } catch (error) {
        console.error('Ma\'lumotlar yuklanmadi:', error);
        setFeaturedListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const stats = [
    { 
      icon: Home, 
      label: 'Yotoqxonalar', 
      value: `${statistics.dormitories_count}`, 
      color: 'text-teal-600' 
    },
    { 
      icon: Building2, 
      label: 'Ijara Xonadonlar', 
      value: `${statistics.apartments_count}`, 
      color: 'text-green-600' 
    },
    { 
      icon: Users, 
      label: 'Talabalar', 
      value: `${statistics.users_count}`, 
      color: 'text-indigo-600' 
    },
    { 
      icon: Shield, 
      label: 'Ishonchli Platforma', 
      value: '24/7', 
      color: 'text-purple-600' 
    }
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Qidiring',
      description: 'O\'zingizga mos yotoqxona yoki kvartira toping',
      icon: Search,
      color: 'bg-teal-100 text-teal-600',
    },
    {
      step: 2,
      title: 'Ariza Yuboring',
      description: 'Tanlagan joyingizga onlayn ariza yuboring',
      icon: MessageCircle,
      color: 'bg-green-100 text-green-600',
    },
    {
      step: 3,
      title: 'Ko\'chib O\'ting',
      description: 'Tasdiqlangandan so\'ng yangi uyingizga ko\'chib o\'ting',
      icon: Home,
      color: 'bg-indigo-100 text-indigo-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
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

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dormitories')}
                className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Home className="w-5 h-5" />
                Yotoqxona Topish
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/rentals')}
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Building2 className="w-5 h-5" />
                Ijara Topish
              </motion.button>
            </div>
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
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Qidiruv
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              O'zingizga mos yotoqxona yoki kvartira toping
            </p>
            <SearchBar onSearch={handleSearch} />
          </motion.div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {searchQuery ? `"${searchQuery}" uchun qidiruv natijalari` : 'Mashhur Elonlar'}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {searchQuery 
                ? `${filteredListings.length} ta natija topildi`
                : 'Talabalar orasida eng mashhur va yuqori baholangan yashash joylari'
              }
            </p>
            {searchQuery && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSearchQuery('');
                  setFilteredListings([]);
                }}
                className="mt-4 text-teal-600 hover:text-teal-700 font-medium transition-colors duration-200"
              >
                Barcha elonlarni ko'rish
              </motion.button>
            )}
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-300">
                  Yotoqxonalar yuklanmoqda...
                </p>
              </div>
            </div>
          ) : searchQuery && filteredListings.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Qidiruv bo'yicha natija topilmadi
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                "{searchQuery}" uchun hech narsa topilmadi. Boshqa kalit so'zlar bilan qidirib ko'ring.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dormitories')}
                className="bg-gradient-to-r from-teal-600 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                Barcha yotoqxonalarni ko'rish
              </motion.button>
            </div>
          ) : !searchQuery && featuredListings.length === 0 ? (
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
              {(searchQuery ? filteredListings : featuredListings).map((listing, index) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  {listing.type === 'dormitory' ? (
                    <DormitoryCard
                      id={listing.id}
                      name={listing.title}
                      month_price={listing.price}
                      address={listing.location}
                      universityName={listing.university}
                      images={listing.images}
                      amenities={listing.amenities}
                      available_capacity={(listing as any).available_capacity ?? 0}
                      total_capacity={listing.capacity}
                      description={listing.description}
                      onSelect={() => onListingSelect(listing)}
                      canApply={!!user}
                    />
                  ) : (
                    <ListingCard
                      listing={listing}
                      onSelect={() => onListingSelect(listing)}
                      user={null}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {!searchQuery && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center mt-12"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dormitories')}
                className="bg-gradient-to-r from-teal-600 to-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 inline-flex items-center gap-2"
              >
                Barcha Elonlarni Ko'rish
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
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
              Minglab talabalar bizning platformamiz orqali o'zlariga mos yashash joyini topdilar. Endi sizning navbatingiz!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(user ? '/dashboard' : '/register')}
                className="bg-white text-teal-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-300"
              >
                {user ? 'Dashboard' : 'Ro\'yhatdan O\'tish'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/about')}
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