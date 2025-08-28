import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Building2, Home } from 'lucide-react';
import Header from '../components/Header';
import { Listing } from '../types';
import { authAPI } from '../services/api';
import DormitoryCard from '../components/DormitoryCard';
import ListingCard from '../components/ListingCard';

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

        const [dormitoriesData, apartmentsData] = await Promise.all([
          authAPI.getDormitories().catch(() => []),
          authAPI.getApartments().catch(() => []),
        ]);

        const convertedDormitories: Listing[] = (dormitoriesData || []).map((dormitory: any) => ({
          id: `dorm-${dormitory.id}`,
          title: dormitory.name,
          type: 'dormitory' as const,
          price: dormitory.month_price,
          location: dormitory.address,
          university: dormitory.university?.name || '',
          images: dormitory.images?.map((img: any) => img.image) || [],
          amenities: dormitory.amenities?.map((amenity: any) => amenity.name) || [],
          description: dormitory.description || '',
          capacity: dormitory.total_capacity || 1,
          available_capacity: dormitory.available_capacity,
          available: (dormitory.available_capacity || 0) > 0,
          rating: 0,
          reviews: 0,
          features: { furnished: true, wifi: false, parking: false, security: true },
          rules: [],
          coordinates: { lat: dormitory.latitude || 0, lng: dormitory.longitude || 0 },
        }));

        const convertedApartments: Listing[] = (apartmentsData || []).map((apartment: any) => ({
          id: `apt-${apartment.id}`,
          title: apartment.title || 'Ijara Xonadon',
          type: 'rental' as const,
          price: apartment.monthly_price || 0,
          location: apartment.exact_address || 'Manzil ko\'rsatilmagan',
          university: `${apartment.room_type || 'Xona'} - ${apartment.gender || 'Aralash'}`,
          images: apartment.images?.map((img: any) => img.image) || ['/placeholder-apartment.jpg'],
          amenities: apartment.amenities?.map((amenity: any) => amenity.name) || [],
          description: apartment.description || '',
          capacity: apartment.total_rooms || 1,
          available_capacity: apartment.available_rooms || 0,
          available: (apartment.available_rooms || 0) > 0 && apartment.is_active !== false,
          rating: 0,
          reviews: 0,
          landlord: {
            name: apartment.user?.username || 'Egasi',
            phone: apartment.phone_number || apartment.user_phone_number || '',
            email: apartment.user?.email || '',
            verified: true,
            rating: 0,
          },
          features: { furnished: true, wifi: true, parking: false, security: true },
          rules: [],
          coordinates: { lat: 0, lng: 0 },
          rooms: apartment.total_rooms || 1,
          available_rooms: apartment.available_rooms || 0,
          room_type: apartment.room_type || 'Xona',
          gender: apartment.gender || 'Aralash',
          owner: apartment.user?.username || 'Egasi',
          phone_number: apartment.phone_number || apartment.user_phone_number || '',
          user_phone_number: apartment.user_phone_number || '',
          province: apartment.province,
          created_at: apartment.created_at || new Date().toISOString(),
          is_active: apartment.is_active !== false,
        }));

        setListings([...convertedDormitories, ...convertedApartments]);
      } catch (e) {
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Barcha E'lonlar</h1>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/dormitories')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-teal-600 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20"
            >
              <Home className="w-4 h-4" /> Yotoqxonalar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/rentals')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
            >
              <Building2 className="w-4 h-4" /> Kvartiralar
            </motion.button>
          </div>
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
              <div key={listing.id}>
                {listing.type === 'dormitory' ? (
                  <DormitoryCard
                    id={listing.id}
                    name={listing.title}
                    month_price={listing.price}
                    address={listing.location}
                    universityName={listing.university}
                    images={listing.images}
                    amenities={listing.amenities}
                    available_capacity={(listing as any).available_capacity ?? 0}
                    total_capacity={listing.capacity}
                    description={listing.description}
                    onSelect={() => navigate(`/listing/${listing.id}`)}
                    canApply={false}
                  />
                ) : (
                  <ListingCard
                    listing={listing}
                    onSelect={() => navigate(`/listing/${listing.id}`)}
                    user={null}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllListingsPage;




