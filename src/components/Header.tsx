import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  User,
  Bell,
  Menu,
  X,
  MessageCircle,
  Heart,
  Settings,
  LogOut,
} from "lucide-react";
import { PageType } from "../App";
import { useAuth } from "../contexts/AuthContext";

interface HeaderProps {
  onNavigate: (page: PageType) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const menuItems = [
    { label: "Bosh Sahifa", page: "home" as PageType, icon: Home },
    { label: "Yotoqxonalar", page: "dormitories" as PageType, icon: Home },
    { label: "Ijara Xonadonlar", page: "rentals" as PageType, icon: Home },
    ...(isAuthenticated ? [{ label: "Ariza Yuborish", page: "application" as PageType, icon: User }] : []),
    { label: "Yordam", page: "help" as PageType, icon: MessageCircle },
    { label: "Biz Haqimizda", page: "about" as PageType, icon: User },
    { label: "Aloqa", page: "contact" as PageType, icon: MessageCircle },
  ];

  const profileMenuItems = [
    { label: "Profil", page: "profile" as PageType, icon: User },
    { label: "Dashboard", page: "dashboard" as PageType, icon: Home },
    { label: "Xabarlar", page: "messages" as PageType, icon: MessageCircle },
    { label: "Saqlangan", page: "saved" as PageType, icon: Heart },
    {
      label: "Bildirishnomalar",
      page: "notifications" as PageType,
      icon: Bell,
    },
    { label: "Sozlamalar", page: "settings" as PageType, icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    onNavigate("home");
    setIsProfileMenuOpen(false);
  };

  // Helper: get display name and avatar
  const displayName =
    user?.first_name && user?.last_name
      ? `${user.first_name} ${user.last_name}`.trim()
      : user?.first_name || user?.username || "Foydalanuvchi";
  const avatarUrl = user?.image;
  const avatarLetter = (user?.first_name ||
    user?.username ||
    "F")[0].toUpperCase();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2"
          >
            <img src="/logo.png" alt="JoyBor" className="w-10 h-10" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              JoyBor
            </span>
          </motion.button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => onNavigate("dormitories")}
              className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200"
            >
              Yotoqxonalar
            </button>
            <button
              onClick={() => onNavigate("rentals")}
              className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200"
            >
              Ijara Xonadonlar
            </button>
            {isAuthenticated && (
              <button
                onClick={() => onNavigate("application")}
                className="bg-gradient-to-r from-teal-600 to-green-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300"
              >
                Ariza Yuborish
              </button>
            )}
            <button
              onClick={() => onNavigate("help")}
              className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200"
            >
              Yordam
            </button>
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                {/* Notifications */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onNavigate("notifications")}
                  className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200"
                >
                  <Bell className="w-6 h-6" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </motion.button>

                {/* Messages */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onNavigate("messages")}
                  className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200"
                >
                  <MessageCircle className="w-6 h-6" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></span>
                </motion.button>

                {/* Profile Menu */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={displayName}
                        className="w-8 h-8 rounded-full object-cover border-2 border-teal-500"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-r from-teal-600 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {avatarLetter}
                      </div>
                    )}
                    <span className="hidden md:block text-gray-700 dark:text-gray-300 font-medium">
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
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2"
                      >
                        {profileMenuItems.map((item) => (
                          <button
                            key={item.page}
                            onClick={() => {
                              onNavigate(item.page);
                              setIsProfileMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                          >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                          </button>
                        ))}
                        <hr className="my-2 border-gray-200 dark:border-gray-700" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
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
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onNavigate("login")}
                  className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 font-medium transition-colors duration-200"
                >
                  Kirish
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onNavigate("register")}
                  className="bg-gradient-to-r from-teal-600 to-green-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300"
                >
                  Ro'yhatdan O'tish
                </motion.button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200"
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="px-4 py-4 space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => {
                    onNavigate(item.page);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}

              {!isAuthenticated && (
                <>
                  <hr className="my-3 border-gray-200 dark:border-gray-700" />
                  <button
                    onClick={() => {
                      onNavigate("login");
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  >
                    <User className="w-5 h-5" />
                    Kirish
                  </button>
                  <button
                    onClick={() => {
                      onNavigate("register");
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-teal-600 to-green-600 text-white px-3 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300"
                  >
                    Ro'yhatdan O'tish
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
