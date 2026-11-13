import React, { useState } from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T, index: number) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField?: keyof T;
  emptyMessage?: string;
  pageSize?: number;
  enablePagination?: boolean;
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
  keyField = 'id',
  emptyMessage = 'No telemetry records located within active matrix.',
  pageSize = 16,
  enablePagination = true,
}: TableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  if (!data || data.length === 0) {
    return (
      <div className="p-8 bg-white border border-[#E5E7EB] text-center font-mono text-xs text-[#4B5563]">
        {emptyMessage}
      </div>
    );
  }

  const shouldPaginate = enablePagination && data.length > pageSize;
  const totalPages = shouldPaginate ? Math.ceil(data.length / pageSize) : 1;
  const validPage = Math.min(Math.max(1, currentPage), totalPages);

  const displayData = shouldPaginate
    ? data.slice((validPage - 1) * pageSize, validPage * pageSize)
    : data;

  const startItem = (validPage - 1) * pageSize + 1;
  const endItem = Math.min(validPage * pageSize, data.length);

  return (
    <div className="w-full bg-white border border-[#E5E7EB] select-none space-y-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse font-sans text-xs">
          {/* Table Header */}
          <thead>
            <tr className="bg-[#F5F5F5] border-b border-[#E5E7EB]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  className={`py-2.5 px-3 font-mono text-[10px] font-bold text-[#4B5563] uppercase tracking-wider ${
                    col.align === 'right'
                      ? 'text-right'
                      : col.align === 'center'
                      ? 'text-center'
                      : 'text-left'
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[#E5E7EB]">
            {displayData.map((row, idx) => {
              const rowKey = row[keyField] || idx;
              return (
                <tr
                  key={rowKey}
                  className="hover:bg-[#F9F9F9] transition-none text-black"
                >
                  {columns.map((col) => {
                    const cellValue = row[col.key];
                    return (
                      <td
                        key={col.key}
                        className={`py-2.5 px-3 font-mono text-xs ${
                          col.align === 'right'
                            ? 'text-right'
                            : col.align === 'center'
                            ? 'text-center'
                            : 'text-left'
                        }`}
                      >
                        {col.render ? col.render(row, (validPage - 1) * pageSize + idx) : String(cellValue ?? '')}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Swiss Modernism 2.0 Pagination Bar if data > 16 */}
      {shouldPaginate && (
        <div className="p-3 bg-[#F5F5F5] border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
          <div className="flex items-center gap-2 text-[#4B5563]">
            <span className="w-1.5 h-1.5 bg-[#DC2626] inline-block" />
            <span className="font-bold text-black uppercase">
              PAGE [ {String(validPage).padStart(2, '0')} / {String(totalPages).padStart(2, '0')} ]
            </span>
            <span className="text-[#D1D5DB]">|</span>
            <span>
              SHOWING {startItem}-{endItem} OF {data.length} RECORDS
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={validPage === 1}
              onClick={() => setCurrentPage(1)}
              className="h-7 px-2 border border-[#E5E7EB] bg-white hover:border-black font-bold uppercase transition-none disabled:opacity-30 disabled:pointer-events-none text-black hover:text-[#DC2626]"
              title="First Page"
            >
              ««
            </button>
            <button
              type="button"
              disabled={validPage === 1}
              onClick={() => setCurrentPage(validPage - 1)}
              className="h-7 px-2.5 border border-[#E5E7EB] bg-white hover:border-black font-bold uppercase transition-none disabled:opacity-30 disabled:pointer-events-none text-black hover:text-[#DC2626]"
            >
              ← PREV
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - validPage) <= 2)
              .map((p, i, arr) => {
                const prev = arr[i - 1];
                const showEllipsis = prev && p - prev > 1;
                return (
                  <React.Fragment key={p}>
                    {showEllipsis && <span className="px-1 text-[#9CA3AF]">...</span>}
                    <button
                      type="button"
                      onClick={() => setCurrentPage(p)}
                      className={`w-7 h-7 border font-bold text-xs transition-none flex items-center justify-center ${
                        p === validPage
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-black border-[#E5E7EB] hover:border-black hover:text-[#DC2626]'
                      }`}
                    >
                      {p}
                    </button>
                  </React.Fragment>
                );
              })}

            <button
              type="button"
              disabled={validPage === totalPages}
              onClick={() => setCurrentPage(validPage + 1)}
              className="h-7 px-2.5 border border-[#E5E7EB] bg-white hover:border-black font-bold uppercase transition-none disabled:opacity-30 disabled:pointer-events-none text-black hover:text-[#DC2626]"
            >
              NEXT →
            </button>
            <button
              type="button"
              disabled={validPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
              className="h-7 px-2 border border-[#E5E7EB] bg-white hover:border-black font-bold uppercase transition-none disabled:opacity-30 disabled:pointer-events-none text-black hover:text-[#DC2626]"
              title="Last Page"
            >
              »»
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;
