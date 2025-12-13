import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (access: string, refresh: string) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  updateUserProfile: (profileData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Migrate tokens from localStorage -> sessionStorage; keep only theme in localStorage
    try {
      const theme = localStorage.getItem('theme');
      const accessLocal = localStorage.getItem('access') || localStorage.getItem('access_token');
      const refreshLocal = localStorage.getItem('refresh') || localStorage.getItem('refresh_token');
      if (accessLocal) sessionStorage.setItem('access', accessLocal);
      if (refreshLocal) sessionStorage.setItem('refresh', refreshLocal);
      // Clear everything except theme
      Object.keys(localStorage).forEach((key) => {
        if (key !== 'theme') localStorage.removeItem(key);
      });
      if (theme) localStorage.setItem('theme', theme);
    } catch {
      // Ignore migration errors
    }

    const initializeAuth = async () => {
      const token = sessionStorage.getItem('access');
      console.log('AuthContext: Token mavjudmi?', !!token);
      
      if (token) {
        try {
          const decoded: { user_id: number; exp: number; username?: string; first_name?: string; last_name?: string; email?: string; phone?: string } = jwtDecode(token);
          console.log('AuthContext: Token decode qilindi', decoded);
          
          // Token muddati tugaganmi tekshirish
          if (decoded.exp * 1000 < Date.now()) {
            console.log('AuthContext: Token muddati tugagan');
            sessionStorage.removeItem('access');
            sessionStorage.removeItem('refresh');
            setUser(null);
            setIsAuthenticated(false);
            setIsLoading(false);
            return;
          }
          
          // API dan to'liq profile ma'lumotlarini yuklash
          const response = await fetch('https://joyborv1.pythonanywhere.com/api/me/', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const profileData = await response.json();
            console.log('AuthContext: Profile ma\'lumotlari yuklandi', profileData);
            setUser({ ...profileData, id: decoded.user_id });
            setIsAuthenticated(true);
          } else if (response.status === 401) {
            console.log('AuthContext: 401 xatosi, token yaroqsiz');
            sessionStorage.removeItem('access');
            sessionStorage.removeItem('refresh');
            setUser(null);
            setIsAuthenticated(false);
          } else {
            // API dan ma'lumot olishda xatolik bo'lsa, JWT dan asosiy ma'lumotlarni ishlatamiz
            console.log('AuthContext: API xatosi, JWT ma\'lumotlarini ishlatish');
            setUser({
              id: decoded.user_id,
              username: decoded.username || '',
              first_name: decoded.first_name || '',
              last_name: decoded.last_name || '',
              email: decoded.email || '',
              phone: decoded.phone || '',
            });
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('AuthContext: Token decode xatosi', error);
          sessionStorage.removeItem('access');
          sessionStorage.removeItem('refresh');
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (access: string, refresh: string) => {
    sessionStorage.setItem('access', access);
    sessionStorage.setItem('refresh', refresh);
    try {
      // JWT dan asosiy ma'lumotlarni olish
      const decoded: { user_id: number; exp: number; username?: string; first_name?: string; last_name?: string; email?: string; phone?: string } = jwtDecode(access);
      // API dan to'liq profile ma'lumotlarini olish
      const response = await fetch('https://joyborv1.pythonanywhere.com/api/me/', {
        headers: {
          'Authorization': `Bearer ${access}`,
        },
      });
      if (response.ok) {
        const profileData = await response.json();
        setUser({ ...profileData, id: decoded.user_id });
      } else {
        setUser({
          id: decoded.user_id,
          username: decoded.username || '',
          first_name: decoded.first_name || '',
          last_name: decoded.last_name || '',
          email: decoded.email || '',
          phone: decoded.phone || '',
        });
      }
    } catch {
      setUser(null);
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    sessionStorage.removeItem('access');
    sessionStorage.removeItem('refresh');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUserProfile = (profileData: User) => {
    setUser(profileData);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    setUser,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 