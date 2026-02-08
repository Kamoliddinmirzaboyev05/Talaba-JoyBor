import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Home,
  MessageCircle,
  Calendar,
  Users,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { Application } from "../types";
import { useAuth } from "../contexts/AuthContext";
import Header from "../components/Header";
import { authAPI } from "../services/api";
import { formatDate } from "../utils/format";


const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [studentDashboard, setStudentDashboard] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [platformStats, setPlatformStats] = useState({
    activeUsers: 0,
    totalDormitories: 0,
    totalRooms: 0,
    freeRooms: 0
  });

  // Sahifa yuklanganda yuqoriga scroll qilish
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // API dan dashboard ma'lumotlarini yuklash
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Platform statistikalarini yuklash
        try {
          const stats = await authAPI.getStatistics();
          setPlatformStats({
            activeUsers: stats.users_count || 0,
            totalDormitories: stats.dormitories_count || 0,
            totalRooms: stats.rooms_total || 0,
            freeRooms: stats.rooms_free || 0
          });
          console.log('✅ Platform statistikalari yuklandi:', stats);
        } catch (error) {
          console.error('❌ Platform statistikalari yuklanmadi:', error);
        }
        
        // Try to get student dashboard first
        try {
          const studentData = await authAPI.getStudentDashboard();
          setStudentDashboard(studentData as Record<string, unknown>);
          
          if (import.meta.env.DEV) {
            console.log('Student Dashboard Data:', studentData);
          }
        } catch {
          console.log('Student dashboard not available, fetching applications instead');
          // Fallback to applications if dashboard not available
          const applicationsData = await authAPI.getApplications();
          setApplications(applicationsData as Application[]);
        }
      } catch (error) {
        console.error("Ma'lumotlar yuklanmadi:", error);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  // Fix: get first name safely
  const firstName = user?.first_name || user?.username || "Foydalanuvchi";

  // Dashboard statistikalari - xavfsiz hisoblash
  const stats = React.useMemo(() => {
    const safeApplications = Array.isArray(applications) ? applications : [];
    return [
      {
        label: "Faol Talabalar",
        value: String(platformStats.activeUsers || 0),
        icon: Users,
        color: "text-blue-600",
        bg: "bg-blue-100 dark:bg-blue-900/30",
      },
      {
        label: "Kutilayotgan",
        value: String(safeApplications.filter((app) => app?.status?.toUpperCase() === "PENDING").length || 0),
        icon: Clock,
        color: "text-yellow-600",
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
      },
      {
        label: "Tasdiqlangan",
        value: String(safeApplications.filter((app) => app?.status?.toUpperCase() === "APPROVED").length || 0),
        icon: CheckCircle,
        color: "text-green-600",
        bg: "bg-green-100 dark:bg-green-900/30",
      },
      {
        label: "Rad etilgan",
        value: String(safeApplications.filter((app) => app?.status?.toUpperCase() === "REJECTED").length || 0),
        icon: XCircle,
        color: "text-red-600",
        bg: "bg-red-100 dark:bg-red-900/30",
      },
    ];
  }, [applications, platformStats]);

  const quickActions = [
    {
      label: "Yotoqxona Qidirish",
      icon: Home,
      action: () => navigate("/dormitories"),
      color: "from-teal-600 to-teal-700",
    },
    {
      label: "Ijara Qidirish",
      icon: MapPin,
      action: () => navigate("/rentals"),
      color: "from-green-600 to-green-700",
    },
    {
      label: "Xabarlar",
      icon: MessageCircle,
      action: () => navigate("/messages"),
      color: "from-blue-600 to-blue-700",
    },
    {
      label: "Profil",
      icon: Users,
      action: () => navigate("/profile"),
      color: "from-purple-600 to-purple-700",
    },
  ];

  const getStatusIcon = (status: string) => {
    const upperStatus = status.toUpperCase();
    switch (upperStatus) {
      case "APPROVED":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "PENDING":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "REJECTED":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "INTERVIEW":
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      case "COMPLETED":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    const upperStatus = status.toUpperCase();
    switch (upperStatus) {
      case "APPROVED":
        return "Tasdiqlangan";
      case "PENDING":
        return "Kutilmoqda";
      case "REJECTED":
        return "Rad etilgan";
      case "INTERVIEW":
        return "Suhbat";
      case "COMPLETED":
        return "Yakunlangan";
      default:
        return "Noma'lum";
    }
  };

  const getStatusColor = (status: string) => {
    const upperStatus = status.toUpperCase();
    switch (upperStatus) {
      case "APPROVED":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "REJECTED":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "INTERVIEW":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "COMPLETED":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Tizimga kirish talab etiladi
          </h2>
          <button
            onClick={() => navigate("/login")}
            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors duration-200"
          >
            Tizimga kirish
          </button>
        </div>
      </div>
    );
  }

  // Agar talaba ro'yxatiga qo'shilgan bo'lsa (student dashboard mavjud)
  if (studentDashboard) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Xush kelibsiz, {String(studentDashboard.name || firstName)}! 🎉
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {String(studentDashboard.placement_status || 'Siz yotoqxonaga qabul qilindingiz')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Yotoqxona Ma'lumotlari */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Home className="w-5 h-5 text-teal-600" />
                  Yotoqxona Ma'lumotlari
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Yotoqxona:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {String((studentDashboard.dormitory_info as { name?: string })?.name || '')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Manzil:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {String((studentDashboard.dormitory_info as { address?: string })?.address || '')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Qavat:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {String((studentDashboard.floor_info as { name?: string })?.name || '')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Xona:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {String((studentDashboard.room_info as { name?: string })?.name || '')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-gray-600 dark:text-gray-400">Oylik to'lov:</span>
                    <span className="font-semibold text-teal-600 dark:text-teal-400">
                      {new Intl.NumberFormat('uz-UZ').format((studentDashboard.dormitory_info as { month_price?: number })?.month_price || 0)} so'm
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Xona Ma'lumotlari */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-teal-600" />
                  Xona Ma'lumotlari
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Sig'im:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {(studentDashboard.room_info as { capacity?: number })?.capacity || 0} kishi
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Hozirgi band:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {(studentDashboard.room_info as { current_occupancy?: number })?.current_occupancy || 0} kishi
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-gray-600 dark:text-gray-400">Bo'sh joylar:</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {((studentDashboard.room_info as { capacity?: number })?.capacity || 0) - ((studentDashboard.room_info as { current_occupancy?: number })?.current_occupancy || 0)} joy
                    </span>
                  </div>
                </div>

                {/* Xonadoshlar */}
                {Array.isArray(studentDashboard.roommates) && studentDashboard.roommates.length > 0 ? (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Xonadoshlar
                    </h3>
                    <div className="space-y-2">
                      {(studentDashboard.roommates as Array<{ name?: string; course?: string }>).map((roommate, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {roommate?.name?.charAt(0) || '?'}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {roommate?.name || 'Noma\'lum'}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {roommate?.course || ''}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 text-center py-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Hozircha xonadoshlar yo'q
                    </p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Shaxsiy Ma'lumotlar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Shaxsiy Ma'lumotlar
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">F.I.O:</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {String(studentDashboard.last_name || '')} {String(studentDashboard.name || '')} {String(studentDashboard.middle_name || '')}
                    </p>
                  </div>
                  {(studentDashboard.province_name as string | undefined) && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Viloyat:</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {studentDashboard.province_name as string}
                      </p>
                    </div>
                  )}
                  {(studentDashboard.district_name as string | undefined) && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Tuman:</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {studentDashboard.district_name as string}
                      </p>
                    </div>
                  )}
                  {(studentDashboard.phone as string | undefined) && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Telefon:</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        +{studentDashboard.phone as string}
                      </p>
                    </div>
                  )}
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Ta'lim:</p>
                    {(studentDashboard.faculty as string | undefined) && (
                      <p className="font-medium text-gray-900 dark:text-white mb-1">
                        📚 {studentDashboard.faculty as string}
                      </p>
                    )}
                    {(studentDashboard.direction as string | undefined) && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {studentDashboard.direction as string}
                      </p>
                    )}
                    {((studentDashboard.course as string | undefined) || (studentDashboard.group as string | undefined)) && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {(studentDashboard.course as string) || ''} {(studentDashboard.group as string | undefined) ? `• ${studentDashboard.group as string}` : ''}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Tezkor Harakatlar
                </h3>
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/profile')}
                    className="w-full flex items-center gap-3 p-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all duration-300"
                  >
                    <Users className="w-5 h-5" />
                    <span className="font-medium">Profilni Ko'rish</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/messages')}
                    className="w-full flex items-center gap-3 p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-medium">Xabarlar</span>
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Oddiy dashboard (ariza yuborgan, lekin hali qabul qilinmagan)
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Xush kelibsiz, {firstName}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Bu yerda sizning faoliyatingiz va arizalaringizni kuzatishingiz
            mumkin
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}
                >
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Applications */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-teal-600" />
                  So'nggi Arizalar
                </h2>
                {applications.length > 3 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/applications")}
                    className="text-teal-600 hover:text-teal-700 text-sm font-medium transition-colors duration-200 flex items-center gap-1"
                  >
                    Barchasini ko'rish
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.button>
                )}
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-300">
                    Arizalar yuklanmoqda...
                  </p>
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Hali arizalar yo'q
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Yotoqxona topib, birinchi arizangizni yuboring
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/dormitories")}
                    className="bg-gradient-to-r from-teal-600 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Yotoqxona Qidirish
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-3">
                  {(Array.isArray(applications) ? applications : []).slice(0, 3).map((application, index) => (
                    <motion.div
                      key={application.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="group border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-lg hover:border-teal-300 dark:hover:border-teal-600 transition-all duration-300 cursor-pointer"
                      onClick={() => navigate(`/application/${application.id}`)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Home className="w-4 h-4 text-teal-600" />
                            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-teal-600 transition-colors">
                              {application.dormitory_name || application.dormitory?.name || 'Yotoqxona nomi'}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">
                            {application.dormitory?.university?.name || application.university || 'Universitet'}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(application.status)}
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                application.status
                              )}`}
                            >
                              {getStatusText(application.status)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm mb-2">
                        <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{application.name} {application.last_name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{application.province_name || application.city || 'Shahar'}</span>
                          </div>
                        </div>
                        {application.created_at && (
                          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span>
                              {formatDate(application.created_at)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Additional info */}
                      {(application.faculty || application.course) && (
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-2">
                          {application.faculty && (
                            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                              {application.faculty}
                            </span>
                          )}
                          {application.direction && (
                            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                              {application.direction}
                            </span>
                          )}
                          {application.course && (
                            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                              {application.course}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Progress indicator */}
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              application.status?.toUpperCase() === 'PENDING' ? 'bg-yellow-500 w-1/3' :
                              application.status?.toUpperCase() === 'INTERVIEW' ? 'bg-blue-500 w-2/3' :
                              application.status?.toUpperCase() === 'APPROVED' ? 'bg-green-500 w-full' :
                              application.status?.toUpperCase() === 'REJECTED' ? 'bg-red-500 w-full' :
                              'bg-gray-400 w-1/4'
                            }`}
                          />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 min-w-fit">
                          {getStatusText(application.status)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Tezkor Harakatlar
              </h3>
              <div className="space-y-3">
                {quickActions.map((action) => (
                  <motion.button
                    key={action.label}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={action.action}
                    className={`w-full flex items-center gap-3 p-3 bg-gradient-to-r ${action.color} text-white rounded-xl hover:shadow-lg transition-all duration-300`}
                  >
                    <action.icon className="w-5 h-5" />
                    <span className="font-medium">{action.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Latest Application Details */}
            {applications.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  So'nggi Ariza
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Yotoqxona:</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {applications[0].dormitory_name || applications[0].dormitory?.name || 'Noma\'lum'}
                    </p>
                  </div>
                  {applications[0].faculty && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Fakultet:</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {applications[0].faculty}
                      </p>
                    </div>
                  )}
                  {applications[0].direction && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Yo'nalish:</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {applications[0].direction}
                      </p>
                    </div>
                  )}
                  {applications[0].course && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Kurs:</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {applications[0].course}
                      </p>
                    </div>
                  )}
                  {applications[0].group && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Guruh:</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {applications[0].group}
                      </p>
                    </div>
                  )}
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Holat:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(applications[0].status)}`}>
                        {getStatusText(applications[0].status)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Profile Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Profil Ma'lumotlari
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">
                    Universitet:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white text-right">
                    {user?.university || 'Belgilanmagan'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">
                    Talaba ID:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {user?.studentId || user?.student_id || 'Belgilanmagan'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">
                    Holat:
                  </span>
                  <div className="flex items-center gap-1">
                    {user?.isVerified || user?.is_verified ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-green-600 dark:text-green-400 text-sm">
                          Tasdiqlangan
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-yellow-500" />
                        <span className="text-yellow-600 dark:text-yellow-400 text-sm">
                          Tasdiqlanmagan
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/profile")}
                className="w-full mt-4 border-2 border-teal-600 text-teal-600 py-2 rounded-xl font-medium hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all duration-300"
              >
                Profilni Ko'rish
              </motion.button>
            </motion.div>

            {/* Quick Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-gradient-to-br from-teal-50 via-blue-50 to-green-50 dark:from-teal-900/20 dark:via-blue-900/20 dark:to-green-900/20 border border-teal-200 dark:border-teal-800 rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-xl">💡</span>
                Foydali Maslahatlar
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white font-medium">
                      Arizangizni kuzatib boring
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Ariza holatini muntazam tekshiring
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white font-medium">
                      Profilingizni to'ldiring
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      To'liq profil ko'proq imkoniyat beradi
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white font-medium">
                      Yotoqxonalarni taqqoslang
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Eng yaxshi variantni tanlang
                    </p>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/help")}
                className="w-full mt-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-300"
              >
                Ko'proq maslahat
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
