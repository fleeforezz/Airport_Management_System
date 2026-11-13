import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageShell from '../../components/layout/PageShell';
import TourCard from '../../components/tour/TourCard';
import { useTours } from '../../hooks/useTours';
import { destinationApi } from '../../services/api';
import { Destination } from '../../types';
import EmptyState from '../../components/common/EmptyState';
import { useLanguage } from '../../context/LanguageContext';
import Pagination from '../../components/common/Pagination';

export const TourListPage: React.FC = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 16;

  const {
    tours,
    searchTerm,
    setSearchTerm,
    selectedDestination,
    setSelectedDestination,
    selectedDuration,
    setSelectedDuration,
    selectedAirline,
    setSelectedAirline,
    toggleSaveTour,
  } = useTours();

  const [destinations, setDestinations] = useState<Destination[]>([]);

  // Reset page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDestination, selectedDuration, selectedAirline]);

  // Fetch active destinations from backend
  useEffect(() => {
    let isMounted = true;
    destinationApi.getAll().then((res) => {
      if (isMounted && res.success && res.data) {
        setDestinations(res.data);
      }
    }).catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  // Sync parameters from Home search form
  useEffect(() => {
    const q = searchParams.get('search') || searchParams.get('q');
    const dest = searchParams.get('destination') || searchParams.get('dest');
    const duration = searchParams.get('duration');
    const airline = searchParams.get('airline');

    if (q !== null) setSearchTerm(q);
    if (dest !== null) setSelectedDestination(dest);
    if (duration !== null) setSelectedDuration(duration);
    if (airline !== null) setSelectedAirline(airline);
  }, [searchParams, setSearchTerm, setSelectedDestination, setSelectedDuration, setSelectedAirline]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedDestination('ALL');
    setSelectedDuration('ALL');
    setSelectedAirline('ALL');
  };

  return (
    <PageShell
      title={t('tours.catalogTitle')}
      subtitle={t('tours.catalogSubtitle')}
      badge="TOUR_CATALOG"
      breadcrumbs={[{ label: t('nav.home'), path: '/' }, { label: t('nav.tours') }]}
    >
      {/* Search & Filter Toolbar */}
      <div className="bg-white border-2 border-black p-4 md:p-6 mb-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2.5">
          <div className="font-mono text-xs font-bold text-black uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 bg-[#DC2626]" />
            <span>{t('tours.filterTitle')}</span>
          </div>
          <span className="font-mono text-[10px] text-[#4B5563]">
            {t('tours.showing')} {tours.length} {t('tours.matching')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Keyword Search (Span 4 cols) */}
          <div className="lg:col-span-4">
            <label className="block font-mono text-[9px] font-bold text-[#4B5563] uppercase tracking-wider mb-1">
              {t('tours.keywordLabel')}
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('tours.keywordPlaceholder')}
                className="w-full h-10 pl-3 pr-8 bg-[#F5F5F5] border border-[#E5E7EB] focus:border-black font-mono text-xs text-black placeholder-[#9CA3AF]"
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

          {/* Destination Selector (Span 3 cols) */}
          <div className="lg:col-span-3">
            <label className="block font-mono text-[9px] font-bold text-[#4B5563] uppercase tracking-wider mb-1">
              {t('tours.destLabel')}
            </label>
            <select
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              className="w-full h-10 px-3 bg-[#F5F5F5] border border-[#E5E7EB] focus:border-black font-mono text-xs text-black"
            >
              <option value="ALL">{t('home.allDest')}</option>
              {destinations.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name} ({d.code || d.airportCode})
                </option>
              ))}
            </select>
          </div>

          {/* Duration Selector (Span 2 cols) */}
          <div className="lg:col-span-2">
            <label className="block font-mono text-[9px] font-bold text-[#4B5563] uppercase tracking-wider mb-1">
              {t('tours.durationLabel')}
            </label>
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="w-full h-10 px-3 bg-[#F5F5F5] border border-[#E5E7EB] focus:border-black font-mono text-xs text-black"
            >
              <option value="ALL">{t('home.allDurations')}</option>
              <option value="3">{t('home.dur3')}</option>
              <option value="4">{t('home.dur4')}</option>
              <option value="5">{t('home.dur5')}</option>
              <option value="7">{t('home.dur7')}</option>
            </select>
          </div>

          {/* Airline Selector (Span 3 cols) */}
          <div className="lg:col-span-3">
            <label className="block font-mono text-[9px] font-bold text-[#4B5563] uppercase tracking-wider mb-1">
              {t('tours.airlineLabel')}
            </label>
            <select
              value={selectedAirline}
              onChange={(e) => setSelectedAirline(e.target.value)}
              className="w-full h-10 px-3 bg-[#F5F5F5] border border-[#E5E7EB] focus:border-black font-mono text-xs text-black"
            >
              <option value="ALL">{t('home.allAirlines')}</option>
              <option value="VN">Vietnam Airlines (VN)</option>
              <option value="VJ">Vietjet Air (VJ)</option>
              <option value="QH">Bamboo Airways (QH)</option>
              <option value="SQ">Singapore Airlines (SQ)</option>
              <option value="AF">Air France (AF)</option>
            </select>
          </div>
        </div>

        {/* Active Filter Indicators & Reset Button */}
        {(searchTerm || selectedDestination !== 'ALL' || selectedDuration !== 'ALL' || selectedAirline !== 'ALL') && (
          <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-between font-mono text-[10px]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[#4B5563] font-bold">{t('tours.filteringBy')}</span>
              {searchTerm && <span className="bg-black text-white px-2 py-0.5">"{searchTerm}"</span>}
              {selectedDestination !== 'ALL' && <span className="bg-black text-white px-2 py-0.5">{selectedDestination}</span>}
              {selectedDuration !== 'ALL' && <span className="bg-black text-white px-2 py-0.5">{selectedDuration}D</span>}
              {selectedAirline !== 'ALL' && <span className="bg-black text-white px-2 py-0.5">{selectedAirline}</span>}
            </div>
            <button
              onClick={handleResetFilters}
              className="text-[#DC2626] hover:underline font-bold uppercase transition-none"
            >
              {t('tours.resetFilters')}
            </button>
          </div>
        )}
      </div>

      {/* Tour Grid with 16 items per page Pagination */}
      {tours.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tours
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
            totalItems={tours.length}
            pageSize={PAGE_SIZE}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            itemLabel="TOURS"
          />
        </div>
      ) : (
        <EmptyState
          title={t('tours.noToursFound')}
          description={t('tours.noToursDesc')}
          actionText={t('tours.resetBtn')}
          onAction={handleResetFilters}
        />
      )}
    </PageShell>
  );
};

export default TourListPage;
