import React, { useEffect } from 'react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  width?: string;
  footer?: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  width = 'max-w-xl',
  footer,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 select-none animate-in fade-in duration-100">
      <div
        className={`w-full ${width} bg-white border-l-2 border-black h-full flex flex-col justify-between shadow-none animate-in slide-in-from-right duration-150`}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F5F5F5]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#DC2626]" />
              <h2 className="font-mono text-sm font-black uppercase text-black">
                {title}
              </h2>
            </div>
            {subtitle && (
              <p className="font-mono text-[9px] text-[#4B5563] mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 border border-[#E5E7EB] bg-white flex items-center justify-center font-mono text-sm text-[#4B5563] hover:text-black hover:border-black transition-none"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-4 border-t border-[#E5E7EB] bg-[#F5F5F5]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Drawer;
