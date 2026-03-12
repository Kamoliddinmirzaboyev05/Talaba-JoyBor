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
  User,
  CreditCard,
  FileText,
  ShieldCheck,
  Briefcase,
  GraduationCap,
  Layers,
  ChevronRight,
  LogOut,
  Bell,
  Settings,
  Building,
  Phone,
} from "lucide-react";
import { Application, StudentDashboard } from "../types";
import { useAuth } from "../contexts/AuthContext";
import Header from "../components/Header";
import { authAPI } from "../services/api";
import { formatDate, formatDateTime } from "../utils/format";


const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [studentDashboard, setStudentDashboard] = useState<StudentDashboard | null>(null);
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
          setStudentDashboard(studentData as StudentDashboard);
          
          if (import.meta.env.DEV) {
            console.log('Student Dashboard Data:', studentData);
          }
        } catch (err) {
          console.log('Student dashboard not available, fetching applications instead', err);
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

  // Tasdiqlangan arizani topish
  const approvedApplication = React.useMemo(() => {
    return (Array.isArray(applications) ? applications : []).find(
      (app) => app.status?.toUpperCase() === "APPROVED" || app.status?.toUpperCase() === "TASDIQLANGAN" || app.status?.toUpperCase() === "TASDIQLANDI"
    );
  }, [applications]);

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
        value: String(safeApplications.filter((app) => app?.status?.toUpperCase() === "APPROVED" || app?.status?.toUpperCase() === "TASDIQLANDI").length || 0),
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
      label: "Yotoqxona",
      icon: Home,
      path: "/dormitories",
      color: "text-teal-600",
      bg: "bg-teal-50 dark:bg-teal-900/20",
    },
    {
      label: "Xabarlar",
      icon: MessageCircle,
      path: "/messages",
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      label: "To'lovlar",
      icon: CreditCard,
      path: "/payments",
      color: "text-purple-600",
      bg: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      label: "Profil",
      icon: Settings,
      path: "/profile",
      color: "text-gray-600",
      bg: "bg-gray-50 dark:bg-gray-900/20",
    },
  ];

  const getStatusIcon = (status: string) => {
    const upperStatus = status?.toUpperCase();
    switch (upperStatus) {
      case "APPROVED":
      case "TASDIQLANDI":
      case "TASDIQLANGAN":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "PENDING":
      case "KUTILMOQDA":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "REJECTED":
      case "RAD ETILGAN":
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
    const upperStatus = status?.toUpperCase();
    switch (upperStatus) {
      case "APPROVED":
      case "TASDIQLANDI":
      case "TASDIQLANGAN":
        return "Tasdiqlangan";
      case "PENDING":
      case "KUTILMOQDA":
        return "Kutilmoqda";
      case "REJECTED":
      case "RAD ETILGAN":
        return "Rad etilgan";
      case "INTERVIEW":
        return "Suhbat";
      case "COMPLETED":
        return "Yakunlangan";
      default:
        return status || "Noma'lum";
    }
  };

  const getStatusColor = (status: string) => {
    const upperStatus = status?.toUpperCase();
    switch (upperStatus) {
      case "APPROVED":
      case "TASDIQLANDI":
      case "TASDIQLANGAN":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "PENDING":
      case "KUTILMOQDA":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "REJECTED":
      case "RAD ETILGAN":
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm"
        >
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl">
            <div className="w-20 h-20 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-teal-600">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Tizimga kiring
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Dashboardingizga kirish uchun tizimga login qilishingiz kerak.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-teal-600 text-white px-6 py-4 rounded-2xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-500/30"
            >
              Tizimga kirish
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Student Dashboard mavjud bo'lsa (yotoqxonaga qabul qilingan talaba)
  if (studentDashboard) {
    const baseUrl = "https://joyborv1.pythonanywhere.com";
    const userImage = studentDashboard.picture ? (studentDashboard.picture.startsWith('http') ? studentDashboard.picture : `${baseUrl}${studentDashboard.picture}`) : null;

    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] pb-24 md:pb-8">
        <Header />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
          {/* Mobile Header / Profile */}
          <div className="flex items-center justify-between mb-8 md:hidden">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-teal-500 bg-white shadow-sm">
                {userImage ? (
                  <img src={userImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-teal-600 font-bold bg-teal-50">
                    {studentDashboard.name?.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white leading-tight">
                  {studentDashboard.name}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {studentDashboard.placement_status}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm text-gray-500">
                <Bell className="w-5 h-5" />
              </button>
              <button 
                onClick={logout}
                className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm text-red-500"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Desktop Welcome Section */}
          <div className="hidden md:flex justify-between items-center mb-10">
            <div>
              <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
                Xush kelibsiz, {studentDashboard.name}! 🎉
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Bugungi kuningiz xayrli o'tsin
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {studentDashboard.placement_status}
                </p>
                <p className="text-xs text-teal-600 dark:text-teal-400 font-bold uppercase tracking-wider">
                  {studentDashboard.status}
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-teal-500 bg-white shadow-md">
                {userImage ? (
                  <img src={userImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-teal-600 font-bold text-xl bg-teal-50">
                    {studentDashboard.name?.charAt(0)}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-8 space-y-6 md:space-y-8">
              
              {/* Quick Info Grid - Mobile Optimized */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 mb-3">
                    <Layers className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Qavat</p>
                  <p className="font-bold text-gray-900 dark:text-white">{studentDashboard.floor_info?.name}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="w-10 h-10 bg-teal-50 dark:bg-teal-900/30 rounded-2xl flex items-center justify-center text-teal-600 mb-3">
                    <Home className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Xona</p>
                  <p className="font-bold text-gray-900 dark:text-white">{studentDashboard.room_info?.name}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600 mb-3">
                    <Users className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Xonadoshlar</p>
                  <p className="font-bold text-gray-900 dark:text-white">{studentDashboard.room_info?.current_occupancy}/{studentDashboard.room_info?.capacity}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="w-10 h-10 bg-green-50 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-600 mb-3">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status</p>
                  <p className="font-bold text-green-600">{studentDashboard.room_info?.status}</p>
                </div>
              </div>

              {/* Dormitory Details Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-6 md:p-10">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                      <div className="w-2 h-8 bg-teal-500 rounded-full"></div>
                      Yotoqxona Ma'lumotlari
                    </h2>
                    <span className="hidden md:block px-4 py-1.5 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-full text-xs font-bold uppercase tracking-widest">
                      ID: {studentDashboard.dormitory_info?.id}
                    </span>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 md:p-6 bg-gray-50 dark:bg-gray-900/50 rounded-3xl transition-all hover:bg-gray-100 dark:hover:bg-gray-900">
                      <div className="flex items-center gap-4 mb-2 md:mb-0">
                        <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center text-teal-600 shadow-sm">
                          <Building className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Yotoqxona</p>
                          <p className="font-black text-gray-900 dark:text-white text-lg">{studentDashboard.dormitory_info?.name}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 md:text-right flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-red-500" />
                        {studentDashboard.dormitory_info?.address}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-6 bg-teal-600 rounded-3xl text-white shadow-lg shadow-teal-500/20">
                        <p className="text-xs font-bold text-teal-100 uppercase tracking-widest mb-1">Oylik to'lov</p>
                        <p className="text-3xl font-black">
                          {new Intl.NumberFormat('uz-UZ').format(studentDashboard.dormitory_info?.month_price || 0)} <span className="text-sm font-medium">so'm</span>
                        </p>
                      </div>
                      <div className="p-6 bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-3xl shadow-sm">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Yillik to'lov</p>
                        <p className="text-3xl font-black text-gray-900 dark:text-white">
                          {new Intl.NumberFormat('uz-UZ').format(studentDashboard.dormitory_info?.year_price || 0)} <span className="text-sm font-medium">so'm</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Roommates Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white">Xonadoshlar</h2>
                  <span className="text-sm font-bold text-teal-600 bg-teal-50 dark:bg-teal-900/30 px-3 py-1 rounded-full">
                    {studentDashboard.roommates?.length || 0} kishi
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {studentDashboard.roommates?.map((mate: any) => (
                    <motion.div
                      key={mate.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white dark:bg-gray-800 p-5 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4"
                    >
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                        {mate.picture ? (
                          <img src={`${baseUrl}${mate.picture}`} alt={mate.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xl">
                            {mate.name?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-black text-gray-900 dark:text-white truncate">{mate.name} {mate.last_name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <GraduationCap className="w-3.5 h-3.5 text-teal-500" />
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{mate.faculty} • {mate.course}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Phone className="w-3.5 h-3.5 text-blue-500" />
                          <p className="text-xs text-gray-500 dark:text-gray-400">+{mate.phone}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {(!studentDashboard.roommates || studentDashboard.roommates.length === 0) && (
                    <div className="col-span-full py-12 text-center bg-gray-50 dark:bg-gray-900/30 rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-gray-700">
                      <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">Hozircha xonadoshlar yo'q</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Payments - Mobile Style Scroll */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white">Oxirgi To'lovlar</h2>
                  <button className="text-teal-600 font-bold text-sm hover:underline">Hammasi</button>
                </div>
                
                <div className="space-y-3">
                  {studentDashboard.recent_payments?.map((payment: any) => (
                    <div key={payment.id} className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-600">
                          <CreditCard className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-black text-gray-900 dark:text-white">{new Intl.NumberFormat('uz-UZ').format(payment.amount)} so'm</p>
                          <p className="text-xs text-gray-500">{formatDateTime(payment.paid_date)} • {payment.method}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                        {payment.status}
                      </span>
                    </div>
                  ))}
                  {(!studentDashboard.recent_payments || studentDashboard.recent_payments.length === 0) && (
                    <div className="py-8 text-center bg-gray-50 dark:bg-gray-900/30 rounded-3xl border border-dashed border-gray-200">
                      <p className="text-gray-400 font-medium">To'lovlar tarixi mavjud emas</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-4 space-y-6 md:space-y-8">
              
              {/* Profile Card */}
              <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="h-24 bg-gradient-to-r from-teal-500 to-blue-600"></div>
                <div className="px-6 pb-8 -mt-12">
                  <div className="flex justify-center mb-4">
                    <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-4 border-white dark:border-gray-800 bg-white shadow-lg">
                      {userImage ? (
                        <img src={userImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-teal-600 font-black text-3xl bg-teal-50">
                          {studentDashboard.name?.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight">
                      {studentDashboard.last_name} {studentDashboard.name}
                    </h3>
                    <p className="text-gray-500 text-sm">{studentDashboard.middle_name}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
                      <GraduationCap className="w-5 h-5 text-teal-600" />
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fakultet</p>
                        <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{studentDashboard.faculty}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
                      <Briefcase className="w-5 h-5 text-blue-600" />
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Yo'nalish</p>
                        <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{studentDashboard.direction}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
                        <Clock className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kurs</p>
                          <p className="text-xs font-bold text-gray-900 dark:text-white">{studentDashboard.course}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
                        <Users className="w-5 h-5 text-orange-600" />
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Guruh</p>
                          <p className="text-xs font-bold text-gray-900 dark:text-white">{studentDashboard.group}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Passport & Documents */}
              <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
                <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6">Hujjatlar</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-teal-600" />
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Passport</span>
                    </div>
                    <span className="text-xs font-black text-gray-900 dark:text-white">{studentDashboard.passport}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Imtiyoz</span>
                    </div>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${studentDashboard.privilege ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                      {studentDashboard.privilege ? 'Mavjud' : 'Yo\'q'}
                    </span>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                  <button 
                    onClick={() => window.open(`${baseUrl}${studentDashboard.document}`, '_blank')}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black text-sm hover:opacity-90 transition-all"
                  >
                    <FileText className="w-4 h-4" />
                    Barcha hujjatlarni ko'rish
                  </button>
                </div>
              </div>

              {/* Application Status Widget */}
              <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-[2.5rem] p-8 text-white shadow-lg shadow-teal-500/20">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-80">Ariza Holati</p>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black">{studentDashboard.application_info?.status}</h4>
                    <p className="text-xs opacity-80">{formatDate(studentDashboard.application_info?.created_at || '')} yuborilgan</p>
                  </div>
                </div>
                <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10">
                  <p className="text-xs font-bold mb-1 opacity-80">Admin izohi:</p>
                  <p className="text-sm font-medium italic">"{studentDashboard.application_info?.admin_comment}"</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Navigation - Sticky */}
        <div className="fixed bottom-6 left-4 right-4 h-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 dark:border-gray-700/50 shadow-2xl md:hidden z-50 flex items-center justify-around px-4">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.path || '#')}
              className="flex flex-col items-center gap-1 p-2"
            >
              <div className={`p-2.5 rounded-2xl ${action.bg} ${action.color}`}>
                <action.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">{action.label}</span>
            </button>
          ))}
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

      {/* Tasdiqlangan Ariza Card */}
      {approvedApplication && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6 shadow-sm"
        >
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-full md:w-32 h-32 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
              {approvedApplication.user_image ? (
                <img 
                  src={approvedApplication.user_image} 
                  alt="User" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-teal-100 dark:bg-teal-900/30 text-teal-600">
                  <User className="w-12 h-12" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Arizangiz Tasdiqlandi! 🎉
                </h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Sizning <span className="font-semibold text-teal-700 dark:text-teal-400">{approvedApplication.dormitory_name}</span> uchun yuborgan arizangiz qabul qilindi.
                {approvedApplication.admin_comment && (
                  <span className="block mt-2 italic text-sm text-gray-600 dark:text-gray-400">
                    Admin izohi: "{approvedApplication.admin_comment}"
                  </span>
                )}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
                <div className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Fakultet</p>
                  <p className="font-medium text-gray-900 dark:text-white truncate">{approvedApplication.faculty}</p>
                </div>
                <div className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Yo'nalish</p>
                  <p className="font-medium text-gray-900 dark:text-white truncate">{approvedApplication.direction}</p>
                </div>
                <div className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Kurs / Guruh</p>
                  <p className="font-medium text-gray-900 dark:text-white">{approvedApplication.course} / {approvedApplication.group}</p>
                </div>
                <div className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Hudud</p>
                  <p className="font-medium text-gray-900 dark:text-white truncate">{approvedApplication.province_name}, {approvedApplication.district_name}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/application/${approvedApplication.id}`)}
                className="bg-teal-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-teal-700 transition-all shadow-sm"
              >
                Batafsil ma'lumot
              </motion.button>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-2">
                <Clock className="w-3.5 h-3.5" />
                {formatDate(approvedApplication.created_at)}
              </div>
            </div>
          </div>
        </motion.div>
      )}

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
                    onClick={() => navigate(action.path)}
                    className={`w-full flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all duration-300 group`}
                  >
                    <div className={`p-2 rounded-lg ${action.bg} ${action.color} group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{action.label}</span>
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
