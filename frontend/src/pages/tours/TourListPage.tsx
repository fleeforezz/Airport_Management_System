import React from 'react';
import PageShell from '../../components/layout/PageShell';
import TourCard from '../../components/tour/TourCard';
import { useTours } from '../../hooks/useTours';
import EmptyState from '../../components/common/EmptyState';

export const TourListPage: React.FC = () => {
  const {
    tours,
    searchTerm,
    setSearchTerm,
    selectedDestination,
    setSelectedDestination,
    toggleSaveTour,
  } = useTours();

  return (
    <PageShell
      title="FLIGHT MATRIX & AIR TOUR SCHEDULES"
      subtitle="Lookup by flight code, destination airport, or partnering carrier"
      badge="TOUR_CATALOG"
      breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Flights & Tours' }]}
    >
      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-[#E5E7EB] p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Keyword Search */}
          <div className="md:col-span-2">
            <label className="block font-mono text-[9px] font-bold text-[#4B5563] uppercase tracking-wider mb-1">
              SEARCH FLIGHT / TOUR CODE / GATEWAY
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter tour name, flight code (e.g., VN-DAD, Phu Quoc, Tokyo)..."
                className="w-full h-10 pl-3 pr-10 bg-[#F5F5F5] border border-[#E5E7EB] focus:border-black font-mono text-xs text-black placeholder-[#9CA3AF]"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 font-mono text-xs text-[#4B5563] hover:text-black"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Destination Selector */}
          <div>
            <label className="block font-mono text-[9px] font-bold text-[#4B5563] uppercase tracking-wider mb-1">
              FILTER BY DESTINATION
            </label>
            <select
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              className="w-full h-10 px-3 bg-[#F5F5F5] border border-[#E5E7EB] focus:border-black font-mono text-xs text-black"
            >
              <option value="ALL">All Destinations</option>
              <option value="DEST-01">Da Nang — Hoi An (DAD)</option>
              <option value="DEST-02">Phu Quoc Island (PQC)</option>
              <option value="DEST-03">Tokyo & Mount Fuji (NRT)</option>
              <option value="DEST-04">New York JFK (JFK)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tour Grid or Empty State */}
      {tours.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour, idx) => (
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
          title="NO MATCHING FLIGHT SCHEDULES FOUND"
          description="Try broadening your search query or reset the destination filter to view all available flight schedules."
          actionText="RESET ALL FILTERS"
          onAction={() => {
            setSearchTerm('');
            setSelectedDestination('ALL');
          }}
        />
      )}
    </PageShell>
  );
};

export default TourListPage;
