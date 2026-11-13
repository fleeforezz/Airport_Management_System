import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookingDraftProvider } from './context/BookingDraftContext';
import SwissSuspenseLoader from './components/common/SwissSuspenseLoader';
import ScrollToTop from './components/common/ScrollToTop';

// Client Pages (Dynamic Code Splitting for Ultra-Fast Initial Load)
const HomePage = lazy(() => import('./pages/HomePage'));
const ExplorePage = lazy(() => import('./pages/ExplorePage'));
const TourListPage = lazy(() => import('./pages/tours/TourListPage'));
const TourDetailPage = lazy(() => import('./pages/tours/TourDetailPage'));
const SavedToursPage = lazy(() => import('./pages/tours/SavedToursPage'));
const DestinationDetailPage = lazy(() => import('./pages/destinations/DestinationDetailPage'));
const ArticleDetailPage = lazy(() => import('./pages/articles/ArticleDetailPage'));
const DepartureSelectPage = lazy(() => import('./pages/booking/DepartureSelectPage'));
const BookingCheckoutPage = lazy(() => import('./pages/booking/BookingCheckoutPage'));
const BookingSuccessPage = lazy(() => import('./pages/booking/BookingSuccessPage'));
const BookingDetailPage = lazy(() => import('./pages/booking/BookingDetailPage'));
const BookingListPage = lazy(() => import('./pages/booking/BookingListPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const PermissionExplainPage = lazy(() => import('./pages/auth/PermissionExplainPage'));
const ProfilePage = lazy(() => import('./pages/account/ProfilePage'));

const RoleRedirectGuard: React.FC<{ targetRole: 'ADMIN' | 'TOUR_OPERATOR' }> = ({ targetRole }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center font-mono text-xs">
        VERIFYING RBAC CLEARANCE...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={`/auth/login?from=${targetRole === 'ADMIN' ? '/admin' : '/operations'}`} replace />;
  }

  // Redirect to standalone portal where AccessGuard enforces strict permissions
  window.location.href = `/admin.html?mode=${targetRole === 'ADMIN' ? 'admin' : 'operator'}`;
  return null;
};

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center font-mono text-xs">
        VERIFYING ACCESS CLEARANCE...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: { pathname: window.location.pathname } }} replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BookingDraftProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={<SwissSuspenseLoader />}>
              <Routes>
                {/* Core Home & Explore */}
                <Route path="/" element={<HomePage />} />
                <Route path="/explore" element={<ExplorePage />} />

                {/* Tours */}
                <Route path="/tours" element={<TourListPage />} />
                <Route
                  path="/tours/saved"
                  element={
                    <AuthGuard>
                      <SavedToursPage />
                    </AuthGuard>
                  }
                />
                <Route path="/tours/:id" element={<TourDetailPage />} />

                {/* Destinations */}
                <Route path="/destinations/:id" element={<DestinationDetailPage />} />

                {/* Articles */}
                <Route path="/articles" element={<HomePage />} />
                <Route path="/articles/:id" element={<ArticleDetailPage />} />

                {/* Booking Flow (Traveler Only Operations) */}
                <Route path="/booking/departure" element={<DepartureSelectPage />} />
                <Route path="/booking/checkout" element={<BookingCheckoutPage />} />
                <Route path="/booking/success" element={<BookingSuccessPage />} />
                <Route
                  path="/booking/my"
                  element={
                    <AuthGuard>
                      <BookingListPage />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/booking/:id"
                  element={
                    <AuthGuard>
                      <BookingDetailPage />
                    </AuthGuard>
                  }
                />

                {/* Security Clearance Portals */}
                <Route path="/admin" element={<RoleRedirectGuard targetRole="ADMIN" />} />
                <Route path="/operations" element={<RoleRedirectGuard targetRole="TOUR_OPERATOR" />} />
                <Route path="/operator" element={<RoleRedirectGuard targetRole="TOUR_OPERATOR" />} />

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
            </Suspense>
          </BrowserRouter>
      </BookingDraftProvider>
    </AuthProvider>
  </LanguageProvider>
  );
};

export default App;
