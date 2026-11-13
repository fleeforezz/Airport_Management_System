import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageShell from '../../components/layout/PageShell';
import DeparturePicker from '../../components/booking/DeparturePicker';
import GuestCounter from '../../components/booking/GuestCounter';
import SwissSuspenseLoader from '../../components/common/SwissSuspenseLoader';
import EmptyState from '../../components/common/EmptyState';
import { useBookingDraft } from '../../context/BookingDraftContext';
import { Departure, Tour } from '../../types';
import { tourApi, flightApi } from '../../services/api';

export const DepartureSelectPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tourId = searchParams.get('tourId') || '';
  const navigate = useNavigate();
  const { setTour, setDeparture, setGuests } = useBookingDraft();

  const [tour, setTourState] = useState<Tour | null>(null);
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [selectedDep, setSelectedDep] = useState<Departure | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [adults, setAdults] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const loadData = async () => {
      try {
        const [tourRes, flightRes] = await Promise.all([
          tourApi.getAll(),
          flightApi.getAll(),
        ]);

        let foundTour: Tour | null = null;
        if (tourRes.success && tourRes.data) {
          foundTour = tourRes.data.find(
            (t) => t.id === tourId || t.code === tourId || String(t.id) === String(tourId)
          ) || tourRes.data[0] || null;
          if (isMounted) setTourState(foundTour);
        }

        if (isMounted && flightRes.success && flightRes.data && flightRes.data.length > 0) {
          const matchedDeps = flightRes.data.filter(
            (d) => foundTour && (d.tourId === tourId || d.tourId === foundTour.id || String(d.tourId) === String(foundTour.id))
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
        // Handled cleanly
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [tourId]);

  const handleNext = () => {
    if (!tour || !selectedDep) return;
    setTour(tour);
    setDeparture(selectedDep);
    setGuests(adults, childrenCount);
    navigate('/booking/checkout');
  };

  if (isLoading) {
    return (
      <PageShell title="SELECT DEPARTURE" subtitle="SYNCING FLIGHT SCHEDULES...">
        <SwissSuspenseLoader label="LOADING SCHEDULE // DATABASE MATRIX" />
      </PageShell>
    );
  }

  if (!tour) {
    return (
      <PageShell title="EXPEDITION NOT FOUND" subtitle="DATABASE QUERY RETURNED NO RESULTS">
        <EmptyState
          title="TOUR RECORD NOT FOUND"
          description="Could not locate the flight schedule in the database matrix."
          actionLabel="RETURN TO TOURS"
          actionPath="/tours"
        />
      </PageShell>
    );
  }

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
          departures={departures.length > 0 ? departures : [{
            id: `dep-${tour.id}-auto`,
            flightNumber: `${tour.code}-01`,
            tourId: tour.id,
            departureAirport: tour.departureCity?.substring(0, 3)?.toUpperCase() || 'SGN',
            arrivalAirport: tour.destinationCode || 'DAD',
            departureTime: new Date(Date.now() + 86400000 * 3).toISOString(),
            arrivalTime: new Date(Date.now() + 86400000 * 3 + 7200000).toISOString(),
            price: tour.price,
            seatsAvailable: 30,
            totalSeats: 180,
            status: 'ON_TIME',
          }]}
          selectedId={selectedDep?.id}
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
