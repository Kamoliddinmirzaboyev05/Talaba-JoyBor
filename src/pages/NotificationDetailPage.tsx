import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Check, CheckCircle, Calendar, MessageCircle, Info, X } from 'lucide-react';
import { Notification } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import Header from '../components/Header';
import { authAPI } from '../services/api';
import { formatTime } from "../utils/format";

const NotificationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { refreshUnreadCount } = useNotifications();
  const navigate = useNavigate();
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const loadNotification = async () => {
      if (!user || !id) return;
      
      setLoading(true);
      try {
        const apiNotifications = await authAPI.getNotifications();
        
        // Define notification types
        type NewNotificationFormat = {
          notification: {
            id: number;
            message: string;
            created_at: string;
            image_url?: string;
            image?: string;
          };
          is_read: boolean;
        };
        
        type LegacyNotificationFormat = {
          id: number;
          title?: string;
          message: string;
          type?: string;
          created_at: string;
          is_read: boolean;
          action_url?: string;
        };
        
        const foundNotification = apiNotifications.find((item: unknown) => {
          const typedItem = item as Record<string, unknown>;
          const isNew = typedItem.notification !== undefined;
          return isNew ? (typedItem.notification as { id: number }).id === parseInt(id) : (typedItem as { id: number }).id === parseInt(id);
        }) as (NewNotificationFormat | LegacyNotificationFormat) | undefined;

        if (foundNotification) {
          const isNew = 'notification' in foundNotification;
          
          const legacyType = (foundNotification as LegacyNotificationFormat).type;
          const validType: 'application' | 'message' | 'system' | 'reminder' = 
            (legacyType === 'application' || legacyType === 'message' || legacyType === 'system' || legacyType === 'reminder') 
              ? legacyType 
              : 'system';
          
          const convertedNotification: Notification = isNew ? {
            id: (foundNotification as NewNotificationFormat).notification.id,
            title: 'Bildirishnoma',
            message: (foundNotification as NewNotificationFormat).notification.message,
            type: 'system',
            timestamp: (foundNotification as NewNotificationFormat).notification.created_at,
            read: foundNotification.is_read,
            actionUrl: undefined,
            image: (foundNotification as NewNotificationFormat).notification.image_url || (foundNotification as NewNotificationFormat).notification.image,
          } : {
            id: (foundNotification as LegacyNotificationFormat).id,
            title: (foundNotification as LegacyNotificationFormat).title || 'Bildirishnoma',
            message: (foundNotification as LegacyNotificationFormat).message,
            type: validType,
            timestamp: (foundNotification as LegacyNotificationFormat).created_at,
            read: (foundNotification as LegacyNotificationFormat).is_read,
            actionUrl: (foundNotification as LegacyNotificationFormat).action_url,
          };
          
          setNotification(convertedNotification);
          
          // Mark as read if not already read
          if (!convertedNotification.read) {
            handleMarkAsRead(convertedNotification.id);
          }
        } else {
          navigate('/notifications');
        }
      } catch (error) {
        console.error('Failed to load notification:', error);
        navigate('/notifications');
      } finally {
        setLoading(false);
      }
    };

    loadNotification();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user, navigate]);

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await authAPI.markNotificationAsRead(notificationId);
      setNotification(prev => prev ? { ...prev, read: true } : null);
      refreshUnreadCount();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'application':
        return <Calendar className="w-6 h-6" />;
      case 'message':
        return <MessageCircle className="w-6 h-6" />;
      case 'system':
      default:
        return <Info className="w-6 h-6" />;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Bildirishnoma yuklanmoqda...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!notification) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Bildirishnoma topilmadi
            </h3>
            <button
              onClick={() => navigate('/notifications')}
              className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors duration-200"
            >
              Orqaga qaytish
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/notifications')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Bildirishnomalarga qaytish
        </motion.button>

        {/* Notification Detail */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${getNotificationColor(notification.type)}`}>
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {notification.title}
                  </h1>
                  <div className="flex items-center gap-2">
                    {notification.read ? (
                      <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg text-sm">
                        <CheckCircle className="w-4 h-4" />
                        O'qilgan
                      </div>
                    ) : (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="flex items-center gap-1 px-3 py-1 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200 text-sm"
                      >
                        <Check className="w-4 h-4" />
                        O'qilgan
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(notification.timestamp)}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getNotificationColor(notification.type)}`}>
                    {notification.type === 'application' ? 'Ariza' : 
                     notification.type === 'message' ? 'Xabar' : 
                     notification.type === 'system' ? 'Tizim' : 
                     notification.type === 'reminder' ? 'Eslatma' : 'Bildirishnoma'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Image if available */}
            {notification.image && (
              <div className="mb-6">
                <img
                  src={notification.image}
                  alt="Notification"
                  className="w-full max-w-2xl mx-auto rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200"
                  onClick={() => setImageModalOpen(true)}
                />
              </div>
            )}

            {/* Message */}
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {notification.message}
              </p>
            </div>

            {/* Action button if actionUrl exists */}
            {notification.actionUrl && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => navigate(notification.actionUrl!)}
                  className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors duration-200 font-medium"
                >
                  Ko'proq ma'lumot
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Image Modal */}
        {imageModalOpen && notification.image && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setImageModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setImageModalOpen(false)}
                className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors duration-200"
              >
                <X className="w-8 h-8" />
              </button>
              <img
                src={notification.image}
                alt="Notification"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NotificationDetailPage;