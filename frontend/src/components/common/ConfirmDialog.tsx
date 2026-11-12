import React from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'CONFIRM ACTION',
  cancelText = 'DISMISS',
  isDestructive = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-none p-4">
      <div className="bg-white border-2 border-black w-full max-w-md p-6 select-none animate-in fade-in zoom-in-95 duration-100">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 ${
                isDestructive ? 'bg-[#DC2626]' : 'bg-black'
              }`}
            />
            <span className="font-mono text-xs font-bold tracking-wider uppercase text-black">
              {title}
            </span>
          </div>
          <span className="font-mono text-[9px] text-[#4B5563]">[ DIALOG_VERIFY ]</span>
        </div>

        <p className="text-xs text-[#4B5563] leading-relaxed mb-6">{message}</p>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E7EB]">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-[#E5E7EB] text-black hover:bg-[#F5F5F5] font-mono text-[11px] font-bold uppercase tracking-wider transition-none"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white font-mono text-[11px] font-bold uppercase tracking-wider transition-none border ${
              isDestructive
                ? 'bg-[#DC2626] border-[#DC2626] hover:bg-black'
                : 'bg-black border-black hover:bg-[#DC2626]'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
