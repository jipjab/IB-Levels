'use client';

import { TradingLevel } from '@/lib/types';
import { getInstrument } from '@/lib/instruments';

interface InitialBalanceCardProps {
  level: TradingLevel;
}

const InitialBalanceCard = ({ level }: InitialBalanceCardProps) => {
  const instrument = getInstrument(level.instrument);
  const priceChange = level.close - level.open;
  const priceChangePercent =
    level.open !== 0 ? ((priceChange / level.open) * 100).toFixed(2) : '0.00';
  const isPositive = priceChange >= 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {instrument.symbol}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">{instrument.name}</p>
        </div>
        <div
          className={`px-2 py-1 rounded text-xs font-semibold ${
            isPositive
              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
              : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
          }`}
        >
          {isPositive ? '+' : ''}
          {priceChangePercent}%
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-700">
          <span className="text-xs text-gray-600 dark:text-gray-400">Open</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {level.open.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-700">
          <span className="text-xs text-gray-600 dark:text-gray-400">Close</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {level.close.toFixed(2)}
          </span>
        </div>

        <div className="pt-2">
          <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
            Initial Balance (1H)
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded p-2">
              <div className="text-xs text-gray-600 dark:text-gray-400">High</div>
              <div className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                {level.initialBalance.ib1hHigh.toFixed(2)}
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded p-2">
              <div className="text-xs text-gray-600 dark:text-gray-400">Low</div>
              <div className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                {level.initialBalance.ib1hLow.toFixed(2)}
              </div>
            </div>
          </div>
          <div className="mt-1 text-xs text-gray-600 dark:text-gray-400 text-center">
            Range: {level.initialBalance.ib1hRange.toFixed(2)}
          </div>
        </div>

        <div className="pt-2">
          <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
            Initial Balance (15M)
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-purple-50 dark:bg-purple-900/30 rounded p-2">
              <div className="text-xs text-gray-600 dark:text-gray-400">High</div>
              <div className="text-sm font-semibold text-purple-700 dark:text-purple-400">
                {level.initialBalance.ib15mHigh.toFixed(2)}
              </div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/30 rounded p-2">
              <div className="text-xs text-gray-600 dark:text-gray-400">Low</div>
              <div className="text-sm font-semibold text-purple-700 dark:text-purple-400">
                {level.initialBalance.ib15mLow.toFixed(2)}
              </div>
            </div>
          </div>
          <div className="mt-1 text-xs text-gray-600 dark:text-gray-400 text-center">
            Range: {level.initialBalance.ib15mRange.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          {level.session} Session • {level.date}
        </div>
      </div>
    </div>
  );
};

export default InitialBalanceCard;

