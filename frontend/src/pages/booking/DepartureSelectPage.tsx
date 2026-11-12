import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageShell from '../../components/layout/PageShell';
import DeparturePicker from '../../components/booking/DeparturePicker';
import GuestCounter from '../../components/booking/GuestCounter';
import { MOCK_DEPARTURES, MOCK_TOURS } from '../../utils/mockData';
import { useBookingDraft } from '../../context/BookingDraftContext';
import { Departure, Tour } from '../../types';
import { tourApi, flightApi } from '../../services/api';

export const DepartureSelectPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tourId = searchParams.get('tourId') || 'TOUR-DAD-01';
  const navigate = useNavigate();
  const { setTour, setDeparture, setGuests } = useBookingDraft();

  const initialTour = MOCK_TOURS.find((t) => t.id === tourId || t.code === tourId) || MOCK_TOURS[0];
  const [tour, setTourState] = useState<Tour>(initialTour);
  const [departures, setDepartures] = useState<Departure[]>(
    MOCK_DEPARTURES.filter((d) => d.tourId === initialTour.id)
  );

  const [selectedDep, setSelectedDep] = useState<Departure>(
    departures[0] || MOCK_DEPARTURES[0]
  );
  const [adults, setAdults] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const [tourRes, flightRes] = await Promise.all([
          tourApi.getAll(),
          flightApi.getAll(),
        ]);

        if (isMounted && tourRes.success && tourRes.data) {
          const found = tourRes.data.find(
            (t) => t.id === tourId || t.code === tourId || String(t.id) === String(tourId)
          );
          if (found) setTourState(found);
        }

        if (isMounted && flightRes.success && flightRes.data && flightRes.data.length > 0) {
          const matchedDeps = flightRes.data.filter(
            (d) => d.tourId === tourId || d.tourId === initialTour.id || String(d.tourId) === String(tourId)
          );
          if (matchedDeps.length > 0) {
            setDepartures(matchedDeps);
            setSelectedDep(matchedDeps[0]);
          } else {
            setDepartures(flightRes.data);
            setSelectedDep(flightRes.data[0]);
          }
        }
      } catch {
        // Retain fallback data
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, [tourId]);

  const handleNext = () => {
    setTour(tour);
    setDeparture(selectedDep);
    setGuests(adults, childrenCount);
    navigate('/booking/checkout');
  };

  return (
    <PageShell
      title="SELECT FLIGHT SCHEDULE & DEPARTURE SLOT"
      subtitle={`ITINERARY: ${tour.title} // TOUR CODE: ${tour.code}`}
      badge="STEP_01_DEPARTURE"
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Tours', path: '/tours' },
        { label: 'Select Departure' },
      ]}
    >
      <div className="max-w-3xl mx-auto bg-white border border-[#E5E7EB] p-6 space-y-6">
        {/* Step indicator */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] font-mono text-[10px]">
          <span className="font-bold text-black">[ STEP 1 OF 3 ] SELECT FLIGHT SCHEDULE</span>
          <span className="text-[#4B5563]">SGN / DAD AVIATION DISPATCH MATRIX</span>
        </div>

        {/* Departure picker */}
        <DeparturePicker
          departures={departures.length > 0 ? departures : MOCK_DEPARTURES}
          selectedId={selectedDep.id}
          onSelect={(dep) => setSelectedDep(dep)}
        />

        {/* Guest counter */}
        <div className="pt-4 border-t border-[#E5E7EB]">
          <GuestCounter
            adults={adults}
            childrenCount={childrenCount}
            onChange={(a, c) => {
              setAdults(a);
              setChildrenCount(c);
            }}
          />
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-black flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-[#E5E7EB] font-mono text-xs font-bold uppercase tracking-wider text-black hover:bg-[#F5F5F5] transition-none"
          >
            ← PREVIOUS STEP
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2.5 bg-black hover:bg-[#DC2626] text-white font-mono text-xs font-bold uppercase tracking-wider transition-none border border-black flex items-center gap-2"
          >
            <span>PROCEED: PASSENGER DETAILS & PAYMENT</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </PageShell>
  );
};

export default DepartureSelectPage;
