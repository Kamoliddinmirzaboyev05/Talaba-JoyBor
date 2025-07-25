import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
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
  const { theme } = useTheme();
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  // Redirect logic on load - only redirect to dashboard if on login/register page
  useEffect(() => {
    if (!isLoading && isAuthenticated && (currentPage === 'login' || currentPage === 'register')) {
      setCurrentPage('dashboard');
    }
  }, [isLoading, isAuthenticated, currentPage]);

  useEffect(() => {
    // Theme ni document class ga qo'shish
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Called after successful login/register
  const handleAuthSuccess = async (access: string, refresh: string) => {
    await login(access, refresh);
    setCurrentPage('dashboard');
  };



  const handleListingSelect = (listing: Listing) => {
    setSelectedListing(listing);
    setCurrentPage('listing-detail');
  };

  const handleApplicationStart = (listing: Listing) => {
    if (!isAuthenticated) {
      setCurrentPage('login');
      return;
    }
    setSelectedListing(listing);
    setCurrentPage('application');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} user={user} onListingSelect={handleListingSelect} onApplicationStart={handleApplicationStart} />;
      case 'login':
        return <LoginPage onNavigate={setCurrentPage} onAuthSuccess={handleAuthSuccess} />;
      case 'register':
        return <RegisterPage onNavigate={setCurrentPage} onAuthSuccess={handleAuthSuccess} />;
      case 'dormitories':
        return <DormitoriesPage onNavigate={setCurrentPage} user={user} onListingSelect={handleListingSelect} onApplicationStart={handleApplicationStart} />;
      case 'rentals':
        return <RentalsPage onNavigate={setCurrentPage} user={user} onListingSelect={handleListingSelect} onApplicationStart={handleApplicationStart} />;
      case 'listing-detail':
        return <ListingDetailPage listing={selectedListing} onNavigate={setCurrentPage} user={user} onApplicationStart={handleApplicationStart} />;
      case 'application':
        return <ApplicationPage onNavigate={setCurrentPage} selectedListing={selectedListing} />;
      case 'profile':
        return <ProfilePage user={user} onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <DashboardPage user={user} onNavigate={setCurrentPage} />;
      case 'messages':
        return <MessagesPage user={user} onNavigate={setCurrentPage} />;
      case 'saved':
        return <SavedListingsPage user={user} onNavigate={setCurrentPage} onListingSelect={handleListingSelect} />;
      case 'notifications':
        return <NotificationsPage user={user} onNavigate={setCurrentPage} />;
      case 'settings':
        return <SettingsPage user={user} onNavigate={setCurrentPage} />;
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
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <AnimatePresence mode="wait">
        {renderPage()}
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;