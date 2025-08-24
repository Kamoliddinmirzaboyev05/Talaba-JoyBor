import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
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

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    onSearch({
      query: searchQuery,
      location: '',
      university: '',
      priceRange: '',
      roomType: '',
      amenities: '',
      distance: ''
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };





  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Simplified Search Container */}
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            
            {/* Search Input - Takes most space */}
            <div className="flex-1 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-green-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-teal-500 transition-colors duration-200 z-10" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Yotoqxona, kvartira yoki joylashuvni qidiring..."
                className={`relative w-full pl-14 pr-6 py-5 border-0 rounded-2xl focus:ring-2 focus:ring-teal-500 transition-all duration-300 text-lg ${
                  theme === 'dark' 
                    ? 'bg-gray-700 focus:bg-gray-600 text-white placeholder-gray-400' 
                    : 'bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500'
                }`}
              />
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
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SearchBar;