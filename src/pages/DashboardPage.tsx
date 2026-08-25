import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  CalendarCheck,
  Home,
  MessageCircle,
  Users,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  User,
  CreditCard,
  FileText,
  ShieldCheck,
  Briefcase,
  GraduationCap,
  Layers,
  ChevronRight,
  Settings,
  Building,
  Phone,
  MessageSquareWarning,
} from "lucide-react";
import { Application, StudentDashboard } from "../types";
import { Complaint } from "../services/api";
import { statusTone, statusLabel, isApproved, isPending, isRejected, isPlacedStudent } from "../utils/applicationStatus";
import { complaintStatusLabel, complaintStatusClassName } from "../utils/complaintStatus";
import { useAuth } from "../contexts/AuthContext";
import Header from "../components/Header";
import Skeleton from "../components/Skeleton";
import EmptyState from "../components/EmptyState";
import { mediaUrl, authAPI } from "../services/api";
import { formatDate } from "../utils/format";

function displayValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '' || value === 'undefined') return '—';
  return String(value);
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [studentDashboard, setStudentDashboard] = useState<StudentDashboard | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    const fetchDashboardData = async () => {
      setLoading(true);
      const [dashResult, appsResult, complaintsResult] = await Promise.allSettled([
        authAPI.getStudentDashboard(),
        authAPI.getApplications(),
        authAPI.getMyComplaints(),
      ]);
      if (cancelled) return;

      setStudentDashboard(dashResult.status === 'fulfilled' ? dashResult.value : null);
      setApplications(appsResult.status === 'fulfilled' ? appsResult.value : []);
      setComplaints(complaintsResult.status === 'fulfilled' ? complaintsResult.value : []);
      setLoading(false);
    };

    void fetchDashboardData();
    return () => {
      cancelled = true;
    };
  }, [user]);

  // Fix: get first name safely
  const firstName = user?.first_name || user?.username || "Foydalanuvchi";

  // Tasdiqlangan arizani topish
  const approvedApplication = React.useMemo(() => {
    return (Array.isArray(applications) ? applications : []).find(
      (app) => isApproved(app.status)
    );
  }, [applications]);

  // Dashboard statistikalari - xavfsiz hisoblash
  const stats = React.useMemo(() => {
    const safeApplications = Array.isArray(applications) ? applications : [];
    return [
      {
        label: "Mening arizalarim",
        value: String(safeApplications.length || 0),
        icon: Users,
        color: "text-brand-600",
        bg: "bg-brand-100 dark:bg-brand-900/30",
      },
      {
        label: "Kutilayotgan",
        value: String(safeApplications.filter((app) => isPending(app?.status)).length || 0),
        icon: Clock,
        color: "text-warning-600",
        bg: "bg-warning-100 dark:bg-warning-900/30",
      },
      {
        label: "Tasdiqlangan",
        value: String(safeApplications.filter((app) => isApproved(app?.status)).length || 0),
        icon: CheckCircle,
        color: "text-success-600",
        bg: "bg-success-100 dark:bg-success-900/30",
      },
      {
        label: "Rad etilgan",
        value: String(safeApplications.filter((app) => isRejected(app?.status)).length || 0),
        icon: XCircle,
        color: "text-danger-600",
        bg: "bg-danger-100 dark:bg-danger-900/30",
      },
    ];
  }, [applications]);

  const quickActions = [
    {
      label: "Yotoqxona",
      icon: Home,
      path: "/dormitories",
      color: "text-brand-600",
      bg: "bg-brand-50 dark:bg-brand-900/20",
    },
    {
      label: "Xabarlar",
      icon: MessageCircle,
      path: "/messages",
      color: "text-brand-600",
      bg: "bg-brand-50 dark:bg-brand-900/20",
    },
    {
      label: "To'lovlar",
      icon: CreditCard,
      path: "/dashboard",
      color: "text-brand-600",
      bg: "bg-brand-50 dark:bg-brand-900/20",
    },
    {
      label: "Profil",
      icon: Settings,
      path: "/profile",
      color: "text-surface-600",
      bg: "bg-surface-50 dark:bg-surface-900/20",
    },
  ];

  // Unknown statuses fall back to the raw string so nothing is hidden on the dashboard.
  const getStatusText = (status: string) =>
    statusTone(status) === "unknown" ? status : statusLabel(status);

  const getStatusColor = (status: string) => {
    switch (statusTone(status)) {
      case "approved":
      case "completed":
        return "bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400";
      case "pending":
        return "bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400";
      case "rejected":
        return "bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400";
      case "interview":
        return "bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400";
      default:
        return "bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-400";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
        <Header />
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 space-y-3">
          <Skeleton className="h-8 w-48 rounded-xl" />
          <div className="grid grid-cols-2 gap-2.5">
            <Skeleton className="h-20 rounded-2xl" count={4} />
          </div>
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  // Yotoqxonaga joylashgan talaba — xona/qavat ma'lumoti bor
  if (isPlacedStudent(studentDashboard) && studentDashboard) {
    const userImage = studentDashboard.picture ? mediaUrl(studentDashboard.picture) : null;

    const totalPaid = studentDashboard.recent_payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
    const annualPrice = studentDashboard.dormitory_info?.year_price || 1;
    const paymentPercentage = Math.min(Math.round((totalPaid / annualPrice) * 100), 100);

    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-950 pb-12">
        <Header />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
          {/* Top Welcome Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-lg sm:text-2xl font-semibold tracking-tight text-surface-900 dark:text-white mb-1">
                Xush kelibsiz, {displayValue(studentDashboard.name)}
              </h1>
              <p className="text-xs sm:text-sm text-surface-500 dark:text-surface-400">
                Yotoqxona ma'lumotlari
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-8 space-y-6 md:space-y-8">
              
              {/* Status Quick Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Qavat", value: displayValue(studentDashboard.floor_info?.name), icon: Layers, color: "text-brand-600", bg: "bg-brand-50 dark:bg-brand-900/20" },
                  { label: "Xona", value: displayValue(studentDashboard.room_info?.name), icon: Home, color: "text-brand-600", bg: "bg-brand-50 dark:bg-brand-900/20" },
                  {
                    label: "Xonadoshlar",
                    value:
                      studentDashboard.room_info?.current_occupancy != null &&
                      studentDashboard.room_info?.capacity != null
                        ? `${studentDashboard.room_info.current_occupancy}/${studentDashboard.room_info.capacity}`
                        : displayValue(studentDashboard.roommates?.length),
                    icon: Users,
                    color: "text-brand-600",
                    bg: "bg-brand-50 dark:bg-brand-900/20",
                  },
                  { label: "Davomat", value: "—", icon: CalendarCheck, color: "text-success-600", bg: "bg-success-50 dark:bg-success-900/20" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white dark:bg-surface-900 p-5 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-800 hover:border-brand-500/30 transition-all duration-150 group"
                  >
                    <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center ${item.color} mb-3 group-hover:scale-110 transition-transform`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <p className="text-[10px] font-bold text-surface-400 dark:text-surface-500 uppercase tracking-widest mb-1">{item.label}</p>
                    <p className="font-semibold text-surface-900 dark:text-white text-sm truncate">{item.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Shikoyatlar & To'lovlar Holati */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl shadow-sm flex flex-col"
                >
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-[10px] font-bold text-surface-400 dark:text-surface-500 uppercase tracking-widest">Shikoyat va takliflar</p>
                    <MessageSquareWarning className="w-5 h-5 text-brand-500" />
                  </div>

                  {complaints.length === 0 ? (
                    <p className="text-sm text-surface-500 dark:text-surface-400 flex-1">
                      Hali murojaat yubormagansiz.
                    </p>
                  ) : (
                    <div className="space-y-2 flex-1">
                      {complaints.slice(0, 2).map((c) => (
                        <div key={c.id} className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium text-surface-800 dark:text-surface-200 truncate">{c.title}</span>
                          <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold ${complaintStatusClassName(c.status)}`}>
                            {complaintStatusLabel(c.status)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => navigate('/messages')}
                    className="mt-4 w-full py-2 bg-brand-50 dark:bg-brand-900/20 hover:bg-brand-100 dark:hover:bg-brand-900/40 text-brand-700 dark:text-brand-300 rounded-xl text-xs font-bold transition-colors duration-150"
                  >
                    Murojaat yuborish / ko'rish
                  </button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl shadow-sm group hover:border-brand-500/30 transition-all duration-150"
                >
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-[10px] font-bold text-surface-400 dark:text-surface-500 uppercase tracking-widest">To'lovlar Holati</p>
                    <span className="text-xs font-black text-brand-600 bg-brand-50 dark:bg-brand-900/20 px-2 py-1 rounded-xl">
                      {paymentPercentage}%
                    </span>
                  </div>
                  <div className="space-y-4">
                    <div className="w-full bg-surface-100 dark:bg-surface-700 rounded-full h-2 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${paymentPercentage}%` }}
                        className="h-full bg-brand-500"
                      />
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] font-bold text-surface-400 uppercase mb-0.5">To'landi</p>
                        <p className="text-lg font-black text-surface-900 dark:text-white">
                          {new Intl.NumberFormat('uz-UZ').format(totalPaid)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-surface-400 uppercase mb-0.5">Yillik jami</p>
                        <p className="text-sm font-bold text-surface-500 dark:text-surface-400">
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
                className="bg-white dark:bg-surface-900 p-4 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-800 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 bg-brand-50 dark:bg-brand-900/20 rounded-xl flex items-center justify-center text-brand-600 flex-shrink-0">
                    <Building className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-0.5">Yotoqxona</p>
                    <h2 className="font-black text-surface-900 dark:text-white text-base truncate">
                      {studentDashboard.dormitory_info?.name}
                    </h2>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-surface-50 dark:bg-surface-800 rounded-xl text-[11px] font-bold text-surface-500 max-w-[200px]">
                  <MapPin className="w-3.5 h-3.5 text-danger-500 flex-shrink-0" />
                  <span className="truncate">{studentDashboard.dormitory_info?.address}</span>
                </div>
              </motion.div>

              {/* Roommates Grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h2 className="text-xl md:text-2xl font-black text-surface-900 dark:text-white flex items-center gap-2">
                    <Users className="w-6 h-6 text-brand-500" />
                    Xonadoshlar
                  </h2>
                  <div className="px-3 py-1 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-full shadow-sm">
                    <span className="text-xs font-black text-brand-600">
                      {studentDashboard.roommates?.length || 0} nafar
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {studentDashboard.roommates?.map((mate, i: number) => (
                    <motion.div
                      key={mate.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white dark:bg-surface-900 p-5 rounded-2xl border border-surface-200 dark:border-surface-800 shadow-sm hover:shadow-md transition-all duration-150 flex items-center gap-4 group"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface-50 dark:bg-surface-800 flex-shrink-0 shadow-inner">
                        {mate.picture ? (
                          <img loading="lazy" src={mediaUrl(mate.picture)} alt={mate.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-surface-300 font-black text-xl">
                            {mate.name?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-black text-surface-900 dark:text-white truncate group-hover:text-brand-600 transition-colors duration-150">
                          {mate.name} {mate.last_name}
                        </h3>
                        <div className="space-y-1 mt-1.5">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-3.5 h-3.5 text-surface-400" />
                            <p className="text-[11px] font-medium text-surface-500 dark:text-surface-400 truncate">
                              {mate.faculty} • {mate.course}-kurs
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-surface-400" />
                            <a href={`tel:+${mate.phone}`} className="text-[11px] font-bold text-brand-600 hover:underline">
                              +{mate.phone}
                            </a>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {(!studentDashboard.roommates || studentDashboard.roommates.length === 0) && (
                    <div className="col-span-full bg-surface-50 dark:bg-surface-900/20 rounded-2xl border-2 border-dashed border-surface-200 dark:border-surface-800">
                      <EmptyState icon={Users} title="Hozircha xonadoshlar yo'q" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar Widgets */}
            <div className="lg:col-span-4 space-y-6 md:space-y-8">
              
              {/* Profile Card Refined */}
              <div className="bg-white dark:bg-surface-900 rounded-3xl shadow-sm border border-surface-200 dark:border-surface-800 overflow-hidden">
                <div className="h-24 bg-gradient-to-br from-brand-500 to-brand-600"></div>
                <div className="px-6 pb-8 -mt-12">
                  <div className="flex justify-center mb-5">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white dark:border-surface-900 bg-white dark:bg-surface-800 shadow-sm">
                      {userImage ? (
                        <img loading="lazy" src={userImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brand-600 font-black text-3xl bg-brand-50 dark:bg-brand-900/20">
                          {studentDashboard.name?.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-center mb-8">
                    <h3 className="text-xl font-black text-surface-900 dark:text-white leading-tight mb-1">
                      {studentDashboard.last_name} {studentDashboard.name}
                    </h3>
                    <p className="text-surface-400 dark:text-surface-500 text-xs font-medium italic">
                      {studentDashboard.middle_name}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { label: "Fakultet", value: studentDashboard.faculty, icon: GraduationCap, color: "text-brand-500" },
                      { label: "Yo'nalish", value: studentDashboard.direction, icon: Briefcase, color: "text-brand-500" },
                      { label: "Kurs / Guruh", value: `${studentDashboard.course}-kurs • ${studentDashboard.group}-guruh`, icon: Clock, color: "text-brand-500" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-surface-50 dark:bg-surface-800/50 rounded-xl border border-transparent hover:border-surface-200 dark:hover:border-surface-700 transition-all duration-150">
                        <div className={`w-10 h-10 bg-white dark:bg-surface-900 rounded-xl flex items-center justify-center ${item.color} shadow-sm`}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest mb-0.5">{item.label}</p>
                          <p className="text-xs font-black text-surface-900 dark:text-white truncate leading-tight">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Documents Card */}
              <div className="bg-white dark:bg-surface-900 rounded-3xl p-8 border border-surface-200 dark:border-surface-800 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-black text-surface-900 dark:text-white">Hujjatlar</h3>
                  <FileText className="w-5 h-5 text-surface-300" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-brand-100 dark:bg-brand-900/30 rounded-xl flex items-center justify-center text-brand-600">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-surface-700 dark:text-surface-300">Passport</span>
                    </div>
                    <span className="text-xs font-black text-surface-900 dark:text-white">{studentDashboard.passport}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-success-100 dark:bg-success-900/30 rounded-xl flex items-center justify-center text-success-600">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-surface-700 dark:text-surface-300">Imtiyoz</span>
                    </div>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${studentDashboard.privilege ? 'bg-success-100 text-success-700' : 'bg-surface-200 text-surface-500'}`}>
                      {studentDashboard.privilege ? 'Mavjud' : 'Yo\'q'}
                    </span>
                  </div>
                </div>
                
                <button 
                  onClick={() => window.open(mediaUrl(studentDashboard.document), '_blank')}
                  className="mt-6 w-full flex items-center justify-center gap-2 py-4 bg-surface-900 dark:bg-white text-white dark:text-surface-900 rounded-2xl font-black text-sm hover:opacity-90 transition-all duration-150 shadow-sm"
                >
                  <FileText className="w-4 h-4" />
                  Hujjatni yuklab olish
                </button>
              </div>

              {/* Application Status */}
              {studentDashboard.application_info && (
                <div className="bg-white dark:bg-surface-900 rounded-2xl p-6 border border-surface-200 dark:border-surface-800 shadow-sm relative overflow-hidden">
                  <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-4">Ariza holati</p>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-brand-50 dark:bg-brand-900/20 rounded-xl flex items-center justify-center text-brand-600">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-surface-900 dark:text-white">{displayValue(studentDashboard.application_info.status)}</h4>
                      {studentDashboard.application_info.created_at && (
                        <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">{formatDate(studentDashboard.application_info.created_at)} yuborilgan</p>
                      )}
                    </div>
                  </div>
                  {studentDashboard.application_info.admin_comment && (
                    <div className="p-4 bg-surface-50 dark:bg-surface-800/50 rounded-xl border border-surface-200 dark:border-surface-800">
                      <p className="text-[10px] font-bold text-surface-400 uppercase mb-2">Admin izohi:</p>
                      <p className="text-sm font-medium text-surface-600 dark:text-surface-300 leading-relaxed">
                        "{studentDashboard.application_info.admin_comment}"
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Joylashmagan talaba — ariza holati
  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 pb-8">
      <Header />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6">
        <div className="mb-3">
          <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-surface-900 dark:text-white">
            Xush kelibsiz, {firstName}
          </h1>
          <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
            Arizalaringiz holati
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white dark:bg-surface-900 p-3 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-800"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className={`w-8 h-8 ${stat.bg} rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
                <p className="text-lg font-semibold text-surface-900 dark:text-white leading-none">{stat.value}</p>
              </div>
              <p className="text-[11px] font-medium text-surface-500">{stat.label}</p>
            </div>
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
                className="relative overflow-hidden bg-gradient-to-br from-brand-600 to-success-700 rounded-3xl p-1 shadow-sm"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
                <div className="relative bg-white/5 backdrop-blur-sm p-6 md:p-8 rounded-[1.4rem] border border-white/10 flex flex-col md:flex-row items-center gap-8 text-white">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white/20 bg-white/10 flex-shrink-0 flex items-center justify-center">
                    {approvedApplication.user_image ? (
                      <img loading="lazy" src={approvedApplication.user_image} alt="User" className="w-full h-full object-cover" />
                    ) : (
                      <CheckCircle className="w-12 h-12 text-white" />
                    )}
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-base font-semibold mb-1">Ariza tasdiqlandi</h2>
                    <p className="text-brand-50 text-sm mb-4 leading-relaxed">
                      <span className="font-semibold">{approvedApplication.dormitory_name}</span> uchun arizangiz tasdiqlandi. Joylashuv kutilmoqda.
                    </p>
                    <button
                      onClick={() => navigate(`/application/${approvedApplication.id}`)}
                      className="px-4 py-2 bg-white text-brand-700 rounded-xl font-semibold text-sm hover:bg-brand-50 transition-colors duration-150 shadow-sm"
                    >
                      Batafsil ko'rish
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Recent Applications List */}
            <div className="bg-white dark:bg-surface-900 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-800 p-3.5 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-surface-900 dark:text-white">
                  Arizalar
                </h2>
                {applications.length > 0 && (
                  <button onClick={() => navigate("/applications")} className="text-xs font-medium text-brand-600">
                    Hammasi
                  </button>
                )}
              </div>

              {loading ? (
                <Skeleton className="h-24 w-full rounded-2xl" count={3} />
              ) : applications.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="Arizalar mavjud emas"
                  description="Siz hali birorta ham yotoqxonaga ariza yubormagansiz."
                  action={{ label: "Yotoqxona qidirish", onClick: () => navigate("/dormitories") }}
                />
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {applications.slice(0, 5).map((app, i) => (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => navigate(`/application/${app.id}`)}
                      className="group p-5 bg-surface-50 dark:bg-surface-800/50 rounded-2xl border border-transparent hover:border-brand-500/30 transition-all duration-150 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-12 h-12 bg-white dark:bg-surface-900 rounded-xl flex items-center justify-center text-brand-600 shadow-sm border border-surface-50 dark:border-surface-800 flex-shrink-0">
                          <Home className="w-6 h-6" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-sm text-surface-900 dark:text-white truncate leading-tight mb-0.5 group-hover:text-brand-600 transition-colors duration-150">
                            {app.dormitory_name || app.dormitory?.name}
                          </h4>
                          <p className="text-xs font-medium text-surface-500 dark:text-surface-400 truncate">
                            {app.university || app.dormitory?.university?.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:justify-end gap-6">
                        <div className="text-right hidden sm:block">
                          <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest mb-0.5">Yuborilgan sana</p>
                          <p className="text-xs font-bold text-surface-700 dark:text-surface-300">{formatDate(app.created_at)}</p>
                        </div>
                        <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${getStatusColor(app.status)}`}>
                          {getStatusText(app.status)}
                        </div>
                        <ChevronRight className="w-5 h-5 text-surface-300 group-hover:text-brand-500 transition-colors duration-150 hidden md:block" />
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
            <div className="bg-white dark:bg-surface-900 rounded-2xl p-4 border border-surface-200 dark:border-surface-800 shadow-sm">
              <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-3">Tezkor</h3>
              <div className="grid grid-cols-1 gap-2">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => navigate(action.path)}
                    className="flex items-center gap-3 p-2.5 bg-surface-50 dark:bg-surface-800/50 rounded-xl transition-colors duration-150"
                  >
                    <div className={`w-8 h-8 bg-white dark:bg-surface-900 rounded-xl flex items-center justify-center ${action.color}`}>
                      <action.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-surface-700 dark:text-surface-300">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
