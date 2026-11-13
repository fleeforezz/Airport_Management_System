import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import PageShell from '../../components/layout/PageShell';
import StatusBadge from '../../components/booking/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import { useBookings } from '../../hooks/useBookings';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatDate, formatTime, formatCurrency } from '../../utils/format';
import { Booking } from '../../types';

// Dynamic lazy import for interactive modal chunk (loaded on demand)
const CancelReservationModal = lazy(() => import('../../components/booking/CancelReservationModal'));

export const BookingListPage: React.FC = () => {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const { bookings, isLoading, cancelBooking } = useBookings();
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PAID' | 'CONFIRMED' | 'CANCELLED'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [cancelSuccessMsg, setCancelSuccessMsg] = useState<string | null>(null);
  const PAGE_SIZE = 16;

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  if (isAuthLoading) {
    return (
      <PageShell
        title={t('bookings.pageTitle')}
        subtitle={t('footer.clearanceCheck')}
        badge="CLEARANCE_CHECK"
        breadcrumbs={[{ label: t('nav.home'), path: '/' }, { label: t('nav.myBookings') }]}
      >
        <div className="p-12 text-center font-mono text-xs text-[#4B5563]">
          {t('footer.clearanceCheck')}
        </div>
      </PageShell>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === 'ALL') return true;
    return b.status === statusFilter;
  });

  return (
    <PageShell
      title={t('bookings.pageTitle')}
      subtitle={t('bookings.subtitle').replace('{user}', `${user.name} (${user.email})`)}
      badge="VERIFIED_TRAVELER"
      breadcrumbs={[{ label: t('nav.home'), path: '/' }, { label: t('nav.myBookings') }]}
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
          {t('bookings.allBookings')} ({bookings.length})
        </button>
        <button
          onClick={() => setStatusFilter('PAID')}
          className={`px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-none border ${
            statusFilter === 'PAID'
              ? 'bg-black text-white border-black'
              : 'bg-white text-[#4B5563] border-[#E5E7EB] hover:border-black'
          }`}
        >
          {t('bookings.paid')}
        </button>
        <button
          onClick={() => setStatusFilter('CONFIRMED')}
          className={`px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-none border ${
            statusFilter === 'CONFIRMED'
              ? 'bg-black text-white border-black'
              : 'bg-white text-[#4B5563] border-[#E5E7EB] hover:border-black'
          }`}
        >
          {t('bookings.pending')}
        </button>
        <button
          onClick={() => setStatusFilter('CANCELLED')}
          className={`px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-none border ${
            statusFilter === 'CANCELLED'
              ? 'bg-black text-white border-black'
              : 'bg-white text-[#4B5563] border-[#E5E7EB] hover:border-black'
          }`}
        >
          {t('bookings.cancelled')}
        </button>
      </div>

      {/* Success cancellation alert banner */}
      {cancelSuccessMsg && (
        <div className="mb-6 p-4 bg-white border-2 border-[#16A34A] text-black font-mono text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#16A34A]" />
            <span className="font-bold">{cancelSuccessMsg}</span>
          </div>
          <button
            onClick={() => setCancelSuccessMsg(null)}
            className="text-[#4B5563] hover:text-black font-bold px-2 py-0.5 border border-[#E5E7EB]"
          >
            ✕
          </button>
        </div>
      )}

      {/* Bookings List with 16 per page Pagination */}
      {filteredBookings.length > 0 ? (
        <div className="space-y-6">
          <div className="space-y-4">
            {filteredBookings
              .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
              .map((b) => (
                <div
                  key={b.id}
                  className={`bg-white border transition-none p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    b.status === 'CANCELLED' ? 'border-[#DC2626]/40 bg-[#FAFAFA]' : 'border-[#E5E7EB] hover:border-black'
                  }`}
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
                    {b.status === 'CANCELLED' && (
                      <div className="font-mono text-[10px] text-[#DC2626] font-bold">
                        ĐÃ HỦY VÉ {b.refundAmount !== undefined ? `• TIỀN HOÀN: $${b.refundAmount}.00` : ''} {b.cancellationReason ? `(${b.cancellationReason})` : ''}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-[#E5E7EB]">
                    <div className="text-right">
                      <div className="font-mono text-[9px] text-[#4B5563] uppercase">
                        {t('bookings.totalSettled')}
                      </div>
                      <div className="font-mono text-base font-black text-black">
                        {formatCurrency(b.totalPrice)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {b.status !== 'CANCELLED' && (
                        <button
                          type="button"
                          onClick={() => setBookingToCancel(b)}
                          className="px-3 py-2 border border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626] hover:text-white font-mono text-xs font-bold uppercase tracking-wider transition-none"
                        >
                          {t('bookings.cancelBtn')}
                        </button>
                      )}
                      <Link
                        to={`/booking/${b.id}`}
                        className="px-4 py-2 bg-black hover:bg-[#DC2626] text-white font-mono text-xs font-bold uppercase tracking-wider transition-none"
                      >
                        {t('bookings.viewTicket')}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={filteredBookings.length}
            pageSize={PAGE_SIZE}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            itemLabel="BOOKINGS"
          />
        </div>
      ) : (
        <EmptyState
          title={t('bookings.emptyTitle')}
          description={t('bookings.emptyDesc')}
          actionText={t('bookings.reserveBtn')}
          onAction={() => window.location.href = '/tours'}
        />
      )}

      {/* Cancel Reservation Modal (Lazy Loaded On Demand) */}
      {bookingToCancel && (
        <Suspense fallback={null}>
          <CancelReservationModal
            isOpen={!!bookingToCancel}
            booking={bookingToCancel}
            onClose={() => setBookingToCancel(null)}
            onConfirmCancel={async (bookingId, reason, refund) => {
              await cancelBooking(bookingId, reason, refund);
              setCancelSuccessMsg(
                `${t('bookings.cancelSuccessNotice')} ${
                  refund > 0
                    ? t('bookings.refundIssuedNotice').replace('{amount}', `$${refund}.00`)
                    : t('bookings.nonRefundableNotice')
                }`
              );
            }}
          />
        </Suspense>
      )}
    </PageShell>
  );
};

export default BookingListPage;
