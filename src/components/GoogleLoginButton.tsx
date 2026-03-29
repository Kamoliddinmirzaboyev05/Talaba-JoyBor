import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { authAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

interface GoogleLoginButtonProps {
  text?: string;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ text = "Google orqali kirish" }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      setError(null);
      try {
        if (tokenResponse.access_token) {
          // Backendga access token yuborish
          // Eslatma: Backend register endpointi (POST /auth/google/register/) 
          // 'token' nomli maydonda Google tokenini kutmoqda
          const data = await authAPI.googleAuth(tokenResponse.access_token);
          
          // Login muvaffaqiyatli bo'lsa
          login(data.access, data.refresh);
          navigate(from, { replace: true });
        } else {
          setError('Google ma\'lumotlari olinmadi');
        }
      } catch (err: any) {
        setError(err.response?.data?.error || 'Google orqali kirishda xatolik yuz berdi');
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      setError('Google login bekor qilindi yoki xatolik yuz berdi');
      setIsLoading(false);
    }
  });

  return (
    <div className="w-full flex flex-col items-center">
      {error && (
        <p className="text-red-500 text-sm mb-3 text-center bg-red-50 dark:bg-red-900/20 p-2 rounded-lg w-full">
          {error}
        </p>
      )}
      
      <button
        onClick={() => {
          setIsLoading(true);
          googleLogin();
        }}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-600 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
        </svg>
        <span className="text-slate-700 dark:text-slate-200 font-semibold">{text}</span>
      </button>

      {isLoading && (
        <div className="mt-3 flex items-center gap-2 text-teal-600 dark:text-teal-400 text-sm font-medium">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Tizimga kirilmoqda...
        </div>
      )}
    </div>
  );
};

export default GoogleLoginButton;
