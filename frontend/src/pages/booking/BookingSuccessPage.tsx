import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import PageShell from '../../components/layout/PageShell';
import { useBookings } from '../../hooks/useBookings';
import { formatDate, formatTime, formatCurrency } from '../../utils/format';

export const BookingSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId') || 'BK-8849';
  const { getBookingById } = useBookings();

  const booking = getBookingById(bookingId) || {
    id: bookingId,
    bookingCode: 'AERO-8849-VN',
    tourTitle: 'Heritage Coastline Flight Matrix: Da Nang — Ba Na Hills — Hoi An',
    departureTime: '2026-11-20T06:30:00Z',
    route: 'SGN -> DAD',
    customerName: 'Alex Morgan',
    customerPhone: '+1 (555) 019-8821',
    customerEmail: 'alex.morgan@aeroops.global',
    adultsCount: 2,
    childrenCount: 0,
    totalPrice: 640,
    status: 'PAID' as const,
    passengers: [{ fullName: 'Alex Morgan', gender: 'MALE', passengerType: 'ADULT', selectedSeat: '12A' }],
    paymentMethod: 'CREDIT_CARD' as const,
    createdAt: new Date().toISOString(),
  };

  return (
    <PageShell
      title="FLIGHT BOOKING CONFIRMED & PNR ISSUED"
      subtitle="AeroOps central dispatch has generated your electronic boarding pass and PNR reference"
      badge="ISSUED_ONLINE"
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Boarding Pass Style Card */}
        <div className="bg-white border-2 border-black p-6 relative select-none">
          {/* Top Airline Header */}
          <div className="flex items-center justify-between pb-4 border-b border-black">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#DC2626]" />
              <span className="font-mono text-sm font-black uppercase text-black">
                AEROFLIGHT // E-BOARDING PASS
              </span>
            </div>
            <div className="font-mono text-xs font-bold px-2 py-0.5 bg-[#22C55E] text-white">
              STATUS: PAYMENT CONFIRMED
            </div>
          </div>

          {/* Large PNR Reference display */}
          <div className="my-6 p-4 bg-[#F5F5F5] border border-[#E5E7EB] text-center">
            <div className="font-mono text-[10px] text-[#4B5563] uppercase tracking-widest">
              PASSENGER NAME RECORD (PNR REFERENCE CODE)
            </div>
            <div className="text-3xl font-black font-mono tracking-wider text-black mt-1">
              {booking.bookingCode}
            </div>
            <div className="font-mono text-[9px] text-[#4B5563] mt-1">
              ISSUED: {formatDate(booking.createdAt)} {formatTime(booking.createdAt)} // T4 DISPATCH
            </div>
          </div>

          {/* Flight details grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-t border-b border-[#E5E7EB] font-mono text-xs">
            <div>
              <div className="text-[9px] text-[#4B5563] uppercase">PASSENGER</div>
              <div className="font-bold text-black mt-0.5">{booking.customerName}</div>
            </div>
            <div>
              <div className="text-[9px] text-[#4B5563] uppercase">ROUTE</div>
              <div className="font-bold text-black mt-0.5">{booking.route}</div>
            </div>
            <div>
              <div className="text-[9px] text-[#4B5563] uppercase">DEPARTURE</div>
              <div className="font-bold text-black mt-0.5">
                {formatTime(booking.departureTime)} ({formatDate(booking.departureTime)})
              </div>
            </div>
            <div>
              <div className="text-[9px] text-[#4B5563] uppercase">SEAT</div>
              <div className="font-bold text-[#DC2626] mt-0.5">
                {booking.passengers[0]?.selectedSeat || '12A'}
              </div>
            </div>
          </div>

          {/* Ticket QR Code Mock & Total */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 bg-black text-white p-2 font-mono text-[8px] flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-[36px]">qr_code_2</span>
                <span>PNR-SCAN</span>
              </div>
              <div className="font-mono text-[10px] text-[#4B5563] leading-tight">
                Scan this QR code at airport kiosks or terminal boarding gates for instant clearance.
              </div>
            </div>

            <div className="text-right">
              <div className="font-mono text-[10px] text-[#4B5563] uppercase">
                TOTAL SETTLEMENT
              </div>
              <div className="font-mono text-xl font-black text-black">
                {formatCurrency(booking.totalPrice)}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => window.print()}
            className="w-full sm:w-auto px-5 py-2.5 bg-black text-white hover:bg-[#DC2626] font-mono text-xs font-bold uppercase tracking-wider transition-none flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            <span>PRINT E-TICKET</span>
          </button>
          <Link
            to={`/booking/${booking.id}`}
            className="w-full sm:w-auto px-5 py-2.5 bg-white border border-black text-black hover:bg-[#F5F5F5] font-mono text-xs font-bold uppercase tracking-wider transition-none text-center"
          >
            VIEW BOOKING DETAILS →
          </Link>
          <Link
            to="/booking/my"
            className="w-full sm:w-auto px-5 py-2.5 bg-white border border-[#E5E7EB] text-[#4B5563] hover:text-black font-mono text-xs font-bold uppercase tracking-wider transition-none text-center"
          >
            MY BOOKINGS LIST
          </Link>
        </div>
      </div>
    </PageShell>
  );
};

export default BookingSuccessPage;
