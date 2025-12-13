import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Home } from 'lucide-react';
import Header from '../components/Header';
import { Listing } from '../types';
import { authAPI } from '../services/api';
import DormitoryCard from '../components/DormitoryCard';

const AllListingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoading(true);
        setError('');

        const dormitoriesResponse = await authAPI.getDormitories().catch(() => ({ results: [] }));
        const dormitoriesData = dormitoriesResponse.results || dormitoriesResponse;

        const convertedDormitories: Listing[] = (dormitoriesData || []).map((dormitory: {
          id: number;
          name: string;
          month_price: number;
          address: string;
          university_name: string;
          images: Array<string | { image: string }>;
          amenities_list: Array<{ name: string }>;
          description: string;
          total_capacity?: number;
          available_capacity?: number;
          rating?: number;
          rules?: string[];
          latitude?: number;
          longitude?: number;
        }) => {
          const images = Array.isArray(dormitory.images) && dormitory.images.length > 0
            ? dormitory.images.map((img: string | { image: string }) => typeof img === 'string' ? img : img?.image || '')
            : ['/placeholder-dormitory.svg'];
          
          const amenities = Array.isArray(dormitory.amenities_list) && dormitory.amenities_list.length > 0
            ? dormitory.amenities_list.map((a: { name: string }) => a?.name || '')
            : [];

          return {
            id: `dorm-${dormitory.id}`,
            title: dormitory.name,
            type: 'dormitory' as const,
            price: dormitory.month_price,
            location: dormitory.address,
            university: dormitory.university_name || '',
            images: images.filter(Boolean),
            amenities: amenities.filter(Boolean),
            description: dormitory.description || '',
            capacity: dormitory.total_capacity || 0,
            available_capacity: dormitory.available_capacity || 0,
            available: (dormitory.available_capacity || 0) > 0,
            rating: dormitory.rating || 0,
            reviews: 0,
            features: {
              furnished: true,
              wifi: amenities.some((a: string) => a.toLowerCase().includes('wifi')),
              parking: amenities.some((a: string) => a.toLowerCase().includes('parking')),
              security: amenities.some((a: string) => a.toLowerCase().includes('security')),
            },
            rules: dormitory.rules || [],
            coordinates: { lat: dormitory.latitude || 0, lng: dormitory.longitude || 0 },
          };
        });

        setListings(convertedDormitories);
      } catch {
        setError('Ma\'lumotlarni yuklashda xatolik.');
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Barcha Yotoqxonalar</h1>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/dormitories')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-teal-600 to-green-600 text-white hover:shadow-lg"
          >
            <Home className="w-4 h-4" /> Yotoqxonalar
          </motion.button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">E'lonlar yuklanmoqda...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <p className="text-red-500 dark:text-red-400">{error}</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300">E'lonlar topilmadi</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((listing) => (
              <DormitoryCard
                key={listing.id}
                id={listing.id}
                name={listing.title}
                month_price={listing.price}
                address={listing.location}
                universityName={listing.university}
                images={listing.images}
                amenities={listing.amenities}
                available_capacity={(listing as { available_capacity?: number }).available_capacity ?? 0}
                total_capacity={listing.capacity}
                description={listing.description}
                onSelect={() => navigate(`/listing/${listing.id}`)}
                canApply={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllListingsPage;




