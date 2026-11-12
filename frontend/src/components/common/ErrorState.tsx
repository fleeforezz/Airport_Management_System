import React from 'react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'DISPATCH GATEWAY COMMUNICATION ERROR',
  message = 'Unable to establish secure telemetry with central airport servers (KJFK/SGN). Please verify connectivity.',
  onRetry,
}) => {
  return (
    <div className="p-6 bg-white border border-[#DC2626] my-6">
      <div className="flex items-start gap-4">
        <div className="w-8 h-8 bg-[#DC2626] text-white flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-[18px]">warning</span>
        </div>
        <div className="flex-1">
          <div className="font-mono text-xs font-bold text-[#DC2626] tracking-wider uppercase mb-1">
            {title}
          </div>
          <p className="text-xs text-[#4B5563] leading-relaxed mb-4">
            {message}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-3 py-1.5 bg-black text-white hover:bg-[#DC2626] font-mono text-[10px] font-bold uppercase tracking-wider transition-none flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[13px]">refresh</span>
              <span>RETRY CONNECTION</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
