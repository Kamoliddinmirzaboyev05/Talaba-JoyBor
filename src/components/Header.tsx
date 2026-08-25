import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  User,
  Bell,
  Menu,
  X,
  MessageCircle,
  Heart,
  LogOut,
  Building2,
  HelpCircle,
  Users,
  Phone,
  FileText,
  Handshake,
  Send,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationContext";
import { useTheme } from "../contexts/ThemeContext";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    { label: "Bosh Sahifa", path: "/", icon: Home },
    { label: "Yotoqxonalar", path: "/dormitories", icon: Building2 },
    { label: "Yordam", path: "/help", icon: HelpCircle },
    { label: "Biz Haqimizda", path: "/about", icon: Users },
    { label: "Aloqa", path: "/contact", icon: Phone },
    { label: "Hamkorlik", path: "/hamkorlik", icon: Handshake },
  ];

  const profileMenuItems = [
    { label: "Profil", path: "/profile", icon: User },
    { label: "Dashboard", path: "/dashboard", icon: Home },
    { label: "Arizalar", path: "/applications", icon: FileText },
    { label: "Shikoyat va takliflar", path: "/messages", icon: MessageCircle },
    { label: "Saqlangan", path: "/saved", icon: Heart },
    { label: "Bildirishnomalar", path: "/notifications", icon: Bell },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsProfileMenuOpen(false);
  };

  // Click outside to close menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsProfileMenuOpen(false);
        setIsMenuOpen(false);
      }
    };

    if (isProfileMenuOpen || isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isProfileMenuOpen, isMenuOpen]);

  // Helper: get display name and avatar
  const displayName =
    user?.first_name && user?.last_name
      ? `${user?.first_name} ${user?.last_name}`.trim()
      : user?.first_name || user?.username || "Foydalanuvchi";
  const avatarUrl = user?.image;
  const avatarLetter = (user?.first_name ||
    user?.username ||
    "F")[0].toUpperCase();

  return (
    <header className="bg-white dark:bg-surface-900 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <img loading="lazy" src="/logo.svg" alt="JoyBor" className="w-10 h-10" />
            <span className="text-xl font-bold text-surface-900 dark:text-white">
              JoyBor
            </span>
          </motion.button>

          {/* Desktop Navigation — public sahifalar (Bosh sahifa = logo) */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-7">
            {menuItems
              .filter((item) => item.path !== "/")
              .map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`${
                    isActive(item.path)
                      ? "text-brand-600 dark:text-brand-400 font-semibold after:w-full"
                      : "text-surface-700 dark:text-surface-300 after:w-0"
                  } relative pb-1 text-sm lg:text-base whitespace-nowrap after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[3px] after:bg-brand-500 after:rounded-full after:transition-all after:duration-300 hover:text-brand-600 dark:hover:text-brand-400 hover:after:w-full`}
                >
                  {item.label}
                </button>
              ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              aria-label="Mavzuni almashtirish"
              className="p-2 rounded-xl text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 hover:text-brand-600 dark:hover:text-brand-400 transition-colors duration-150"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </motion.button>

            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                {/* Notifications */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigate("/notifications")}
                  className="relative p-2 text-surface-600 dark:text-surface-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors duration-150"
                >
                  <Bell className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-gradient-to-r from-danger-500 to-danger-600 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-sm animate-pulse"
                    >
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </motion.span>
                  )}
                </motion.button>



                {/* Profile Menu */}
                <div className="relative" ref={profileMenuRef}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors duration-150"
                  >
                    {avatarUrl ? (
                      <img loading="lazy"
                        src={avatarUrl}
                        alt={displayName}
                        className="w-8 h-8 rounded-full object-cover border-2 border-brand-500"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-r from-brand-600 to-brand-700 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {avatarLetter}
                      </div>
                    )}
                    <span className="hidden md:block text-surface-700 dark:text-surface-300 font-medium">
                      {displayName}
                    </span>
                  </motion.button>

                  <AnimatePresence>
                    {isProfileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-900 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-800 py-2"
                      >
                        {profileMenuItems.map((item) => (
                          <button
                            key={item.path}
                            onClick={() => {
                              navigate(item.path);
                              setIsProfileMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors duration-150"
                          >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                          </button>
                        ))}
                        <hr className="my-2 border-surface-200 dark:border-surface-800" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-colors duration-150"
                        >
                          <LogOut className="w-4 h-4" />
                          Chiqish
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <button
                  onClick={() => navigate("/login")}
                  className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2 rounded-xl font-semibold shadow-sm transition-colors duration-150 text-sm"
                >
                  Kirish
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-surface-600 dark:text-surface-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors duration-150"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Menu — o'ng tarafdan chiqadi */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              key="mobile-menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsMenuOpen(false)}
              className="md:hidden fixed inset-0 bg-surface-900/50 backdrop-blur-sm z-[60]"
            />
            <motion.div
              key="mobile-menu-drawer"
              ref={mobileMenuRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
              className="md:hidden fixed inset-y-0 right-0 z-[70] w-[80%] max-w-xs bg-white dark:bg-surface-900 shadow-sm flex flex-col"
            >
              <div className="flex items-center justify-between h-16 px-5 border-b border-surface-200 dark:border-surface-800 shrink-0">
                <span className="text-base font-bold text-surface-900 dark:text-white">Menyu</span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Menyuni yopish"
                  className="p-2 rounded-xl text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-brand-600 dark:hover:text-brand-400 transition-colors duration-150"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm transition-colors duration-150 ${
                      isActive(item.path)
                        ? "bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 font-semibold"
                        : "text-surface-700 dark:text-surface-300 font-medium hover:bg-surface-100 dark:hover:bg-surface-800"
                    }`}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    {item.label}
                  </button>
                ))}
              </nav>

              {!isAuthenticated && (
                <div className="p-4 border-t border-surface-200 dark:border-surface-800 shrink-0">
                  <button
                    onClick={() => {
                      navigate("/login");
                      setIsMenuOpen(false);
                    }}
                    className="w-full inline-flex items-center justify-center bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-xl font-semibold shadow-sm transition-colors duration-150 text-sm"
                  >
                    Kirish
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;