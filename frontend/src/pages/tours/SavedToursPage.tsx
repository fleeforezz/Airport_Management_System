import React, { useState } from 'react';
import PageShell from '../../components/layout/PageShell';
import TourCard from '../../components/tour/TourCard';
import { useTours } from '../../hooks/useTours';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';

export const SavedToursPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { getSavedTours, toggleSaveTour } = useTours();
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 16;

  if (authLoading) {
    return (
      <PageShell
        title={t('savedTours.pageTitle')}
        subtitle={t('footer.clearanceCheck')}
        badge="CLEARANCE_CHECK"
        breadcrumbs={[{ label: t('nav.home'), path: '/' }, { label: t('nav.savedTours') }]}
      >
        <div className="p-12 text-center font-mono text-xs text-[#4B5563]">
          {t('footer.clearanceCheck')}
        </div>
      </PageShell>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  const savedList = getSavedTours();

  return (
    <PageShell
      title={t('savedTours.pageTitle')}
      subtitle={t('savedTours.subtitle').replace('{user}', `${user.name} (${user.email})`)}
      badge="SAVED_ARCHIVE"
      breadcrumbs={[{ label: t('nav.home'), path: '/' }, { label: t('nav.savedTours') }]}
    >
      {savedList.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {savedList
              .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
              .map((tour, idx) => (
                <TourCard
                  key={tour.id}
                  tour={tour}
                  index={(currentPage - 1) * PAGE_SIZE + idx}
                  onToggleSave={toggleSaveTour}
                />
              ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={savedList.length}
            pageSize={PAGE_SIZE}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            itemLabel="SAVED TOURS"
          />
        </div>
      ) : (
        <EmptyState
          title={t('savedTours.emptyTitle')}
          description={t('savedTours.emptyDesc')}
          actionText={t('savedTours.exploreBtn')}
          onAction={() => navigate('/tours')}
          iconName="bookmark_border"
        />
      )}
    </PageShell>
  );
};

export default SavedToursPage;
