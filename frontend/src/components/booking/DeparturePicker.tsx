import React from 'react';
import { Departure } from '../../types';
import { formatTime, formatDate, formatCurrency } from '../../utils/format';

interface DeparturePickerProps {
  departures: Departure[];
  selectedId?: string;
  onSelect: (departure: Departure) => void;
}

export const DeparturePicker: React.FC<DeparturePickerProps> = ({
  departures,
  selectedId,
  onSelect,
}) => {
  if (!departures || departures.length === 0) {
    return (
      <div className="p-4 bg-white border border-[#E5E7EB] font-mono text-xs text-[#4B5563]">
        No scheduled flight departures available for this route corridor in the upcoming schedule.
      </div>
    );
  }

  return (
    <div className="space-y-2 select-none">
      <div className="font-mono text-[10px] font-bold text-[#4B5563] uppercase tracking-wider mb-2">
        SELECT SCHEDULED DEPARTURE & AIR CARRIER:
      </div>

      <div className="grid grid-cols-1 gap-2">
        {departures.map((dep) => {
          const isSelected = dep.id === selectedId;
          const isLowSeats = dep.seatsAvailable <= 10;

          return (
            <div
              key={dep.id}
              onClick={() => onSelect(dep)}
              className={`p-3.5 border transition-none cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isSelected
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-black border-[#E5E7EB] hover:border-black'
              }`}
            >
              {/* Flight & Route */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 flex items-center justify-center border ${
                    isSelected ? 'border-white bg-[#DC2626]' : 'border-black bg-white'
                  }`}
                >
                  {isSelected && <span className="w-2 h-2 bg-white" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold">
                      {dep.flightNumber}
                    </span>
                    <span
                      className={`text-[9px] font-mono uppercase px-1.5 py-0.5 ${
                        isSelected
                          ? 'bg-[#262626] text-white'
                          : 'bg-[#F5F5F5] text-[#4B5563]'
                      }`}
                    >
                      {dep.departureAirport} → {dep.arrivalAirport}
                    </span>
                    {dep.aircraftModel && (
                      <span className="font-mono text-[9px] text-[#9CA3AF] hidden md:inline">
                        {dep.aircraftModel}
                      </span>
                    )}
                  </div>
                  <div
                    className={`font-mono text-[11px] mt-0.5 ${
                      isSelected ? 'text-[#E5E7EB]' : 'text-[#4B5563]'
                    }`}
                  >
                    Departure: <strong className={isSelected ? 'text-white' : 'text-black'}>{formatTime(dep.departureTime)}</strong> ({formatDate(dep.departureTime)})
                  </div>
                </div>
              </div>

              {/* Seats & Price */}
              <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-current/20">
                <div className="text-right">
                  <div className="font-mono text-sm font-black">
                    {formatCurrency(dep.price)}
                  </div>
                  <div
                    className={`font-mono text-[9px] ${
                      isLowSeats
                        ? isSelected
                          ? 'text-[#FF8080]'
                          : 'text-[#DC2626] font-bold'
                        : isSelected
                        ? 'text-[#9CA3AF]'
                        : 'text-[#4B5563]'
                    }`}
                  >
                    {dep.seatsAvailable} seats available
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DeparturePicker;
