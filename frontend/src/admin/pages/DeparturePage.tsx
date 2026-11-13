import React, { useState, useEffect } from 'react';
import { Departure } from '../../types';
import Table, { Column } from '../components/Table';
import Drawer from '../components/Drawer';
import StatusBadge from '../../components/booking/StatusBadge';
import { formatDate, formatTime, formatCurrency } from '../../utils/format';
import { flightApi } from '../../services/api';

export const DeparturePage: React.FC = () => {
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [selectedDep, setSelectedDep] = useState<Departure | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await flightApi.getAll();
        if (mounted && res.success && res.data && res.data.length > 0) {
          setDepartures(res.data);
        }
      } catch {
        // Fallback to initial mock data
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const columns: Column<Departure>[] = [
    {
      key: 'flightNumber',
      header: 'FLIGHT NUMBER',
      render: (row) => (
        <span className="font-bold text-black font-mono">{row.flightNumber}</span>
      ),
    },
    {
      key: 'route',
      header: 'ROUTE CORRIDOR',
      render: (row) => (
        <span className="font-bold">
          {row.departureAirport} → {row.arrivalAirport}
        </span>
      ),
    },
    {
      key: 'departureTime',
      header: 'SCHEDULED WHEELS-UP',
      render: (row) => (
        <span>
          {formatTime(row.departureTime)} ({formatDate(row.departureTime)})
        </span>
      ),
    },
    {
      key: 'aircraftModel',
      header: 'FLEET MODEL',
      render: (row) => <span>{row.aircraftModel || 'A350-900'}</span>,
    },
    {
      key: 'gate',
      header: 'TERMINAL & GATE',
      render: (row) => (
        <span className="font-mono text-[11px]">
          {row.terminal} | Gate {row.gate}
        </span>
      ),
    },
    {
      key: 'seats',
      header: 'SEAT AVAILABILITY',
      render: (row) => (
        <span className="font-mono">
          {row.seatsAvailable} / {row.totalSeats}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'STATUS',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      header: 'DISPATCH',
      align: 'right',
      render: (row) => (
        <button
          onClick={() => setSelectedDep(row)}
          className="px-2 py-1 bg-black text-white hover:bg-[#DC2626] font-mono text-[10px] font-bold uppercase transition-none"
        >
          UPDATE GATE / TIME
        </button>
      ),
    },
  ];

  const handleUpdateDeparture = async (newStatus: Departure['status']) => {
    if (!selectedDep) return;
    setDepartures(
      departures.map((d) =>
        d.id === selectedDep.id ? { ...d, status: newStatus } : d
      )
    );
    setSelectedDep({ ...selectedDep, status: newStatus });
    try {
      await flightApi.updateStatus(selectedDep.id, newStatus);
    } catch {
      // Local optimistic update maintained
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E5E7EB] gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#DC2626]" />
            <h1 className="text-xl font-black uppercase text-black">
              FLIGHT DEPARTURE MATRIX & GATE CONTROL
            </h1>
          </div>
          <p className="font-mono text-xs text-[#4B5563] mt-0.5">
            TAKEOFF SLOTS, RUNWAY ASSIGNMENTS, AND ON-TIME PERFORMANCE (OTP) LOGGING
          </p>
        </div>
      </div>

      <Table columns={columns} data={departures} />

      {/* Drawer */}
      <Drawer
        isOpen={!!selectedDep}
        onClose={() => setSelectedDep(null)}
        title={selectedDep ? `DISPATCH: ${selectedDep.flightNumber}` : ''}
        subtitle="REAL-TIME FLIGHT STATUS TELEMETRY OVERRIDE"
        footer={
          <div className="flex justify-between items-center">
            <button
              onClick={() => setSelectedDep(null)}
              className="px-3 py-1.5 border border-[#E5E7EB] font-mono text-xs font-bold uppercase hover:bg-[#F5F5F5]"
            >
              CLOSE
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => handleUpdateDeparture('ON_TIME')}
                className="px-3 py-1.5 bg-[#22C55E] text-white font-mono text-xs font-bold uppercase"
              >
                ON-TIME
              </button>
              <button
                onClick={() => handleUpdateDeparture('DELAYED')}
                className="px-3 py-1.5 bg-[#DC2626] text-white font-mono text-xs font-bold uppercase"
              >
                FLAG DELAY
              </button>
            </div>
          </div>
        }
      >
        {selectedDep && (
          <div className="space-y-4 font-mono text-xs">
            <div className="p-3 bg-[#F5F5F5] border border-[#E5E7EB] space-y-1">
              <div>CORRIDOR: {selectedDep.departureAirport} → {selectedDep.arrivalAirport}</div>
              <div>AIRCRAFT: {selectedDep.aircraftModel}</div>
              <div>BASE FARE: {formatCurrency(selectedDep.price)}</div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#4B5563] uppercase mb-1">
                GATE ASSIGNMENT
              </label>
              <input
                type="text"
                value={selectedDep.gate}
                onChange={(e) =>
                  setSelectedDep({ ...selectedDep, gate: e.target.value })
                }
                className="w-full h-9 px-2.5 bg-[#F5F5F5] border border-[#E5E7EB] font-mono text-xs text-black"
              />
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default DeparturePage;
