import React, { useState, useMemo } from 'react';
import { Booking } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { formatCurrency, formatDate, formatTime } from '../../utils/format';

interface CancelReservationModalProps {
  isOpen: boolean;
  booking: Booking | null;
  onClose: () => void;
  onConfirmCancel: (bookingId: string, reason: string, estimatedRefund: number) => Promise<void> | void;
}

export const CancelReservationModal: React.FC<CancelReservationModalProps> = ({
  isOpen,
  booking,
  onClose,
  onConfirmCancel,
}) => {
  const { t, language } = useLanguage();
  const isVi = language === 'vi';

  const [selectedReason, setSelectedReason] = useState<string>('PERSONAL');
  const [customReason, setCustomReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Calculate days remaining and refund percentage based on tiered policy
  const { diffDays, refundPercent, estimatedRefund, penaltyAmount } = useMemo(() => {
    if (!booking) {
      return { diffDays: 0, refundPercent: 0, estimatedRefund: 0, penaltyAmount: 0 };
    }

    const depDate = new Date(booking.departureTime || Date.now());
    const now = new Date();
    const diffTime = depDate.getTime() - now.getTime();
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let percent = 0;
    if (days >= 15) {
      percent = 100;
    } else if (days >= 7) {
      percent = 70;
    } else if (days >= 3) {
      percent = 40;
    } else {
      percent = 0;
    }

    const refund = Math.round((booking.totalPrice * percent) / 100);
    const penalty = booking.totalPrice - refund;

    return {
      diffDays: days > 0 ? days : 0,
      refundPercent: percent,
      estimatedRefund: refund,
      penaltyAmount: penalty,
    };
  }, [booking]);

  if (!isOpen || !booking) return null;

  const getFinalReason = (): string => {
    switch (selectedReason) {
      case 'PERSONAL':
        return t('bookings.cancelReasonOption1');
      case 'MEDICAL':
        return t('bookings.cancelReasonOption2');
      case 'REBOOK':
        return t('bookings.cancelReasonOption3');
      case 'CUSTOM':
      default:
        return customReason.trim() || t('bookings.cancelReasonOption4');
    }
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const reason = getFinalReason();
      await onConfirmCancel(booking.id, reason, estimatedRefund);
      onClose();
    } catch {
      // Handled upstream
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 swiss-fade-in">
      <div
        className="w-full max-w-xl bg-white border-2 border-black rounded-none shadow-none flex flex-col max-h-[90vh] overflow-hidden swiss-scale-in"
        role="dialog"
        aria-modal="true"
      >
        {/* Header - High contrast Swiss red alert */}
        <div className="bg-[#DC2626] text-white p-4 flex items-center justify-between border-b-2 border-black">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-white" />
            <h2 className="font-mono text-xs sm:text-sm font-black uppercase tracking-wider">
              {t('bookings.cancelModalTitle')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center bg-black hover:bg-white hover:text-black text-white font-mono text-xs font-bold transition-none border border-black"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 font-sans">
          {/* Section 1: PNR and Flight Dossier */}
          <div className="bg-[#F5F5F5] border border-[#E5E7EB] p-4 font-mono text-xs space-y-2">
            <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-2">
              <span className="text-[#4B5563] uppercase tracking-wider font-bold">
                [ 01 ] DOSSIER PNR CODE:
              </span>
              <span className="font-mono text-sm font-black text-black">
                {booking.bookingCode}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#4B5563] uppercase">HÀNH TRÌNH // ROUTE:</span>
              <span className="font-bold text-black">{booking.route}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#4B5563] uppercase">TOUR / CHUYẾN BAY:</span>
              <span className="font-bold text-black truncate max-w-[260px]" title={booking.tourTitle}>
                {booking.tourTitle}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#4B5563] uppercase">GIỜ KHỞI HÀNH:</span>
              <span className="font-bold text-black">
                {formatTime(booking.departureTime)} | {formatDate(booking.departureTime)}
              </span>
            </div>
          </div>

          {/* Section 2: Policy & Refund Breakdown Assessment */}
          <div className="border border-[#E5E7EB] p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2">
              <span className="font-mono text-[10px] font-bold text-[#DC2626] uppercase tracking-wider">
                [ 02 ] {t('bookings.cancelPolicyIntro')}
              </span>
              <span className="font-mono text-[10px] bg-black text-white px-2 py-0.5 font-bold">
                TIER POLICY v2.0
              </span>
            </div>

            {/* Days telemetry indicator */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-center">
              <div className="border border-[#E5E7EB] bg-[#F5F5F5] p-2">
                <div className="text-[9px] text-[#4B5563] uppercase">CÒN LẠI / DAYS</div>
                <div className="text-base font-black text-black">{diffDays} NGÀY</div>
              </div>
              <div className="border border-[#E5E7EB] bg-[#F5F5F5] p-2">
                <div className="text-[9px] text-[#4B5563] uppercase">TỶ LỆ HOÀN / TIER</div>
                <div className={`text-base font-black ${refundPercent > 0 ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                  {refundPercent}%
                </div>
              </div>
              <div className="border border-[#E5E7EB] bg-[#F5F5F5] p-2">
                <div className="text-[9px] text-[#4B5563] uppercase">TIỀN HOÀN / REFUND</div>
                <div className="text-base font-black text-[#16A34A]">
                  ${estimatedRefund}.00
                </div>
              </div>
              <div className="border border-[#E5E7EB] bg-[#F5F5F5] p-2">
                <div className="text-[9px] text-[#4B5563] uppercase">PHÍ PHẠT / PENALTY</div>
                <div className="text-base font-black text-[#DC2626]">
                  ${penaltyAmount}.00
                </div>
              </div>
            </div>

            {/* Policy Reference Rules Box */}
            <div className="bg-[#F9F9F9] border-l-2 border-black p-3 font-mono text-[11px] text-[#4B5563] space-y-1">
              <div className={diffDays >= 15 ? 'text-black font-bold' : ''}>
                • Trước ≥ 15 ngày: Hoàn tiền 100% giá trị đặt chỗ.
              </div>
              <div className={diffDays >= 7 && diffDays < 15 ? 'text-black font-bold' : ''}>
                • Trước 7 - 14 ngày: Hoàn tiền 70% (Phí hủy phạt 30%).
              </div>
              <div className={diffDays >= 3 && diffDays < 7 ? 'text-black font-bold' : ''}>
                • Trước 3 - 6 ngày: Hoàn tiền 40% (Phí hủy phạt 60%).
              </div>
              <div className={diffDays < 3 ? 'text-[#DC2626] font-bold' : ''}>
                • Trong vòng 48h khởi hành: Không hoàn tiền (Phí phạt 100%).
              </div>
            </div>

            {refundPercent === 0 && (
              <div className="border border-[#DC2626] bg-[#FEF2F2] p-2.5 font-mono text-[10px] text-[#DC2626] font-bold flex items-center gap-2">
                <span className="w-2 h-2 bg-[#DC2626]" />
                <span>{t('bookings.nonRefundableNotice')}</span>
              </div>
            )}
          </div>

          {/* Section 3: Reason Selection */}
          <div className="space-y-2">
            <label className="block font-mono text-[10px] font-bold text-black uppercase tracking-wider">
              [ 03 ] {t('bookings.cancelReasonLabel')}
            </label>

            <div className="space-y-1.5 font-mono text-xs">
              <label className="flex items-center gap-2 p-2 border border-[#E5E7EB] hover:border-black cursor-pointer bg-white">
                <input
                  type="radio"
                  name="cancelReason"
                  value="PERSONAL"
                  checked={selectedReason === 'PERSONAL'}
                  onChange={() => setSelectedReason('PERSONAL')}
                  className="rounded-none text-black focus:ring-0"
                />
                <span className="text-black font-medium">{t('bookings.cancelReasonOption1')}</span>
              </label>

              <label className="flex items-center gap-2 p-2 border border-[#E5E7EB] hover:border-black cursor-pointer bg-white">
                <input
                  type="radio"
                  name="cancelReason"
                  value="MEDICAL"
                  checked={selectedReason === 'MEDICAL'}
                  onChange={() => setSelectedReason('MEDICAL')}
                  className="rounded-none text-black focus:ring-0"
                />
                <span className="text-black font-medium">{t('bookings.cancelReasonOption2')}</span>
              </label>

              <label className="flex items-center gap-2 p-2 border border-[#E5E7EB] hover:border-black cursor-pointer bg-white">
                <input
                  type="radio"
                  name="cancelReason"
                  value="REBOOK"
                  checked={selectedReason === 'REBOOK'}
                  onChange={() => setSelectedReason('REBOOK')}
                  className="rounded-none text-black focus:ring-0"
                />
                <span className="text-black font-medium">{t('bookings.cancelReasonOption3')}</span>
              </label>

              <label className="flex items-center gap-2 p-2 border border-[#E5E7EB] hover:border-black cursor-pointer bg-white">
                <input
                  type="radio"
                  name="cancelReason"
                  value="CUSTOM"
                  checked={selectedReason === 'CUSTOM'}
                  onChange={() => setSelectedReason('CUSTOM')}
                  className="rounded-none text-black focus:ring-0"
                />
                <span className="text-black font-medium">{t('bookings.cancelReasonOption4')}</span>
              </label>

              {selectedReason === 'CUSTOM' && (
                <div className="pt-1">
                  <input
                    type="text"
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder={t('bookings.cancelReasonPlaceholder')}
                    className="w-full h-9 px-3 bg-[#F5F5F5] border border-black rounded-none font-mono text-xs text-black focus:outline-none"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#F5F5F5] border-t-2 border-black p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="font-mono text-[10px] text-[#4B5563] text-center sm:text-left">
            THAO TÁC NÀY KHÔNG THỂ HOÀN TÁC. GHẾ SẼ ĐƯỢC GIẢI PHÓNG.
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none px-4 py-2 bg-white border border-[#E5E7EB] hover:border-black text-black font-mono text-xs font-bold uppercase tracking-wider transition-none"
            >
              {t('bookings.cancelKeepBtn')}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none px-4 py-2 bg-[#DC2626] hover:bg-black text-white font-mono text-xs font-bold uppercase tracking-wider transition-none border border-[#DC2626] flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>ĐANG XỬ LÝ...</span>
              ) : (
                <span>{t('bookings.cancelConfirmBtn')}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelReservationModal;
