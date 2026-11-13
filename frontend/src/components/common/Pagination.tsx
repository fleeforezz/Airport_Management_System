import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize?: number;
  totalPages?: number;
  onPageChange: (page: number) => void;
  className?: string;
  itemLabel?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  pageSize = 16,
  totalPages: propTotalPages,
  onPageChange,
  className = '',
  itemLabel,
}) => {
  const { language } = useLanguage();
  const isVi = language === 'vi';

  const totalPages = propTotalPages ?? Math.ceil(totalItems / pageSize);

  // If 16 or fewer items, no need to show pagination buttons
  if (totalPages <= 1) {
    return null;
  }

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Calculate sliding page window (e.g. at most 5 page numbers visible)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);

      if (currentPage <= 3) {
        start = 1;
        end = maxVisible;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - (maxVisible - 1);
        end = totalPages;
      }

      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages) {
        if (end < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div
      className={`bg-white border-2 border-black p-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono select-none ${className}`}
    >
      {/* Telemetry Indicator */}
      <div className="flex items-center gap-2 text-xs text-[#4B5563]">
        <span className="w-2 h-2 bg-[#DC2626] inline-block flex-shrink-0" />
        <span className="font-bold text-black uppercase">
          {isVi ? 'TRANG' : 'PAGE'} [ {String(currentPage).padStart(2, '0')} / {String(totalPages).padStart(2, '0')} ]
        </span>
        <span className="text-[#E5E7EB]">|</span>
        <span>
          {isVi ? 'HIỂN THỊ' : 'SHOWING'} {startItem}-{endItem} / {totalItems} {itemLabel || (isVi ? 'MỤC' : 'ITEMS')}
        </span>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-1 text-xs">
        {/* First Button */}
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
          className="h-8 px-2.5 border border-[#E5E7EB] hover:border-black font-bold uppercase transition-none disabled:opacity-30 disabled:pointer-events-none text-black hover:text-[#DC2626]"
          title={isVi ? 'Trang đầu' : 'First page'}
        >
          ««
        </button>

        {/* Previous Button */}
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="h-8 px-3 border border-[#E5E7EB] hover:border-black font-bold uppercase transition-none disabled:opacity-30 disabled:pointer-events-none text-black hover:text-[#DC2626] flex items-center gap-1"
        >
          <span>←</span>
          <span className="hidden md:inline">{isVi ? 'TRƯỚC' : 'PREV'}</span>
        </button>

        {/* Page Number Sequence */}
        <div className="flex items-center gap-1">
          {pages.map((p, idx) => {
            if (p === '...') {
              return (
                <span key={`dots-${idx}`} className="w-8 h-8 flex items-center justify-center text-[#9CA3AF]">
                  ...
                </span>
              );
            }

            const pageNum = p as number;
            const isActive = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                className={`w-8 h-8 border font-bold text-xs transition-none flex items-center justify-center ${
                  isActive
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-[#E5E7EB] hover:border-black hover:text-[#DC2626]'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="h-8 px-3 border border-[#E5E7EB] hover:border-black font-bold uppercase transition-none disabled:opacity-30 disabled:pointer-events-none text-black hover:text-[#DC2626] flex items-center gap-1"
        >
          <span className="hidden md:inline">{isVi ? 'SAU' : 'NEXT'}</span>
          <span>→</span>
        </button>

        {/* Last Button */}
        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
          className="h-8 px-2.5 border border-[#E5E7EB] hover:border-black font-bold uppercase transition-none disabled:opacity-30 disabled:pointer-events-none text-black hover:text-[#DC2626]"
          title={isVi ? 'Trang cuối' : 'Last page'}
        >
          »»
        </button>
      </div>
    </div>
  );
};

export default Pagination;
