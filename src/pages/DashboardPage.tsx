import React from 'react';
import { motion } from 'framer-motion';
import { Home, MessageCircle, Bell, Heart, Calendar, TrendingUp, Users, MapPin, Star, Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { PageType } from '../App';
import { User, Application } from '../types';
import Header from '../components/Header';

interface DashboardPageProps {
  user: User | null;
  onNavigate: (page: PageType) => void;
  onLogout: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ user, onNavigate, onLogout }) => {
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

  // Mock data for dashboard
  const stats = [
    { label: 'Yuborilgan Arizalar', value: '3', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { label: 'Saqlangan Elonlar', value: '12', icon: Heart, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30' },
    { label: 'Yangi Xabarlar', value: '5', icon: MessageCircle, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
    { label: 'Bildirishnomalar', value: '8', icon: Bell, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' }
  ];

  const recentApplications: Application[] = [
    {
      id: '1',
      listingId: '1',
      listingTitle: 'TATU Yotoqxonasi - Zamonaviy Xonalar',
      status: 'pending',
      submittedAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
      documents: {
        studentId: true,
        transcript: true,
        recommendation: false,
        passport: true
      },
      notes: 'Hujjatlar ko\'rib chiqilmoqda'
    },
    {
      id: '2',
      listingId: '2',
      listingTitle: 'Zamonaviy 2-Xonali Kvartira',
      status: 'approved',
      submittedAt: '2024-01-10T14:30:00Z',
      updatedAt: '2024-01-12T09:15:00Z',
      documents: {
        studentId: true,
        transcript: true,
        recommendation: true,
        passport: true
      },
      notes: 'Ariza tasdiqlandi. Uy egasi bilan bog\'laning.',
      interviewDate: '2024-01-20T15:00:00Z'
    },
    {
      id: '3',
      listingId: '3',
      listingTitle: 'Mirzo Ulug\'bek Yotoqxonasi',
      status: 'interview',
      submittedAt: '2024-01-08T16:45:00Z',
      updatedAt: '2024-01-14T11:20:00Z',
      documents: {
        studentId: true,
        transcript: true,
        recommendation: true,
        passport: false
      },
      notes: 'Suhbat uchun tayyorlaning',
      interviewDate: '2024-01-18T10:00:00Z'
    }
  ];

  const quickActions = [
    { label: 'Yotoqxona Qidirish', icon: Home, action: () => onNavigate('dormitories'), color: 'from-teal-600 to-teal-700' },
    { label: 'Ijara Qidirish', icon: MapPin, action: () => onNavigate('rentals'), color: 'from-green-600 to-green-700' },
    { label: 'Xabarlar', icon: MessageCircle, action: () => onNavigate('messages'), color: 'from-blue-600 to-blue-700' },
    { label: 'Profil', icon: Users, action: () => onNavigate('profile'), color: 'from-purple-600 to-purple-700' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'interview':
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Tasdiqlangan';
      case 'pending':
        return 'Kutilmoqda';
      case 'rejected':
        return 'Rad etilgan';
      case 'interview':
        return 'Suhbat';
      default:
        return 'Noma\'lum';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'interview':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header user={user} onNavigate={onNavigate} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Xush kelibsiz, {user.name.split(' ')[0]}! 👋
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

              {recentApplications.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Hali arizalar yo'q
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Yotoqxona yoki ijara xonadoni topib, birinchi arizangizni yuboring
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onNavigate('home')}
                    className="bg-gradient-to-r from-teal-600 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Qidirishni Boshlash
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentApplications.map((application, index) => (
                    <motion.div
                      key={application.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {application.listingTitle}
                        </h3>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(application.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                            {getStatusText(application.status)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                        <span>
                          Yuborilgan: {new Date(application.submittedAt).toLocaleDateString('uz-UZ')}
                        </span>
                        {application.interviewDate && (
                          <span className="text-blue-600 dark:text-blue-400">
                            Suhbat: {new Date(application.interviewDate).toLocaleDateString('uz-UZ')}
                          </span>
                        )}
                      </div>
                      
                      {application.notes && (
                        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
                          {application.notes}
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
                {quickActions.map((action, index) => (
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