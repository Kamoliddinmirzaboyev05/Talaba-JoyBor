import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, MessageCircle, Bell, Heart, Calendar, Users, MapPin, Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { PageType } from '../App';
import { User, Application } from '../types';
import Header from '../components/Header';
import { authAPI } from '../services/api';

interface DashboardPageProps {
  user: User | null;
  onNavigate: (page: PageType) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ user, onNavigate }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // API dan arizalarni yuklash
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const applicationsData = await authAPI.getApplications();
        setApplications(applicationsData);
      } catch (error) {
        console.error('Arizalar yuklanmadi:', error);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchApplications();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Tizimga kirish talab etiladi
          </h2>
          <button
            onClick={() => onNavigate('login')}
            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors duration-200"
          >
            Tizimga kirish
          </button>
        </div>
      </div>
    );
  }

  // Fix: get first name safely
  const firstName = user?.name?.split(' ')[0] || 'Foydalanuvchi';

  // Dashboard statistikalari
  const stats = [
    { label: 'Yuborilgan Arizalar', value: applications.length.toString(), icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { label: 'Kutilayotgan', value: applications.filter(app => app.status === 'PENDING').length.toString(), icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
    { label: 'Tasdiqlangan', value: applications.filter(app => app.status === 'APPROVED').length.toString(), icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
    { label: 'Rad etilgan', value: applications.filter(app => app.status === 'REJECTED').length.toString(), icon: XCircle, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30' }
  ];

  const quickActions = [
    { label: 'Yotoqxona Qidirish', icon: Home, action: () => onNavigate('dormitories'), color: 'from-teal-600 to-teal-700' },
    { label: 'Ijara Qidirish', icon: MapPin, action: () => onNavigate('rentals'), color: 'from-green-600 to-green-700' },
    { label: 'Xabarlar', icon: MessageCircle, action: () => onNavigate('messages'), color: 'from-blue-600 to-blue-700' },
    { label: 'Profil', icon: Users, action: () => onNavigate('profile'), color: 'from-purple-600 to-purple-700' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'REJECTED':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'INTERVIEW':
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      case 'COMPLETED':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'Tasdiqlangan';
      case 'PENDING':
        return 'Kutilmoqda';
      case 'REJECTED':
        return 'Rad etilgan';
      case 'INTERVIEW':
        return 'Suhbat';
      case 'COMPLETED':
        return 'Yakunlangan';
      default:
        return 'Noma\'lum';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'INTERVIEW':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header onNavigate={onNavigate} />

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
            Bu yerda sizning faoliyatingiz va arizalaringizni kuzatishingiz mumkin
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
                <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
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
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  So'nggi Arizalar
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onNavigate('profile')}
                  className="text-teal-600 hover:text-teal-700 text-sm font-medium transition-colors duration-200"
                >
                  Barchasini ko'rish
                </motion.button>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-300">Arizalar yuklanmoqda...</p>
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
                    onClick={() => onNavigate('dormitories')}
                    className="bg-gradient-to-r from-teal-600 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Yotoqxona Qidirish
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.slice(0, 5).map((application, index) => (
                    <motion.div
                      key={application.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {application.dormitory.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {application.dormitory.university.name}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(application.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                            {getStatusText(application.status)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300 mb-3">
                        <div>
                          <span className="font-medium">Ism:</span> {application.name}
                        </div>
                        <div>
                          <span className="font-medium">Shahar:</span> {application.city}
                        </div>
                        <div>
                          <span className="font-medium">Telefon:</span> {application.phone}
                        </div>
                        <div>
                          <span className="font-medium">Universitet:</span> {application.university}
                        </div>
                      </div>

                      {application.created_at && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Yuborilgan: {new Date(application.created_at).toLocaleDateString('uz-UZ', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      )}

                      {application.comment && (
                        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
                          <span className="font-medium">Izoh:</span> {application.comment}
                        </p>
                      )}
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
                  <span className="text-gray-600 dark:text-gray-300">Universitet:</span>
                  <span className="font-medium text-gray-900 dark:text-white text-right">
                    {user.university}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Talaba ID:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {user.studentId}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Holat:</span>
                  <div className="flex items-center gap-1">
                    {user.isVerified ? (
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
                onClick={() => onNavigate('profile')}
                className="w-full mt-4 border-2 border-teal-600 text-teal-600 py-2 rounded-xl font-medium hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all duration-300"
              >
                Profilni Ko'rish
              </motion.button>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                So'nggi Faoliyat
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white">
                      Yangi ariza yuborildi
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      2 soat oldin
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white">
                      Profil yangilandi
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      1 kun oldin
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white">
                      Yangi elon saqlandi
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      3 kun oldin
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;