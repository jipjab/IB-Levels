'use client';

import { format } from 'date-fns';

interface DateSelectorProps {
  startDate: Date;
  endDate: Date;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
}

const DateSelector = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: DateSelectorProps) => {
  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onStartDateChange(new Date(e.target.value));
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onEndDateChange(new Date(e.target.value));
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">From:</span>
      <input
        type="date"
        id="start-date"
        value={format(startDate, 'yyyy-MM-dd')}
        onChange={handleStartChange}
        className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        aria-label="Select start date"
      />
      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">To:</span>
      <input
        type="date"
        id="end-date"
        value={format(endDate, 'yyyy-MM-dd')}
        onChange={handleEndChange}
        className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        aria-label="Select end date"
      />
    </div>
  );
};

export default DateSelector;

