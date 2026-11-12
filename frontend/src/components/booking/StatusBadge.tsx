import React from 'react';
import { BookingStatus } from '../../types';

interface StatusBadgeProps {
  status: BookingStatus | 'ON_TIME' | 'DELAYED' | 'CANCELLED' | 'BOARDING' | 'ACTIVE' | 'DRAFT';
  label?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  let indicatorColor = 'bg-black';
  let displayLabel = label || status;

  switch (status) {
    case 'PAID':
    case 'CONFIRMED':
    case 'ON_TIME':
    case 'ACTIVE':
      indicatorColor = 'bg-[#22C55E]';
      displayLabel = label || (status === 'PAID' ? 'PAID' : status === 'CONFIRMED' ? 'CONFIRMED' : 'ON TIME');
      break;

    case 'PENDING':
    case 'BOARDING':
    case 'DRAFT':
      indicatorColor = 'bg-[#F59E0B]';
      displayLabel = label || (status === 'PENDING' ? 'PENDING PAYMENT' : 'BOARDING');
      break;

    case 'CANCELLED':
    case 'DELAYED':
      indicatorColor = 'bg-[#DC2626]';
      displayLabel = label || (status === 'CANCELLED' ? 'CANCELLED' : 'DELAYED');
      break;

    case 'COMPLETED':
      indicatorColor = 'bg-black';
      displayLabel = label || 'COMPLETED';
      break;
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#F5F5F5] border border-[#E5E7EB] text-black font-mono text-[10px] font-bold uppercase tracking-wider select-none">
      <span className={`w-1.5 h-1.5 ${indicatorColor} inline-block flex-shrink-0`} />
      <span>{displayLabel}</span>
    </span>
  );
};

export default StatusBadge;
