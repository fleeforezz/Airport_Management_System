import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '../components/layout/PageShell';
import { destinationApi } from '../services/api';
import { Destination } from '../types';
import Pagination from '../components/common/Pagination';
import LazyImage from '../components/common/LazyImage';

export const ExplorePage: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [filterRegion, setFilterRegion] = useState<'ALL' | 'VN' | 'INTL'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 16;

  useEffect(() => {
    setCurrentPage(1);
  }, [filterRegion]);

  useEffect(() => {
    let isMounted = true;
    destinationApi.getAll().then((res) => {
      if (isMounted && res.success && res.data && res.data.length > 0) {
        setDestinations(res.data);
      }
    }).catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = destinations.filter((d) => {
    if (filterRegion === 'VN') return d.country === 'Vietnam';
    if (filterRegion === 'INTL') return d.country !== 'Vietnam';
    return true;
  });

  return (
    <PageShell
      title="AIRPORT & GATEWAY NETWORK"
      subtitle="Lookup international airport facilities, runway telemetry, weather and direct route corridors"
      badge="NETWORK_MATRIX"
      breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Explore Network' }]}
    >
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-[#E5E7EB] pb-3">
        <button
          onClick={() => setFilterRegion('ALL')}
          className={`px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-none border ${
            filterRegion === 'ALL'
              ? 'bg-black text-white border-black'
              : 'bg-white text-[#4B5563] border-[#E5E7EB] hover:border-black'
          }`}
        >
          ALL AIRPORTS ({destinations.length})
        </button>
        <button
          onClick={() => setFilterRegion('VN')}
          className={`px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-none border ${
            filterRegion === 'VN'
              ? 'bg-black text-white border-black'
              : 'bg-white text-[#4B5563] border-[#E5E7EB] hover:border-black'
          }`}
        >
          VIETNAM DOMESTIC (SGN, HAN, DAD, PQC)
        </button>
        <button
          onClick={() => setFilterRegion('INTL')}
          className={`px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-none border ${
            filterRegion === 'INTL'
              ? 'bg-black text-white border-black'
              : 'bg-white text-[#4B5563] border-[#E5E7EB] hover:border-black'
          }`}
        >
          INTERNATIONAL HUBS (NRT, JFK)
        </button>
      </div>

      {/* Grid of Destinations with 16 per page Pagination */}
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered
            .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
            .map((dest) => (
              <div
                key={dest.id}
                className="bg-white border border-[#E5E7EB] hover:border-black transition-none flex flex-col justify-between"
              >
                <div>
                  <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#DC2626]" />
                        <h2 className="font-black text-base uppercase text-black">
                          {dest.name}
                        </h2>
                      </div>
                      <div className="font-mono text-[10px] text-[#4B5563] mt-0.5">
                        {dest.city}, {dest.country}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="px-2 py-0.5 bg-black text-white font-mono text-xs font-black">
                        IATA: {dest.airportCode}
                      </div>
                      <div className="font-mono text-[9px] text-[#4B5563] mt-0.5">
                        {dest.airportName}
                      </div>
                    </div>
                  </div>

                  {/* Media image */}
                  <div className="h-56 bg-[#EEEEEE] overflow-hidden relative">
                    <LazyImage
                      src={dest.imageUrl}
                      alt={dest.name}
                      className="w-full h-full object-cover"
                      containerClassName="w-full h-full"
                    />
                    {dest.climate && (
                      <div className="absolute bottom-2 left-2 z-10 bg-black/90 text-white px-2 py-1 font-mono text-[10px] flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[13px]">thermostat</span>
                        <span>{dest.climate}</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="p-4 space-y-3">
                    <p className="text-xs text-[#4B5563] leading-relaxed">
                      {dest.description}
                    </p>

                    {dest.bestTimeToVisit && (
                      <div className="font-mono text-[10px] text-[#4B5563] bg-[#F5F5F5] p-2 border border-[#E5E7EB]">
                        <span className="font-bold text-black">RECOMMENDED SEASON: </span>
                        {dest.bestTimeToVisit}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 border-t border-[#E5E7EB] flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-black">
                    {dest.popularToursCount} FLIGHT SCHEDULES OPEN
                  </span>
                  <Link
                    to={`/destinations/${dest.id}`}
                    className="px-3.5 py-1.5 bg-black text-white hover:bg-[#DC2626] font-mono text-[10px] font-bold uppercase tracking-wider transition-none flex items-center gap-1.5"
                  >
                    <span>VIEW AIRPORT SPECS & FLIGHTS</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={(page) => {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          itemLabel="GATEWAYS"
        />
      </div>
    </PageShell>
  );
};

export default ExplorePage;
