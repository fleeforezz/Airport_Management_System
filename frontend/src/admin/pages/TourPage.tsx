import React, { useState, useEffect } from 'react';
import { Tour } from '../../types';
import Table, { Column } from '../components/Table';
import Drawer from '../components/Drawer';
import ImageUploader from '../components/ImageUploader';
import { formatCurrency, formatDurationDays } from '../../utils/format';
import { tourApi } from '../../services/api';

export const TourPage: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    let isMounted = true;
    tourApi.getAll().then((res) => {
      if (isMounted && res.success && res.data && res.data.length > 0) {
        setTours(res.data);
      }
    }).catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenNew = () => {
    setIsNew(true);
    setEditingTour({
      id: `TOUR-${Math.floor(100 + Math.random() * 900)}`,
      code: 'VN-NEW-01',
      title: 'New Air Charter Package',
      subtitle: 'Premier flight experience compliant with international aviation standards',
      destinationId: 'DEST-01',
      destinationName: 'Da Nang — Hoi An',
      price: 250,
      durationDays: 3,
      durationNights: 2,
      departureCity: 'Ho Chi Minh City (SGN)',
      transportType: 'FLIGHT',
      airlineName: 'Vietnam Airlines',
      featuredImage: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80',
      galleryImages: [],
      highlights: ['Round-trip flight ticket', '5-star hotel accommodations'],
      itinerary: [],
      rating: 5.0,
      reviewsCount: 0,
      status: 'ACTIVE',
    });
  };

  const handleSaveTour = async () => {
    if (!editingTour) return;
    try {
      if (isNew) {
        const res = await tourApi.create(editingTour);
        if (res.success && res.data) {
          setTours([res.data, ...tours]);
        } else {
          setTours([editingTour, ...tours]);
        }
      } else {
        await tourApi.update(editingTour.id, editingTour);
        setTours(tours.map((t) => (t.id === editingTour.id ? editingTour : t)));
      }
    } catch {
      if (isNew) {
        setTours([editingTour, ...tours]);
      } else {
        setTours(tours.map((t) => (t.id === editingTour.id ? editingTour : t)));
      }
    }
    setEditingTour(null);
  };

  const handleDeleteTour = async (id: string) => {
    if (!window.confirm('Delete this aviation tour package from catalog?')) return;
    try {
      await tourApi.delete(id);
    } catch {}
    setTours(tours.filter((t) => t.id !== id));
  };

  const columns: Column<Tour>[] = [
    {
      key: 'code',
      header: 'TOUR CODE',
      render: (row) => <span className="font-bold text-black">{row.code}</span>,
    },
    {
      key: 'title',
      header: 'PACKAGE TITLE & ITINERARY',
      render: (row) => (
        <div>
          <div className="font-bold text-black max-w-sm truncate">{row.title}</div>
          <div className="text-[10px] text-[#4B5563]">{row.subtitle}</div>
        </div>
      ),
    },
    {
      key: 'destinationName',
      header: 'DESTINATION',
      render: (row) => <span>{row.destinationName}</span>,
    },
    {
      key: 'duration',
      header: 'DURATION',
      render: (row) => (
        <span>{formatDurationDays(row.durationDays, row.durationNights)}</span>
      ),
    },
    {
      key: 'price',
      header: 'BASE FARE',
      align: 'right',
      render: (row) => (
        <span className="font-black text-black">{formatCurrency(row.price)}</span>
      ),
    },
    {
      key: 'airlineName',
      header: 'AIR CARRIER',
      render: (row) => (
        <span className="px-1.5 py-0.5 bg-[#F5F5F5] border border-[#E5E7EB] font-bold">
          {row.airlineName}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'ACTION',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => {
              setIsNew(false);
              setEditingTour(row);
            }}
            className="px-2 py-1 bg-black text-white hover:bg-[#DC2626] font-mono text-[10px] font-bold uppercase transition-none"
          >
            EDIT
          </button>
          <button
            onClick={() => handleDeleteTour(row.id)}
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
              FLIGHT PACKAGES & AIR CHARTERS (TOUR OPERATIONS)
            </h1>
          </div>
          <p className="font-mono text-xs text-[#4B5563] mt-0.5">
            CATALOG CONFIGURATION, BASE TARIFFS, AND PARTNERING CARRIERS
          </p>
        </div>
        <button
          onClick={handleOpenNew}
          className="px-4 py-2 bg-black hover:bg-[#DC2626] text-white font-mono text-xs font-bold uppercase tracking-wider transition-none flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>+ CREATE NEW FLIGHT PACKAGE</span>
        </button>
      </div>

      <Table columns={columns} data={tours} />

      {/* Tour Edit / Create Drawer */}
      <Drawer
        isOpen={!!editingTour}
        onClose={() => setEditingTour(null)}
        title={isNew ? 'CREATE NEW FLIGHT PACKAGE' : `EDIT SPECS: ${editingTour?.code}`}
        subtitle="CONFIGURE FLIGHT ITINERARY DISPATCH TELEMETRY"
        footer={
          <div className="flex items-center justify-between">
            <button
              onClick={() => setEditingTour(null)}
              className="px-3 py-1.5 border border-[#E5E7EB] font-mono text-xs font-bold uppercase hover:bg-[#F5F5F5]"
            >
              DISCARD
            </button>
            <button
              onClick={handleSaveTour}
              className="px-4 py-2 bg-black text-white hover:bg-[#DC2626] font-mono text-xs font-bold uppercase tracking-wider"
            >
              COMMIT CHANGES
            </button>
          </div>
        }
      >
        {editingTour && (
          <div className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-[10px] font-bold text-[#4B5563] uppercase mb-1">
                PACKAGE TITLE *
              </label>
              <input
                type="text"
                value={editingTour.title}
                onChange={(e) =>
                  setEditingTour({ ...editingTour, title: e.target.value })
                }
                className="w-full h-9 px-2.5 bg-[#F5F5F5] border border-[#E5E7EB] font-sans text-xs text-black"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-[#4B5563] uppercase mb-1">
                  FLIGHT/TOUR CODE *
                </label>
                <input
                  type="text"
                  value={editingTour.code}
                  onChange={(e) =>
                    setEditingTour({ ...editingTour, code: e.target.value })
                  }
                  className="w-full h-9 px-2.5 bg-[#F5F5F5] border border-[#E5E7EB] font-mono text-xs text-black"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#4B5563] uppercase mb-1">
                  BASE FARE (USD) *
                </label>
                <input
                  type="number"
                  value={editingTour.price}
                  onChange={(e) =>
                    setEditingTour({
                      ...editingTour,
                      price: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full h-9 px-2.5 bg-[#F5F5F5] border border-[#E5E7EB] font-mono text-xs text-black"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-[#4B5563] uppercase mb-1">
                  AIR CARRIER
                </label>
                <input
                  type="text"
                  value={editingTour.airlineName}
                  onChange={(e) =>
                    setEditingTour({
                      ...editingTour,
                      airlineName: e.target.value,
                    })
                  }
                  className="w-full h-9 px-2.5 bg-[#F5F5F5] border border-[#E5E7EB] font-mono text-xs text-black"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#4B5563] uppercase mb-1">
                  ORIGIN GATEWAY
                </label>
                <input
                  type="text"
                  value={editingTour.departureCity}
                  onChange={(e) =>
                    setEditingTour({
                      ...editingTour,
                      departureCity: e.target.value,
                    })
                  }
                  className="w-full h-9 px-2.5 bg-[#F5F5F5] border border-[#E5E7EB] font-mono text-xs text-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#4B5563] uppercase mb-1">
                BAGGAGE ALLOWANCE SPECIFICATIONS & POLICY
              </label>
              <textarea
                rows={2}
                value={editingTour.baggagePolicy || ''}
                onChange={(e) =>
                  setEditingTour({
                    ...editingTour,
                    baggagePolicy: e.target.value,
                  })
                }
                placeholder="e.g. Standard 7kg cabin carry-on + 20kg checked luggage included. Extra luggage packages available."
                className="w-full p-2 bg-[#F5F5F5] border border-[#E5E7EB] font-sans text-xs text-black"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#4B5563] uppercase mb-1">
                TOUR CANCELLATION & REFUND POLICY TERMS
              </label>
              <textarea
                rows={2}
                value={editingTour.cancellationPolicy || ''}
                onChange={(e) =>
                  setEditingTour({
                    ...editingTour,
                    cancellationPolicy: e.target.value,
                  })
                }
                placeholder="e.g. >=15 days: 100% refund, 7-14 days: 70% refund, 3-6 days: 40% refund, <48h: 0% refund."
                className="w-full p-2 bg-[#F5F5F5] border border-[#E5E7EB] font-sans text-xs text-black"
              />
            </div>

            {/* Image Uploader */}
            <ImageUploader
              value={editingTour.featuredImage}
              onChange={(url) =>
                setEditingTour({ ...editingTour, featuredImage: url })
              }
              label="REPRESENTATIVE AIRCRAFT / RESORT MEDIA FRAME"
            />
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default TourPage;
