'use client';

import { useState } from 'react';
import { TradingLevel } from '@/lib/types';
import { downloadCSV } from '@/lib/csvExport';

interface TradingLevelsTableProps {
  levels: TradingLevel[];
}

type SortField = 'date' | 'instrument' | 'open' | 'close';
type SortDirection = 'asc' | 'desc';

const TradingLevelsTable = ({ levels }: TradingLevelsTableProps) => {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleExport = () => {
    downloadCSV(sortedLevels);
  };

  const sortedLevels = [...levels].sort((a, b) => {
    let comparison = 0;

    switch (sortField) {
      case 'date':
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        break;
      case 'instrument':
        comparison = a.instrument.localeCompare(b.instrument);
        break;
      case 'open':
        comparison = a.open - b.open;
        break;
      case 'close':
        comparison = a.close - b.close;
        break;
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return (
        <span className="text-gray-400" aria-hidden="true">
          ↕
        </span>
      );
    }
    return (
      <span aria-label={`Sorted ${sortDirection === 'asc' ? 'ascending' : 'descending'}`}>
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded overflow-hidden transition-colors">
      <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center justify-between transition-colors">
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100">Initial Balance Levels</h3>
        <button
          type="button"
          onClick={handleExport}
          disabled={sortedLevels.length === 0}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/50 active:bg-blue-100 dark:active:bg-blue-900 border border-blue-300 dark:border-blue-600 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
          aria-label="Export data to CSV"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span className="hidden sm:inline">Export CSV</span>
          <span className="sm:hidden">CSV</span>
        </button>
      </div>

      <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-colors">
            <tr>
              <th
                className="px-2 sm:px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700 touch-manipulation"
                onClick={() => handleSort('date')}
                tabIndex={0}
                role="button"
                aria-label="Sort by date"
                onKeyDown={(e) => e.key === 'Enter' && handleSort('date')}
              >
                <div className="flex items-center gap-1 whitespace-nowrap">
                  Date <SortIcon field="date" />
                </div>
              </th>
              <th
                className="px-2 sm:px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700 touch-manipulation"
                onClick={() => handleSort('instrument')}
                tabIndex={0}
                role="button"
                aria-label="Sort by instrument"
                onKeyDown={(e) => e.key === 'Enter' && handleSort('instrument')}
              >
                <div className="flex items-center gap-1 whitespace-nowrap">
                  Symbol <SortIcon field="instrument" />
                </div>
              </th>
              <th className="px-2 sm:px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                Session
              </th>
              <th
                className="px-2 sm:px-4 py-2 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700 touch-manipulation"
                onClick={() => handleSort('open')}
                tabIndex={0}
                role="button"
                aria-label="Sort by open price"
                onKeyDown={(e) => e.key === 'Enter' && handleSort('open')}
              >
                <div className="flex items-center justify-end gap-1 whitespace-nowrap">
                  Open <SortIcon field="open" />
                </div>
              </th>
              <th
                className="px-2 sm:px-4 py-2 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700 touch-manipulation"
                onClick={() => handleSort('close')}
                tabIndex={0}
                role="button"
                aria-label="Sort by close price"
                onKeyDown={(e) => e.key === 'Enter' && handleSort('close')}
              >
                <div className="flex items-center justify-end gap-1 whitespace-nowrap">
                  Close <SortIcon field="close" />
                </div>
              </th>
              <th className="px-2 sm:px-4 py-2 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                IB 1H High
              </th>
              <th className="px-2 sm:px-4 py-2 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                IB 1H Low
              </th>
              <th className="px-2 sm:px-4 py-2 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                IB 15M High
              </th>
              <th className="px-2 sm:px-4 py-2 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                IB 15M Low
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
            {sortedLevels.map((level, index) => (
              <tr key={`${level.instrument}-${level.date}-${index}`} className="hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 transition-colors">
                <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-xs text-gray-900 dark:text-gray-100">
                  {level.date}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-xs font-semibold text-blue-600 dark:text-blue-400">
                  {level.instrument}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-xs text-gray-600 dark:text-gray-400">
                  {level.session}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-xs text-right text-gray-900 dark:text-gray-100">
                  {level.open.toFixed(2)}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-xs text-right text-gray-900 dark:text-gray-100">
                  {level.close.toFixed(2)}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-xs text-right text-gray-900 dark:text-gray-100">
                  {level.initialBalance.ib1hHigh.toFixed(2)}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-xs text-right text-gray-900 dark:text-gray-100">
                  {level.initialBalance.ib1hLow.toFixed(2)}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-xs text-right text-gray-600 dark:text-gray-400">
                  {level.initialBalance.ib15mHigh.toFixed(2)}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-xs text-right text-gray-600 dark:text-gray-400">
                  {level.initialBalance.ib15mLow.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sortedLevels.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No trading data available. Please select instruments and apply filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default TradingLevelsTable;

