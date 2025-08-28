import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import {
  ArrowLeft,
  MapPin,
  Users,
  Wifi,
  Car,
  Shield,
  Heart,
  Share2,
  Calendar,
  Phone,
  Mail,
  CheckCircle,
  Coffee,
  BookOpen,
  Utensils,
  Dumbbell,
  Tv,
  Snowflake,
  Sun,
  Moon,
  Zap,
  Bus,
  Bike,
  Eye,
  GraduationCap,
  Droplets,
  Bed,
  Home,
  Trees,
  Leaf,
  Building2,
  User,
  MessageCircle,
} from "lucide-react";
import { Listing } from "../types";
import { formatCapacityBucket, formatPhoneNumber, formatAvailableCapacity } from "../utils/format";
import { useAuth } from "../contexts/AuthContext";
import Header from "../components/Header";
import YandexMap from "../components/YandexMap";
import { getGlobalSelectedListing, setGlobalSelectedListing } from "../App";
import { authAPI } from "../services/api";
import { shareOrCopy } from "../utils/share";

const ListingDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Sahifa yuklanganda yuqoriga scroll qilish
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
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
  const handleShare = async () => {
    if (!listing) return;
    const priceText = new Intl.NumberFormat('uz-UZ').format(listing.price) + " so'm/oy";
    await shareOrCopy({
      title: `${listing.title} - JoyBor`,
      text: `${listing.description || "Yotoqxona haqida ma'lumot"} - ${priceText}`,
      url: `${window.location.origin}/listing/${listing.id}`,
    });
  };

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
              admin: {
                name: dorm.admin?.username || dorm.university?.name || "Admin",
                phone: dorm.admin_phone_number || dorm.university?.contact || dorm.admin?.phone || undefined,
                email: dorm.admin?.email || undefined,
              },
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
              title: apt.title || 'Ijara Xonadon',
              type: "rental" as const,
              price: apt.monthly_price || 0,
              location: apt.exact_address || 'Manzil ko\'rsatilmagan',
              university: `${apt.room_type || 'Xona'} - ${apt.gender || 'Aralash'}`,
              images: apt.images?.map((img: any) => img.image) || ['/placeholder-apartment.jpg'],
              amenities: apt.amenities?.map((amenity: any) => amenity.name) || [],
              description: apt.description || "Tavsif mavjud emas",
              capacity: apt.total_rooms || 1,
              available_capacity: apt.available_rooms || 0,
              available: apt.available_rooms > 0 && apt.is_active,
              rating: 4.2,
              reviews: Math.floor(Math.random() * 15) + 3,
              landlord: {
                name: apt.user?.username || 'Egasi',
                phone: apt.phone_number || apt.user_phone_number || '',
                email: apt.user?.email || '',
                verified: true,
                rating: 4.5
              },
              features: {
                furnished: true,
                wifi: apt.amenities?.some((a: any) => 
                  a.name?.toLowerCase().includes('wifi') || 
                  a.name?.toLowerCase().includes('internet')
                ) || false,
                parking: apt.amenities?.some((a: any) => 
                  a.name?.toLowerCase().includes('parking') || 
                  a.name?.toLowerCase().includes('avtomobil')
                ) || false,
                security: true,
              },
              rules: [
                'Chekish taqiqlanadi',
                'Begonalar kirishi taqiqlanadi',
                'Kechqurun 22:00 dan keyin shovqin qilish taqiqlanadi'
              ],
              coordinates: {
                lat: 40.3833,
                lng: 71.7833,
              },
              // Qo'shimcha apartment ma'lumotlari
              rooms: apt.total_rooms || 1,
              available_rooms: apt.available_rooms || 0,
              room_type: apt.room_type || 'Xona',
              gender: apt.gender || 'Aralash',
              owner: apt.user?.username || 'Egasi',
              phone_number: apt.phone_number || apt.user_phone_number || '',
              user_phone_number: apt.user_phone_number || '',
              province: apt.province || 3,
              created_at: apt.created_at || new Date().toISOString(),
              is_active: apt.is_active !== false
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
    }
  }, [listing?.id]);



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

  const getAmenityIcon = (amenityName: string) => {
    const name = amenityName.toLowerCase();
    
    // Internet va texnologiya
    if (name.includes('wifi') || name.includes('internet')) return <Wifi className="w-5 h-5 text-teal-600 dark:text-teal-400" />;
    if (name.includes('tv') || name.includes('televizor')) return <Tv className="w-5 h-5 text-pink-600 dark:text-pink-400" />;
    if (name.includes('ac') || name.includes('konditsioner')) return <Snowflake className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />;
    if (name.includes('zap') || name.includes('elektr')) return <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
    
    // Transport va parking
    if (name.includes('parking') || name.includes('avto')) return <Car className="w-5 h-5 text-green-600 dark:text-green-400" />;
    if (name.includes('bus') || name.includes('avtobus')) return <Bus className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    if (name.includes('bike') || name.includes('velosiped')) return <Bike className="w-5 h-5 text-green-600 dark:text-green-400" />;
    
    // Xavfsizlik va monitoring
    if (name.includes('security') || name.includes('xavfsizlik')) return <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
    if (name.includes('camera') || name.includes('kamera')) return <Eye className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
    
    // Oshxona va ovqat
    if (name.includes('coffee') || name.includes('kofe')) return <Coffee className="w-5 h-5 text-orange-600 dark:text-orange-400" />;
    if (name.includes('kitchen') || name.includes('oshxona')) return <Utensils className="w-5 h-5 text-red-600 dark:text-red-400" />;
    if (name.includes('restaurant') || name.includes('restoran')) return <Utensils className="w-5 h-5 text-red-600 dark:text-red-400" />;
    
    // O'qish va ish
    if (name.includes('library') || name.includes('kutubxona')) return <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    if (name.includes('darsxona') || name.includes('study') || name.includes('classroom')) return <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    if (name.includes('computer') || name.includes('kompyuter')) return <Tv className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
    
    // Sport va mashg'ulot
    if (name.includes('gym') || name.includes('mashq') || name.includes('sport')) return <Dumbbell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
    if (name.includes('pool') || name.includes('basseyn')) return <Droplets className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    if (name.includes('tennis') || name.includes('basketball')) return <Dumbbell className="w-5 h-5 text-green-600 dark:text-green-400" />;
    
    // Turar joy va mebel
    if (name.includes('bed') || name.includes('krovat')) return <Bed className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
    if (name.includes('furniture') || name.includes('mebel')) return <Home className="w-5 h-5 text-brown-600" />;
    if (name.includes('balcony') || name.includes('balkon')) return <Home className="w-5 h-5 text-green-600 dark:text-green-400" />;
    
    // Xizmatlar
    if (name.includes('kir yuvish') || name.includes('washing') || name.includes('laundry')) return <Droplets className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />;
    if (name.includes('mashina') || name.includes('machine')) return <Droplets className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />;
    if (name.includes('cleaning') || name.includes('tozalash')) return <Droplets className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    
    // Iqlim va muhit
    if (name.includes('heating') || name.includes('isitish')) return <Sun className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
    if (name.includes('fan') || name.includes('ventilyator')) return <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    if (name.includes('garden') || name.includes('bog')) return <Trees className="w-5 h-5 text-green-600 dark:text-green-400" />;
    if (name.includes('nature') || name.includes('tabiat')) return <Leaf className="w-5 h-5 text-green-600 dark:text-green-400" />;
    
    // Boshqa
    if (name.includes('building') || name.includes('binolar')) return <Building2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    
    return <CheckCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
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
             {/* Image Gallery with Swiper */}
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6 }}
               className="relative h-96 rounded-2xl overflow-hidden mb-6 group"
             >
               {listing.images && listing.images.length > 0 ? (
                                 <Swiper
                  modules={[Pagination, Autoplay, Navigation]}
                 spaceBetween={0}
                 slidesPerView={1}
                 pagination={{ clickable: true, dynamicBullets: true }}
                 navigation
                 autoplay={{ delay: 5000, disableOnInteraction: false }}
                 loop={listing.images.length > 1}
                 className="h-full"
                >
                  {listing.images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={image}
                        alt={`${listing.title} - ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder-room.svg";
                        }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
               ) : (
                 <img
                   src="/placeholder-room.svg"
                   alt={listing.title}
                   className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                   loading="lazy"
                   decoding="async"
                 />
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
                   onClick={handleShare}
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
                       ? "bg-teal-100/90 text-teal-800 dark:bg-green-900/60 dark:text-teal-300"
                       : "bg-green-100/90 text-green-800 dark:bg-green-900/60 dark:text-green-300"
                   }`}
                 >
                   {listing.type === "dormitory" ? "Yotoqxona" : "Ijara"}
                 </span>
               </div>
             </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6"
            >
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {listing.title}
                </h1>
              </div>

              <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-5 h-5" />
                  <span>{listing.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-5 h-5" />
                  <span>
                    {listing.available_capacity !== undefined 
                      ? `Bo'sh joylar: ${formatCapacityBucket(listing.available_capacity)}`
                      : `${listing.capacity} kishi`
                    }
                  </span>
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
                {listing.amenities && listing.amenities.length > 0 ? (
                  listing.amenities.map((amenity, index) => {
                    const amenityName = typeof amenity === "string" ? amenity : (amenity as any)?.name || "Qulaylik";
                    const icon = getAmenityIcon(amenityName);
                    return (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                          {icon}
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">
                          {amenityName}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  // Fallback to features if no amenities
                  <>
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
                  </>
                )}
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
                    {listing.type === 'rental' ? 'Kvartira Egasi' : 'Yotoqxona Ma\'muriyati'}
                  </h3>
                  <div className="space-y-3 mb-6">
                    {listing.type === 'rental' && listing.owner && (
                      <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                        <User className="w-4 h-4" />
                        <span className="text-sm">{listing.owner}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">
                        {formatPhoneNumber(
                          listing.type === 'rental' 
                            ? (listing.phone_number || listing.landlord?.phone || '998889563848')
                            : (listing.admin?.phone || '998889563848')
                        )}
                      </span>
                    </div>
                    {listing.admin?.email && (
                      <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">{listing.admin.email}</span>
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="space-y-3">
                {user ? (
                  <>
                    {listing.type === 'rental' ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleStartChat(listing)}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="w-5 h-5" />
                        Chat Boshlash
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onApplicationStart(listing)}
                        className="w-full bg-gradient-to-r from-teal-600 to-green-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Calendar className="w-5 h-5" />
                        Ariza Yuborish
                      </motion.button>
                    )}
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

            {/* Location Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Joylashuv
              </h3>
              <div className="rounded-xl overflow-hidden">
                <YandexMap
                  center={{ lat: listing.coordinates?.lat || 0, lng: listing.coordinates?.lng || 0 }}
                  balloonContent={listing.title}
                  height="220px"
                />
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
