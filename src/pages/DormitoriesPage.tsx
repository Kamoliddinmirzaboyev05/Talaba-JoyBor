import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, MapPin, Users, Star, Wifi, Shield, Car, Building2, Clock, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Listing, Dormitory } from '../types';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { authAPI } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

interface DormitoriesPageProps {
  onListingSelect: (listing: Listing) => void;
  onApplicationStart: (listing: Listing) => void;
}

const DormitoriesPage: React.FC<DormitoriesPageProps> = ({ onListingSelect, onApplicationStart }) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [dormitories, setDormitories] = useState<Dormitory[]>([]);
  const [filteredDormitories, setFilteredDormitories] = useState<Dormitory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState({
    location: '',
    university: '',
    priceRange: '',
    capacity: '',
    amenities: [] as string[]
  });
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  const [imageIndexes, setImageIndexes] = useState<{[key: number]: number}>({});
  const [provinces, setProvinces] = useState<{ id: number; name: string }[]>([]);

  // API dan yotoqxonalar va viloyatlarni yuklash
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [dormitoriesData, provincesData] = await Promise.all([
          authAPI.getDormitories(),
          authAPI.getProvinces()
        ]);
        
        setDormitories(dormitoriesData);
        setFilteredDormitories(dormitoriesData);
        setProvinces(provincesData);
      } catch (error) {
        console.error('Ma\'lumotlar yuklanmadi:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Qidiruv va filtrlash
  useEffect(() => {
    let filtered = dormitories;

    // Qidiruv bo'yicha filtrlash
    if (searchQuery) {
      filtered = filtered.filter(dormitory =>
        dormitory.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dormitory.university.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dormitory.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtrlar bo'yicha filtrlash
    if (selectedFilters.university) {
      filtered = filtered.filter(dormitory =>
        dormitory.university.name === selectedFilters.university
      );
    }

    if (selectedFilters.priceRange) {
      const [min, max] = selectedFilters.priceRange.split('-').map(Number);
      filtered = filtered.filter(dormitory => {
        const price = dormitory.month_price;
        if (max) {
          return price >= min && price <= max;
        } else {
          return price >= min;
        }
      });
    }

    if (selectedFilters.capacity) {
      const capacity = parseInt(selectedFilters.capacity);
      filtered = filtered.filter(dormitory =>
        dormitory.available_capacity >= capacity
      );
    }

    // Saralash
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.month_price - b.month_price;
        case 'price-high':
          return b.month_price - a.month_price;
        case 'capacity':
          return b.available_capacity - a.available_capacity;
        case 'distance':
          return a.distance_to_university - b.distance_to_university;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredDormitories(filtered);
  }, [dormitories, searchQuery, selectedFilters, sortBy]);

  // Yotoqxonani Listing formatiga o'tkazish
  const convertDormitoryToListing = (dormitory: Dormitory): Listing => {
    return {
      id: dormitory.id.toString(),
      title: dormitory.name,
      type: 'dormitory',
      price: dormitory.month_price,
      location: dormitory.address,
      university: dormitory.university.name,
      images: dormitory.images.map(img => img.image),
      amenities: dormitory.amenities.map(amenity => amenity.name),
      description: dormitory.description,
      capacity: dormitory.total_capacity,
      available: dormitory.available_capacity > 0,
      rating: 4.5, // Default rating
      reviews: 0, // Default reviews
      features: {
        furnished: true,
        wifi: dormitory.amenities.some(a => a.name.toLowerCase().includes('wifi')),
        parking: dormitory.amenities.some(a => a.name.toLowerCase().includes('parking')),
        security: dormitory.amenities.some(a => a.name.toLowerCase().includes('security'))
      },
      rules: dormitory.rules,
      coordinates: {
        lat: dormitory.latitude,
        lng: dormitory.longitude
      }
    };
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m';
  };

  const nextImage = (dormitoryId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const dormitory = dormitories.find(d => d.id === dormitoryId);
    if (dormitory && dormitory.images.length > 1) {
      setImageIndexes(prev => ({
        ...prev,
        [dormitoryId]: ((prev[dormitoryId] || 0) + 1) % dormitory.images.length
      }));
    }
  };

  const prevImage = (dormitoryId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const dormitory = dormitories.find(d => d.id === dormitoryId);
    if (dormitory && dormitory.images.length > 1) {
      setImageIndexes(prev => ({
        ...prev,
        [dormitoryId]: ((prev[dormitoryId] || 0) - 1 + dormitory.images.length) % dormitory.images.length
      }));
    }
  };

  const universities = [...new Set(dormitories.map(d => d.university.name))];
  const priceRanges = [
    { label: '100,000 - 300,000', value: '100000-300000' },
    { label: '300,000 - 500,000', value: '300000-500000' },
    { label: '500,000 - 1,000,000', value: '500000-1000000' },
    { label: '1,000,000+', value: '1000000' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Yotoqxonalar yuklanmoqda...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Yotoqxonalar
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            O'zbekiston universitetlarining eng yaxshi yotoqxonalarini toping
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Yotoqxona, universitet yoki manzilni qidiring..."
                className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ${
                  theme === 'dark' 
                    ? 'border-gray-600 bg-gray-700 text-white' 
                    : 'border-gray-300 bg-white text-gray-900'
                }`}
              />
            </div>
            
            <div className="flex gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`px-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ${
                  theme === 'dark' 
                    ? 'border-gray-600 bg-gray-700 text-white' 
                    : 'border-gray-300 bg-white text-gray-900'
                }`}
              >
                <option value="name">Nomi bo'yicha</option>
                <option value="price-low">Arzon narx</option>
                <option value="price-high">Qimmat narx</option>
                <option value="capacity">Joy soni</option>
                <option value="distance">Masofa</option>
              </select>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
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
                    Universitet
                  </label>
                  <select
                    value={selectedFilters.university}
                    onChange={(e) => setSelectedFilters(prev => ({ ...prev, university: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ${
                      theme === 'dark' 
                        ? 'border-gray-600 bg-gray-700 text-white' 
                        : 'border-gray-300 bg-white text-gray-900'
                    }`}
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
                    Minimal joy soni
                  </label>
                  <select
                    value={selectedFilters.capacity}
                    onChange={(e) => setSelectedFilters(prev => ({ ...prev, capacity: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ${
                      theme === 'dark' 
                        ? 'border-gray-600 bg-gray-700 text-white' 
                        : 'border-gray-300 bg-white text-gray-900'
                    }`}
                  >
                    <option value="">Istalgan</option>
                    <option value="1">1+ joy</option>
                    <option value="5">5+ joy</option>
                    <option value="10">10+ joy</option>
                    <option value="20">20+ joy</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedFilters({
                      location: '',
                      university: '',
                      priceRange: '',
                      capacity: '',
                      amenities: []
                    })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    Tozalash
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            <span className="font-semibold text-gray-900 dark:text-white">{filteredDormitories.length}</span> ta yotoqxona topildi
          </p>
        </div>

        {/* Dormitories Grid */}
        {filteredDormitories.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Yotoqxona topilmadi
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Qidiruv shartlarini o'zgartirib qaytadan urinib ko'ring
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDormitories.map((dormitory, index) => (
              <motion.div
                key={dormitory.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <motion.img
                    key={`dorm-${dormitory.id}-${imageIndexes[dormitory.id] || 0}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    src={dormitory.images[imageIndexes[dormitory.id] || 0]?.image || '/placeholder-dormitory.svg'}
                    alt={dormitory.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-dormitory.svg';
                    }}
                  />
                  
                  {/* Image Navigation */}
                  {dormitory.images && dormitory.images.length > 1 && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => prevImage(dormitory.id, e)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-black/80 backdrop-blur-sm shadow-lg"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => nextImage(dormitory.id, e)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-black/80 backdrop-blur-sm shadow-lg"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </motion.button>
                      
                      {/* Image Indicators */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1 bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
                        {dormitory.images.map((_, index) => (
                          <motion.button
                            key={index}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setImageIndexes(prev => ({...prev, [dormitory.id]: index}));
                            }}
                            className={`w-2 h-2 rounded-full transition-all duration-200 ${
                              index === (imageIndexes[dormitory.id] || 0) ? 'bg-white' : 'bg-white/50 hover:bg-white/70'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Image Counter */}
                      <div className="absolute top-2 right-2 z-10 px-2 py-1 bg-black/60 text-white text-xs rounded-full backdrop-blur-sm">
                        {(imageIndexes[dormitory.id] || 0) + 1}/{dormitory.images.length}
                      </div>
                    </>
                  )}
                  
                  {/* Availability Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm shadow-lg ${
                      dormitory.available_capacity > 0
                        ? 'bg-green-100/90 text-green-800 dark:bg-green-900/60 dark:text-green-300'
                        : 'bg-red-100/90 text-red-800 dark:bg-red-900/60 dark:text-red-300'
                    }`}>
                      {dormitory.available_capacity > 0 ? 'Mavjud' : 'To\'liq'}
                    </span>
                  </div>

                  {/* Price Badge */}
                  <div className="absolute bottom-3 left-3 z-10">
                    <span className="px-3 py-1 bg-black/70 text-white rounded-full text-sm font-semibold backdrop-blur-sm shadow-lg">
                      {formatPrice(dormitory.month_price)}/oy
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Title and University */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                      {dormitory.name}
                    </h3>
                    <div className="flex items-center gap-2 text-teal-600 mb-2">
                      <Building2 className="w-4 h-4" />
                      <span className="text-sm font-medium">{dormitory.university.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm line-clamp-1">{dormitory.address}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {dormitory.available_capacity}/{dormitory.total_capacity} joy
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {dormitory.distance_to_university} km
                      </span>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="flex items-center gap-3 mb-4">
                    {dormitory.amenities.slice(0, 3).map((amenity) => (
                      <div key={amenity.id} className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-xs">{amenity.name}</span>
                      </div>
                    ))}
                    {dormitory.amenities.length > 3 && (
                      <span className="text-xs text-gray-500">+{dormitory.amenities.length - 3} ko'proq</span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {dormitory.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onListingSelect(convertDormitoryToListing(dormitory))}
                      className="flex-1 bg-gradient-to-r from-teal-600 to-green-600 text-white py-2 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      Ko'rish
                    </motion.button>
                    
                    {user && dormitory.available_capacity > 0 && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onApplicationStart(convertDormitoryToListing(dormitory))}
                        className="px-4 py-2 border-2 border-teal-600 text-teal-600 rounded-lg font-medium hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all duration-300"
                      >
                        Ariza Yuborish
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DormitoriesPage;