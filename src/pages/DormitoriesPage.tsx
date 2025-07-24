import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import { PageType } from '../App';
import { User, Listing } from '../types';
import Header from '../components/Header';
import ListingCard from '../components/ListingCard';
import { authAPI } from '../services/api';

interface DormitoriesPageProps {
  onNavigate: (page: PageType) => void;
  user: User | null;
  onListingSelect: (listing: Listing) => void;
  onApplicationStart: (listing: Listing) => void;
}

const DormitoriesPage: React.FC<DormitoriesPageProps> = ({ onNavigate, user, onListingSelect, onApplicationStart }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    location: '',
    university: '',
    priceRange: '',
    roomType: '',
    amenities: [] as string[]
  });
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [provinces, setProvinces] = useState<{ id: number; name: string }[]>([]);

  // API dan shaharlar ro'yxatini yuklash
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const data = await authAPI.getProvinces();
        setProvinces(data);
      } catch (error) {
        console.error('Shaharlar yuklanmadi:', error);
      }
    };
    fetchProvinces();
  }, []);

  const dormitories: Listing[] = [
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
      title: 'TDTU Talabalar Shaharchasi',
      type: 'dormitory',
      price: 350000,
      location: 'Yunusobod, Toshkent',
      university: 'TDTU',
      images: ['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg'],
      amenities: ['WiFi', 'Konditsioner', 'Sport zali', 'Kutubxona'],
      description: 'Zamonaviy talabalar shaharchasi',
      capacity: 2,
      available: true,
      rating: 4.7,
      reviews: 156,
      features: {
        furnished: true,
        wifi: true,
        parking: true,
        security: true
      },
      rules: ['Mehmonlar ro\'yhatdan o\'tishi shart', 'Tinchlik soatlari 22:00-07:00'],
      coordinates: { lat: 41.3775, lng: 69.2718 }
    }
  ];

  const universities = ['TATU', 'MirU', 'TDTU', 'TIQXMMI', 'Boshqa'];
  const priceRanges = ['100,000-300,000', '300,000-500,000', '500,000-800,000', '800,000+'];
  const roomTypes = ['Yakka xona', 'Ikki kishilik', 'Uch kishilik', 'To\'rt kishilik'];
  const amenitiesList = ['WiFi', 'Konditsioner', 'Oshxona', 'Sport zali', 'Kutubxona', 'Xavfsizlik'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header user={user} onNavigate={onNavigate} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Universitet Yotoqxonalari
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            O'zbekistondagi eng yaxshi universitet yotoqxonalarini toping
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8"
        >
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Yotoqxona nomini kiriting..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div className="flex gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:text-white"
              >
                <option value="rating">Reyting bo'yicha</option>
                <option value="price-low">Arzon narx</option>
                <option value="price-high">Qimmat narx</option>
                <option value="newest">Yangi qo'shilgan</option>
              </select>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors duration-200 flex items-center gap-2"
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filtrlar
              </motion.button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-gray-200 dark:border-gray-700 pt-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Shahar
                  </label>
                  <select
                    value={selectedFilters.location}
                    onChange={(e) => setSelectedFilters(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Barcha shaharlar</option>
                    {provinces.map(province => (
                      <option key={province.id} value={province.name}>{province.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Universitet
                  </label>
                  <select
                    value={selectedFilters.university}
                    onChange={(e) => setSelectedFilters(prev => ({ ...prev, university: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Barcha universitetlar</option>
                    {universities.map(uni => (
                      <option key={uni} value={uni}>{uni}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Narx oralig'i
                  </label>
                  <select
                    value={selectedFilters.priceRange}
                    onChange={(e) => setSelectedFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Barcha narxlar</option>
                    {priceRanges.map(range => (
                      <option key={range} value={range}>{range} so'm</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Xona turi
                  </label>
                  <select
                    value={selectedFilters.roomType}
                    onChange={(e) => setSelectedFilters(prev => ({ ...prev, roomType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Barcha turlar</option>
                    {roomTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Qulayliklar
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:text-white">
                    <option value="">Barcha qulayliklar</option>
                    {amenitiesList.map(amenity => (
                      <option key={amenity} value={amenity}>{amenity}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            {dormitories.length} ta yotoqxona topildi
          </p>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dormitories.map((dormitory, index) => (
            <motion.div
              key={dormitory.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <ListingCard
                listing={dormitory}
                onSelect={() => onListingSelect(dormitory)}
                user={user}
              />
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <button className="bg-gradient-to-r from-teal-600 to-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
            Ko'proq Ko'rish
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default DormitoriesPage;