import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageShell from '../../components/layout/PageShell';
import Gallery from '../../components/tour/Gallery';
import Itinerary from '../../components/tour/Itinerary';
import DeparturePicker from '../../components/booking/DeparturePicker';
import GuestCounter from '../../components/booking/GuestCounter';
import PriceBreakdown from '../../components/booking/PriceBreakdown';
import { MOCK_TOURS, MOCK_DEPARTURES } from '../../utils/mockData';
import { useBookingDraft } from '../../context/BookingDraftContext';
import { formatCurrency, formatDurationDays } from '../../utils/format';
import { tourApi } from '../../services/api';
import { Tour, Departure } from '../../types';

export const TourDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setTour, setDeparture, setGuests } = useBookingDraft();

  const initialTour = MOCK_TOURS.find((t) => t.id === id || t.code === id) || MOCK_TOURS[0];
  const [tour, setTourState] = useState<Tour>(initialTour);
  const [departures, setDepartures] = useState<Departure[]>(
    MOCK_DEPARTURES.filter((d) => d.tourId === initialTour.id)
  );
  const [selectedDeparture, setSelectedDepartureState] = useState<Departure>(
    departures[0] || MOCK_DEPARTURES[0]
  );
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const loadTourData = async () => {
      try {
        const toursRes = await tourApi.getAll();
        if (isMounted && toursRes.success && toursRes.data && toursRes.data.length > 0) {
          const found = toursRes.data.find(
            (t) => t.id === id || t.code === id || String(t.id) === String(id)
          );
          if (found) {
            setTourState(found);
            const depRes = await tourApi.getDepartures(found.id);
            if (isMounted && depRes.success && depRes.data && depRes.data.length > 0) {
              setDepartures(depRes.data);
              setSelectedDepartureState(depRes.data[0]);
            }
          }
        }
      } catch {
        // Fallback gracefully
      }
    };
    loadTourData();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleProceedBooking = () => {
    setTour(tour);
    setDeparture(selectedDeparture);
    setGuests(adults, childrenCount);
    navigate('/booking/checkout');
  };

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
              departures={departures.length > 0 ? departures : [MOCK_DEPARTURES[0]]}
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
