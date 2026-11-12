import React, { useState } from 'react';
import { ItineraryDay } from '../../types';

interface ItineraryProps {
  days: ItineraryDay[];
}

export const Itinerary: React.FC<ItineraryProps> = ({ days }) => {
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

  const toggleDay = (dayNum: number) => {
    setExpandedDay((prev) => (prev === dayNum ? null : dayNum));
  };

  if (!days || days.length === 0) {
    return (
      <div className="p-4 bg-white border border-[#E5E7EB] font-mono text-xs text-[#9CA3AF]">
        Detailed operational flight schedule is being updated by the dispatch team.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {days.map((day) => {
        const isExpanded = expandedDay === day.dayNumber;
        return (
          <div
            key={day.dayNumber}
            className="bg-white border border-[#E5E7EB] hover:border-black transition-none"
          >
            {/* Header Clickable Row */}
            <button
              onClick={() => toggleDay(day.dayNumber)}
              className="w-full p-4 flex items-center justify-between text-left cursor-pointer transition-none select-none"
            >
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 bg-black text-white font-mono text-[10px] font-bold uppercase tracking-wider">
                  DAY {String(day.dayNumber).padStart(2, '0')}
                </span>
                <span className="font-bold text-xs md:text-sm text-black uppercase tracking-tight">
                  {day.title}
                </span>
              </div>
              <span className="font-mono text-sm font-bold text-[#4B5563]">
                {isExpanded ? '—' : '+'}
              </span>
            </button>

            {/* Expanded Body Content */}
            {isExpanded && (
              <div className="px-4 pb-4 pt-1 border-t border-[#E5E7EB] space-y-3">
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  {day.description}
                </p>

                {/* Key activities bullets */}
                {day.activities && day.activities.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <div className="font-mono text-[9px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                      KEY ACTIVITIES & FLIGHT MILESTONES:
                    </div>
                    <ul className="space-y-1">
                      {day.activities.map((act, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-black">
                          <span className="w-1 h-1 bg-[#DC2626]" />
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Stay & Meal Tags */}
                {(day.meals || day.stay) && (
                  <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#E5E7EB] font-mono text-[10px] text-[#4B5563]">
                    {day.meals && (
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">restaurant</span>
                        <span>Catering: {day.meals}</span>
                      </div>
                    )}
                    {day.stay && (
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">hotel</span>
                        <span>Accommodations: {day.stay}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Itinerary;
