import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, MapPin, Users, Wifi, Car, Shield, Eye, MessageCircle, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Listing, User } from '../types';

interface ListingCardProps {
  listing: Listing;
  onSelect: () => void;
  user: User | null;
  onApplicationStart?: (listing: Listing) => void;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, onSelect, user, onApplicationStart }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m';
  };

  const getTypeLabel = (type: string) => {
    return type === 'dormitory' ? 'Yotoqxona' : 'Ijara';
  };

  const getTypeColor = (type: string) => {
    return type === 'dormitory' 
      ? 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300'
      : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (listing.images && listing.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === listing.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (listing.images && listing.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? listing.images.length - 1 : prev - 1
      );
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Share functionality
  };

  const handleMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Message functionality
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && listing?.images && listing.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === listing.images.length - 1 ? 0 : prev + 1
      );
    }
    if (isRightSwipe && listing?.images && listing.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? listing.images.length - 1 : prev - 1
      );
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      onClick={onSelect}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group"
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <motion.img
          key={`${listing.id}-${currentImageIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          src={listing.images && listing.images.length > 0 ? listing.images[currentImageIndex] : '/placeholder-room.svg'}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-room.svg';
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
        
        {/* Image Navigation */}
        {listing.images && listing.images.length > 1 && (
          <>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-black/80 backdrop-blur-sm shadow-lg"
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-black/80 backdrop-blur-sm shadow-lg"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
            
            {/* Image Indicators */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1 bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
              {listing.images && listing.images.map((_, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>

            {/* Image Counter */}
            <div className="absolute top-2 right-2 z-10 px-2 py-1 bg-black/60 text-white text-xs rounded-full backdrop-blur-sm">
              {currentImageIndex + 1}/{listing.images.length}
            </div>
          </>
        )}

        {/* Overlay Actions */}
        <div className="absolute top-3 right-3 flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
              isLiked 
                ? 'bg-red-500 text-white' 
                : 'bg-white/90 text-gray-600 hover:bg-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleShare}
            className="w-8 h-8 bg-white/90 text-gray-600 rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200"
          >
            <Share2 className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Type Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(listing.type)}`}>
            {getTypeLabel(listing.type)}
          </span>
        </div>

        {/* Available Badge */}
        {listing.available && (
          <div className="absolute bottom-3 left-3">
            <span className="px-2 py-1 bg-green-500 text-white rounded-full text-xs font-semibold">
              Mavjud
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Title and Rating */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1">
            {listing.title}
          </h3>
          <div className="flex items-center gap-1 ml-2">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {listing.rating}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({listing.reviews})
            </span>
          </div>
        </div>

        {/* Location and University */}
        <div className="flex items-center gap-1 mb-3 text-gray-600 dark:text-gray-300">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{listing.location}</span>
          <span className="text-xs">•</span>
          <span className="text-sm">{listing.university}</span>
        </div>

        {/* Price and Capacity */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatPrice(listing.price)}
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">
              /oyiga
            </span>
          </div>
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
            <Users className="w-4 h-4" />
            <span className="text-sm">{listing.capacity} kishi</span>
          </div>
        </div>

        {/* Amenities */}
        <div className="flex items-center gap-3 mb-4">
          {listing.features.wifi && (
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
              <Wifi className="w-4 h-4" />
              <span className="text-xs">WiFi</span>
            </div>
          )}
          {listing.features.parking && (
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
              <Car className="w-4 h-4" />
              <span className="text-xs">Parking</span>
            </div>
          )}
          {listing.features.security && (
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
              <Shield className="w-4 h-4" />
              <span className="text-xs">Xavfsizlik</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSelect}
            className="flex-1 bg-gradient-to-r from-teal-600 to-green-600 text-white py-2 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Ko'rish
          </motion.button>
          
          {user && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleMessage}
              className="px-4 py-2 border-2 border-teal-600 text-teal-600 rounded-lg font-medium hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all duration-300 flex items-center justify-center"
            >
              <MessageCircle className="w-4 h-4" />
            </motion.button>
          )}
        </div>

        {/* Landlord Info (for rentals) */}
        {listing.type === 'rental' && listing.landlord && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-teal-600 to-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-semibold">
                  {listing.landlord.name.charAt(0)}
                </span>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {listing.landlord.name}
              </span>
              {listing.landlord.verified && (
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
              <div className="flex items-center gap-1 ml-auto">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-xs text-gray-600 dark:text-gray-300">
                  {listing.landlord.rating}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ListingCard;