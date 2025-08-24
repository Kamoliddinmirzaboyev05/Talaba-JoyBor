import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { authAPI } from '../services/api';

interface NotificationContextType {
  unreadCount: number;
  refreshUnreadCount: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    if (!isAuthenticated || !user) {
      setUnreadCount(0);
      return;
    }

    try {
      const notifications = await authAPI.getNotifications();
      const unread = notifications.filter((item: any) => {
        // Support both new and legacy notification formats
        const isNew = item.notification !== undefined;
        return isNew ? !item.is_read : !item.is_read;
      }).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
      // Set to 0 on error instead of fallback
      setUnreadCount(0);
    }
  };

  const refreshUnreadCount = () => {
    fetchUnreadCount();
  };

  useEffect(() => {
    fetchUnreadCount();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, [isAuthenticated, user]);

  const value = {
    unreadCount,
    refreshUnreadCount,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};