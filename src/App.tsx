import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DormitoriesPage from './pages/DormitoriesPage';
import RentalsPage from './pages/RentalsPage';
import ListingDetailPage from './pages/ListingDetailPage';
import ApplicationPage from './pages/ApplicationPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import MessagesPage from './pages/MessagesPage';
import SavedListingsPage from './pages/SavedListingsPage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import { Listing } from './types';

export type PageType = 
  | 'home' 
  | 'login' 
  | 'register' 
  | 'dormitories' 
  | 'rentals' 
  | 'listing-detail' 
  | 'application' 
  | 'profile' 
  | 'dashboard' 
  | 'messages' 
  | 'saved' 
  | 'notifications' 
  | 'settings' 
  | 'help' 
  | 'about' 
  | 'contact';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const { user, isLoading, isAuthenticated, login, logout } = useAuth();
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  // Redirect logic on load
  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        setCurrentPage('dashboard');
      } else {
        setCurrentPage('login');
      }
    }
    // eslint-disable-next-line
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    // Check for system dark mode preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
  }, []);

  useEffect(() => {
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Called after successful login/register
  const handleAuthSuccess = (access: string, refresh: string) => {
    login(access, refresh);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    logout();
    setCurrentPage('home');
  };

  const handleListingSelect = (listing: Listing) => {
    setSelectedListing(listing);
    setCurrentPage('listing-detail');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} user={user} onListingSelect={handleListingSelect} />;
      case 'login':
        return <LoginPage onNavigate={setCurrentPage} onAuthSuccess={handleAuthSuccess} />;
      case 'register':
        return <RegisterPage onNavigate={setCurrentPage} onAuthSuccess={handleAuthSuccess} />;
      case 'dormitories':
        return <DormitoriesPage onNavigate={setCurrentPage} user={user} onListingSelect={handleListingSelect} />;
      case 'rentals':
        return <RentalsPage onNavigate={setCurrentPage} user={user} onListingSelect={handleListingSelect} />;
      case 'listing-detail':
        return <ListingDetailPage listing={selectedListing} onNavigate={setCurrentPage} user={user} />;
      case 'application':
        return <ApplicationPage listing={selectedListing} onNavigate={setCurrentPage} user={user} />;
      case 'profile':
        return <ProfilePage user={user} onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <DashboardPage user={user} onNavigate={setCurrentPage} onLogout={handleLogout} />;
      case 'messages':
        return <MessagesPage user={user} onNavigate={setCurrentPage} />;
      case 'saved':
        return <SavedListingsPage user={user} onNavigate={setCurrentPage} onListingSelect={handleListingSelect} />;
      case 'notifications':
        return <NotificationsPage user={user} onNavigate={setCurrentPage} />;
      case 'settings':
        return <SettingsPage user={user} onNavigate={setCurrentPage} darkMode={darkMode} onDarkModeToggle={setDarkMode} />;
      case 'help':
        return <HelpPage onNavigate={setCurrentPage} />;
      case 'about':
        return <AboutPage onNavigate={setCurrentPage} />;
      case 'contact':
        return <ContactPage onNavigate={setCurrentPage} />;
      default:
        return <HomePage onNavigate={setCurrentPage} user={user} onListingSelect={handleListingSelect} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <AnimatePresence mode="wait">
          {renderPage()}
        </AnimatePresence>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;