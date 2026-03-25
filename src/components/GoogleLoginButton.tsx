import React, { useState } from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { authAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const GoogleLoginButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    setIsLoading(true);
    setError(null);
    try {
      if (credentialResponse.credential) {
        // Backendga ID Token yuborish
        const data = await authAPI.googleAuth(credentialResponse.credential);
        
        // Login muvaffaqiyatli bo'lsa
        login(data.access, data.refresh);
        navigate(from, { replace: true });
      } else {
        setError('Google ma\'lumotlari olinmadi');
      }
    } catch (err: any) {
      console.error('Google auth error:', err);
      setError(err.response?.data?.error || 'Google orqali kirishda xatolik yuz berdi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = () => {
    setError('Google login bekor qilindi yoki xatolik yuz berdi');
  };

  return (
    <div className="w-full flex flex-col items-center">
      {error && (
        <p className="text-red-500 text-sm mb-3 text-center bg-red-50 dark:bg-red-900/20 p-2 rounded-lg w-full">
          {error}
        </p>
      )}
      
      <div className="w-full flex justify-center">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          useOneTap
          theme="outline"
          shape="circle"
          size="large"
          width="100%"
        />
      </div>

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
