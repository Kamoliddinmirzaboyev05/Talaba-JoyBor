import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DormitoriesPage from './pages/DormitoriesPage';
import RentalsPage from './pages/RentalsPage';
import ListingDetailPage from './pages/ListingDetailPage';
import ApplicationPage from './pages/ApplicationPage';
import ApplicationsPage from './pages/ApplicationsPage';
import ApplicationDetailPage from './pages/ApplicationDetailPage';
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

// Global state for selected listing
let globalSelectedListing: Listing | null = null;

export const setGlobalSelectedListing = (listing: Listing | null) => {
  globalSelectedListing = listing;
};

export const getGlobalSelectedListing = () => globalSelectedListing;

// Protected Route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

// Auth redirect component
function AuthRedirect({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function AppContent() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    // Theme ni document class ga qo'shish
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Helper functions for navigation
  const handleListingSelect = (listing: Listing) => {
    setGlobalSelectedListing(listing);
    navigate(`/listing/${listing.id}`);
  };

  const handleApplicationStart = (listing: Listing) => {
    setGlobalSelectedListing(listing);
    navigate('/application');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage onListingSelect={handleListingSelect} onApplicationStart={handleApplicationStart} />} />
        <Route path="/dormitories" element={<DormitoriesPage onListingSelect={handleListingSelect} onApplicationStart={handleApplicationStart} />} />
        <Route path="/rentals" element={<RentalsPage onListingSelect={handleListingSelect} onApplicationStart={handleApplicationStart} />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        
        {/* Auth Routes - redirect to dashboard if already logged in */}
        <Route path="/login" element={<AuthRedirect><LoginPage /></AuthRedirect>} />
        <Route path="/register" element={<AuthRedirect><RegisterPage /></AuthRedirect>} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
        <Route path="/saved" element={<ProtectedRoute><SavedListingsPage onListingSelect={handleListingSelect} /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/application" element={<ProtectedRoute><ApplicationPage /></ProtectedRoute>} />
        <Route path="/applications" element={<ProtectedRoute><ApplicationsPage /></ProtectedRoute>} />
        <Route path="/application/:id" element={<ProtectedRoute><ApplicationDetailPage /></ProtectedRoute>} />
        
        {/* Listing detail can be accessed by anyone */}
        <Route path="/listing/:id" element={<ListingDetailPage />} />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;