import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Building2 } from 'lucide-react';
import { authAPI } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

interface SearchBarProps {
  onSearch: (searchData: {
    query: string;
    location: string;
    university: string;
    priceRange: string;
    roomType: string;
    amenities: string;
    distance: string;
  }) => void;
}

interface Province {
  id: number;
  name: string;
}

interface University {
  id: number;
  name: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [university, setUniversity] = useState('');


  const [provinces, setProvinces] = useState<Province[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingUniversities, setLoadingUniversities] = useState(true);

  // API dan shaharlar va universitetlar ro'yxatini yuklash
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [provincesData, universitiesData] = await Promise.all([
          authAPI.getProvinces().catch(() => [
            { id: 1, name: 'Toshkent' },
            { id: 2, name: 'Samarqand' },
            { id: 3, name: 'Buxoro' },
            { id: 4, name: 'Andijon' },
            { id: 5, name: 'Namangan' },
            { id: 6, name: 'Farg\'ona' }
          ]),
          authAPI.getUniversities()
        ]);
        
        setProvinces(provincesData);
        setUniversities(universitiesData);
      } catch (error) {
        console.error('Ma\'lumotlar yuklanmadi:', error);
      } finally {
        setLoadingProvinces(false);
        setLoadingUniversities(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = () => {
    onSearch({
      query: searchQuery,
      location,
      university,
      priceRange: '',
      roomType: '',
      amenities: '',
      distance: ''
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setLocation('');
    setUniversity('');
  };





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
                className={`relative w-full pl-14 pr-6 py-5 border-0 rounded-2xl focus:ring-2 focus:ring-teal-500 transition-all duration-300 text-lg ${
                  theme === 'dark' 
                    ? 'bg-gray-700 focus:bg-gray-600 text-white placeholder-gray-400' 
                    : 'bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>

            {/* Quick Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              
              {/* Location Dropdown */}
              <div className="relative group min-w-[220px]">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-green-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-teal-500 transition-colors duration-200 z-10" />
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={loadingProvinces}
                  className={`relative w-full pl-12 pr-10 py-5 border-0 rounded-2xl focus:ring-2 focus:ring-teal-500 transition-all duration-300 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-base font-medium ${
                    theme === 'dark' 
                      ? 'bg-gray-700 focus:bg-gray-600 text-white hover:bg-gray-600' 
                      : 'bg-gray-50 focus:bg-white text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <option value="">
                    {loadingProvinces ? 'Yuklanmoqda...' : 'Shahar tanlang'}
                  </option>
                  {provinces.map((province) => (
                    <option key={province.id} value={province.name}>
                      {province.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* University Dropdown */}
              <div className="relative group min-w-[280px]">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-green-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-teal-500 transition-colors duration-200 z-10" />
                <select
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  disabled={loadingUniversities}
                  className={`relative w-full pl-12 pr-10 py-5 border-0 rounded-2xl focus:ring-2 focus:ring-teal-500 transition-all duration-300 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-base font-medium ${
                    theme === 'dark' 
                      ? 'bg-gray-700 focus:bg-gray-600 text-white hover:bg-gray-600' 
                      : 'bg-gray-50 focus:bg-white text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <option value="">
                    {loadingUniversities ? 'Yuklanmoqda...' : 'Universitet tanlang'}
                  </option>
                  {universities.map((uni) => (
                    <option key={uni.id} value={uni.name}>
                      {uni.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>



              {/* Search Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSearch}
                className="bg-gradient-to-r from-teal-600 via-teal-600 to-green-600 text-white px-10 py-5 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 min-w-[160px] hover:from-teal-700 hover:to-green-700"
              >
                <Search className="w-5 h-5" />
                Qidirish
              </motion.button>

              {/* Clear Filters Button */}
              {(searchQuery || location || university) && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={clearFilters}
                  className="px-6 py-5 border-2 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-2xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Tozalash
                </motion.button>
              )}
            </div>
          </div>


        </div>


      </div>
    </motion.div>
  );
};

export default SearchBar;