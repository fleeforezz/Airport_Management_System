import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageShell from '../../components/layout/PageShell';
import TourCard from '../../components/tour/TourCard';
import { MOCK_DESTINATIONS, MOCK_TOURS } from '../../utils/mockData';
import { useTours } from '../../hooks/useTours';
import { destinationApi, tourApi } from '../../services/api';
import { Destination, Tour } from '../../types';

export const DestinationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toggleSaveTour } = useTours();

  const fallbackDest =
    MOCK_DESTINATIONS.find((d) => d.id === id || d.code === id) ||
    MOCK_DESTINATIONS[0];
  const [dest, setDest] = useState<Destination>(fallbackDest);
  const [relatedTours, setRelatedTours] = useState<Tour[]>(
    MOCK_TOURS.filter((t) => t.destinationId === fallbackDest.id)
  );

  useEffect(() => {
    let isMounted = true;
    destinationApi.getAll().then((res) => {
      if (isMounted && res.success && res.data) {
        const found = res.data.find(
          (d) => d.id === id || d.code === id || String(d.id) === String(id) || d.airportCode === id
        );
        if (found) {
          setDest(found);
          tourApi.getAll({ destinationId: found.id }).then((tRes) => {
            if (isMounted && tRes.success && tRes.data && tRes.data.length > 0) {
              setRelatedTours(tRes.data);
            }
          }).catch(() => {});
        }
      }
    }).catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <PageShell
      title={`GATEWAY: ${dest.name}`}
      subtitle={`FACILITY: ${dest.airportName} [ ${dest.airportCode} ]`}
      badge={`IATA: ${dest.airportCode}`}
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Explore', path: '/explore' },
        { label: dest.name },
      ]}
    >
      {/* Destination Hero Banner */}
      <div className="bg-white border border-[#E5E7EB] mb-8 overflow-hidden">
        <div className="relative h-72 sm:h-96 w-full bg-black">
          <img
            src={dest.imageUrl}
            alt={dest.name}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute bottom-6 left-6 right-6 bg-black/85 text-white p-5 border border-[#1F2937]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="font-mono text-[10px] text-[#DC2626] font-bold uppercase tracking-wider">
                  COUNTRY: {dest.country} // CITY: {dest.city}
                </div>
                <h1 className="text-xl sm:text-3xl font-black uppercase tracking-tight mt-1">
                  {dest.name}
                </h1>
              </div>
              <div className="font-mono text-xs text-right">
                <div className="px-2.5 py-1 bg-[#DC2626] text-white font-bold inline-block">
                  AIRPORT: {dest.airportCode}
                </div>
                <div className="text-[10px] text-[#9CA3AF] mt-1">{dest.climate}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Airport specs and overview */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <h2 className="font-black text-sm uppercase text-black">
              DESTINATION & RUNWAY CAPACITY OVERVIEW
            </h2>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              {dest.description}
            </p>
          </div>

          <div className="bg-[#F5F5F5] border border-[#E5E7EB] p-4 font-mono text-xs space-y-2">
            <div className="font-bold text-black border-b border-[#E5E7EB] pb-2 uppercase">
              DISPATCH SPECS (IATA / ICAO)
            </div>
            <div className="flex justify-between text-[#4B5563]">
              <span>AIRPORT CODE:</span>
              <strong className="text-black">{dest.airportCode}</strong>
            </div>
            <div className="flex justify-between text-[#4B5563]">
              <span>OFFICIAL NAME:</span>
              <strong className="text-black truncate max-w-[150px]">{dest.airportName}</strong>
            </div>
            <div className="flex justify-between text-[#4B5563]">
              <span>PEAK TRAVEL SEASON:</span>
              <strong className="text-black">{dest.bestTimeToVisit}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Related Tours connecting to this airport */}
      <section>
        <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#E5E7EB]">
          <div>
            <div className="font-mono text-[10px] font-bold text-[#DC2626] uppercase tracking-wider">
              CONNECTING SCHEDULES
            </div>
            <h2 className="text-lg font-black text-black uppercase tracking-tight">
              ACTIVE FLIGHT PACKAGES TO {dest.airportCode} ({relatedTours.length})
            </h2>
          </div>
        </div>

        {relatedTours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedTours.map((t, idx) => (
              <TourCard
                key={t.id}
                tour={t}
                index={idx}
                onToggleSave={toggleSaveTour}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 bg-white border border-[#E5E7EB] text-center font-mono text-xs text-[#4B5563]">
            All available seats on this route corridor are currently committed. Contact central dispatch for standby placement.
          </div>
        )}
      </section>
    </PageShell>
  );
};

export default DestinationDetailPage;
