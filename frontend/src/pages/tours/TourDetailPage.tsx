import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageShell from '../../components/layout/PageShell';
import Gallery from '../../components/tour/Gallery';
import Itinerary from '../../components/tour/Itinerary';
import DeparturePicker from '../../components/booking/DeparturePicker';
import GuestCounter from '../../components/booking/GuestCounter';
import PriceBreakdown from '../../components/booking/PriceBreakdown';
import SwissSuspenseLoader from '../../components/common/SwissSuspenseLoader';
import EmptyState from '../../components/common/EmptyState';
import { useBookingDraft } from '../../context/BookingDraftContext';
import { formatCurrency, formatDurationDays } from '../../utils/format';
import { tourApi } from '../../services/api';
import { Tour, Departure } from '../../types';

export const TourDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setTour, setDeparture, setGuests } = useBookingDraft();

  const [tour, setTourState] = useState<Tour | null>(null);
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [selectedDeparture, setSelectedDepartureState] = useState<Departure | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const loadTourData = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        // Try getting directly by ID or search all
        let foundTour: Tour | null = null;
        try {
          const detailRes = await tourApi.getById(id);
          if (detailRes.success && detailRes.data) {
            foundTour = detailRes.data;
          }
        } catch {
          // If direct detail endpoint misses, find in list
        }

        if (!foundTour) {
          const toursRes = await tourApi.getAll();
          if (toursRes.success && toursRes.data) {
            foundTour = toursRes.data.find(
              (t) => t.id === id || t.code === id || String(t.id) === String(id)
            ) || null;
          }
        }

        if (isMounted && foundTour) {
          setTourState(foundTour);
          const depRes = await tourApi.getDepartures(foundTour.id);
          if (isMounted && depRes.success && depRes.data && depRes.data.length > 0) {
            setDepartures(depRes.data);
            setSelectedDepartureState(depRes.data[0]);
          }
        }
      } catch {
        // Handled cleanly
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadTourData();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleProceedBooking = () => {
    if (!tour || !selectedDeparture) return;
    setTour(tour);
    setDeparture(selectedDeparture);
    setGuests(adults, childrenCount);
    navigate('/booking/checkout');
  };

  if (isLoading) {
    return (
      <PageShell title="AIR EXPEDITION" subtitle="RETRIEVING RECORD FROM DATABASE...">
        <SwissSuspenseLoader label="SYS_DB // RETRIEVING TOUR TELEMETRY" />
      </PageShell>
    );
  }

  if (!tour) {
    return (
      <PageShell title="EXPEDITION NOT FOUND" subtitle="DATABASE QUERY RETURNED NULL">
        <EmptyState
          title="TOUR RECORD NOT FOUND"
          description="The requested tour expedition does not exist in the live database matrix."
          actionLabel="RETURN TO TOURS"
          actionPath="/tours"
        />
      </PageShell>
    );
  }

  return (
    <PageShell
      title={tour.title}
      subtitle={`CODE: ${tour.code} // ORIGIN: ${tour.departureCity}`}
      badge="PREMIER CHARTER"
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Tours & Flights', path: '/tours' },
        { label: tour.code },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Media Gallery, Highlights, Itinerary (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Gallery Component */}
          <Gallery images={tour.galleryImages} title={tour.title} />

          {/* Key Quick Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white border border-[#E5E7EB] p-4 font-mono text-xs">
            <div>
              <div className="text-[9px] text-[#4B5563] uppercase">DURATION</div>
              <div className="font-bold text-black mt-0.5">
                {formatDurationDays(tour.durationDays, tour.durationNights)}
              </div>
            </div>
            <div>
              <div className="text-[9px] text-[#4B5563] uppercase">AIRLINE CARRIER</div>
              <div className="font-bold text-black mt-0.5">{tour.airlineName}</div>
            </div>
            <div>
              <div className="text-[9px] text-[#4B5563] uppercase">DESTINATION</div>
              <div className="font-bold text-black mt-0.5">{tour.destinationName}</div>
            </div>
            <div>
              <div className="text-[9px] text-[#4B5563] uppercase">RATINGS</div>
              <div className="font-bold text-black mt-0.5 flex items-center gap-1">
                <span className="text-[#DC2626]">★</span>
                <span>{tour.rating} ({tour.reviewsCount} reviews)</span>
              </div>
            </div>
          </div>

          {/* Highlights Section */}
          <div className="bg-white border border-[#E5E7EB] p-5">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#E5E7EB]">
              <span className="w-2 h-2 bg-[#DC2626]" />
              <h2 className="font-black text-sm uppercase text-black">
                EXCLUSIVE FLIGHT HIGHLIGHTS
              </h2>
            </div>
            <ul className="space-y-2">
              {tour.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-black leading-relaxed">
                  <span className="w-1.5 h-1.5 bg-black mt-1.5 flex-shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Itinerary Schedule */}
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-black" />
                <h2 className="font-black text-sm uppercase text-black">
                  DAY-BY-DAY OPERATIONAL FLIGHT SCHEDULE
                </h2>
              </div>
              <span className="font-mono text-[10px] text-[#4B5563]">
                {tour.itinerary.length} DISPATCH PHASES
              </span>
            </div>
            <Itinerary days={tour.itinerary} />
          </div>

          {/* Baggage Allowance & Surcharges Policy Section */}
          <div className="bg-white border border-[#E5E7EB] p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#DC2626]" />
                <h2 className="font-black text-sm uppercase text-black">
                  BAGGAGE ALLOWANCE & EXTRA SURCHARGES
                </h2>
              </div>
              <span className="font-mono text-[9px] text-[#4B5563]">STANDARD INCLUSION</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-[#F5F5F5] border border-[#E5E7EB]">
                <div className="text-[10px] text-[#4B5563] uppercase font-bold">CABIN HAND LUGGAGE</div>
                <div className="text-black font-bold mt-1">1× 7kg Carry-on</div>
                <div className="text-[10px] text-[#4B5563] mt-0.5">Max 56 × 36 × 23 cm (Included in fare)</div>
              </div>
              <div className="p-3 bg-[#F5F5F5] border border-[#E5E7EB]">
                <div className="text-[10px] text-[#4B5563] uppercase font-bold">CHECKED BAGGAGE</div>
                <div className="text-black font-bold mt-1">1× 20kg Checked Luggage</div>
                <div className="text-[10px] text-[#4B5563] mt-0.5">All flights included without extra fee</div>
              </div>
            </div>

            <div className="pt-2">
              <div className="text-[10px] font-bold text-black uppercase font-mono mb-2">
                EXTRA BAGGAGE PACKAGES (SELECTABLE AT CHECKOUT):
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono">
                <div className="border border-[#E5E7EB] p-2 bg-white">
                  <div className="text-[10px] text-[#4B5563]">+10kg Checked</div>
                  <div className="font-bold text-[#DC2626] text-xs">+$25</div>
                </div>
                <div className="border border-[#E5E7EB] p-2 bg-white">
                  <div className="text-[10px] text-[#4B5563]">+20kg Checked</div>
                  <div className="font-bold text-[#DC2626] text-xs">+$45</div>
                </div>
                <div className="border border-[#E5E7EB] p-2 bg-white">
                  <div className="text-[10px] text-[#4B5563]">+30kg Checked</div>
                  <div className="font-bold text-[#DC2626] text-xs">+$65</div>
                </div>
                <div className="border border-[#E5E7EB] p-2 bg-white">
                  <div className="text-[10px] text-[#4B5563]">Sports Gear</div>
                  <div className="font-bold text-[#DC2626] text-xs">+$50</div>
                </div>
              </div>
            </div>
            {tour.baggagePolicy && (
              <p className="text-[11px] text-[#4B5563] leading-relaxed pt-1">
                {tour.baggagePolicy}
              </p>
            )}
          </div>

          {/* Cancellation & Refund Policy Section */}
          <div className="bg-white border border-[#E5E7EB] p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-black" />
                <h2 className="font-black text-sm uppercase text-black">
                  TOUR CANCELLATION & AUTOMATED REFUND POLICY
                </h2>
              </div>
              <span className="font-mono text-[9px] text-[#DC2626] font-bold">TIERED SCHEDULE</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between p-2.5 bg-[#F5F5F5] border-l-2 border-[#22C55E]">
                <div>
                  <span className="font-bold text-black">≥ 15 DAYS BEFORE DEPARTURE</span>
                  <div className="text-[10px] text-[#4B5563]">Full cancellation allowed</div>
                </div>
                <span className="font-bold text-[#22C55E]">100% REFUND (0% PENALTY)</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#F5F5F5] border-l-2 border-black">
                <div>
                  <span className="font-bold text-black">7 – 14 DAYS BEFORE DEPARTURE</span>
                  <div className="text-[10px] text-[#4B5563]">Partial airline slot penalty applies</div>
                </div>
                <span className="font-bold text-black">70% REFUND (30% PENALTY)</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#F5F5F5] border-l-2 border-[#DC2626]">
                <div>
                  <span className="font-bold text-black">3 – 6 DAYS BEFORE DEPARTURE</span>
                  <div className="text-[10px] text-[#4B5563]">Late flight release surcharge</div>
                </div>
                <span className="font-bold text-[#DC2626]">40% REFUND (60% PENALTY)</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#F5F5F5] border-l-2 border-black">
                <div>
                  <span className="font-bold text-black">&lt; 48 HOURS (2 DAYS) BEFORE DEPARTURE</span>
                  <div className="text-[10px] text-[#4B5563]">Flight manifest locked by civil aviation authority</div>
                </div>
                <span className="font-bold text-black">0% REFUND (NON-REFUNDABLE)</span>
              </div>
            </div>

            {tour.cancellationPolicy && (
              <p className="text-[11px] text-[#4B5563] leading-relaxed pt-1">
                {tour.cancellationPolicy}
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Sticky Booking Widget (4 cols) */}
        <div className="lg:col-span-4">
          <div className="bg-white border-2 border-black p-5 sticky top-20 space-y-5">
            {/* Price Header */}
            <div className="border-b border-[#E5E7EB] pb-3">
              <div className="font-mono text-[10px] text-[#4B5563] uppercase tracking-wider">
                BASE FARE / PASSENGER
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <div className="text-2xl font-black text-black font-mono">
                  {formatCurrency(selectedDeparture?.price || tour.price)}
                </div>
                {tour.originalPrice && (
                  <span className="font-mono text-xs text-[#9CA3AF] line-through">
                    {formatCurrency(tour.originalPrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Departure Picker */}
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
              selectedId={selectedDeparture?.id}
              onSelect={(dep) => setSelectedDepartureState(dep)}
            />

            {/* Guest Counter */}
            <GuestCounter
              adults={adults}
              childrenCount={childrenCount}
              onChange={(a, c) => {
                setAdults(a);
                setChildrenCount(c);
              }}
            />

            {/* Price Breakdown */}
            <PriceBreakdown
              basePrice={selectedDeparture?.price || tour.price}
              adultsCount={adults}
              childrenCount={childrenCount}
            />

            {/* Proceed CTA Button */}
            <button
              onClick={handleProceedBooking}
              className="w-full py-3 bg-black hover:bg-[#DC2626] text-white font-mono text-xs font-bold uppercase tracking-wider transition-none border border-black flex items-center justify-center gap-2"
            >
              <span>PROCEED TO SEAT SELECTION & CHECKOUT</span>
              <span>→</span>
            </button>

            <div className="font-mono text-[9px] text-[#4B5563] text-center pt-1">
              FREE CANCELLATION UP TO 48H PRIOR TO WHEELS-UP // AVIATION INSURANCE INCLUDED
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default TourDetailPage;
