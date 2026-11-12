import React from 'react';

interface GuestCounterProps {
  adults: number;
  childrenCount: number;
  onChange: (adults: number, children: number) => void;
  maxTotal?: number;
}

export const GuestCounter: React.FC<GuestCounterProps> = ({
  adults,
  childrenCount,
  onChange,
  maxTotal = 9,
}) => {
  const total = adults + childrenCount;

  const handleAdultChange = (delta: number) => {
    const nextVal = adults + delta;
    if (nextVal >= 1 && nextVal + childrenCount <= maxTotal) {
      onChange(nextVal, childrenCount);
    }
  };

  const handleChildChange = (delta: number) => {
    const nextVal = childrenCount + delta;
    if (nextVal >= 0 && adults + nextVal <= maxTotal) {
      onChange(adults, nextVal);
    }
  };

  return (
    <div className="space-y-3 select-none">
      <div className="font-mono text-[10px] font-bold text-[#4B5563] uppercase tracking-wider">
        PASSENGER ALLOCATION (MAXIMUM {maxTotal} GUESTS PER PNR):
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Adults control */}
        <div className="p-3 bg-white border border-[#E5E7EB] flex items-center justify-between">
          <div>
            <div className="font-bold text-xs text-black uppercase">
              ADULTS
            </div>
            <div className="font-mono text-[10px] text-[#4B5563]">
              Age 12+ years (Standard Fare)
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleAdultChange(-1)}
              disabled={adults <= 1}
              className="w-7 h-7 border border-[#E5E7EB] flex items-center justify-center font-mono text-sm font-bold text-black hover:bg-black hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-none"
            >
              -
            </button>
            <span className="w-8 text-center font-mono text-sm font-bold text-black">
              {adults}
            </span>
            <button
              type="button"
              onClick={() => handleAdultChange(1)}
              disabled={total >= maxTotal}
              className="w-7 h-7 border border-[#E5E7EB] flex items-center justify-center font-mono text-sm font-bold text-black hover:bg-black hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-none"
            >
              +
            </button>
          </div>
        </div>

        {/* Children control */}
        <div className="p-3 bg-white border border-[#E5E7EB] flex items-center justify-between">
          <div>
            <div className="font-bold text-xs text-black uppercase">
              CHILDREN
            </div>
            <div className="font-mono text-[10px] text-[#4B5563]">
              Age 2 — 11 years (75% Base Fare)
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleChildChange(-1)}
              disabled={childrenCount <= 0}
              className="w-7 h-7 border border-[#E5E7EB] flex items-center justify-center font-mono text-sm font-bold text-black hover:bg-black hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-none"
            >
              -
            </button>
            <span className="w-8 text-center font-mono text-sm font-bold text-black">
              {childrenCount}
            </span>
            <button
              type="button"
              onClick={() => handleChildChange(1)}
              disabled={total >= maxTotal}
              className="w-7 h-7 border border-[#E5E7EB] flex items-center justify-center font-mono text-sm font-bold text-black hover:bg-black hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-none"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestCounter;
