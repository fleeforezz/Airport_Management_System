import React from 'react';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  message = 'SYNCHRONIZING AVIATION TELEMETRY...',
  fullScreen = false,
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center select-none">
      <div className="flex items-center gap-1.5 mb-3">
        <div className="w-2.5 h-2.5 bg-black animate-pulse" />
        <div className="w-2.5 h-2.5 bg-[#DC2626] animate-pulse delay-75" />
        <div className="w-2.5 h-2.5 bg-black animate-pulse delay-150" />
      </div>
      <div className="font-mono text-[11px] font-bold tracking-widest uppercase text-black">
        {message}
      </div>
      <div className="font-mono text-[9px] text-[#4B5563] tracking-wider mt-1">
        TELEMETRY LATENCY: 12MS // SWISS 2.0
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#F5F5F5]/90 backdrop-blur-none border border-[#000000]">
        {content}
      </div>
    );
  }

  return content;
};

export default Loading;
