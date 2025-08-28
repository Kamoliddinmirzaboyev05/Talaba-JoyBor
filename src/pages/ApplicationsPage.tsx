import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Home,
  Users,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Search,
  Filter,
  Eye,
} from "lucide-react";
import { Application } from "../types";
import { useAuth } from "../contexts/AuthContext";
import Header from "../components/Header";
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
        console.error("Arizalar yuklanmadi:", error);
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
      filtered = filtered.filter(app => app.status === statusFilter);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
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
    switch (status) {
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
    switch (status) {
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

  const statusOptions = [
    { value: "ALL", label: "Barchasi", count: applications.length },
    { value: "PENDING", label: "Kutilmoqda", count: applications.filter(app => app.status === "PENDING").length },
    { value: "APPROVED", label: "Tasdiqlangan", count: applications.filter(app => app.status === "APPROVED").length },
    { value: "REJECTED", label: "Rad etilgan", count: applications.filter(app => app.status === "REJECTED").length },
    { value: "INTERVIEW", label: "Suhbat", count: applications.filter(app => app.status === "INTERVIEW").length },
  ];

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
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-6 transition-colors duration-200"
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-teal-600" />
            Mening Arizalarim
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Barcha yuborgan arizalaringizni bu yerda ko'rishingiz mumkin
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Yotoqxona, universitet yoki shahar bo'yicha qidiring..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="md:w-64">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
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
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">
                Arizalar yuklanmoqda...
              </p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {searchTerm || statusFilter !== "ALL" ? "Hech narsa topilmadi" : "Hali arizalar yo'q"}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {searchTerm || statusFilter !== "ALL" 
                  ? "Qidiruv shartlaringizni o'zgartiring yoki filterni olib tashlang"
                  : "Yotoqxona topib, birinchi arizangizni yuboring"
                }
              </p>
              {!searchTerm && statusFilter === "ALL" && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/dormitories")}
                  className="bg-gradient-to-r from-teal-600 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Yotoqxona Qidirish
                </motion.button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((application, index) => (
                <motion.div
                  key={application.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg hover:border-teal-300 dark:hover:border-teal-600 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Home className="w-5 h-5 text-teal-600" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-teal-600 transition-colors">
                          {application.dormitory?.name || 'Yotoqxona nomi'}
                        </h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 ml-8 mb-3">
                        {application.dormitory?.university?.name || application.university || 'Universitet'}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-8">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Users className="w-4 h-4" />
                          <span>{application.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <MapPin className="w-4 h-4" />
                          <span>{application.city}</span>
                        </div>
                        {application.created_at && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
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
                        className="flex items-center gap-2 text-teal-600 hover:text-teal-700 text-sm font-medium transition-colors duration-200"
                      >
                        <Eye className="w-4 h-4" />
                        Batafsil
                      </motion.button>
                    </div>
                  </div>

                  {/* Progress indicator */}
                  <div className="flex items-center gap-3 ml-8">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          application.status === 'PENDING' ? 'bg-yellow-500 w-1/3' :
                          application.status === 'INTERVIEW' ? 'bg-blue-500 w-2/3' :
                          application.status === 'APPROVED' ? 'bg-green-500 w-full' :
                          application.status === 'REJECTED' ? 'bg-red-500 w-full' :
                          'bg-gray-400 w-1/4'
                        }`}
                      />
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 min-w-fit font-medium">
                      {application.status === 'PENDING' ? 'Kutilmoqda' :
                       application.status === 'INTERVIEW' ? 'Suhbat' :
                       application.status === 'APPROVED' ? 'Tasdiqlangan' :
                       application.status === 'REJECTED' ? 'Rad etilgan' : 'Jarayon'}
                    </span>
                  </div>

                  {application.comment && (
                    <div className="mt-4 ml-8">
                      <p className={`text-sm p-3 rounded-lg border-l-4 border-teal-500 ${
                        theme === "dark"
                          ? "text-gray-300 bg-gray-700"
                          : "text-gray-700 bg-gray-50"
                      }`}>
                        <span className="font-medium">Izoh:</span> {application.comment}
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