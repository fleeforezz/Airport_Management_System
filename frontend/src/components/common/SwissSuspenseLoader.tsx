import React from 'react';

interface SwissSuspenseLoaderProps {
  label?: string;
  fullScreen?: boolean;
}

export const SwissSuspenseLoader: React.FC<SwissSuspenseLoaderProps> = ({
  label = 'SYS_MODULE // LOADING VIEW',
  fullScreen = true,
}) => {
  return (
    <div
      className={`bg-[#F5F5F5] flex flex-col items-center justify-center p-6 ${
        fullScreen ? 'min-h-[70vh]' : 'py-16'
      }`}
    >
      <div className="max-w-sm w-full bg-white border border-black p-6 space-y-4">
        {/* Header Indicator */}
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#DC2626] animate-pulse" />
            <span className="font-mono text-[10px] font-bold tracking-widest uppercase text-black">
              SWISS AIRPORT SYSTEM
            </span>
          </div>
          <span className="font-mono text-[9px] text-[#737373] tracking-widest uppercase">
            [ 01 // SYNC ]
          </span>
        </div>

        {/* Status Line */}
        <div className="space-y-1">
          <div className="font-mono text-xs font-bold text-black uppercase tracking-wider">
            {label}
          </div>
          <div className="font-mono text-[10px] text-[#737373] uppercase tracking-widest">
            STREAMING ASSETS & COMPONENT CHUNKS
          </div>
        </div>

        {/* Minimal Hairline Progress Bar */}
        <div className="w-full bg-[#E5E7EB] h-1 overflow-hidden relative">
          <div className="swiss-loader-bar" />
        </div>
      </div>
    </div>
  );
};

export default SwissSuspenseLoader;
