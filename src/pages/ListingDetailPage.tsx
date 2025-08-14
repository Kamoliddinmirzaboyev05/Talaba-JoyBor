import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  MapPin,
  Users,
  Wifi,
  Car,
  Shield,
  Heart,
  Share2,
  MessageCircle,
  Calendar,
  Phone,
  Mail,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Listing } from "../types";
import { useAuth } from "../contexts/AuthContext";
import Header from "../components/Header";
import { getGlobalSelectedListing, setGlobalSelectedListing } from "../App";
import { authAPI } from "../services/api";

const ListingDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [listing, setListing] = useState<Listing | null>(
    getGlobalSelectedListing()
  );
  const [loading, setLoading] = useState(false);

  const onApplicationStart = (listing: Listing) => {
    setGlobalSelectedListing(listing);
    navigate("/application");
  };
  const [isLiked, setIsLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Load listing data if not available
  useEffect(() => {
    const loadListing = async () => {
      if (!listing && id) {
        setLoading(true);
        try {
          // Try to find listing from API
          const [dormitories, apartments] = await Promise.all([
            authAPI.getDormitories(),
            authAPI.getApartments(),
          ]);

          // Convert API data to Listing format
          const allListings: Listing[] = [
            ...dormitories.map((dorm: any) => ({
              id: `dorm-${dorm.id}`,
              title: dorm.name,
              type: "dormitory" as const,
              price: dorm.month_price,
              location: dorm.address,
              university: dorm.university.name,
              images: dorm.images?.map((img: any) => img.image) || [],
              amenities:
                dorm.amenities?.map((amenity: any) => amenity.name) || [],
              description: dorm.description || "Tavsif mavjud emas",
              capacity: dorm.total_capacity || 1,
              available: dorm.available_capacity > 0,
              rating: 4.5,
              reviews: 12,
              features: {
                furnished: true,
                wifi:
                  dorm.amenities?.some((a: any) =>
                    a.name.toLowerCase().includes("wifi")
                  ) || false,
                parking:
                  dorm.amenities?.some((a: any) =>
                    a.name.toLowerCase().includes("parking")
                  ) || false,
                security:
                  dorm.amenities?.some((a: any) =>
                    a.name.toLowerCase().includes("security")
                  ) || false,
              },
              rules: dorm.rules || [],
              coordinates: {
                lat: dorm.latitude || 0,
                lng: dorm.longitude || 0,
              },
            })),
            ...apartments.map((apt: any) => ({
              id: `apt-${apt.id}`,
              title: apt.name || apt.title,
              type: "rental" as const,
              price: apt.month_price || apt.price,
              location: apt.address || apt.location,
              university: apt.university?.name || "Umumiy",
              images: apt.images?.map((img: any) => img.image || img) || [],
              amenities:
                apt.amenities?.map((amenity: any) => amenity.name || amenity) ||
                [],
              description: apt.description || "Tavsif mavjud emas",
              capacity: apt.capacity || 1,
              available: true,
              rating: 4.3,
              reviews: 8,
              landlord: apt.landlord,
              features: {
                furnished: true,
                wifi:
                  apt.amenities?.some((a: any) =>
                    (a.name || a).toLowerCase().includes("wifi")
                  ) || false,
                parking:
                  apt.amenities?.some((a: any) =>
                    (a.name || a).toLowerCase().includes("parking")
                  ) || false,
                security:
                  apt.amenities?.some((a: any) =>
                    (a.name || a).toLowerCase().includes("security")
                  ) || false,
              },
              rules: apt.rules || [],
              coordinates: {
                lat: apt.latitude || 0,
                lng: apt.longitude || 0,
              },
            })),
          ];

          const foundListing = allListings.find((l) => l.id === id);
          if (foundListing) {
            setListing(foundListing);
            setGlobalSelectedListing(foundListing);
          }
        } catch (error) {
          console.error("Listing yuklanmadi:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadListing();
  }, [id, listing]);

  // Sahifa yuklanganda yuqoriga scroll qilish
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Listing o'zgarganda ham yuqoriga scroll qilish va image index reset
  useEffect(() => {
    if (listing) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setCurrentImageIndex(0);
    }
  }, [listing?.id]);

  // Keyboard navigation for image slider
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!listing?.images || listing.images.length <= 1) return;

      if (e.key === "ArrowLeft") {
        prevImage();
      } else if (e.key === "ArrowRight") {
        nextImage();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [listing]);



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Elon topilmadi
          </h2>
          <button
            onClick={() => navigate("/")}
            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors duration-200"
          >
            Bosh sahifaga qaytish
          </button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("uz-UZ").format(price) + " so'm";
  };

  const nextImage = () => {
    if (listing?.images && listing.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === listing.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (listing?.images && listing.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? listing.images.length - 1 : prev - 1
      );
    }
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
      nextImage();
    }
    if (isRightSwipe && listing?.images && listing.images.length > 1) {
      prevImage();
    }
  };



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          Orqaga
        </motion.button>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="flex-1 lg:max-w-4xl space-y-6">
                         {/* Image Gallery */}
             {/* Image Gallery */}
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6 }}
               className="relative h-96 rounded-2xl overflow-hidden mb-6 group"
             >
               <motion.img
                 key={`${listing.id}-${currentImageIndex}`}
                 initial={{ opacity: 0, scale: 1.05 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 transition={{ duration: 0.4, ease: "easeInOut" }}
                 src={
                   listing.images && listing.images.length > 0
                     ? listing.images[currentImageIndex]
                     : "/placeholder-room.svg"
                 }
                 alt={listing.title}
                 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                 onError={(e) => {
                   const target = e.target as HTMLImageElement;
                   target.src = "/placeholder-room.svg";
                 }}
                 onTouchStart={handleTouchStart}
                 onTouchMove={handleTouchMove}
                 onTouchEnd={handleTouchEnd}
               />

               {/* Navigation Buttons */}
               {listing.images && listing.images.length > 1 && (
                 <>
                   <motion.button
                     whileHover={{ scale: 1.1 }}
                     whileTap={{ scale: 0.9 }}
                     onClick={prevImage}
                     className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-all duration-200 backdrop-blur-sm shadow-lg opacity-0 group-hover:opacity-100"
                   >
                     <ChevronLeft className="w-6 h-6" />
                   </motion.button>
                   <motion.button
                     whileHover={{ scale: 1.1 }}
                     whileTap={{ scale: 0.9 }}
                     onClick={nextImage}
                     className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-all duration-200 backdrop-blur-sm shadow-lg opacity-0 group-hover:opacity-100"
                   >
                     <ChevronRight className="w-6 h-6" />
                   </motion.button>

                   {/* Image Indicators */}
                   <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2 bg-black/40 px-3 py-2 rounded-full backdrop-blur-sm shadow-lg">
                     {listing.images.map((_, index) => (
                       <motion.button
                         key={index}
                         whileHover={{ scale: 1.2 }}
                         whileTap={{ scale: 0.9 }}
                         onClick={() => setCurrentImageIndex(index)}
                         className={`w-3 h-3 rounded-full transition-all duration-200 ${
                           index === currentImageIndex
                             ? "bg-white shadow-sm"
                             : "bg-white/50 hover:bg-white/70"
                         }`}
                       />
                     ))}
                   </div>

                   {/* Image Counter */}
                   <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-black/60 text-white text-sm rounded-full backdrop-blur-sm shadow-lg">
                     {currentImageIndex + 1} / {listing.images.length}
                   </div>
                 </>
               )}

               {/* Action Buttons */}
               <div className="absolute top-4 left-4 z-10 flex gap-2">
                 <motion.button
                   whileHover={{ scale: 1.1 }}
                   whileTap={{ scale: 0.9 }}
                   onClick={() => setIsLiked(!isLiked)}
                   className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 shadow-lg ${
                     isLiked
                       ? "bg-red-500 text-white"
                       : "bg-white/90 text-gray-600 hover:bg-white backdrop-blur-sm"
                   }`}
                 >
                   <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                 </motion.button>
                 <motion.button
                   whileHover={{ scale: 1.1 }}
                   whileTap={{ scale: 0.9 }}
                   className="w-10 h-10 bg-white/90 text-gray-600 rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200 backdrop-blur-sm shadow-lg"
                 >
                   <Share2 className="w-5 h-5" />
                 </motion.button>
               </div>

               {/* Type Badge */}
               <div className="absolute bottom-4 left-4 z-10">
                 <span
                   className={`px-3 py-1 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm ${
                     listing.type === "dormitory"
                       ? "bg-teal-100/90 text-teal-800 dark:bg-teal-900/60 dark:text-teal-300"
                       : "bg-green-100/90 text-green-800 dark:bg-green-900/60 dark:text-green-300"
                   }`}
                 >
                   {listing.type === "dormitory" ? "Yotoqxona" : "Ijara"}
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
                    <span className="text-gray-700 dark:text-gray-300">
                      WiFi
                    </span>
                  </div>
                )}
                {listing.features.parking && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <Car className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">
                      Parking
                    </span>
                  </div>
                )}
                {listing.features.security && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">
                      Xavfsizlik
                    </span>
                  </div>
                )}
                {listing.amenities &&
                  listing.amenities.length > 0 &&
                  listing.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">
                        {typeof amenity === "string"
                          ? amenity
                          : (amenity as any)?.name || "Qulaylik"}
                      </span>
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
                {listing.rules && listing.rules.length > 0 ? (
                  listing.rules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-teal-600 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300">
                        {typeof rule === "string"
                          ? rule
                          : (rule as any)?.rule || (rule as any)?.name || "Qoida"}
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-500 dark:text-gray-400">
                      Qoidalar haqida ma'lumot yo'q
                    </span>
                  </li>
                )}
              </ul>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 lg:flex-shrink-0 lg:sticky lg:top-20 lg:self-start space-y-6">
            {/* Contact Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6"
            >
              {listing.type === "rental" && listing.landlord ? (
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
                      <span className="text-sm">
                        info@{listing.university.toLowerCase()}.uz
                      </span>
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
                    onClick={() => navigate("/login")}
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
