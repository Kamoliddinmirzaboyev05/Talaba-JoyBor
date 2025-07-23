import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Map } from 'lucide-react';
import { PageType } from '../App';
import { User, Listing } from '../types';
import Header from '../components/Header';
import ListingCard from '../components/ListingCard';

interface RentalsPageProps {
  onNavigate: (page: PageType) => void;
  user: User | null;
  onListingSelect: (listing: Listing) => void;
}

const RentalsPage: React.FC<RentalsPageProps> = ({ onNavigate, user, onListingSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedFilters, setSelectedFilters] = useState({
    location: '',
    priceRange: '',
    roomType: '',
    furnished: ''
  });
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);

  const rentals: Listing[] = [
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
    },
    {
      id: '4',
      title: 'Chilonzor 1-Xonali Kvartira',
      type: 'rental',
      price: 1800000,
      location: 'Chilonzor, Toshkent',
      university: 'TATU yaqinida',
      images: ['https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg'],
      amenities: ['WiFi', 'Konditsioner', 'Oshxona', 'Xavfsizlik'],
      description: 'Qulay joylashgan 1-xonali kvartira',
      capacity: 2,
      available: true,
      rating: 4.6,
      reviews: 43,
      landlord: {
        name: 'Malika Tosheva',
        phone: '+998901234568',
        email: 'malika@example.com',
        verified: true,
        rating: 4.7
      },
      features: {
        furnished: true,
        wifi: true,
        parking: false,
        security: true
      },
      rules: ['Mehmonlar 23:00 gacha', 'Tozalik saqlanishi shart'],
      coordinates: { lat: 41.2995, lng: 69.2401 }
    },
    {
      id: '5',
      title: 'Mirzo Ulug\'bek 3-Xonali Kvartira',
      type: 'rental',
      price: 3200000,
      location: 'Mirzo Ulug\'bek, Toshkent',
      university: 'MirU yaqinida',
      images: ['https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg'],
      amenities: ['WiFi', 'Konditsioner', 'Kir yuvish mashinasi', 'Balkon', 'Lift'],
      description: 'Keng va yorug\' 3-xonali kvartira',
      capacity: 6,
      available: true,
      rating: 4.8,
      reviews: 92,
      landlord: {
        name: 'Bobur Alimov',
        phone: '+998901234569',
        email: 'bobur@example.com',
        verified: true,
        rating: 4.9
      },
      features: {
        furnished: true,
        wifi: true,
        parking: true,
        security: true
      },
      rules: ['Sigaret chekish taqiqlanadi', 'Hayvonlar ruxsat etiladi'],
      coordinates: { lat: 41.3111, lng: 69.2797 }
    }
  ];

  const locations = ['Chilonzor', 'Yunusobod', 'Mirzo Ulug\'bek', 'Shayxontohur', 'Yakkasaroy'];
  const priceRanges = ['1,000,000-2,000,000', '2,000,000-3,000,000', '3,000,000-4,000,000', '4,000,000+'];
  const roomTypes = ['1-xonali', '2-xonali', '3-xonali', '4+ xonali'];

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
            Ijara Xonadonlar
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Talabalar uchun qulay ijara xonadonlarini toping
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
                placeholder="Kvartira yoki xona qidiring..."
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
              
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 rounded-lg transition-colors duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-white dark:bg-gray-600 text-teal-600 shadow-sm' 
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-3 py-2 rounded-lg transition-colors duration-200 flex items-center gap-1 ${
                    viewMode === 'map' 
                      ? 'bg-white dark:bg-gray-600 text-teal-600 shadow-sm' 
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  <Map className="w-4 h-4" />
                  Xarita
                </button>
              </div>
              
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Joylashuv
                  </label>
                  <select
                    value={selectedFilters.location}
                    onChange={(e) => setSelectedFilters(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Barcha joylar</option>
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
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
                    Xonalar soni
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
                    Jihozlanganlik
                  </label>
                  <select
                    value={selectedFilters.furnished}
                    onChange={(e) => setSelectedFilters(prev => ({ ...prev, furnished: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Barcha turlar</option>
                    <option value="furnished">Jihozlangan</option>
                    <option value="unfurnished">Jihozlanmagan</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            {rentals.length} ta ijara xonadoni topildi
          </p>
        </div>

        {/* Map View Placeholder */}
        {viewMode === 'map' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8 text-center"
          >
            <Map className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Xarita Ko'rinishi
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Xarita integratsiyasi tez orada qo'shiladi
            </p>
          </motion.div>
        )}

        {/* Listings Grid */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rentals.map((rental, index) => (
              <motion.div
                key={rental.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ListingCard
                  listing={rental}
                  onSelect={() => onListingSelect(rental)}
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