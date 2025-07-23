import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, DollarSign, Filter, Calendar, X, Home, Building2, Users, Wifi } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [roomType, setRoomType] = useState('');
  const [amenities, setAmenities] = useState('');
  const [distance, setDistance] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setLocation('');
    setPriceRange('');
    setRoomType('');
    setAmenities('');
    setDistance('');
  };

  const locations = [
    'Toshkent',
    'Samarqand', 
    'Buxoro',
    'Andijon',
    'Namangan',
    'Farg\'ona',
    'Qarshi',
    'Nukus'
  ];

  const priceRanges = [
    { label: '100,000 - 500,000 so\'m', value: '100000-500000' },
    { label: '500,000 - 1,000,000 so\'m', value: '500000-1000000' },
    { label: '1,000,000 - 2,000,000 so\'m', value: '1000000-2000000' },
    { label: '2,000,000 - 3,000,000 so\'m', value: '2000000-3000000' },
    { label: '3,000,000+ so\'m', value: '3000000+' }
  ];

  const roomTypes = [
    { label: 'Yakka xona', value: 'single', icon: Home },
    { label: 'Ikki kishilik', value: 'double', icon: Users },
    { label: 'Uch kishilik', value: 'triple', icon: Users },
    { label: 'Kvartira', value: 'apartment', icon: Building2 }
  ];

  const amenitiesList = [
    { label: 'WiFi', value: 'wifi', icon: Wifi },
    { label: 'Konditsioner', value: 'ac', icon: '❄️' },
    { label: 'Oshxona', value: 'kitchen', icon: '🍳' },
    { label: 'Avtoturargoh', value: 'parking', icon: '🚗' },
    { label: 'Xavfsizlik', value: 'security', icon: '🛡️' }
  ];

  const distances = [
    { label: '1 km gacha', value: '1km' },
    { label: '3 km gacha', value: '3km' },
    { label: '5 km gacha', value: '5km' },
    { label: '10 km gacha', value: '10km' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="w-full max-w-6xl mx-auto"
    >
      {/* Main Search Container */}
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
        
        {/* Primary Search Bar */}
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            
            {/* Search Input - Takes most space */}
            <div className="flex-1 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-green-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-teal-500 transition-colors duration-200 z-10" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Yotoqxona, kvartira yoki joylashuvni qidiring..."
                className="relative w-full pl-14 pr-6 py-5 bg-gray-50 dark:bg-gray-700 border-0 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:bg-white dark:focus:bg-gray-600 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-lg"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              
              {/* Location Dropdown */}
              <div className="relative group min-w-[200px]">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-teal-500 transition-colors duration-200 z-10" />
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-12 pr-4 py-5 bg-gray-50 dark:bg-gray-700 border-0 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:bg-white dark:focus:bg-gray-600 transition-all duration-300 text-gray-900 dark:text-white appearance-none cursor-pointer"
                >
                  <option value="">Shahar</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="relative group min-w-[220px]">
                <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-teal-500 transition-colors duration-200 z-10" />
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full pl-12 pr-4 py-5 bg-gray-50 dark:bg-gray-700 border-0 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:bg-white dark:focus:bg-gray-600 transition-all duration-300 text-gray-900 dark:text-white appearance-none cursor-pointer"
                >
                  <option value="">Narx</option>
                  {priceRanges.map((range) => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>
              </div>

              {/* Search Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSearch}
                className="bg-gradient-to-r from-teal-600 via-teal-600 to-green-600 text-white px-8 py-5 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 min-w-[140px]"
              >
                <Search className="w-5 h-5" />
                Qidirish
              </motion.button>
            </div>
          </div>

          {/* Filter Toggle & Stats */}
          <div className="flex items-center justify-between mt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                showFilters 
                  ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Filter className="w-4 h-4" />
              Qo'shimcha Filtrlar
              <motion.div
                animate={{ rotate: showFilters ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                ▼
              </motion.div>
            </motion.button>

            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>Bugun yangilangan</span>
              </div>
              <div className="px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full font-medium">
                150+ natija
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30"
            >
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  
                  {/* Room Type */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Xona Turi
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {roomTypes.map((type) => (
                        <motion.button
                          key={type.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setRoomType(roomType === type.value ? '' : type.value)}
                          className={`p-3 rounded-xl border-2 transition-all duration-200 flex items-center gap-2 text-sm font-medium ${
                            roomType === type.value
                              ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                              : 'border-gray-200 dark:border-gray-600 hover:border-teal-300 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <type.icon className="w-4 h-4" />
                          {type.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Qulayliklar
                    </label>
                    <div className="space-y-2">
                      {amenitiesList.map((amenity) => (
                        <motion.button
                          key={amenity.value}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => setAmenities(amenities === amenity.value ? '' : amenity.value)}
                          className={`w-full p-3 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 text-sm font-medium ${
                            amenities === amenity.value
                              ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                              : 'border-gray-200 dark:border-gray-600 hover:border-teal-300 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <span className="text-lg">{typeof amenity.icon === 'string' ? amenity.icon : <amenity.icon className="w-4 h-4" />}</span>
                          {amenity.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Distance */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Universitetgacha Masofa
                    </label>
                    <div className="space-y-2">
                      {distances.map((dist) => (
                        <motion.button
                          key={dist.value}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => setDistance(distance === dist.value ? '' : dist.value)}
                          className={`w-full p-3 rounded-xl border-2 transition-all duration-200 text-sm font-medium ${
                            distance === dist.value
                              ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                              : 'border-gray-200 dark:border-gray-600 hover:border-teal-300 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {dist.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Filter Actions */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors duration-200"
                  >
                    <X className="w-4 h-4" />
                    Tozalash
                  </motion.button>
                  
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowFilters(false)}
                      className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-all duration-200"
                    >
                      Yopish
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSearch}
                      className="px-8 py-3 bg-gradient-to-r from-teal-600 to-green-600 text-white rounded-xl hover:shadow-lg font-semibold transition-all duration-300"
                    >
                      Filtrlarni Qo'llash
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SearchBar;