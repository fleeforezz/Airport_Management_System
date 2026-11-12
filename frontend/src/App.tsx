import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookingDraftProvider } from './context/BookingDraftContext';

// Client Pages
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import TourListPage from './pages/tours/TourListPage';
import TourDetailPage from './pages/tours/TourDetailPage';
import SavedToursPage from './pages/tours/SavedToursPage';
import DestinationDetailPage from './pages/destinations/DestinationDetailPage';
import ArticleDetailPage from './pages/articles/ArticleDetailPage';
import DepartureSelectPage from './pages/booking/DepartureSelectPage';
import BookingCheckoutPage from './pages/booking/BookingCheckoutPage';
import BookingSuccessPage from './pages/booking/BookingSuccessPage';
import BookingDetailPage from './pages/booking/BookingDetailPage';
import BookingListPage from './pages/booking/BookingListPage';
import LoginPage from './pages/auth/LoginPage';
import PermissionExplainPage from './pages/auth/PermissionExplainPage';
import ProfilePage from './pages/account/ProfilePage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BookingDraftProvider>
        <BrowserRouter>
          <Routes>
            {/* Core Home & Explore */}
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />

            {/* Tours */}
            <Route path="/tours" element={<TourListPage />} />
            <Route path="/tours/saved" element={<SavedToursPage />} />
            <Route path="/tours/:id" element={<TourDetailPage />} />

            {/* Destinations */}
            <Route path="/destinations/:id" element={<DestinationDetailPage />} />

            {/* Articles */}
            <Route path="/articles" element={<HomePage />} />
            <Route path="/articles/:id" element={<ArticleDetailPage />} />

            {/* Booking Flow */}
            <Route path="/booking/departure" element={<DepartureSelectPage />} />
            <Route path="/booking/checkout" element={<BookingCheckoutPage />} />
            <Route path="/booking/success" element={<BookingSuccessPage />} />
            <Route path="/booking/my" element={<BookingListPage />} />
            <Route path="/booking/:id" element={<BookingDetailPage />} />

            {/* Auth */}
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<LoginPage />} />
            <Route path="/auth/zalo" element={<LoginPage />} />
            <Route path="/auth/permissions" element={<PermissionExplainPage />} />

            {/* Account */}
            <Route path="/account/profile" element={<ProfilePage />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </BookingDraftProvider>
    </AuthProvider>
  );
};

export default App;
