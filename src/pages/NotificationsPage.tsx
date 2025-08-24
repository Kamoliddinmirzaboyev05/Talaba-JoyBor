import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, Filter, Search, Calendar, MessageCircle, CheckCircle, Info, RefreshCw, Clock } from 'lucide-react';
import { Notification, APINotificationItem, APINotificationLegacy } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import Header from '../components/Header';
import { useTheme } from '../contexts/ThemeContext';
import { authAPI } from '../services/api';

const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { refreshUnreadCount } = useNotifications();
  const navigate = useNavigate();

  // Sahifa yuklanganda yuqoriga scroll qilish
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  const [filter, setFilter] = useState<'all' | 'unread' | 'application' | 'message' | 'system'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Load notifications from API
  const loadNotifications = async (pageNum: number = 1, append: boolean = false) => {
    if (!user) return;

    if (pageNum === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const apiNotifications: any[] = await authAPI.getNotifications();

      // Convert API format to local format (support both new and legacy shapes)
      const convertedNotifications: Notification[] = apiNotifications.map((item: APINotificationItem | APINotificationLegacy) => {
        const isNew = (item as APINotificationItem).notification !== undefined;
        if (isNew) {
          const n = (item as APINotificationItem);
          return {
            id: n.notification.id, // notification ichidagi id ni ishlatamiz
            title: 'Bildirishnoma',
            message: n.notification.message,
            type: 'system' as const,
            timestamp: n.notification.created_at,
            read: n.is_read,
            actionUrl: undefined,
            image: n.notification.image_url || n.notification.image || undefined,
          };
        } else {
          const n = item as APINotificationLegacy;
          return {
            id: n.id,
            title: n.title || 'Bildirishnoma',
            message: n.message,
            type: (n.type as 'application' | 'message' | 'system' | 'reminder') || 'system',
            timestamp: n.created_at,
            read: n.is_read,
            actionUrl: n.action_url,
          };
        }
      });

      // Sort notifications by timestamp (newest first)
      const sortedNotifications = convertedNotifications.sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      // Implement pagination
      const startIndex = (pageNum - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const paginatedNotifications = sortedNotifications.slice(startIndex, endIndex);

      if (append) {
        setNotifications(prev => [...prev, ...paginatedNotifications]);
      } else {
        setNotifications(paginatedNotifications);
      }

      // Check if there are more items
      setHasMore(endIndex < sortedNotifications.length);
    } catch (error) {
      console.error('Failed to load notifications:', error);
      // Fallback to sample notifications for testing
      const fallbackNotifications: Notification[] = [
        {
          id: 1,
          title: 'Ariza tasdiqlandi! 🎉',
          message: 'Tabriklaymiz! Sizning Toshkent Davlat Universiteti yotoqxonasiga arizangiz tasdiqlandi. Keyingi qadamlar haqida tez orada xabar beramiz.',
          type: 'application',
          timestamp: new Date().toISOString(),
          read: false,
          actionUrl: '/applications',
          image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=100&h=100&fit=crop&crop=center',
          priority: 'high'
        },
        {
          id: 2,
          title: 'Yangi xabar keldi',
          message: 'Yotoqxona ma\'muriyatidan sizga yangi xabar keldi. Iltimos, xabarlar bo\'limini tekshiring.',
          type: 'message',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          read: false,
          actionUrl: '/messages',
          priority: 'medium'
        },
        {
          id: 3,
          title: 'Yangi yotoqxonalar qo\'shildi',
          message: 'Samarqand viloyatida 5 ta yangi yotoqxona qo\'shildi. Ularni ko\'rib chiqing!',
          type: 'system',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          read: false,
          actionUrl: '/dormitories',
          image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=100&h=100&fit=crop&crop=center',
          priority: 'medium'
        },
        {
          id: 4,
          title: 'Tizim yangilandi',
          message: 'JoyBor platformasi yangi funksiyalar bilan yangilandi. Yangi imkoniyatlarni kashf eting!',
          type: 'system',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          read: true,
          actionUrl: '/about',
          priority: 'low'
        },
        {
          id: 5,
          title: 'Eslatma: To\'lov muddati',
          message: 'Yotoqxona to\'lovi muddati yaqinlashmoqda. 3 kun ichida to\'lovni amalga oshiring.',
          type: 'reminder',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          read: false,
          actionUrl: '/payments',
          priority: 'high'
        }
      ];
      setNotifications(fallbackNotifications);
    } finally {
      if (pageNum === 1) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  };

  useEffect(() => {
    loadNotifications(1, false);
  }, [user]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadNotifications(nextPage, true);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Tizimga kirish talab etiladi
          </h2>
          <button
            onClick={() => navigate('/login')}
            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors duration-200"
          >
            Tizimga kirish
          </button>
        </div>
      </div>
    );
  }

  const filteredNotifications = notifications.filter(notification => {
    const title = (notification.title || '').toLowerCase();
    const message = (notification.message || '').toLowerCase();
    const query = (searchQuery || '').toLowerCase();

    const matchesSearch = title.includes(query) || message.includes(query);
    const notifType = (notification.type || 'system') as 'application' | 'message' | 'system' | 'reminder';
    const matchesFilter = filter === 'all' ||
      (filter === 'unread' && !notification.read) ||
      notifType === filter;
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
      default:
        return <Info className="w-5 h-5" />;
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

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await authAPI.markNotificationAsRead(notificationId);

      // Update local state
      setNotifications(prev => prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      ));

      // Refresh unread count in header
      refreshUnreadCount();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // Get all notifications from API first
      const apiNotifications = await authAPI.getNotifications();
      const unreadNotifications = apiNotifications.filter((item: any) => {
        const isNew = item.notification !== undefined;
        return isNew ? !item.is_read : !item.is_read;
      });

      // Mark all unread notifications as read using notification.id
      await Promise.all(unreadNotifications.map((item: any) => {
        const isNew = item.notification !== undefined;
        const notificationId = isNew ? item.notification.id : item.id;
        return authAPI.markNotificationAsRead(notificationId);
      }));

      // Update local state
      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));

      // Refresh unread count in header
      refreshUnreadCount();
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };



  const handleNotificationClick = (notification: Notification) => {
    // If notification has image or is long, go to detail page
    if (notification.image || notification.message.length > 200) {
      navigate(`/notification/${notification.id}`);
      return;
    }

    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }

    // Navigate based on actionUrl
    if (notification.actionUrl) {
      try {
        navigate(notification.actionUrl);
      } catch (error) {
        console.error('Navigation failed:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Clean Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
                    <Bell className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  {unreadCount > 0 && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Bildirishnomalar
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    {unreadCount > 0 ? `${unreadCount} ta yangi xabar` : 'Barcha xabarlar o\'qilgan'}
                  </p>
                </div>
              </div>

              {/* Action buttons - moved below for mobile */}
              <div className="flex flex-wrap items-center gap-3">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200 text-sm font-medium"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Barchasini o'qilgan</span>
                    <span className="sm:hidden">Barchasi</span>
                  </button>
                )}
                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 text-sm font-medium"
                >
                  <RefreshCw className="w-4 h-4" />
                  Yangilash
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Clean Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Bildirishnomalarni qidiring..."
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ${theme === 'dark'
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                  }`}
              />
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'unread' | 'application' | 'message' | 'system')}
                className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ${theme === 'dark'
                    ? 'border-gray-600 bg-gray-700 text-white'
                    : 'border-gray-300 bg-white text-gray-900'
                  }`}
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
        {loading ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Bildirishnomalar yuklanmoqda...</p>
          </motion.div>
        ) : filteredNotifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Bell className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
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
          <div className="space-y-6">
            {filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => handleNotificationClick(notification)}
                className={`group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border ${!notification.read
                    ? 'border-l-4 border-l-teal-500 bg-teal-50/30 dark:bg-teal-900/10 border-gray-200 dark:border-gray-700'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
              >
                <div className="p-4 sm:p-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    {/* Clean icon */}
                    <div className="relative flex-shrink-0">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center ${getNotificationColor(notification.type)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      {!notification.read && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-teal-500 rounded-full"></div>
                      )}
                    </div>

                    {/* Image if available */}
                    {notification.image && (
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 dark:border-gray-700">
                        <img
                          src={notification.image}
                          alt="Notification"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-1 sm:gap-2">
                        <h3 className={`font-semibold text-base sm:text-lg ${!notification.read
                            ? 'text-gray-900 dark:text-white'
                            : 'text-gray-700 dark:text-gray-300'
                          }`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{formatTime(notification.timestamp)}</span>
                        </div>
                      </div>

                      <p className={`text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 ${!notification.read
                          ? 'text-gray-700 dark:text-gray-300'
                          : 'text-gray-600 dark:text-gray-400'
                        } ${notification.message.length > 100 ? 'line-clamp-2' : ''}`}>
                        {notification.message.length > 100 ?
                          `${notification.message.substring(0, 100)}...` :
                          notification.message
                        }
                      </p>

                      {/* Action section */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getNotificationColor(notification.type)}`}>
                            {notification.type === 'application' ? 'Ariza' :
                              notification.type === 'message' ? 'Xabar' :
                                notification.type === 'system' ? 'Tizim' :
                                  notification.type === 'reminder' ? 'Eslatma' : 'Bildirishnoma'}
                          </span>
                          {notification.priority && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${notification.priority === 'high' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                                notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                  'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400'
                              }`}>
                              {notification.priority === 'high' ? 'Muhim' :
                                notification.priority === 'medium' ? 'O\'rta' : 'Past'}
                            </span>
                          )}
                          {(notification.image || notification.message.length > 200) && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-medium">
                              Ko'proq o'qish
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {!notification.read ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification.id);
                              }}
                              className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200 text-xs sm:text-sm"
                              title="O'qilgan deb belgilash"
                            >
                              <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="hidden sm:inline">O'qilgan</span>
                            </button>
                          ) : (
                            <div className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg text-xs sm:text-sm">
                              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="hidden sm:inline">O'qilgan</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Load More */}
        {hasMore && filteredNotifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-8"
          >
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
            >
              {loadingMore ? 'Yuklanmoqda...' : 'Ko\'proq yuklash'}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;