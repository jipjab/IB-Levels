'use client';

import { InstrumentSymbol } from '@/lib/types';
import { getAllInstruments } from '@/lib/instruments';

interface InstrumentSelectorProps {
  selected: InstrumentSymbol[];
  onChange: (instruments: InstrumentSymbol[]) => void;
}

const InstrumentSelector = ({ selected, onChange }: InstrumentSelectorProps) => {
  const instruments = getAllInstruments();

  const handleToggle = (symbol: InstrumentSymbol) => {
    if (selected.includes(symbol)) {
      onChange(selected.filter((s) => s !== symbol));
    } else {
      onChange([...selected, symbol]);
    }
  };

  const handleSelectAll = () => {
    if (selected.length === instruments.length) {
      onChange([]);
    } else {
      onChange(instruments.map((i) => i.symbol));
    }
  };

  return (
    <div className="flex items-start sm:items-center gap-2 flex-wrap">
      <span className="text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Instruments:</span>
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {instruments.map((instrument) => {
          const isSelected = selected.includes(instrument.symbol);
          return (
            <button
              key={instrument.symbol}
              type="button"
              onClick={() => handleToggle(instrument.symbol)}
              className={`
                px-3 py-1.5 rounded text-xs font-medium transition-colors touch-manipulation
                ${
                  isSelected
                    ? 'bg-blue-600 text-white active:bg-blue-700 dark:bg-blue-500 dark:active:bg-blue-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:active:bg-gray-500'
                }
              `}
              aria-pressed={isSelected}
              aria-label={`${isSelected ? 'Deselect' : 'Select'} ${instrument.name}`}
            >
              {instrument.symbol}
            </button>
          );
        })}
        <button
          type="button"
          onClick={handleSelectAll}
          className="px-2 py-1.5 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 active:text-blue-800 dark:active:text-blue-200 font-medium underline touch-manipulation"
          aria-label={
            selected.length === instruments.length
              ? 'Deselect all instruments'
              : 'Select all instruments'
          }
        >
          {selected.length === instruments.length ? 'Clear all' : 'Select all'}
        </button>
      </div>
    </div>
  );
};

export default InstrumentSelector;

