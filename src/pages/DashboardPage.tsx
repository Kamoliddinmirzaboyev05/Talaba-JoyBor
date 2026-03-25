import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  CalendarCheck,
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
        } catch (error) {
          // Handle error silently
        }
        
        // Try to get student dashboard first
        try {
          const studentData = await authAPI.getStudentDashboard();
          setStudentDashboard(studentData as StudentDashboard);
        } catch (err) {
          // Fallback to applications if dashboard not available
          const applicationsData = await authAPI.getApplications();
          setApplications(applicationsData as Application[]);
        }
      } catch (error) {
        // Handle error silently
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
        return "Bajarilgan";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    const upperStatus = status?.toUpperCase();
    switch (upperStatus) {
      case "APPROVED":
      case "TASDIQLANDI":
      case "TASDIQLANGAN":
      case "COMPLETED":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "PENDING":
      case "KUTILMOQDA":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "REJECTED":
      case "RAD ETILGAN":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "INTERVIEW":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  // Student Dashboard mavjud bo'lsa (yotoqxonaga qabul qilingan talaba)
  if (studentDashboard) {
    const baseUrl = "https://joyborv1.pythonanywhere.com";
    const userImage = studentDashboard.picture ? (studentDashboard.picture.startsWith('http') ? studentDashboard.picture : `${baseUrl}${studentDashboard.picture}`) : null;

    const totalPaid = studentDashboard.recent_payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
    const annualPrice = studentDashboard.dormitory_info?.year_price || 1;
    const paymentPercentage = Math.min(Math.round((totalPaid / annualPrice) * 100), 100);

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-12">
        <Header />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
          {/* Top Welcome Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
                Xush kelibsiz, {studentDashboard.name}! 👋
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg">
                Yotoqxonangizdagi so'nggi ma'lumotlarni kuzatib boring
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-8 space-y-6 md:space-y-8">
              
              {/* Status Quick Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Qavat", value: studentDashboard.floor_info?.name, icon: Layers, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
                  { label: "Xona", value: studentDashboard.room_info?.name, icon: Home, color: "text-teal-600", bg: "bg-teal-50 dark:bg-teal-900/20" },
                  { label: "Xonadoshlar", value: `${studentDashboard.room_info?.current_occupancy}/${studentDashboard.room_info?.capacity}`, icon: Users, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" },
                  { label: "Davomat", value: "98%", icon: CalendarCheck, color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/20" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:border-teal-500/30 transition-all group"
                  >
                    <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center ${item.color} mb-3 group-hover:scale-110 transition-transform`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">{item.label}</p>
                    <p className="font-black text-gray-900 dark:text-white text-base truncate">{item.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Payment Info & Progress Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl text-white shadow-lg shadow-teal-500/20 group hover:scale-[1.02] transition-transform"
                >
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-[10px] font-bold text-teal-100 uppercase tracking-widest">Oylik to'lov</p>
                    <CreditCard className="w-5 h-5 text-teal-200 opacity-50" />
                  </div>
                  <p className="text-3xl font-black">
                    {new Intl.NumberFormat('uz-UZ').format(studentDashboard.dormitory_info?.month_price || 0)}
                    <span className="text-sm font-medium ml-1.5 opacity-80">so'm</span>
                  </p>
                  <button className="mt-4 w-full py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-xs font-bold transition-colors">
                    To'lov qilish
                  </button>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm group hover:border-teal-500/30 transition-all"
                >
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">To'lovlar Holati</p>
                    <span className="text-xs font-black text-teal-600 bg-teal-50 dark:bg-teal-900/20 px-2 py-1 rounded-lg">
                      {paymentPercentage}%
                    </span>
                  </div>
                  <div className="space-y-4">
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${paymentPercentage}%` }}
                        className="h-full bg-teal-500"
                      />
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">To'landi</p>
                        <p className="text-lg font-black text-gray-900 dark:text-white">
                          {new Intl.NumberFormat('uz-UZ').format(totalPaid)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Yillik jami</p>
                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
                          {new Intl.NumberFormat('uz-UZ').format(studentDashboard.dormitory_info?.year_price || 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Compact Dormitory Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 bg-teal-50 dark:bg-teal-900/20 rounded-xl flex items-center justify-center text-teal-600 flex-shrink-0">
                    <Building className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Yotoqxona</p>
                    <h2 className="font-black text-gray-900 dark:text-white text-base truncate">
                      {studentDashboard.dormitory_info?.name}
                    </h2>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-[11px] font-bold text-gray-500 max-w-[200px]">
                  <MapPin className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                  <span className="truncate">{studentDashboard.dormitory_info?.address}</span>
                </div>
              </motion.div>

              {/* Roommates Grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <Users className="w-6 h-6 text-teal-500" />
                    Xonadoshlar
                  </h2>
                  <div className="px-3 py-1 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-full shadow-sm">
                    <span className="text-xs font-black text-teal-600">
                      {studentDashboard.roommates?.length || 0} nafar
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {studentDashboard.roommates?.map((mate: any, i: number) => (
                    <motion.div
                      key={mate.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all flex items-center gap-4 group"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800 flex-shrink-0 shadow-inner">
                        {mate.picture ? (
                          <img src={`${baseUrl}${mate.picture}`} alt={mate.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 font-black text-xl">
                            {mate.name?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-black text-gray-900 dark:text-white truncate group-hover:text-teal-600 transition-colors">
                          {mate.name} {mate.last_name}
                        </h3>
                        <div className="space-y-1 mt-1.5">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
                            <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 truncate">
                              {mate.faculty} • {mate.course}-kurs
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            <a href={`tel:+${mate.phone}`} className="text-[11px] font-bold text-blue-600 hover:underline">
                              +{mate.phone}
                            </a>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {(!studentDashboard.roommates || studentDashboard.roommates.length === 0) && (
                    <div className="col-span-full py-12 text-center bg-gray-50 dark:bg-gray-900/20 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                      <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Hozircha xonadoshlar yo'q</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar Widgets */}
            <div className="lg:col-span-4 space-y-6 md:space-y-8">
              
              {/* Profile Card Refined */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="h-24 bg-gradient-to-br from-teal-500 to-blue-600"></div>
                <div className="px-6 pb-8 -mt-12">
                  <div className="flex justify-center mb-5">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white dark:border-gray-900 bg-white dark:bg-gray-800 shadow-xl">
                      {userImage ? (
                        <img src={userImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-teal-600 font-black text-3xl bg-teal-50 dark:bg-teal-900/20">
                          {studentDashboard.name?.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-center mb-8">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight mb-1">
                      {studentDashboard.last_name} {studentDashboard.name}
                    </h3>
                    <p className="text-gray-400 dark:text-gray-500 text-xs font-medium italic">
                      {studentDashboard.middle_name}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { label: "Fakultet", value: studentDashboard.faculty, icon: GraduationCap, color: "text-teal-500" },
                      { label: "Yo'nalish", value: studentDashboard.direction, icon: Briefcase, color: "text-blue-500" },
                      { label: "Kurs / Guruh", value: `${studentDashboard.course}-kurs • ${studentDashboard.group}-guruh`, icon: Clock, color: "text-purple-500" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all">
                        <div className={`w-10 h-10 bg-white dark:bg-gray-900 rounded-lg flex items-center justify-center ${item.color} shadow-sm`}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{item.label}</p>
                          <p className="text-xs font-black text-gray-900 dark:text-white truncate leading-tight">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Documents Card */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">Hujjatlar</h3>
                  <FileText className="w-5 h-5 text-gray-300" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center text-teal-600">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Passport</span>
                    </div>
                    <span className="text-xs font-black text-gray-900 dark:text-white">{studentDashboard.passport}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center text-green-600">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Imtiyoz</span>
                    </div>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${studentDashboard.privilege ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                      {studentDashboard.privilege ? 'Mavjud' : 'Yo\'q'}
                    </span>
                  </div>
                </div>
                
                <button 
                  onClick={() => window.open(`${baseUrl}${studentDashboard.document}`, '_blank')}
                  className="mt-6 w-full flex items-center justify-center gap-2 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black text-sm hover:opacity-90 transition-all shadow-lg shadow-gray-200 dark:shadow-none"
                >
                  <FileText className="w-4 h-4" />
                  Hujjatni yuklab olish
                </button>
              </div>

              {/* Application Status Refined */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                <div className="relative z-10">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Ariza Holati</p>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-teal-50 dark:bg-teal-900/20 rounded-2xl flex items-center justify-center text-teal-600">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-gray-900 dark:text-white">{studentDashboard.application_info?.status || "Tasdiqlangan"}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{formatDate(studentDashboard.application_info?.created_at || '')} yuborilgan</p>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Admin izohi:</p>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 italic leading-relaxed">
                      "{studentDashboard.application_info?.admin_comment || "Sizning arizangiz muvaffaqiyatli qabul qilindi."}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Oddiy dashboard (ariza yuborgan, lekin hali qabul qilinmagan)
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24 md:pb-12">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
              Xush kelibsiz, {firstName}! 👋
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg">
              Arizalaringiz holatini shu yerdan kuzatib boring
            </p> */}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <button className="p-3 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 text-gray-500 hover:text-teal-600 transition-colors shadow-sm">
              <Bell className="w-6 h-6" />
            </button>
            <button 
              onClick={logout}
              className="p-3 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all shadow-sm"
            >
              <LogOut className="w-6 h-6" />
            </button>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 group hover:border-teal-500/30 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">{stat.value}</p>
              </div>
              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Approved Application Banner */}
            {approvedApplication && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative overflow-hidden bg-gradient-to-br from-teal-600 to-emerald-700 rounded-3xl p-1 shadow-xl shadow-teal-500/20"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
                <div className="relative bg-white/5 backdrop-blur-sm p-6 md:p-8 rounded-[1.4rem] border border-white/10 flex flex-col md:flex-row items-center gap-8 text-white">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white/20 bg-white/10 flex-shrink-0 flex items-center justify-center">
                    {approvedApplication.user_image ? (
                      <img src={approvedApplication.user_image} alt="User" className="w-full h-full object-cover" />
                    ) : (
                      <CheckCircle className="w-12 h-12 text-white" />
                    )}
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl font-black mb-2">Tabriklaymiz! 🎉</h2>
                    <p className="text-teal-50 font-medium mb-6 leading-relaxed">
                      Sizning <span className="font-black underline underline-offset-4">{approvedApplication.dormitory_name}</span> uchun arizangiz muvaffaqiyatli tasdiqlandi.
                    </p>
                    <button
                      onClick={() => navigate(`/application/${approvedApplication.id}`)}
                      className="px-8 py-3 bg-white text-teal-700 rounded-xl font-black text-sm hover:bg-teal-50 transition-colors shadow-lg shadow-black/10 uppercase tracking-widest"
                    >
                      Batafsil ko'rish
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Recent Applications List */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 md:p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-teal-500 rounded-full"></div>
                  So'nggi Arizalar
                </h2>
                {applications.length > 0 && (
                  <button onClick={() => navigate("/applications")} className="text-xs font-black text-teal-600 uppercase tracking-widest hover:underline">
                    Hammasi
                  </button>
                )}
              </div>

              {loading ? (
                <div className="py-20 flex flex-col items-center gap-4">
                  <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Yuklanmoqda...</p>
                </div>
              ) : applications.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center">
                  <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-300 mb-6">
                    <FileText className="w-10 h-10" />
                  </div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">Arizalar mavjud emas</h3>
                  <p className="text-gray-500 text-sm mb-8 max-w-xs mx-auto">Siz hali birorta ham yotoqxonaga ariza yubormagansiz.</p>
                  <button
                    onClick={() => navigate("/dormitories")}
                    className="px-8 py-4 bg-teal-600 text-white rounded-2xl font-black text-sm hover:bg-teal-700 transition-all shadow-lg shadow-teal-500/30 uppercase tracking-widest"
                  >
                    Yotoqxona qidirish
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {applications.slice(0, 5).map((app, i) => (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => navigate(`/application/${app.id}`)}
                      className="group p-5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-transparent hover:border-teal-500/30 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-12 h-12 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center text-teal-600 shadow-sm border border-gray-50 dark:border-gray-800 flex-shrink-0">
                          <Home className="w-6 h-6" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-black text-gray-900 dark:text-white truncate leading-tight mb-1 group-hover:text-teal-600 transition-colors">
                            {app.dormitory_name || app.dormitory?.name}
                          </h4>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate">
                            {app.university || app.dormitory?.university?.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:justify-end gap-6">
                        <div className="text-right hidden sm:block">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Yuborilgan sana</p>
                          <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{formatDate(app.created_at)}</p>
                        </div>
                        <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${getStatusColor(app.status)}`}>
                          {getStatusText(app.status)}
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-teal-500 transition-colors hidden md:block" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Widgets */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Quick Actions Widget */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
              <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6">Tezkor Harakatlar</h3>
              <div className="grid grid-cols-1 gap-3">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => navigate(action.path)}
                    className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all group"
                  >
                    <div className={`w-10 h-10 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center ${action.color} shadow-sm group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Help Widget */}
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
              <div className="relative z-10">
                <MessageCircle className="w-10 h-10 text-blue-200 mb-6" />
                <h3 className="text-xl font-black mb-2">Yordam kerakmi?</h3>
                <p className="text-blue-100 text-sm font-medium mb-8 leading-relaxed">
                  Savollaringiz bormi yoki muammoga duch keldingizmi? Bizning qo'llab-quvvatlash markazimizga murojaat qiling.
                </p>
                <button 
                  onClick={() => navigate('/help')}
                  className="w-full py-4 bg-white text-blue-700 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-50 transition-colors shadow-lg"
                >
                  Bog'lanish
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
