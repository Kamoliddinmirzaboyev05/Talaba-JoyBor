import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, MapPin, Users, Wifi, Car, Shield, Heart, Share2, MessageCircle, Calendar, Phone, Mail, CheckCircle } from 'lucide-react';
import { PageType } from '../App';
import { User, Listing } from '../types';
import Header from '../components/Header';

interface ListingDetailPageProps {
  listing: Listing | null;
  onNavigate: (page: PageType) => void;
  user: User | null;
  onApplicationStart: (listing: Listing) => void;
}

const ListingDetailPage: React.FC<ListingDetailPageProps> = ({ listing, onNavigate, user, onApplicationStart }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Elon topilmadi
          </h2>
          <button
            onClick={() => onNavigate('home')}
            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors duration-200"
          >
            Bosh sahifaga qaytish
          </button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m';
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === listing.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? listing.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header user={user} onNavigate={onNavigate} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          Orqaga
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative h-96 rounded-2xl overflow-hidden mb-6"
            >
              <img
                src={listing.images[currentImageIndex]}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
              
              {listing.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors duration-200"
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors duration-200"
                  >
                    ›
                  </button>
                  
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {listing.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsLiked(!isLiked)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${
                    isLiked 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white/90 text-gray-600 hover:bg-white'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-white/90 text-gray-600 rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200"
                >
                  <Share2 className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Type Badge */}
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  listing.type === 'dormitory' 
                    ? 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300'
                    : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                }`}>
                  {listing.type === 'dormitory' ? 'Yotoqxona' : 'Ijara'}
                </span>
              </div>
            </motion.div>

            {/* Title and Rating */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6"
            >
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {listing.title}
                </h1>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {listing.rating}
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">
                    ({listing.reviews} sharh)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-5 h-5" />
                  <span>{listing.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-5 h-5" />
                  <span>{listing.capacity} kishi</span>
                </div>
              </div>

              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {formatPrice(listing.price)}
                <span className="text-lg font-normal text-gray-600 dark:text-gray-300 ml-2">
                  /oyiga
                </span>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Tavsif
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {listing.description}
              </p>
            </motion.div>

            {/* Amenities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Qulayliklar
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {listing.features.wifi && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
                      <Wifi className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">WiFi</span>
                  </div>
                )}
                {listing.features.parking && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <Car className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Parking</span>
                  </div>
                )}
                {listing.features.security && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Xavfsizlik</span>
                  </div>
                )}
                {listing.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{amenity}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Rules */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Qoidalar
              </h2>
              <ul className="space-y-2">
                {listing.rules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-teal-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300">{rule}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 sticky top-8"
            >
              {listing.type === 'rental' && listing.landlord ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Uy egasi
                  </h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {listing.landlord.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {listing.landlord.name}
                        </span>
                        {listing.landlord.verified && (
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {listing.landlord.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{listing.landlord.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{listing.landlord.email}</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Yotoqxona Ma'muriyati
                  </h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">+998 71 123 45 67</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">info@{listing.university.toLowerCase()}.uz</span>
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-3">
                {user ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onApplicationStart(listing)}
                      className="w-full bg-gradient-to-r from-teal-600 to-green-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-5 h-5" />
                      Ariza Yuborish
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full border-2 border-teal-600 text-teal-600 py-3 rounded-xl font-semibold hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Xabar Yuborish
                    </motion.button>
                  </>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onNavigate('login')}
                    className="w-full bg-gradient-to-r from-teal-600 to-green-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Ariza Yuborish Uchun Kiring
                  </motion.button>
                )}
              </div>
            </motion.div>

            {/* Location Map Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Joylashuv
              </h3>
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Xarita tez orada qo'shiladi
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mt-3 text-sm">
                {listing.location} • {listing.university}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailPage;