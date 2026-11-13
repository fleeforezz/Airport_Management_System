import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageShell from '../../components/layout/PageShell';
import StatusBadge from '../../components/booking/StatusBadge';
import { useBookings } from '../../hooks/useBookings';
import { useLanguage } from '../../context/LanguageContext';
import { formatDate, formatTime, formatCurrency } from '../../utils/format';
import { bookingApi } from '../../services/api';
import { Booking } from '../../types';

// Dynamic lazy import for interactive modal chunk (loaded on demand)
const CancelReservationModal = lazy(() => import('../../components/booking/CancelReservationModal'));

export const BookingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { getBookingById, cancelBooking } = useBookings();
  const [showCancelModal, setShowCancelModal] = useState(false);

  const localBooking = getBookingById(id || '') || {
    id: id || 'BK-8849',
    bookingCode: 'AERO-8849-VN',
    tourTitle: 'Heritage Coastline Flight Matrix: Da Nang — Ba Na Hills — Hoi An',
    tourId: 'TOUR-DAD-01',
    departureId: 'DEP-101',
    departureTime: '2026-11-20T06:30:00Z',
    route: 'SGN -> DAD',
    customerName: 'Alex Morgan',
    customerPhone: '+1 (555) 019-8821',
    customerEmail: 'alex.morgan@aeroops.global',
    adultsCount: 2,
    childrenCount: 0,
    totalPrice: 640,
    baggagePackage: 'STANDARD',
    baggageFee: 0,
    paymentMethod: 'CREDIT_CARD' as const,
    status: 'PAID' as const,
    passengers: [
      { fullName: 'Alex Morgan', gender: 'MALE', passengerType: 'ADULT', selectedSeat: '12A' },
      { fullName: 'Elena Vance', gender: 'FEMALE', passengerType: 'ADULT', selectedSeat: '12B' },
    ],
    notes: 'Priority fast-track through Security Terminal 1 requested',
    createdAt: '2026-11-10T14:22:00Z',
  };

  const [booking, setBooking] = useState<Booking>(localBooking);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;
    bookingApi.getByReference(id).then((res) => {
      if (isMounted && res.success && res.data) {
        setBooking(res.data);
      }
    }).catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleConfirmCancel = async (bookingId: string, reason: string, refund: number) => {
    try {
      await bookingApi.cancel(bookingId, reason);
    } catch {}
    await cancelBooking(bookingId, reason, refund);
    setBooking((prev) => ({ 
      ...prev, 
      status: 'CANCELLED',
      refundAmount: refund,
      cancellationReason: reason,
      cancellationDate: new Date().toISOString()
    }));
    setShowCancelModal(false);
  };

  return (
    <PageShell
      title={`BOOKING RECORD: ${booking.bookingCode}`}
      subtitle={`SYSTEM ID: ${booking.id} // CREATED: ${formatDate(booking.createdAt)}`}
      badge={booking.status}
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'My Bookings', path: '/booking/my' },
        { label: booking.bookingCode },
      ]}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Header Card */}
        <div className="bg-white border border-[#E5E7EB] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xl font-black text-black">
                {booking.bookingCode}
              </span>
              <StatusBadge status={booking.status} />
            </div>
            <div className="text-xs text-[#4B5563] mt-1 font-mono">
              Route: {booking.route} | Departure: {formatTime(booking.departureTime)} on {formatDate(booking.departureTime)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 border border-[#E5E7EB] text-black hover:border-black font-mono text-xs font-bold uppercase tracking-wider transition-none flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[14px]">print</span>
              <span>PRINT TICKET</span>
            </button>
            {booking.status !== 'CANCELLED' && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="px-3.5 py-1.5 border border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626] hover:text-white font-mono text-xs font-bold uppercase tracking-wider transition-none"
              >
                {t('bookings.cancelBtn')}
              </button>
            )}
          </div>
        </div>

        {/* Tour & Route Details */}
        <div className="bg-white border border-[#E5E7EB] p-6 space-y-4">
          <div className="font-mono text-[10px] font-bold text-black uppercase tracking-wider pb-2 border-b border-[#E5E7EB]">
            FLIGHT SCHEDULE & ITINERARY SPECIFICATIONS
          </div>
          <div className="text-sm font-bold text-black">{booking.tourTitle}</div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono text-xs text-[#4B5563] pt-2">
            <div>
              <span className="block text-[9px] uppercase">FLIGHT ROUTE</span>
              <span className="font-bold text-black">{booking.route}</span>
            </div>
            <div>
              <span className="block text-[9px] uppercase">PASSENGER COUNT</span>
              <span className="font-bold text-black">
                {booking.adultsCount} Adult{booking.adultsCount > 1 ? 's' : ''} {booking.childrenCount > 0 ? `, ${booking.childrenCount} Child(ren)` : ''}
              </span>
            </div>
            <div>
              <span className="block text-[9px] uppercase">BAGGAGE PACKAGE</span>
              <span className="font-bold text-black">
                {booking.baggagePackage || 'STANDARD'} {booking.baggageFee ? `(+$${booking.baggageFee})` : '(Included)'}
              </span>
            </div>
            <div>
              <span className="block text-[9px] uppercase">TOTAL FARE</span>
              <span className="font-bold text-[#DC2626] text-sm">
                {formatCurrency(booking.totalPrice)}
              </span>
            </div>
          </div>
        </div>

        {/* Cancellation Notice if Cancelled */}
        {booking.status === 'CANCELLED' && (
          <div className="bg-white border-2 border-[#DC2626] p-5 font-mono space-y-2">
            <div className="flex items-center gap-2 text-[#DC2626] font-bold text-xs uppercase">
              <span className="w-2 h-2 bg-[#DC2626]" />
              <span>RESERVATION CANCELLED & REFUND CREDITED</span>
            </div>
            <div className="text-xs text-black">
              Refund Amount Issued: <strong className="text-[#22C55E]">${booking.refundAmount || 0}.00</strong>
            </div>
            {booking.cancellationReason && (
              <div className="text-[11px] text-[#4B5563]">
                Reason provided: <em>{booking.cancellationReason}</em>
              </div>
            )}
            <div className="text-[10px] text-[#4B5563]">
              Aviation seats released back to carrier inventory according to cancellation policy.
            </div>
          </div>
        )}

        {/* Passenger List */}
        <div className="bg-white border border-[#E5E7EB] p-6 space-y-3">
          <div className="font-mono text-[10px] font-bold text-black uppercase tracking-wider pb-2 border-b border-[#E5E7EB]">
            PASSENGER MANIFEST & CABIN SEAT ASSIGNMENTS
          </div>
          <div className="divide-y divide-[#E5E7EB]">
            {booking.passengers.map((p, idx) => (
              <div
                key={idx}
                className="py-3 flex items-center justify-between font-mono text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="px-1.5 py-0.5 bg-black text-white text-[10px] font-bold">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <span className="font-bold text-black">{p.fullName}</span>
                    <span className="text-[10px] text-[#4B5563] ml-2">
                      ({p.passengerType === 'CHILD' ? 'CHILD' : 'ADULT'})
                    </span>
                  </div>
                </div>
                <div className="font-bold text-black">
                  SEAT: <span className="text-[#DC2626]">{p.selectedSeat || 'UNASSIGNED'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        {booking.notes && (
          <div className="bg-[#F5F5F5] border border-[#E5E7EB] p-4 font-mono text-xs text-[#4B5563]">
            <span className="font-bold text-black">RECORDED SPECIAL REQUESTS (SSR): </span>
            {booking.notes}
          </div>
        )}
      </div>

      {showCancelModal && (
        <Suspense fallback={null}>
          <CancelReservationModal
            isOpen={showCancelModal}
            booking={booking}
            onClose={() => setShowCancelModal(false)}
            onConfirmCancel={handleConfirmCancel}
          />
        </Suspense>
      )}
    </PageShell>
  );
};

export default BookingDetailPage;
