import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Search, SlidersHorizontal, Building2 } from 'lucide-react';
import { Listing, Dormitory } from '../types';
import { formatCapacityBucket } from '../utils/format';
import DormitoryCard from '../components/DormitoryCard';
import Header from '../components/Header';
import { authAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface DormitoriesPageProps {
  onListingSelect: (listing: Listing) => void;
  onApplicationStart: (listing: Listing) => void;
}

const DormitoriesPage: React.FC<DormitoriesPageProps> = ({ onListingSelect, onApplicationStart }) => {
  const { user } = useAuth();
  const location = useLocation();
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


  // Sahifa yuklanganda yuqoriga scroll qilish
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // HomePage dan kelgan qidiruv ma'lumotlarini olish
  useEffect(() => {
    if (location.state?.searchFilters) {
      const filters = location.state.searchFilters;
      setSearchQuery(filters.query || '');
      setSelectedFilters(prev => ({
        ...prev,
        location: filters.location || '',
        university: filters.university || '',
        priceRange: filters.priceRange || ''
      }));
      if (filters.query || filters.location || filters.university || filters.priceRange) {
        setShowFilters(true);
      }
    }
  }, [location.state]);

  // Get unique universities for filter
  const universities = Array.from(new Set(dormitories.map(d => d.university.name))).sort();

  const priceRanges = [
    { label: '100,000 - 300,000', value: '100000-300000' },
    { label: '300,000 - 500,000', value: '300000-500000' },
    { label: '500,000 - 1,000,000', value: '500000-1000000' },
    { label: '1,000,000+', value: '1000000' }
  ];

  // Share functionality
  const handleShare = async (dormitory: Dormitory, e: React.MouseEvent) => {
    e.stopPropagation();

    const shareData = {
      title: `${dormitory.name} - JoyBor`,
      text: `${dormitory.description || 'Yotoqxona haqida ma\'lumot'} - ${formatPrice(dormitory.month_price)}/oy`,
      url: `${window.location.origin}/dormitory/${dormitory.id}`
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareData.url);
        alert('Link nusxalandi!');
      }
    } catch (error) {
      console.error('Share failed:', error);
      try {
        await navigator.clipboard.writeText(shareData.url);
        alert('Link nusxalandi!');
      } catch (clipboardError) {
        console.error('Clipboard failed:', clipboardError);
      }
    }
  };

  // API dan yotoqxonalarni yuklash
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const dormitoriesData = await authAPI.getDormitories();

        setDormitories(dormitoriesData);
        setFilteredDormitories(dormitoriesData);
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
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="flex gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Universitet
                  </label>
                  <select
                    value={selectedFilters.university}
                    onChange={(e) => setSelectedFilters(prev => ({ ...prev, university: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
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
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
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
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
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
              <DormitoryCard
                key={dormitory.id}
                id={dormitory.id}
                name={dormitory.name}
                month_price={dormitory.month_price}
                address={dormitory.address}
                universityName={dormitory.university.name}
                images={dormitory.images.map(img => img.image)}
                amenities={dormitory.amenities.map(a => a.name)}
                available_capacity={dormitory.available_capacity}
                total_capacity={dormitory.total_capacity}
                distance_to_university={dormitory.distance_to_university}
                description={dormitory.description}
                onSelect={() => onListingSelect(convertDormitoryToListing(dormitory))}
                onApplicationStart={() => onApplicationStart(convertDormitoryToListing(dormitory))}
                canApply={!!user}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DormitoriesPage;