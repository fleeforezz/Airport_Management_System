import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '../../components/layout/PageShell';
import StatusBadge from '../../components/booking/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import { useBookings } from '../../hooks/useBookings';
import { formatDate, formatTime, formatCurrency } from '../../utils/format';

export const BookingListPage: React.FC = () => {
  const { bookings } = useBookings();
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PAID' | 'CONFIRMED' | 'CANCELLED'>('ALL');

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === 'ALL') return true;
    return b.status === statusFilter;
  });

  return (
    <PageShell
      title="MY FLIGHT BOOKINGS & PNR RECORDS"
      subtitle="Manage electronic tickets, charter itineraries and retrieve booking confirmation references"
      badge="MY_BOOKINGS"
      breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'My Bookings' }]}
    >
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-[#E5E7EB] pb-3">
        <button
          onClick={() => setStatusFilter('ALL')}
          className={`px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-none border ${
            statusFilter === 'ALL'
              ? 'bg-black text-white border-black'
              : 'bg-white text-[#4B5563] border-[#E5E7EB] hover:border-black'
          }`}
        >
          ALL BOOKINGS ({bookings.length})
        </button>
        <button
          onClick={() => setStatusFilter('PAID')}
          className={`px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-none border ${
            statusFilter === 'PAID'
              ? 'bg-black text-white border-black'
              : 'bg-white text-[#4B5563] border-[#E5E7EB] hover:border-black'
          }`}
        >
          CONFIRMED & PAID
        </button>
        <button
          onClick={() => setStatusFilter('CONFIRMED')}
          className={`px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-none border ${
            statusFilter === 'CONFIRMED'
              ? 'bg-black text-white border-black'
              : 'bg-white text-[#4B5563] border-[#E5E7EB] hover:border-black'
          }`}
        >
          PENDING CLEARANCE
        </button>
        <button
          onClick={() => setStatusFilter('CANCELLED')}
          className={`px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-none border ${
            statusFilter === 'CANCELLED'
              ? 'bg-black text-white border-black'
              : 'bg-white text-[#4B5563] border-[#E5E7EB] hover:border-black'
          }`}
        >
          CANCELLED
        </button>
      </div>

      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              className="bg-white border border-[#E5E7EB] hover:border-black transition-none p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-black text-black">
                    {b.bookingCode}
                  </span>
                  <StatusBadge status={b.status} />
                  <span className="font-mono text-[10px] text-[#4B5563]">
                    {b.route}
                  </span>
                </div>
                <div className="font-bold text-xs text-black">{b.tourTitle}</div>
                <div className="font-mono text-[11px] text-[#4B5563]">
                  Departure: {formatTime(b.departureTime)} on {formatDate(b.departureTime)} | {b.adultsCount} passenger{b.adultsCount > 1 ? 's' : ''}
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-[#E5E7EB]">
                <div className="text-right">
                  <div className="font-mono text-[9px] text-[#4B5563] uppercase">
                    TOTAL SETTLED
                  </div>
                  <div className="font-mono text-base font-black text-black">
                    {formatCurrency(b.totalPrice)}
                  </div>
                </div>

                <Link
                  to={`/booking/${b.id}`}
                  className="px-4 py-2 bg-black hover:bg-[#DC2626] text-white font-mono text-xs font-bold uppercase tracking-wider transition-none"
                >
                  VIEW E-TICKET →
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="NO BOOKINGS FOUND"
          description="There are currently no flight records under this filtered status."
          actionText="RESERVE A NEW FLIGHT"
          onAction={() => window.location.href = '/tours'}
        />
      )}
    </PageShell>
  );
};

export default BookingListPage;
