import React, { useState, useEffect } from 'react';
import { Booking, BookingStatus } from '../../types';
import Table, { Column } from '../components/Table';
import Drawer from '../components/Drawer';
import StatusBadge from '../../components/booking/StatusBadge';
import { formatCurrency, formatDate, formatTime } from '../../utils/format';
import { bookingApi } from '../../services/api';

export const BookingPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await bookingApi.getAll();
        if (mounted && res.success && res.data && res.data.length > 0) {
          setBookings(res.data);
        }
      } catch {
        // Fall back to initial mock data
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const filtered = bookings.filter(
    (b) =>
      b.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.route.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateStatus = async (status: BookingStatus) => {
    if (!selectedBooking) return;
    setBookings((prev) =>
      prev.map((b) => (b.id === selectedBooking.id ? { ...b, status } : b))
    );
    setSelectedBooking({ ...selectedBooking, status });
    try {
      await bookingApi.updateStatus(selectedBooking.id, status);
    } catch {
      // Local optimistic update maintained
    }
  };

  const columns: Column<Booking>[] = [
    {
      key: 'bookingCode',
      header: 'PNR CODE',
      render: (row) => (
        <span className="font-bold text-black font-mono">{row.bookingCode}</span>
      ),
    },
    {
      key: 'customerName',
      header: 'PRIMARY PASSENGER',
      render: (row) => (
        <div>
          <div className="font-bold text-black">{row.customerName}</div>
          <div className="text-[10px] text-[#4B5563]">{row.customerPhone}</div>
        </div>
      ),
    },
    {
      key: 'tourTitle',
      header: 'FLIGHT / TOUR ITINERARY',
      render: (row) => (
        <div className="max-w-xs truncate" title={row.tourTitle}>
          {row.tourTitle}
        </div>
      ),
    },
    {
      key: 'route',
      header: 'ROUTE',
      render: (row) => (
        <span className="px-1.5 py-0.5 bg-[#F5F5F5] border border-[#E5E7EB] font-bold">
          {row.route}
        </span>
      ),
    },
    {
      key: 'totalPrice',
      header: 'TOTAL VALUE',
      align: 'right',
      render: (row) => (
        <span className="font-black text-black">{formatCurrency(row.totalPrice)}</span>
      ),
    },
    {
      key: 'status',
      header: 'STATUS',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      header: 'DISPATCH ACTION',
      align: 'right',
      render: (row) => (
        <button
          onClick={() => setSelectedBooking(row)}
          className="px-2 py-1 bg-black text-white hover:bg-[#DC2626] font-mono text-[10px] font-bold uppercase transition-none"
        >
          INSPECT / APPROVE
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E5E7EB] gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#DC2626]" />
            <h1 className="text-xl font-black uppercase text-black">
              BOOKING & PASSENGER MANIFEST CONTROL
            </h1>
          </div>
          <p className="font-mono text-xs text-[#4B5563] mt-0.5">
            PNR RETRIEVAL, VERIFICATION, AND STATUS OVERRIDE INTERFACE
          </p>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white border border-[#E5E7EB] p-4 flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search PNR code, passenger name, route corridor..."
            className="w-full h-9 pl-3 pr-8 bg-[#F5F5F5] border border-[#E5E7EB] focus:border-black font-mono text-xs text-black"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#4B5563]"
            >
              ✕
            </button>
          )}
        </div>
        <div className="font-mono text-xs text-[#4B5563]">
          ACTIVE MATCHES: <strong className="text-black">{filtered.length} RECORDS</strong>
        </div>
      </div>

      {/* Main Table */}
      <Table columns={columns} data={filtered} />

      {/* Drawer for Booking Detail & Status Update */}
      <Drawer
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title={selectedBooking ? `INSPECT PNR: ${selectedBooking.bookingCode}` : ''}
        subtitle="DISPATCH APPROVAL & MANIFEST CLEARANCE"
        footer={
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedBooking(null)}
              className="px-3 py-1.5 border border-[#E5E7EB] font-mono text-xs font-bold uppercase hover:bg-[#F5F5F5]"
            >
              DISMISS DRAWER
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleUpdateStatus('PAID')}
                className="px-3 py-1.5 bg-[#22C55E] text-white font-mono text-xs font-bold uppercase"
              >
                MARK AS PAID
              </button>
              <button
                onClick={() => handleUpdateStatus('CANCELLED')}
                className="px-3 py-1.5 bg-[#DC2626] text-white font-mono text-xs font-bold uppercase"
              >
                CANCEL PNR
              </button>
            </div>
          </div>
        }
      >
        {selectedBooking && (
          <div className="space-y-4 font-mono text-xs">
            <div className="p-3 bg-[#F5F5F5] border border-[#E5E7EB] space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#4B5563]">CURRENT STATUS:</span>
                <StatusBadge status={selectedBooking.status} />
              </div>
              <div className="flex justify-between">
                <span className="text-[#4B5563]">ROUTE:</span>
                <span className="font-bold text-black">{selectedBooking.route}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4B5563]">SCHEDULED DEPARTURE:</span>
                <span className="font-bold text-black">
                  {formatTime(selectedBooking.departureTime)} ({formatDate(selectedBooking.departureTime)})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4B5563]">PAYMENT METHOD:</span>
                <span className="font-bold text-black">{selectedBooking.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4B5563]">TOTAL AMOUNT:</span>
                <span className="font-black text-[#DC2626]">
                  {formatCurrency(selectedBooking.totalPrice)}
                </span>
              </div>
            </div>

            <div>
              <div className="font-bold text-black uppercase pb-1 border-b border-[#E5E7EB] mb-2">
                PASSENGER MANIFEST & CABIN SEATS
              </div>
              <div className="space-y-1">
                {selectedBooking.passengers.map((p, i) => (
                  <div
                    key={i}
                    className="p-2 border border-[#E5E7EB] flex justify-between items-center"
                  >
                    <div>
                      <span className="font-bold text-black">{p.fullName}</span>
                      <span className="text-[10px] text-[#4B5563] ml-2">
                        [{p.passengerType}]
                      </span>
                    </div>
                    <span className="font-bold text-[#DC2626]">SEAT {p.selectedSeat || 'N/A'}</span>
                  </div>
                ))}
              </div>
            </div>

            {selectedBooking.notes && (
              <div>
                <div className="font-bold text-black uppercase pb-1 border-b border-[#E5E7EB] mb-1">
                  PASSENGER SPECIAL INSTRUCTIONS
                </div>
                <div className="p-2 bg-[#F5F5F5] border border-[#E5E7EB] text-[#4B5563]">
                  {selectedBooking.notes}
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default BookingPage;
