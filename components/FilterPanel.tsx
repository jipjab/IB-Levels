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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
        {/* Session Tabs - Centered */}
        <div className="flex items-center justify-center mb-3 sm:mb-4 overflow-x-auto">
          <SessionSelector selected={session} onChange={onSessionChange} />
        </div>

        {/* Filters - Centered and Stack on mobile */}
        <div className="space-y-3 sm:space-y-0 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-3">
          {/* Instrument Selector - Full width on mobile */}
          <div className="w-full sm:w-auto">
            <InstrumentSelector
              selected={instruments}
              onChange={onInstrumentsChange}
            />
          </div>
          
          {/* Date Selector - Full width on mobile */}
          <div className="w-full sm:w-auto">
            <DateSelector
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={onStartDateChange}
              onEndDateChange={onEndDateChange}
            />
          </div>

              {/* Action Buttons - Side by side on mobile */}
              <div className="flex gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={onApply}
                  className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/50 active:bg-blue-100 dark:active:bg-blue-900 border border-blue-300 dark:border-blue-600 rounded transition-colors touch-manipulation"
                  aria-label="Refresh data"
                  title="Force refresh data"
                >
                  🔄 Refresh
                </button>

                <button
                  type="button"
                  onClick={onReset}
                  className="flex-1 sm:flex-none px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 active:text-gray-950 dark:active:text-gray-100 border border-gray-300 dark:border-gray-600 rounded touch-manipulation"
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

