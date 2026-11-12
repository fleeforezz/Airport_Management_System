import React from 'react';

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
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
  keyField = 'id',
  emptyMessage = 'No telemetry records located within active matrix.',
}: TableProps<T>) {
  if (!data || data.length === 0) {
    return (
      <div className="p-8 bg-white border border-[#E5E7EB] text-center font-mono text-xs text-[#4B5563]">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto bg-white border border-[#E5E7EB] select-none">
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
          {data.map((row, idx) => {
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
                      {col.render ? col.render(row, idx) : String(cellValue ?? '')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
