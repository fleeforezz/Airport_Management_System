import React, { useState, useEffect } from 'react';
import { MOCK_DESTINATIONS } from '../../utils/mockData';
import { Destination } from '../../types';
import Table, { Column } from '../components/Table';
import Drawer from '../components/Drawer';
import ImageUploader from '../components/ImageUploader';
import { destinationApi } from '../../services/api';

export const DestinationPage: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>(MOCK_DESTINATIONS);
  const [editingDest, setEditingDest] = useState<Destination | null>(null);

  useEffect(() => {
    let isMounted = true;
    destinationApi.getAll().then((res) => {
      if (isMounted && res.success && res.data && res.data.length > 0) {
        setDestinations(res.data);
      }
    }).catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const columns: Column<Destination>[] = [
    {
      key: 'code',
      header: 'IATA CODE',
      render: (row) => (
        <span className="px-2 py-0.5 bg-black text-white font-mono font-black text-xs">
          {row.airportCode}
        </span>
      ),
    },
    {
      key: 'name',
      header: 'DESTINATION NAME',
      render: (row) => <span className="font-bold text-black">{row.name}</span>,
    },
    {
      key: 'airportName',
      header: 'AIRPORT FACILITY',
      render: (row) => <span>{row.airportName}</span>,
    },
    {
      key: 'country',
      header: 'COUNTRY',
      render: (row) => <span>{row.country}</span>,
    },
    {
      key: 'popularToursCount',
      header: 'ACTIVE SCHEDULES',
      render: (row) => <span>{row.popularToursCount || 0} tours</span>,
    },
    {
      key: 'actions',
      header: 'ACTION',
      align: 'right',
      render: (row) => (
        <button
          onClick={() => setEditingDest(row)}
          className="px-2 py-1 bg-black text-white hover:bg-[#DC2626] font-mono text-[10px] font-bold uppercase transition-none"
        >
          EDIT SPECS
        </button>
      ),
    },
  ];

  const handleSave = () => {
    if (!editingDest) return;
    setDestinations(
      destinations.map((d) => (d.id === editingDest.id ? editingDest : d))
    );
    setEditingDest(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E5E7EB] gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#DC2626]" />
            <h1 className="text-xl font-black uppercase text-black">
              AIRPORT REGISTRY & GATEWAY CAPACITIES
            </h1>
          </div>
          <p className="font-mono text-xs text-[#4B5563] mt-0.5">
            IATA / ICAO AIRPORT INVENTORY, TERMINAL FACILITIES, AND FLIGHT CONNECTIONS
          </p>
        </div>
      </div>

      <Table columns={columns} data={destinations} />

      <Drawer
        isOpen={!!editingDest}
        onClose={() => setEditingDest(null)}
        title={editingDest ? `AIRPORT: ${editingDest.airportCode}` : ''}
        subtitle="UPDATE RUNWAY & TERMINAL CAPACITY TELEMETRY"
        footer={
          <div className="flex justify-between items-center">
            <button
              onClick={() => setEditingDest(null)}
              className="px-3 py-1.5 border border-[#E5E7EB] font-mono text-xs font-bold uppercase hover:bg-[#F5F5F5]"
            >
              DISCARD
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-black text-white hover:bg-[#DC2626] font-mono text-xs font-bold uppercase tracking-wider"
            >
              COMMIT CHANGES
            </button>
          </div>
        }
      >
        {editingDest && (
          <div className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-[10px] font-bold text-[#4B5563] uppercase mb-1">
                DESTINATION CITY / TITLE
              </label>
              <input
                type="text"
                value={editingDest.name}
                onChange={(e) =>
                  setEditingDest({ ...editingDest, name: e.target.value })
                }
                className="w-full h-9 px-2.5 bg-[#F5F5F5] border border-[#E5E7EB] font-sans text-xs text-black"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#4B5563] uppercase mb-1">
                OFFICIAL AIRPORT NAME
              </label>
              <input
                type="text"
                value={editingDest.airportName}
                onChange={(e) =>
                  setEditingDest({ ...editingDest, airportName: e.target.value })
                }
                className="w-full h-9 px-2.5 bg-[#F5F5F5] border border-[#E5E7EB] font-sans text-xs text-black"
              />
            </div>

            <ImageUploader
              value={editingDest.imageUrl}
              onChange={(url) =>
                setEditingDest({ ...editingDest, imageUrl: url })
              }
              label="AIRPORT PANORAMA MEDIA FRAME"
            />
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default DestinationPage;
