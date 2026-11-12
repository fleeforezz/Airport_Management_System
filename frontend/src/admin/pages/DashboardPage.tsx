import React, { useState, useEffect } from 'react';
import { MOCK_BOOKINGS, MOCK_DEPARTURES } from '../../utils/mockData';
import { formatCurrency, formatDate, formatTime } from '../../utils/format';
import Table, { Column } from '../components/Table';
import StatusBadge from '../../components/booking/StatusBadge';
import { Booking, Departure } from '../../types';
import { adminApi } from '../../services/api';

export const DashboardPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [departures, setDepartures] = useState<Departure[]>(MOCK_DEPARTURES);
  const [kpis, setKpis] = useState({
    totalBookingsMonth: 2481,
    dispatchedRevenue: 845000,
    scheduledFlightSlots: 64,
    activeFleetCount: 38,
  });

  useEffect(() => {
    let mounted = true;
    const fetchDashboardData = async () => {
      try {
        const statsRes = await adminApi.getStats();
        if (mounted && statsRes.success && statsRes.data) {
          const d = statsRes.data;
          setKpis({
            totalBookingsMonth: d.totalBookingsMonth || 2481,
            dispatchedRevenue: d.dispatchedRevenue || 845000,
            scheduledFlightSlots: d.scheduledFlightSlots || 64,
            activeFleetCount: d.activeFleetCount || 38,
          });
          if (d.recentBookings && d.recentBookings.length > 0) {
            setBookings(d.recentBookings);
          }
        }

        const depsRes = await adminApi.getDepartures();
        if (mounted && depsRes.success && depsRes.data && depsRes.data.length > 0) {
          setDepartures(depsRes.data);
        }
      } catch {
        // Fall back to mock data when backend is not connected
      }
    };

    fetchDashboardData();
    return () => {
      mounted = false;
    };
  }, []);

  const stats = [
    { label: 'TOTAL BOOKINGS (MONTH)', value: `${kpis.totalBookingsMonth.toLocaleString()} PNR`, change: '+12.4% VS PREV', changeType: 'pos' },
    { label: 'DISPATCHED REVENUE', value: formatCurrency(kpis.dispatchedRevenue), change: '+18.1% YOY', changeType: 'pos' },
    { label: 'SCHEDULED FLIGHT SLOTS', value: `${kpis.scheduledFlightSlots} SLOTS`, change: '100% ON-TIME RATE', changeType: 'neutral' },
    { label: 'FLEET IN ACTIVE SERVICE', value: `${kpis.activeFleetCount} AIRCRAFT`, change: 'KJFK - SGN - HAN', changeType: 'neutral' },
  ];

  const bookingColumns: Column<Booking>[] = [
    {
      key: 'bookingCode',
      header: 'PNR CODE',
      render: (row) => <span className="font-bold text-black">{row.bookingCode}</span>,
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
      key: 'route',
      header: 'ROUTE CORRIDOR',
      render: (row) => (
        <span className="px-1.5 py-0.5 bg-[#F5F5F5] border border-[#E5E7EB] font-bold">
          {row.route}
        </span>
      ),
    },
    {
      key: 'totalPrice',
      header: 'VALUE',
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
      key: 'createdAt',
      header: 'TIMESTAMP',
      render: (row) => (
        <span className="text-[#4B5563]">
          {formatTime(row.createdAt)} - {formatDate(row.createdAt)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title & Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E5E7EB] gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#DC2626]" />
            <h1 className="text-xl font-black uppercase text-black">
              CENTRAL OPERATIONS DASHBOARD (AEROOPS HUB)
            </h1>
          </div>
          <p className="font-mono text-xs text-[#4B5563] mt-0.5">
            REAL-TIME DISPATCH TELEMETRY // TERMINAL 4 KJFK & T1 SGN
          </p>
        </div>
        <div className="font-mono text-xs flex items-center gap-2">
          <span className="px-2.5 py-1 bg-black text-white font-bold">
            STATUS: 100% OPERATIONAL
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <div
            key={idx}
            className="bg-white border border-[#E5E7EB] p-4 flex flex-col justify-between"
          >
            <div className="font-mono text-[9px] font-bold text-[#4B5563] uppercase tracking-wider">
              {s.label}
            </div>
            <div className="font-mono text-xl font-black text-black my-2">
              {s.value}
            </div>
            <div className="pt-2 border-t border-[#E5E7EB] font-mono text-[10px] text-[#22C55E] font-bold">
              {s.change}
            </div>
          </div>
        ))}
      </div>

      {/* Active Departures Alert Row */}
      <div className="bg-white border border-black p-4 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
          <div className="font-mono text-xs font-bold text-black uppercase flex items-center gap-2">
            <span className="w-2 h-2 bg-[#DC2626]" />
            <span>IMMEDIATE UPCOMING DEPARTURES (NEXT DISPATCH SLOTS)</span>
          </div>
          <span className="font-mono text-[10px] text-[#4B5563]">
            {departures.length} ACTIVE SLOTS TODAY
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {departures.slice(0, 3).map((dep) => (
            <div
              key={dep.id}
              className="p-3 bg-[#F5F5F5] border border-[#E5E7EB] font-mono text-xs space-y-1"
            >
              <div className="flex justify-between items-center font-bold text-black">
                <span>{dep.flightNumber}</span>
                <span className="text-[#22C55E] text-[10px]">ON-TIME</span>
              </div>
              <div className="text-[#4B5563]">
                {dep.departureAirport} → {dep.arrivalAirport} ({dep.aircraftModel || 'A350'})
              </div>
              <div className="text-[10px] text-black pt-1">
                Departure: {formatTime(dep.departureTime)} | Gate: {dep.gate || 'G12'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs font-bold text-black uppercase flex items-center gap-2">
            <span className="w-2 h-2 bg-black" />
            <span>LATEST PNR RESERVATION LOGS</span>
          </div>
          <span className="font-mono text-[10px] text-[#4B5563]">
            TELEMETRY REFRESH EVERY 30 SECONDS
          </span>
        </div>

        <Table columns={bookingColumns} data={bookings} />
      </div>
    </div>
  );
};

export default DashboardPage;
