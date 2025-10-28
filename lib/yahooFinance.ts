import { OHLCVData, InstrumentSymbol } from './types';
import { getInstrument } from './instruments';
import { format } from 'date-fns';

// --- Twelve Data API Integration ---
// Fetches real futures market data from Twelve Data API
// API Docs: https://twelvedata.com/docs

// Map our symbols to Twelve Data futures symbols
const symbolMapping: Record<InstrumentSymbol, string> = {
  'ES': 'ES', // E-mini S&P 500
  'MES': 'MES', // Micro E-mini S&P 500
  'NQ': 'NQ', // E-mini Nasdaq 100
  'MNQ': 'MNQ', // Micro E-mini Nasdaq 100
  'GC': 'GC', // Gold Futures
  'MGC': 'MGC', // Micro Gold Futures
  'CL': 'CL', // Crude Oil Futures
  'MCL': 'MCL', // Micro Crude Oil Futures
};

interface TwelveDataBar {
  datetime: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume?: string;
}

interface TwelveDataResponse {
  values?: TwelveDataBar[];
  status?: string;
  message?: string;
}

const TWELVE_DATA_API_KEY = process.env.TWELVE_DATA_API_KEY;
const TWELVE_DATA_BASE_URL = 'https://api.twelvedata.com';

async function fetchFromTwelveData(
  symbol: string,
  interval: string,
  startDate: Date,
  endDate: Date
): Promise<OHLCVData[]> {
  // If no API key, fall back to sample data
  if (!TWELVE_DATA_API_KEY || TWELVE_DATA_API_KEY === 'your_api_key_here') {
    console.warn('Twelve Data API key not configured. Using sample data.');
    return generateFallbackData(symbol, startDate, endDate, interval);
  }

  const twelveSymbol = `${symbol}:CME`; // CME exchange for futures
  const params = new URLSearchParams({
    symbol: twelveSymbol,
    interval: interval,
    apikey: TWELVE_DATA_API_KEY,
    outputsize: '5000', // Maximum data points
    format: 'JSON',
    start_date: format(startDate, 'yyyy-MM-dd'),
    end_date: format(endDate, 'yyyy-MM-dd'),
  });

  try {
    const url = `${TWELVE_DATA_BASE_URL}/time_series?${params}`;
    console.log(`Fetching ${symbol} from Twelve Data...`);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Twelve Data API error: ${response.status}`);
    }

    const data: TwelveDataResponse = await response.json();

    if (data.status === 'error') {
      console.error('Twelve Data API error:', data.message);
      return generateFallbackData(symbol, startDate, endDate, interval);
    }

    if (!data.values || data.values.length === 0) {
      console.warn(`No data returned for ${symbol}`);
      return generateFallbackData(symbol, startDate, endDate, interval);
    }

    console.log(`Successfully fetched ${data.values.length} bars for ${symbol}`);

    // Transform Twelve Data format to our format
    return data.values.map((bar) => ({
      timestamp: new Date(bar.datetime).getTime(),
      date: new Date(bar.datetime),
      open: parseFloat(bar.open),
      high: parseFloat(bar.high),
      low: parseFloat(bar.low),
      close: parseFloat(bar.close),
      volume: bar.volume ? parseFloat(bar.volume) : 100000,
    })).reverse(); // Twelve Data returns newest first, we want oldest first

  } catch (error) {
    console.error(`Error fetching ${symbol} from Twelve Data:`, error);
    return generateFallbackData(symbol, startDate, endDate, interval);
  }
}

// Fallback sample data generator (for when API fails or key is missing)
function generateFallbackData(
  symbol: string,
  startDate: Date,
  endDate: Date,
  interval: string
): OHLCVData[] {
  const data: OHLCVData[] = [];
  const currentDate = new Date(startDate);
  
  // Base prices for different instruments
  const basePrices: Record<string, number> = {
    ES: 4500,
    MES: 4500,
    NQ: 15000,
    MNQ: 15000,
    GC: 2000,
    MGC: 2000,
    CL: 75,
    MCL: 75,
  };
  
  let basePrice = basePrices[symbol] || 1000;
  
  // Add some days before start date to ensure we have data
  const adjustedStartDate = new Date(startDate);
  adjustedStartDate.setDate(adjustedStartDate.getDate() - 5);
  currentDate.setTime(adjustedStartDate.getTime());
  
  while (currentDate <= endDate) {
    // Skip weekends
    if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
      currentDate.setDate(currentDate.getDate() + 1);
      continue;
    }
    
    // Generate intraday data
    if (interval.includes('min')) {
      // Generate data for trading hours (24 hours)
      for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
          const dataPoint = generateCandle(basePrice, currentDate, hour, minute);
          data.push(dataPoint);
          basePrice = dataPoint.close; // Use close as new base
        }
      }
      currentDate.setDate(currentDate.getDate() + 1);
    } else {
      // Daily data
      const dataPoint = generateCandle(basePrice, currentDate, 9, 30);
      data.push(dataPoint);
      basePrice = dataPoint.close;
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }
  
  return data;
}

function generateCandle(
  basePrice: number,
  date: Date,
  hour: number,
  minute: number
): OHLCVData {
  const candleDate = new Date(date);
  candleDate.setHours(hour, minute, 0, 0);
  
  // Generate realistic OHLC data with some randomness
  const volatility = basePrice * 0.002; // 0.2% volatility
  const change = (Math.random() - 0.5) * volatility;
  
  const open = basePrice;
  const close = basePrice + change;
  const high = Math.max(open, close) + Math.random() * volatility * 0.5;
  const low = Math.min(open, close) - Math.random() * volatility * 0.5;
  
  return {
    timestamp: candleDate.getTime(),
    date: candleDate,
    open: Number(open.toFixed(2)),
    high: Number(high.toFixed(2)),
    low: Number(low.toFixed(2)),
    close: Number(close.toFixed(2)),
    volume: Math.floor(Math.random() * 10000) + 1000,
  };
}

// Fetch historical data for a specific instrument
export const fetchHistoricalData = async (
  symbol: InstrumentSymbol,
  startDate: Date,
  endDate: Date
): Promise<OHLCVData[]> => {
  try {
    const twelveSymbol = symbolMapping[symbol];
    return await fetchFromTwelveData(twelveSymbol, '15min', startDate, endDate);
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    return [];
  }
};

// Fetch daily data for charts
export const fetchDailyData = async (
  symbol: InstrumentSymbol,
  startDate: Date,
  endDate: Date
): Promise<OHLCVData[]> => {
  try {
    const twelveSymbol = symbolMapping[symbol];
    return await fetchFromTwelveData(twelveSymbol, '1day', startDate, endDate);
  } catch (error) {
    console.error(`Error fetching daily data for ${symbol}:`, error);
    return [];
  }
};

// Fetch data for multiple instruments
export const fetchMultipleInstruments = async (
  symbols: InstrumentSymbol[],
  startDate: Date,
  endDate: Date
): Promise<Record<InstrumentSymbol, OHLCVData[]>> => {
  const results: Record<string, OHLCVData[]> = {};

  await Promise.all(
    symbols.map(async (symbol) => {
      try {
        const data = await fetchHistoricalData(symbol, startDate, endDate);
        results[symbol] = data;
      } catch (error) {
        console.error(`Failed to fetch ${symbol}:`, error);
        results[symbol] = [];
      }
    })
  );

  return results as Record<InstrumentSymbol, OHLCVData[]>;
};
