'use client';

import { InstrumentSymbol, TradingSessionType } from '@/lib/types';
import InstrumentSelector from './InstrumentSelector';
import DateSelector from './DateSelector';
import SessionSelector from './SessionSelector';

interface FilterPanelProps {
  instruments: InstrumentSymbol[];
  startDate: Date;
  endDate: Date;
  session: TradingSessionType;
  onInstrumentsChange: (instruments: InstrumentSymbol[]) => void;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  onSessionChange: (session: TradingSessionType) => void;
  onReset: () => void;
  onApply: () => void;
}

const FilterPanel = ({
  instruments,
  startDate,
  endDate,
  session,
  onInstrumentsChange,
  onStartDateChange,
  onEndDateChange,
  onSessionChange,
  onReset,
  onApply,
}: FilterPanelProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-2 sm:py-3">
        {/* Session Tabs - Centered */}
        <div className="mb-2 sm:mb-3">
          <SessionSelector selected={session} onChange={onSessionChange} />
        </div>

        {/* Filters - Centered on all screens */}
        <div className="flex flex-col items-center gap-2 sm:gap-3">
          {/* Instrument Selector - Full width, centered */}
          <InstrumentSelector
            selected={instruments}
            onChange={onInstrumentsChange}
          />
          
          {/* Date Selector - Full width, centered */}
          <DateSelector
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={onStartDateChange}
            onEndDateChange={onEndDateChange}
          />

          {/* Action Buttons - Centered */}
          <div className="flex gap-1.5 sm:gap-2 justify-center">
            <button
              type="button"
              onClick={onApply}
              className="px-3 min-[400px]:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/50 active:bg-blue-100 dark:active:bg-blue-900 border border-blue-300 dark:border-blue-600 rounded transition-colors touch-manipulation"
              aria-label="Refresh data"
              title="Force refresh data"
            >
              <span className="hidden min-[400px]:inline">🔄 Refresh</span>
              <span className="min-[400px]:hidden">🔄</span>
            </button>

            <button
              type="button"
              onClick={onReset}
              className="px-2.5 min-[400px]:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 active:text-gray-950 dark:active:text-gray-100 border border-gray-300 dark:border-gray-600 rounded touch-manipulation"
              aria-label="Reset all filters"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;

