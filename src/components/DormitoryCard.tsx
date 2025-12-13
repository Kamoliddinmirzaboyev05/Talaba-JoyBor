import React from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { MapPin, Users, Building2, Clock, CheckCircle, Share2, Heart } from 'lucide-react';
import { formatCapacityBucket } from '../utils/format';
import { shareOrCopy } from '../utils/share';
import { useLikes } from '../contexts/LikesContext';

interface DormitoryCardProps {
  id: number | string;
  name: string;
  month_price: number;
  address: string;
  universityName: string;
  images: string[];
  amenities: string[];
  available_capacity: number;
  total_capacity: number;
  distance_to_university?: number;
  description?: string;
  onSelect: () => void;
  onApplicationStart?: () => void;
  canApply?: boolean;
}

const formatPrice = (price: number) => new Intl.NumberFormat('uz-UZ').format(price) + " so'm";

const DormitoryCard: React.FC<DormitoryCardProps> = ({
  id,
  name,
  month_price,
  address,
  universityName,
  images,
  amenities,
  available_capacity,
  distance_to_university,
  description,
  onSelect,
  onApplicationStart,
  canApply,
}) => {
  const { toggleLike, isLiked } = useLikes();

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLike(id.toString());
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await shareOrCopy({
      title: `${name} - JoyBor`,
      text: `${description || "Yotoqxona haqida ma'lumot"} - ${formatPrice(month_price)}/oy`,
      url: window.location.href,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      onClick={onSelect}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {images && images.length > 0 ? (
          <Swiper
            modules={[Pagination, Autoplay, Navigation]}
            spaceBetween={0}
            slidesPerView={1}
            pagination={{ clickable: true, dynamicBullets: true }}
            navigation
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop={images.length > 1}
            className="h-full"
          >
            {images.map((src, index) => (
              <SwiperSlide key={index}>
                <img
                  src={src}
                  alt={`${name} - ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-dormitory.svg';
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <img
            src="/placeholder-dormitory.svg"
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            decoding="async"
          />
        )}

        {/* Share Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleShare}
          className="absolute top-2 left-2 z-10 w-8 h-8 bg-white/90 text-gray-600 rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200 backdrop-blur-sm shadow-lg"
        >
          <Share2 className="w-4 h-4" />
        </motion.button>

        {/* Like Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleLike}
          className={`absolute top-2 left-12 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 backdrop-blur-sm shadow-lg ${
            isLiked(id.toString()) 
              ? 'bg-red-500 text-white' 
              : 'bg-white/90 text-gray-600 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked(id.toString()) ? 'fill-current' : ''}`} />
        </motion.button>

        {/* Price Badge */}
        <div className="absolute bottom-2 right-2 z-10 bg-gradient-to-r from-teal-600 to-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">
          {formatPrice(month_price)}/oy
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">
              {name}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-teal-600 mb-2">
            <Building2 className="w-4 h-4" />
            <span className="text-sm font-medium line-clamp-1">{universityName}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <MapPin className="w-4 h-4" />
            <span className="text-sm line-clamp-1">{address}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Bo'sh joylar: {formatCapacityBucket(available_capacity)}
            </span>
          </div>
          {typeof distance_to_university === 'number' && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {distance_to_university} km
              </span>
            </div>
          )}
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-4">
          {amenities.slice(0, 3).map((amenity, idx) => (
            <div key={idx} className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span className="text-xs text-gray-700 dark:text-gray-300">{amenity}</span>
            </div>
          ))}
          {amenities.length > 3 && (
            <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
              +{amenities.length - 3}
            </span>
          )}
        </div>

        {/* Description */}
        {description && (
          <div className="flex-1 mb-4">
            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
              {description}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSelect}
            className="flex-1 bg-gradient-to-r from-teal-600 to-green-600 text-white py-2.5 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            Ko'rish
          </motion.button>

          {canApply && onApplicationStart && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => { e.stopPropagation(); onApplicationStart(); }}
              className="px-4 py-2.5 border-2 border-teal-600 text-teal-600 rounded-lg font-medium hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all duration-300 whitespace-nowrap"
            >
              Ariza
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DormitoryCard; 