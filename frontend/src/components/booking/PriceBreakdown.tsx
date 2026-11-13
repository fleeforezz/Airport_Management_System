import React from 'react';
import { formatCurrency } from '../../utils/format';

interface PriceBreakdownProps {
  basePrice: number;
  adultsCount: number;
  childrenCount: number;
  baggageFee?: number;
  baggagePackage?: string;
  discount?: number;
  couponCode?: string;
  currency?: 'USD' | 'VND';
}

export const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
  basePrice,
  adultsCount,
  childrenCount,
  baggageFee = 0,
  baggagePackage,
  discount = 0,
  couponCode,
  currency = 'USD',
}) => {
  const adultSubtotal = basePrice * adultsCount;
  const childSubtotal = Math.round(basePrice * 0.75 * childrenCount);
  const subtotal = adultSubtotal + childSubtotal;
  const total = Math.max(0, subtotal + baggageFee - discount);

  return (
    <div className="bg-white border border-[#E5E7EB] p-4 select-none">
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#E5E7EB]">
        <div className="font-mono text-[10px] font-bold tracking-wider uppercase text-black">
          AVIATION TARIFF & FARE BREAKDOWN
        </div>
        <span className="font-mono text-[9px] text-[#4B5563]">[ TARIFF_TABLE ]</span>
      </div>

      <div className="space-y-2 text-xs font-mono">
        {/* Adult fare row */}
        <div className="flex items-center justify-between text-[#4B5563]">
          <span>Adult Fare ({adultsCount} × {formatCurrency(basePrice, currency)})</span>
          <span className="font-bold text-black">{formatCurrency(adultSubtotal, currency)}</span>
        </div>

        {/* Child fare row */}
        {childrenCount > 0 && (
          <div className="flex items-center justify-between text-[#4B5563]">
            <span>Child Fare ({childrenCount} × {formatCurrency(Math.round(basePrice * 0.75), currency)})</span>
            <span className="font-bold text-black">{formatCurrency(childSubtotal, currency)}</span>
          </div>
        )}

        {/* Airport Tax row */}
        <div className="flex items-center justify-between text-[#4B5563]">
          <span>Airport Security Surcharges & Terminal Fees</span>
          <span className="text-[#22C55E] font-bold">ALL-INCLUDED ($0.00)</span>
        </div>

        {/* Baggage Surcharge row */}
        {baggageFee > 0 && (
          <div className="flex items-center justify-between text-black">
            <span>Baggage Surcharge ({baggagePackage || 'Extra Luggage'})</span>
            <span className="font-bold text-[#DC2626]">+{formatCurrency(baggageFee, currency)}</span>
          </div>
        )}

        {/* Discount row */}
        {discount > 0 && (
          <div className="flex items-center justify-between text-[#DC2626]">
            <span>Voucher Concession {couponCode ? `[${couponCode}]` : ''}</span>
            <span className="font-bold">-{formatCurrency(discount, currency)}</span>
          </div>
        )}

        {/* Grand Total Row */}
        <div className="pt-3 mt-2 border-t border-black flex items-baseline justify-between text-black">
          <div className="uppercase font-bold tracking-tight text-xs">
            TOTAL PAYABLE:
          </div>
          <div className="font-black text-lg text-[#DC2626]">
            {formatCurrency(total, currency)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceBreakdown;
