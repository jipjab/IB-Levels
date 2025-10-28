import { TradingLevel } from './types';
import { format } from 'date-fns';

/**
 * Convert trading levels data to CSV format
 */
export function convertToCSV(data: TradingLevel[]): string {
  if (data.length === 0) {
    return '';
  }

  // CSV Headers
  const headers = [
    'Date',
    'Session',
    'Instrument',
    'Open',
    'Close',
    'High',
    'Low',
    'Volume',
    'IB 1H High',
    'IB 1H Low',
    'IB 1H Range',
    'IB 15M High',
    'IB 15M Low',
    'IB 15M Range',
  ];

  // CSV Rows
  const rows = data.map((level) => [
    level.date,
    level.session,
    level.instrument,
    level.open.toFixed(2),
    level.close.toFixed(2),
    level.high.toFixed(2),
    level.low.toFixed(2),
    level.volume?.toFixed(0) || '0',
    level.initialBalance.ib1hHigh.toFixed(2),
    level.initialBalance.ib1hLow.toFixed(2),
    level.initialBalance.ib1hRange.toFixed(2),
    level.initialBalance.ib15mHigh.toFixed(2),
    level.initialBalance.ib15mLow.toFixed(2),
    level.initialBalance.ib15mRange.toFixed(2),
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  return csvContent;
}

/**
 * Download CSV file
 */
export function downloadCSV(data: TradingLevel[], filename?: string): void {
  const csv = convertToCSV(data);
  
  if (!csv) {
    console.warn('No data to export');
    return;
  }

  // Create filename with timestamp if not provided
  const timestamp = format(new Date(), 'yyyy-MM-dd_HHmmss');
  const finalFilename = filename || `IBLevels_Export_${timestamp}.csv`;

  // Create blob and download link
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    // Create a link to the file
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', finalFilename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log(`✅ Exported ${data.length} trading levels to ${finalFilename}`);
  }
}

/**
 * Format data summary for export filename
 */
export function generateExportFilename(
  instruments: string[],
  session: string,
  startDate: Date,
  endDate: Date
): string {
  const instrumentStr = instruments.join('-');
  const dateRange = `${format(startDate, 'MMdd')}-${format(endDate, 'MMdd')}`;
  const timestamp = format(new Date(), 'HHmmss');
  
  return `IBLevels_${instrumentStr}_${session}_${dateRange}_${timestamp}.csv`;
}

