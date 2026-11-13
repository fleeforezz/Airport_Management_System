import React, { useState, useEffect } from 'react';
import { Coupon } from '../../types';
import Table, { Column } from '../components/Table';
import Drawer from '../components/Drawer';
import { formatCurrency, formatDate } from '../../utils/format';
import { couponApi } from '../../services/api';

export const CouponPage: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    let isMounted = true;
    couponApi.getAll().then((res) => {
      if (isMounted && res.success && res.data && res.data.length > 0) {
        setCoupons(res.data);
      }
    }).catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenNew = () => {
    setIsNew(true);
    setEditingCoupon({
      id: `CPN-${Math.floor(10 + Math.random() * 90)}`,
      code: 'NEWPROMO2026',
      description: 'Seasonal aviation concession campaign',
      discountPercent: 10,
      minSpend: 200,
      maxDiscount: 100,
      validUntil: '2026-12-31T23:59:59Z',
      usageCount: 0,
      isActive: true,
    });
  };

  const handleSave = () => {
    if (!editingCoupon) return;
    if (isNew) {
      setCoupons([editingCoupon, ...coupons]);
    } else {
      setCoupons(coupons.map((c) => (c.id === editingCoupon.id ? editingCoupon : c)));
    }
    setEditingCoupon(null);
  };

  const columns: Column<Coupon>[] = [
    {
      key: 'code',
      header: 'CONCESSION CODE',
      render: (row) => (
        <span className="px-2 py-0.5 bg-black text-white font-mono font-black text-xs">
          {row.code}
        </span>
      ),
    },
    {
      key: 'discountPercent',
      header: 'DISCOUNT VALUE',
      render: (row) => (
        <span className="font-bold text-[#DC2626]">
          {row.discountPercent ? `-${row.discountPercent}%` : formatCurrency(row.discountAmount || 0)}
        </span>
      ),
    },
    {
      key: 'minSpend',
      header: 'MINIMUM SPEND',
      render: (row) => <span>{formatCurrency(row.minSpend)}</span>,
    },
    {
      key: 'validUntil',
      header: 'EXPIRATION',
      render: (row) => <span>{formatDate(row.validUntil)}</span>,
    },
    {
      key: 'usageCount',
      header: 'REDEMPTIONS',
      render: (row) => <span>{row.usageCount} times</span>,
    },
    {
      key: 'isActive',
      header: 'STATUS',
      render: (row) => (
        <span
          className={`px-1.5 py-0.5 text-[9px] font-mono font-bold ${
            row.isActive ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-[#DC2626]/10 text-[#DC2626]'
          }`}
        >
          {row.isActive ? 'ACTIVE' : 'EXPIRED'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'ACTION',
      align: 'right',
      render: (row) => (
        <button
          onClick={() => {
            setIsNew(false);
            setEditingCoupon(row);
          }}
          className="px-2 py-1 bg-black text-white hover:bg-[#DC2626] font-mono text-[10px] font-bold uppercase transition-none"
        >
          EDIT
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
              TARIFF MANAGEMENT & PROMO CONCESSIONS
            </h1>
          </div>
          <p className="font-mono text-xs text-[#4B5563] mt-0.5">
            PROMOTIONAL CAMPAIGNS, VOUCHER CONCESSIONS, AND PRIVILEGE DISCOUNTS
          </p>
        </div>
        <button
          onClick={handleOpenNew}
          className="px-4 py-2 bg-black hover:bg-[#DC2626] text-white font-mono text-xs font-bold uppercase tracking-wider transition-none flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>+ CREATE PROMO CODE</span>
        </button>
      </div>

      <Table columns={columns} data={coupons} />

      <Drawer
        isOpen={!!editingCoupon}
        onClose={() => setEditingCoupon(null)}
        title={isNew ? 'CREATE CONCESSION CODE' : `EDIT: ${editingCoupon?.code}`}
        subtitle="CONFIGURE VALIDITY WINDOW AND APPLICABILITY RULES"
        footer={
          <div className="flex justify-between items-center">
            <button
              onClick={() => setEditingCoupon(null)}
              className="px-3 py-1.5 border border-[#E5E7EB] font-mono text-xs font-bold uppercase hover:bg-[#F5F5F5]"
            >
              DISCARD
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-black text-white hover:bg-[#DC2626] font-mono text-xs font-bold uppercase tracking-wider"
            >
              COMMIT CONCESSION
            </button>
          </div>
        }
      >
        {editingCoupon && (
          <div className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-[10px] font-bold text-[#4B5563] uppercase mb-1">
                CONCESSION CODE (UPPERCASE)
              </label>
              <input
                type="text"
                value={editingCoupon.code}
                onChange={(e) =>
                  setEditingCoupon({ ...editingCoupon, code: e.target.value.toUpperCase() })
                }
                className="w-full h-9 px-2.5 bg-[#F5F5F5] border border-[#E5E7EB] font-mono text-xs text-black uppercase"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#4B5563] uppercase mb-1">
                CAMPAIGN DESCRIPTION
              </label>
              <input
                type="text"
                value={editingCoupon.description}
                onChange={(e) =>
                  setEditingCoupon({ ...editingCoupon, description: e.target.value })
                }
                className="w-full h-9 px-2.5 bg-[#F5F5F5] border border-[#E5E7EB] font-sans text-xs text-black"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-[#4B5563] uppercase mb-1">
                  DISCOUNT PERCENTAGE (%)
                </label>
                <input
                  type="number"
                  value={editingCoupon.discountPercent || 0}
                  onChange={(e) =>
                    setEditingCoupon({
                      ...editingCoupon,
                      discountPercent: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full h-9 px-2.5 bg-[#F5F5F5] border border-[#E5E7EB] font-mono text-xs text-black"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#4B5563] uppercase mb-1">
                  MINIMUM ORDER SPEND ($)
                </label>
                <input
                  type="number"
                  value={editingCoupon.minSpend}
                  onChange={(e) =>
                    setEditingCoupon({
                      ...editingCoupon,
                      minSpend: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full h-9 px-2.5 bg-[#F5F5F5] border border-[#E5E7EB] font-mono text-xs text-black"
                />
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default CouponPage;
