import React from 'react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  iconName?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'NO RECORDS IDENTIFIED',
  description = 'No matching aviation records found matching the active filtering parameters.',
  actionText,
  onAction,
  iconName = 'inbox',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white border border-[#E5E7EB] text-center my-6">
      <div className="w-12 h-12 bg-[#F5F5F5] border border-[#E5E7EB] flex items-center justify-center mb-4 text-[#4B5563]">
        <span className="material-symbols-outlined text-[24px]">{iconName}</span>
      </div>
      <div className="font-mono text-xs font-bold tracking-widest text-black uppercase mb-1">
        {title}
      </div>
      <p className="text-xs text-[#4B5563] max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-black text-white hover:bg-[#DC2626] font-mono text-[11px] font-bold uppercase tracking-wider transition-none border border-black flex items-center gap-2"
        >
          <span>{actionText}</span>
          <span className="text-xs">→</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;
