import React, { useState, useEffect } from 'react';
import { Airline } from '../../types';
import Table, { Column } from '../components/Table';
import Drawer from '../components/Drawer';
import { airlineApi } from '../../services/api';

const MOCK_AIRLINES: Airline[] = [
  { id: 1, code: 'VN', name: 'Vietnam Airlines', country: 'Vietnam', isActive: true },
  { id: 2, code: 'VJ', name: 'VietJet Air', country: 'Vietnam', isActive: true },
  { id: 3, code: 'QH', name: 'Bamboo Airways', country: 'Vietnam', isActive: true },
  { id: 4, code: 'VU', name: 'Vietravel Airlines', country: 'Vietnam', isActive: true },
  { id: 5, code: 'SQ', name: 'Singapore Airlines', country: 'Singapore', isActive: true },
  { id: 6, code: 'TG', name: 'Thai Airways', country: 'Thailand', isActive: true },
  { id: 7, code: 'NH', name: 'All Nippon Airways (ANA)', country: 'Japan', isActive: true },
  { id: 8, code: 'KE', name: 'Korean Air', country: 'South Korea', isActive: true },
];

export const AirlinesPage: React.FC = () => {
  const [airlines, setAirlines] = useState<Airline[]>(MOCK_AIRLINES);
  const [editingAirline, setEditingAirline] = useState<Partial<Airline> | null>(null);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    let isMounted = true;
    airlineApi.getAll().then((res) => {
      if (isMounted && res.success && res.data && res.data.length > 0) {
        setAirlines(res.data);
      }
    }).catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenNew = () => {
    setIsNew(true);
    setEditingAirline({
      code: '',
      name: '',
      country: 'Vietnam',
      isActive: true,
    });
  };

  const handleSave = async () => {
    if (!editingAirline || !editingAirline.code || !editingAirline.name) return;
    try {
      if (isNew) {
        const res = await airlineApi.create(editingAirline);
        if (res.success && res.data) {
          setAirlines([res.data, ...airlines]);
        } else {
          setAirlines([{ ...editingAirline, id: Date.now() } as Airline, ...airlines]);
        }
      } else if (editingAirline.id) {
        await airlineApi.update(editingAirline.id, editingAirline);
        setAirlines(airlines.map((a) => (a.id === editingAirline.id ? ({ ...a, ...editingAirline } as Airline) : a)));
      }
    } catch {
      // Local fallback
      if (isNew) {
        setAirlines([{ ...editingAirline, id: Date.now() } as Airline, ...airlines]);
      } else {
        setAirlines(airlines.map((a) => (a.id === editingAirline.id ? ({ ...a, ...editingAirline } as Airline) : a)));
      }
    }
    setEditingAirline(null);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Confirm removing carrier airline from operational database?')) return;
    try {
      await airlineApi.delete(id);
    } catch {}
    setAirlines(airlines.filter((a) => a.id !== id));
  };

  const columns: Column<Airline>[] = [
    {
      key: 'code',
      header: 'IATA CODE',
      render: (row) => (
        <span className="font-mono font-black text-black bg-[#F5F5F5] px-2 py-1 border border-[#E5E7EB]">
          {row.code}
        </span>
      ),
    },
    {
      key: 'name',
      header: 'AIRLINE CARRIER NAME',
      render: (row) => (
        <div>
          <div className="font-bold text-black">{row.name}</div>
          <div className="font-mono text-[10px] text-[#4B5563]">REGISTERED FLEET PARTNER</div>
        </div>
      ),
    },
    {
      key: 'country',
      header: 'REGISTRATION DOMAIN',
      render: (row) => <span className="font-mono text-xs">{row.country || 'International'}</span>,
    },
    {
      key: 'status',
      header: 'STATUS',
      render: (row) => (
        <span
          className={`font-mono text-[10px] px-2 py-0.5 font-bold ${
            row.isActive
              ? 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30'
              : 'bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/30'
          }`}
        >
          {row.isActive ? 'ACTIVE PARTNER' : 'GROUNDED'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'ACTIONS',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => {
              setIsNew(false);
              setEditingAirline(row);
            }}
            className="px-2 py-1 bg-black text-white hover:bg-[#DC2626] font-mono text-[10px] font-bold uppercase transition-none"
          >
            EDIT
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="px-2 py-1 border border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626] hover:text-white font-mono text-[10px] font-bold uppercase transition-none"
          >
            DELETE
          </button>
        </div>
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
              PARTNER AIRLINES & CARRIER DIRECTORY
            </h1>
          </div>
          <p className="font-mono text-xs text-[#4B5563] mt-0.5">
            AUTHORIZED CIVIL AVIATION CARRIERS SUPPORTED ACROSS EXPEDITIONS
          </p>
        </div>
        <button
          onClick={handleOpenNew}
          className="px-4 py-2 bg-black hover:bg-[#DC2626] text-white font-mono text-xs font-bold uppercase tracking-wider transition-none flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>+ REGISTER NEW AIRLINE</span>
        </button>
      </div>

      <Table columns={columns} data={airlines} />

      {/* Airline Edit / Create Drawer */}
      <Drawer
        isOpen={!!editingAirline}
        onClose={() => setEditingAirline(null)}
        title={isNew ? 'REGISTER PARTNER AIRLINE' : `EDIT CARRIER: ${editingAirline?.code}`}
        subtitle="CIVIL AVIATION OPERATOR PROFILE"
        footer={
          <div className="flex items-center justify-between">
            <button
              onClick={() => setEditingAirline(null)}
              className="px-3 py-1.5 border border-[#E5E7EB] font-mono text-xs font-bold uppercase hover:bg-[#F5F5F5]"
            >
              DISCARD
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-black text-white hover:bg-[#DC2626] font-mono text-xs font-bold uppercase tracking-wider"
            >
              SAVE AIRLINE RECORD
            </button>
          </div>
        }
      >
        {editingAirline && (
          <div className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-[10px] font-bold text-[#4B5563] uppercase mb-1">
                IATA CODE (2 CHARACTERS) *
              </label>
              <input
                type="text"
                maxLength={3}
                value={editingAirline.code || ''}
                onChange={(e) =>
                  setEditingAirline({ ...editingAirline, code: e.target.value.toUpperCase() })
                }
                placeholder="e.g. VN, VJ, SQ"
                className="w-full h-9 px-2.5 bg-[#F5F5F5] border border-[#E5E7EB] font-mono text-xs text-black"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#4B5563] uppercase mb-1">
                OFFICIAL AIRLINE NAME *
              </label>
              <input
                type="text"
                value={editingAirline.name || ''}
                onChange={(e) =>
                  setEditingAirline({ ...editingAirline, name: e.target.value })
                }
                placeholder="e.g. Vietnam Airlines"
                className="w-full h-9 px-2.5 bg-[#F5F5F5] border border-[#E5E7EB] font-sans text-xs text-black"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#4B5563] uppercase mb-1">
                COUNTRY OF INCORPORATION
              </label>
              <input
                type="text"
                value={editingAirline.country || ''}
                onChange={(e) =>
                  setEditingAirline({ ...editingAirline, country: e.target.value })
                }
                placeholder="e.g. Vietnam, Singapore, Japan"
                className="w-full h-9 px-2.5 bg-[#F5F5F5] border border-[#E5E7EB] font-mono text-xs text-black"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingAirline.isActive ?? true}
                  onChange={(e) =>
                    setEditingAirline({ ...editingAirline, isActive: e.target.checked })
                  }
                  className="accent-black w-4 h-4"
                />
                <span className="font-bold text-black uppercase text-[11px]">
                  OPERATIONAL STATUS: ACTIVE (AUTHORIZED FOR BOOKINGS)
                </span>
              </label>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default AirlinesPage;
