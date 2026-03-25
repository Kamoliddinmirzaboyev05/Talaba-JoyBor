import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Building2, SlidersHorizontal, ChevronRight } from 'lucide-react';

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
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full max-w-5xl mx-auto px-4"
    >
      <div className="relative group">
        {/* Glow effect on hover */}
        <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
        
        <div className="relative bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-800 p-2 md:p-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
            
            {/* Main Input Section */}
            <div className="flex-1 relative flex items-center min-w-0">
              <div className="absolute left-5 text-teal-500">
                <Search size={22} strokeWidth={2.5} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Yotoqxona yoki manzil..."
                className="w-full pl-14 pr-4 py-4 md:py-5 bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white text-base md:text-lg font-medium placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>

            {/* Divider (Desktop Only) */}
            <div className="hidden md:block w-px h-10 bg-gray-100 dark:bg-gray-800 mx-2" />

            {/* Quick Filter Section (Simulated) */}
            <div className="hidden lg:flex items-center gap-4 px-4 whitespace-nowrap">
              <div className="flex items-center gap-2 text-gray-400 hover:text-teal-500 cursor-pointer transition-colors">
                <MapPin size={18} />
                <span className="text-sm font-bold uppercase tracking-widest">Hudud</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 hover:text-teal-500 cursor-pointer transition-colors">
                <Building2 size={18} />
                <span className="text-sm font-bold uppercase tracking-widest">OTM</span>
              </div>
            </div>

            {/* Search Button Section */}
            <div className="flex items-center gap-2 mt-2 md:mt-0">
              <button className="md:hidden flex-1 flex items-center justify-center gap-2 py-4 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-2xl font-bold text-sm uppercase tracking-widest active:scale-95 transition-transform">
                <SlidersHorizontal size={18} />
                Filtrlar
              </button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSearch}
                className="flex-[2] md:flex-none px-8 md:px-12 py-4 md:py-5 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black text-sm md:text-base uppercase tracking-[0.1em] shadow-lg shadow-teal-500/25 transition-all flex items-center justify-center gap-3"
              >
                <span>Qidirish</span>
                <ChevronRight className="hidden md:block w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Tags (Optional UX Improvement) */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2 px-4">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mr-2">Ommabop:</span>
        {['Chilonzor', 'Yunusobod', 'Tashkent City', 'Arzon'].map((tag) => (
          <button 
            key={tag}
            className="px-4 py-1.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-full text-[11px] font-bold text-gray-500 dark:text-gray-400 hover:border-teal-500 hover:text-teal-600 transition-all shadow-sm"
          >
            {tag}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default SearchBar;