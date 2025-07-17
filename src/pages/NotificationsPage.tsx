import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, Trash2, Filter, Search, Calendar, MessageCircle, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { PageType } from '../App';
import { User, Notification } from '../types';
import Header from '../components/Header';

interface NotificationsPageProps {
  user: User | null;
  onNavigate: (page: PageType) => void;
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({ user, onNavigate }) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'application' | 'message' | 'system'>('all');
  const [searchQuery, setSearchQuery] = useState('');

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

  // Mock notifications data
  const notifications: Notification[] = [
    {
      id: '1',
      title: 'Ariza tasdiqlandi',
      message: 'TATU Yotoqxonasi uchun yuborgan arizangiz tasdiqlandi. Keyingi qadamlar haqida ma\'lumot olish uchun bog\'laning.',
      type: 'application',
      timestamp: '2024-01-15T14:30:00Z',
      read: false,
      actionUrl: '/applications'
    },
    {
      id: '2',
      title: 'Yangi xabar',
      message: 'Aziz Karimov sizga xabar yubordi: "Kvartira haqida qo\'shimcha savollaringiz bormi?"',
      type: 'message',
      timestamp: '2024-01-15T13:45:00Z',
      read: false,
      actionUrl: '/messages'
    },
    {
      id: '3',
      title: 'Suhbat vaqti belgilandi',
      message: 'Mirzo Ulug\'bek Yotoqxonasi bilan suhbat 18-yanvar, 10:00 da belgilandi.',
      type: 'application',
      timestamp: '2024-01-15T11:20:00Z',
      read: true,
      actionUrl: '/applications'
    },
    {
      id: '4',
      title: 'Yangi elonlar mavjud',
      message: 'Sizning afzalliklaringizga mos 3 ta yangi elon qo\'shildi.',
      type: 'system',
      timestamp: '2024-01-15T09:15:00Z',
      read: true,
      actionUrl: '/dormitories'
    },
    {
      id: '5',
      title: 'Hujjat yuklash eslatmasi',
      message: 'Arizangizni to\'ldirish uchun talaba guvohnomasi va o\'quv ma\'lumotnomasi yuklash kerak.',
      type: 'reminder',
      timestamp: '2024-01-14T16:30:00Z',
      read: true,
      actionUrl: '/applications'
    },
    {
      id: '6',
      title: 'Profil yangilandi',
      message: 'Profilingiz muvaffaqiyatli yangilandi. Barcha ma\'lumotlar saqlandi.',
      type: 'system',
      timestamp: '2024-01-14T14:20:00Z',
      read: true,
      actionUrl: '/profile'
    }
  ];

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' && !notification.read) ||
                         notification.type === filter;
    return matchesSearch && matchesFilter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'application':
        return <Calendar className="w-5 h-5" />;
      case 'message':
        return <MessageCircle className="w-5 h-5" />;
      case 'system':
        return <Info className="w-5 h-5" />;
      case 'reminder':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'application':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'message':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
      case 'system':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400';
      case 'reminder':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Hozir';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} soat oldin`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} kun oldin`;
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    // Here you would typically update the notification status
    console.log('Marking as read:', notificationId);
  };

  const handleMarkAllAsRead = () => {
    // Here you would typically mark all notifications as read
    console.log('Marking all as read');
  };

  const handleDeleteNotification = (notificationId: string) => {
    // Here you would typically delete the notification
    console.log('Deleting notification:', notificationId);
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
    
    // Navigate based on actionUrl
    if (notification.actionUrl) {
      const page = notification.actionUrl.replace('/', '') as PageType;
      onNavigate(page);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header user={user} onNavigate={onNavigate} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                    {unreadCount}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Bildirishnomalar
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  {unreadCount > 0 ? `${unreadCount} ta o'qilmagan xabar` : 'Barcha xabarlar o\'qilgan'}
                </p>
              </div>
            </div>
            
            {unreadCount > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
              >
                <CheckCircle className="w-4 h-4" />
                Barchasini o'qilgan deb belgilash
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Bildirishnomalarni qidiring..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">Barchasi</option>
                <option value="unread">O'qilmaganlar</option>
                <option value="application">Arizalar</option>
                <option value="message">Xabarlar</option>
                <option value="system">Tizim</option>
                <option value="reminder">Eslatmalar</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bell className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {searchQuery || filter !== 'all' ? 'Hech narsa topilmadi' : 'Bildirishnomalar yo\'q'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
              {searchQuery || filter !== 'all' 
                ? 'Qidiruv shartlaringizni o\'zgartirib ko\'ring'
                : 'Yangi bildirishnomalar paydo bo\'lganda bu yerda ko\'rasiz'
              }
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                onClick={() => handleNotificationClick(notification)}
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 border-l-4 ${
                  !notification.read 
                    ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-900/10' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`font-semibold ${
                        !notification.read 
                          ? 'text-gray-900 dark:text-white' 
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {notification.title}
                        {!notification.read && (
                          <span className="inline-block w-2 h-2 bg-teal-500 rounded-full ml-2"></span>
                        )}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0 ml-4">
                        {formatTime(notification.timestamp)}
                      </span>
                    </div>
                    
                    <p className={`text-sm leading-relaxed ${
                      !notification.read 
                        ? 'text-gray-700 dark:text-gray-300' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {notification.message}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!notification.read && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notification.id);
                        }}
                        className="p-2 text-teal-600 hover:bg-teal-100 dark:hover:bg-teal-900/30 rounded-lg transition-colors duration-200"
                        title="O'qilgan deb belgilash"
                      >
                        <Check className="w-4 h-4" />
                      </motion.button>
                    )}
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNotification(notification.id);
                      }}
                      className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors duration-200"
                      title="O'chirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Load More */}
        {filteredNotifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-8"
          >
            <button className="text-teal-600 hover:text-teal-700 font-medium transition-colors duration-200">
              Ko'proq yuklash
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;