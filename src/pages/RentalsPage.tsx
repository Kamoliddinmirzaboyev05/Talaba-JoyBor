import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Building2 } from 'lucide-react';
import { Listing } from '../types';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import ListingCard from '../components/ListingCard';
import { authAPI } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

interface RentalsPageProps {
  onListingSelect: (listing: Listing) => void;
  onApplicationStart: (listing: Listing) => void;
}

const RentalsPage: React.FC<RentalsPageProps> = ({ onListingSelect, onApplicationStart }) => {
  const { user } = useAuth();
  const { theme } = useTheme();

  // Sahifa yuklanganda yuqoriga scroll qilish
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    location: '',
    priceRange: '',
    roomType: ''
  });
  const [sortBy, setSortBy] = useState('rating');
  const [provinces, setProvinces] = useState<{ id: number; name: string }[]>([]);
  const [apartments, setApartments] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // API dan shaharlar ro'yxatini yuklash
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const data = await authAPI.getProvinces();
        setProvinces(data);
      } catch (error) {
        console.error('Shaharlar yuklanmadi:', error);
        // Fallback shaharlar ro'yxati
        setProvinces([
          { id: 1, name: 'Toshkent' },
          { id: 2, name: 'Samarqand' },
          { id: 3, name: 'Buxoro' },
          { id: 4, name: 'Andijon' },
          { id: 5, name: 'Namangan' },
          { id: 6, name: 'Farg\'ona' },
          { id: 7, name: 'Qashqadaryo' },
          { id: 8, name: 'Surxondaryo' },
          { id: 9, name: 'Jizzax' },
          { id: 10, name: 'Sirdaryo' },
          { id: 11, name: 'Navoiy' },
          { id: 12, name: 'Xorazm' },
          { id: 13, name: 'Qoraqalpog\'iston' }
        ]);
      }
    };
    fetchProvinces();
  }, []);

  // API dan apartments ma'lumotlarini yuklash
  useEffect(() => {
    const fetchApartments = async () => {
      try {
        setLoading(true);
        const apartmentsData = await authAPI.getApartments();

        // API strukturasiga mos apartments mapping
        const convertedListings: Listing[] = apartmentsData.map((apartment: any) => ({
          id: apartment.id.toString(),
          title: apartment.title || 'Ijara Xonadon',
          type: 'rental' as const,
          price: apartment.monthly_price || 0,
          location: apartment.exact_address || 'Manzil ko\'rsatilmagan',
          university: `${apartment.room_type} - ${apartment.gender}`,
          images: apartment.images?.map((img: any) => img.image) || ['/placeholder-apartment.jpg'],
          amenities: apartment.amenities?.map((amenity: any) => amenity.name) || [],
          description: apartment.description || 'Tavsif mavjud emas',
          capacity: apartment.total_rooms || 1,
          available: apartment.available_rooms > 0,
          rating: 4.0, // Default rating
          reviews: 0, // Default reviews
          features: {
            furnished: true, // Default
            wifi: apartment.amenities?.some((a: any) => 
              a.name?.toLowerCase().includes('wifi') || 
              a.name?.toLowerCase().includes('internet')
            ) || false,
            parking: apartment.amenities?.some((a: any) => 
              a.name?.toLowerCase().includes('parking') || 
              a.name?.toLowerCase().includes('avtomobil')
            ) || false,
            security: apartment.amenities?.some((a: any) => 
              a.name?.toLowerCase().includes('security') || 
              a.name?.toLowerCase().includes('xavfsizlik')
            ) || false
          },
          rules: [],
          coordinates: {
            lat: apartment.latitude || 41.2995, // Default Tashkent coordinates
            lng: apartment.longitude || 69.2401
          },
          // Qo'shimcha apartment ma'lumotlari
          rooms: apartment.total_rooms || 1,
          available_rooms: apartment.available_rooms || 0,
          room_type: apartment.room_type || '1 kishilik',
          gender: apartment.gender || 'Aralash',
          owner: apartment.user || 'Egasi ko\'rsatilmagan',
          phone_number: apartment.phone_number || '',
          province: apartment.province || 1,
          created_at: apartment.created_at || new Date().toISOString(),
          is_active: apartment.is_active !== false
        }));

        setApartments(convertedListings);
      } catch (error) {
        console.error('Apartments yuklanmadi:', error);
        setApartments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApartments();
  }, []);

  const priceRanges = [
    { label: '500,000 - 1,000,000', value: '500000-1000000' },
    { label: '1,000,000 - 2,000,000', value: '1000000-2000000' },
    { label: '2,000,000 - 3,000,000', value: '2000000-3000000' },
    { label: '3,000,000+', value: '3000000' }
  ];
  const roomTypes = ['1-xonali', '2-xonali', '3-xonali', '4+ xonali'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Ijara Xonadonlar
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Talabalar uchun qulay va arzon ijara xonadonlarini toping
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
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Kvartira yoki xona qidiring..."
                className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ${
                  theme === 'dark' 
                    ? 'border-gray-600 bg-gray-700 text-white' 
                    : 'border-gray-300 bg-white text-gray-900'
                }`}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`px-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ${
                  theme === 'dark' 
                    ? 'border-gray-600 bg-gray-700 text-white' 
                    : 'border-gray-300 bg-white text-gray-900'
                }`}
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
                className="px-4 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors duration-200 flex items-center justify-center gap-2 whitespace-nowrap"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Viloyat
                  </label>
                  <select
                    value={selectedFilters.location}
                    onChange={(e) => setSelectedFilters(prev => ({ ...prev, location: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ${
                      theme === 'dark' 
                        ? 'border-gray-600 bg-gray-700 text-white' 
                        : 'border-gray-300 bg-white text-gray-900'
                    }`}
                  >
                    <option value="">Barcha viloyatlar</option>
                    {provinces.map(province => (
                      <option key={province.id} value={province.name}>{province.name}</option>
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
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ${
                      theme === 'dark' 
                        ? 'border-gray-600 bg-gray-700 text-white' 
                        : 'border-gray-300 bg-white text-gray-900'
                    }`}
                  >
                    <option value="">Barcha narxlar</option>
                    {priceRanges.map(range => (
                      <option key={range.value} value={range.value}>{range.label} so'm</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Xonalar soni
                  </label>
                  <select
                    value={selectedFilters.roomType}
                    onChange={(e) => setSelectedFilters(prev => ({ ...prev, roomType: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ${
                      theme === 'dark' 
                        ? 'border-gray-600 bg-gray-700 text-white' 
                        : 'border-gray-300 bg-white text-gray-900'
                    }`}
                  >
                    <option value="">Barcha turlar</option>
                    {roomTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Clear Filters Button */}
              <div className="flex justify-end mt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedFilters({ location: '', priceRange: '', roomType: '' })}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors duration-200"
                >
                  Filtrlarni Tozalash
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            {loading ? 'Yuklanmoqda...' : `${apartments.length} ta ijara xonadoni topildi`}
          </p>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Ijara xonadonlar yuklanmoqda...</p>
            </div>
          </div>
        ) : apartments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Ijara xonadonlar topilmadi
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Qidiruv shartlarini o'zgartirib qaytadan urinib ko'ring
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {apartments.map((apartment, index) => (
              <motion.div
                key={apartment.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ListingCard
                  listing={apartment}
                  onSelect={() => onListingSelect(apartment)}
                  user={user}
                />
              </motion.div>
            ))}
          </div>
        )}

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

export default RentalsPage;