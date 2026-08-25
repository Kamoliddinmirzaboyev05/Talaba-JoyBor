import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Send, ArrowLeft, RefreshCw, ShieldCheck, Sparkles, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { JOYBOR_BOT_USERNAME, JOYBOR_BOT_URL } from '../services/telegram';

const TelegramAuthPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    isAuthenticated,
    isLoading,
    isTelegram,
    authError,
    reauthenticateWithTelegram,
    openBot,
  } = useAuth();

  // Agar allaqachon login qilgan bo'lsa, oldingi sahifaga (yoki asosiy sahifaga)
  // yo'naltirish — yotoqxonaga joylashgan talabani dashboardga o'tkazish
  // ishini HomePage o'zi TMA-ochilish tekshiruvida bajaradi.
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  const handleOpenBot = () => {
    openBot('app');
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex flex-col justify-between p-4 sm:p-6">
      {/* Top bar */}
      <div className="max-w-xl w-full mx-auto flex items-center justify-between py-2">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-sm font-medium text-surface-600 dark:text-surface-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors duration-150"
        >
          <ArrowLeft className="w-4 h-4" />
          Bosh sahifaga qaytish
        </button>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800/50">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Telegram Mini App</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center py-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-lg"
        >
          {/* Brand Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white flex items-center justify-center mx-auto mb-3.5 shadow-sm">
              <LogIn className="w-8 h-8" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white tracking-tight mb-1.5">
              Tizimga kirish
            </h1>
            <p className="text-surface-600 dark:text-surface-400 text-sm max-w-md mx-auto">
              JoyBor talabalar turar joyi platformasi
            </p>
          </div>

          {/* Card Content */}
          <div className="bg-white dark:bg-surface-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-surface-200 dark:border-surface-800">
            {isLoading ? (
              <div className="py-10 text-center space-y-4">
                <div className="w-10 h-10 border-3 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-surface-800 dark:text-surface-200 font-medium text-sm">
                  Telegram orqali avtorizatsiya qilinmoqda...
                </p>
                <p className="text-xs text-surface-500 dark:text-surface-400">
                  Iltimos, kuting...
                </p>
              </div>
            ) : authError && isTelegram ? (
              /* Telegram WebApp ichida xatolik yuz bersa */
              <div className="space-y-6 text-center py-2">
                <div className="w-12 h-12 bg-danger-50 dark:bg-danger-900/20 text-danger-600 rounded-xl flex items-center justify-center mx-auto">
                  <RefreshCw className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-surface-900 dark:text-white">
                    Avtorizatsiyada xatolik
                  </h3>
                  <p className="text-xs text-danger-600 dark:text-danger-400">
                    {authError}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => reauthenticateWithTelegram()}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold bg-brand-600 text-white hover:bg-brand-700 transition-colors shadow-sm text-sm"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Qayta urinish
                  </button>
                  <button
                    onClick={handleOpenBot}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors text-sm"
                  >
                    <Send className="w-4 h-4" />
                    Botga o'tish
                  </button>
                </div>
              </div>
            ) : (
              /* Oddiy brauzer yoki botga yo'naltirish ekrani */
              <div className="space-y-5">
                <div className="bg-brand-50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-800/50 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs sm:text-sm font-bold text-surface-900 dark:text-white">
                        Parolsiz va xavfsiz kirish
                      </h4>
                      <p className="text-xs text-surface-600 dark:text-surface-400 leading-relaxed">
                        Talabalar uchun kirish faqat rasmiy <strong>@{JOYBOR_BOT_USERNAME}</strong> boti orqali amalga oshiriladi.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Steps */}
                <div className="space-y-2.5 pt-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400">
                    Kirish ketma-ketligi:
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-50 dark:bg-surface-800/60 border border-surface-200 dark:border-surface-700/60">
                      <div className="w-5 h-5 rounded-full bg-brand-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                        1
                      </div>
                      <p className="text-xs text-surface-700 dark:text-surface-300 font-medium">
                        <strong>@{JOYBOR_BOT_USERNAME}</strong> botini oching va <span className="font-mono text-brand-600 dark:text-brand-400">/start</span> bosing
                      </p>
                    </div>

                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-50 dark:bg-surface-800/60 border border-surface-200 dark:border-surface-700/60">
                      <div className="w-5 h-5 rounded-full bg-brand-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                        2
                      </div>
                      <p className="text-xs text-surface-700 dark:text-surface-300 font-medium">
                        Telefon raqamingizni tasdiqlang
                      </p>
                    </div>

                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-50 dark:bg-surface-800/60 border border-surface-200 dark:border-surface-700/60">
                      <div className="w-5 h-5 rounded-full bg-brand-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                        3
                      </div>
                      <p className="text-xs text-surface-700 dark:text-surface-300 font-medium">
                        <strong>"Mini App"</strong> tugmasi orqali to'g'ridan-to'g'ri tizimga kiring
                      </p>
                    </div>
                  </div>
                </div>

                {/* Primary Action Button (Solid, NO gradient) */}
                <button
                  type="button"
                  onClick={handleOpenBot}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-sm transition-colors duration-150 text-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Bot orqali kirish</span>
                </button>

                <div className="text-center pt-1">
                  <a
                    href={JOYBOR_BOT_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-surface-500 dark:text-surface-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                  >
                    @{JOYBOR_BOT_USERNAME} manzilini ochish &rarr;
                  </a>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Footer Info */}
      <div className="max-w-xl w-full mx-auto text-center py-2 text-xs text-surface-500 dark:text-surface-500">
        JoyBor &copy; {new Date().getFullYear()} — Talabalar yotoqxonasi axborot tizimi
      </div>
    </div>
  );
};

export default TelegramAuthPage;
