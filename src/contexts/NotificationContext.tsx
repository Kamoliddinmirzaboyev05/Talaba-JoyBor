import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
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

  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setUnreadCount(0);
      return;
    }

    try {
      const notifications = await authAPI.getNotifications();
      // Calculate unread count based on 'read' or 'is_read' property
      const count = notifications.filter(n => !(n as any).read && !(n as any).is_read).length;
      setUnreadCount(count);
    } catch (error) {
      // Handle error silently
    }
  }, [isAuthenticated, user]);

  const refreshUnreadCount = () => {
    fetchUnreadCount();
  };

  useEffect(() => {
    fetchUnreadCount();
    
    // Refresh every 60 seconds (increased from 30 to reduce API load)
    const interval = setInterval(fetchUnreadCount, 60000);
    
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

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