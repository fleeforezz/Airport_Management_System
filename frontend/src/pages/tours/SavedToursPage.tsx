import React from 'react';
import PageShell from '../../components/layout/PageShell';
import TourCard from '../../components/tour/TourCard';
import { useTours } from '../../hooks/useTours';
import EmptyState from '../../components/common/EmptyState';
import { useNavigate } from 'react-router-dom';

export const SavedToursPage: React.FC = () => {
  const navigate = useNavigate();
  const { getSavedTours, toggleSaveTour } = useTours();
  const savedList = getSavedTours();

  return (
    <PageShell
      title="SAVED FLIGHTS & AIR TOURS"
      subtitle="Flight corridors and charter packages flagged for scheduled booking"
      badge="SAVED_ARCHIVE"
      breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Saved Flights' }]}
    >
      {savedList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedList.map((tour, idx) => (
            <TourCard
              key={tour.id}
              tour={tour}
              index={idx}
              onToggleSave={toggleSaveTour}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="NO SAVED FLIGHTS FOUND"
          description="Browse our active flight schedules and click the bookmark icon to monitor preferred routes."
          actionText="BROWSE FEATURED FLIGHTS"
          onAction={() => navigate('/tours')}
          iconName="bookmark_border"
        />
      )}
    </PageShell>
  );
};

export default SavedToursPage;
