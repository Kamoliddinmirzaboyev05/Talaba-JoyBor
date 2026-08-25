import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Home,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Search,
  Filter,
  Eye,
  MessageSquareText,
} from "lucide-react";
import { Application } from "../types";
import { statusTone, statusLabel } from "../utils/applicationStatus";
import { useAuth } from "../contexts/AuthContext";
import Header from "../components/Header";
import Skeleton from "../components/Skeleton";
import EmptyState from "../components/EmptyState";
import { authAPI } from "../services/api";
import { useTheme } from "../contexts/ThemeContext";
import { formatUiDate } from "../utils/format";

const ApplicationsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Sahifa yuklanganda yuqoriga scroll qilish
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // API dan arizalarni yuklash
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const applicationsData = await authAPI.getApplications();
        setApplications(applicationsData);
        setFilteredApplications(applicationsData);
      } catch (error) {
        setApplications([]);
        setFilteredApplications([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchApplications();
    }
  }, [user]);

  // Filter applications
  useEffect(() => {
    let filtered = applications;

    // Status filter
    if (statusFilter !== "ALL") {
      filtered = filtered.filter(app => statusTone(app.status).toUpperCase() === statusFilter);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.dormitory?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.dormitory?.university?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.university?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.city?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredApplications(filtered);
  }, [applications, searchTerm, statusFilter]);

  if (!user) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-4">
            Tizimga kirish talab etiladi
          </h2>
          <button
            onClick={() => navigate("/login")}
            className="bg-brand-600 text-white px-6 py-3 rounded-xl hover:bg-brand-700 transition-colors duration-200"
          >
            Tizimga kirish
          </button>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (statusTone(status)) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-success-500" />;
      case "pending":
        return <Clock className="w-5 h-5 text-warning-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-danger-500" />;
      case "interview":
        return <AlertCircle className="w-5 h-5 text-brand-500" />;
      case "completed":
        return <CheckCircle className="w-5 h-5 text-success-600" />;
      default:
        return <Clock className="w-5 h-5 text-surface-500" />;
    }
  };

  const getStatusText = statusLabel;

  const getStatusColor = (status: string) => {
    switch (statusTone(status)) {
      case "approved":
      case "completed":
        return "bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300";
      case "pending":
        return "bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300";
      case "rejected":
        return "bg-danger-100 text-danger-800 dark:bg-danger-900/30 dark:text-danger-300";
      case "interview":
        return "bg-brand-100 text-brand-800 dark:bg-brand-900/30 dark:text-brand-300";
      default:
        return "bg-surface-100 text-surface-800 dark:bg-surface-900/30 dark:text-surface-300";
    }
  };

  const statusOptions = [
    { value: "ALL", label: "Barchasi", count: applications.length },
    { value: "PENDING", label: "Kutilmoqda", count: applications.filter(app => statusTone(app.status) === "pending").length },
    { value: "APPROVED", label: "Tasdiqlangan", count: applications.filter(app => statusTone(app.status) === "approved").length },
    { value: "REJECTED", label: "Rad etilgan", count: applications.filter(app => statusTone(app.status) === "rejected").length },
    { value: "INTERVIEW", label: "Suhbat", count: applications.filter(app => statusTone(app.status) === "interview").length },
  ];

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-brand-600 hover:text-brand-700 mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          Dashboard ga qaytish
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-2 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-brand-600" />
            Mening Arizalarim
          </h1>
          <p className="text-surface-600 dark:text-surface-300">
            Barcha yuborgan arizalaringizni bu yerda ko'rishingiz mumkin
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white dark:bg-surface-900 rounded-2xl shadow-sm p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type="text"
                  placeholder="Yotoqxona, universitet yoki shahar bo'yicha qidiring..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all duration-200 ${
                    theme === 'dark' 
                      ? 'bg-surface-700 border-surface-600 text-white' 
                      : 'bg-white border-surface-300 text-surface-900'
                  }`}
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="md:w-64">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all duration-200 ${
                    theme === 'dark' 
                      ? 'bg-surface-700 border-surface-600 text-white' 
                      : 'bg-white border-surface-300 text-surface-900'
                  }`}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label} ({option.count})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Applications List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-surface-900 rounded-2xl shadow-sm p-6"
        >
          {loading ? (
            <Skeleton className="h-24 w-full rounded-2xl" count={3} />
          ) : filteredApplications.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title={searchTerm || statusFilter !== "ALL" ? "Hech narsa topilmadi" : "Hali arizalar yo'q"}
              description={
                searchTerm || statusFilter !== "ALL"
                  ? "Qidiruv shartlaringizni o'zgartiring yoki filterni olib tashlang"
                  : "Yotoqxona topib, birinchi arizangizni yuboring"
              }
              action={
                !searchTerm && statusFilter === "ALL"
                  ? { label: "Yotoqxona Qidirish", onClick: () => navigate("/dormitories") }
                  : undefined
              }
            />
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((application, index) => (
                <motion.div
                  key={application.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group border border-surface-200 dark:border-surface-700 rounded-xl p-6 hover:shadow-md hover:border-brand-300 dark:hover:border-brand-600 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Home className="w-5 h-5 text-brand-600" />
                        <h3 className="text-lg font-semibold text-surface-900 dark:text-white group-hover:text-brand-600 transition-colors duration-150">
                          {application.dormitory?.name || 'Yotoqxona nomi'}
                        </h3>
                      </div>
                      <p className="text-surface-600 dark:text-surface-400 ml-8 mb-3">
                        {application.dormitory?.university?.name || application.university || 'Universitet'}
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ml-8">
                        <div className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400 min-w-0">
                          <MapPin className="w-4 h-4 shrink-0 text-danger-500" />
                          <span className="truncate">
                            {application.dormitory?.address || application.city || "Joylashuv ko'rsatilmagan"}
                          </span>
                        </div>
                        {application.created_at && (
                          <div className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
                            <Calendar className="w-4 h-4 shrink-0" />
                            <span>{formatUiDate(application.created_at)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(application.status)}
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            application.status
                          )}`}
                        >
                          {getStatusText(application.status)}
                        </span>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/application/${application.id}`)}
                        className="flex items-center gap-2 text-brand-600 hover:text-brand-700 text-sm font-medium transition-colors duration-200"
                      >
                        <Eye className="w-4 h-4" />
                        Batafsil
                      </motion.button>
                    </div>
                  </div>

                  {/* Progress indicator */}
                  <div className="flex items-center gap-3 ml-8">
                    <div className="flex-1 bg-surface-200 dark:bg-surface-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          statusTone(application.status) === 'pending' ? 'bg-warning-500 w-1/3' :
                          statusTone(application.status) === 'interview' ? 'bg-brand-500 w-2/3' :
                          statusTone(application.status) === 'approved' ? 'bg-success-500 w-full' :
                          statusTone(application.status) === 'rejected' ? 'bg-danger-500 w-full' :
                          'bg-surface-400 w-1/4'
                        }`}
                      />
                    </div>
                    <span className="text-sm text-surface-500 dark:text-surface-400 min-w-fit font-medium">
                      {statusTone(application.status) === 'unknown' ? 'Jarayon' : statusLabel(application.status)}
                    </span>
                  </div>

                  {application.comment && (
                    <div className="mt-4 ml-8 flex items-start gap-2.5 p-3.5 rounded-xl bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-800/50">
                      <MessageSquareText className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-surface-700 dark:text-surface-300">
                        <span className="font-semibold text-surface-900 dark:text-white">Izoh: </span>
                        {application.comment}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ApplicationsPage;