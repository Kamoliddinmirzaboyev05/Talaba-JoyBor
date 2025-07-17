import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
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
import { User, Listing } from './types';

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

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [user, setUser] = useState<User | null>(null);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [darkMode, setDarkMode] = useState(false);

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

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
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
        return <LoginPage onNavigate={setCurrentPage} onLogin={handleLogin} />;
      case 'register':
        return <RegisterPage onNavigate={setCurrentPage} onLogin={handleLogin} />;
      case 'dormitories':
        return <DormitoriesPage onNavigate={setCurrentPage} user={user} onListingSelect={handleListingSelect} />;
      case 'rentals':
        return <RentalsPage onNavigate={setCurrentPage} user={user} onListingSelect={handleListingSelect} />;
      case 'listing-detail':
        return <ListingDetailPage listing={selectedListing} onNavigate={setCurrentPage} user={user} />;
      case 'application':
        return <ApplicationPage listing={selectedListing} onNavigate={setCurrentPage} user={user} />;
      case 'profile':
        return <ProfilePage user={user} onNavigate={setCurrentPage} onUserUpdate={setUser} />;
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

export default App;