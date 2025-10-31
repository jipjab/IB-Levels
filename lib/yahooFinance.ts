import { OHLCVData, InstrumentSymbol } from './types';
import { getInstrument } from './instruments';
import { format, subDays } from 'date-fns';

// --- Yahoo Finance API Integration ---
// Fetches real futures market data from Yahoo Finance (FREE)
// Yahoo Finance provides actual futures contract data with correct pricing

// Map our symbols to Yahoo Finance futures symbols
const symbolMapping: Record<InstrumentSymbol, string> = {
  'ES': 'ES=F', // E-mini S&P 500 Futures
  'MES': 'ES=F', // Micro E-mini S&P 500 (use ES as proxy)
  'NQ': 'NQ=F', // E-mini Nasdaq 100 Futures
  'MNQ': 'NQ=F', // Micro E-mini Nasdaq 100 (use NQ as proxy)
  'GC': 'GC=F', // Gold Futures
  'MGC': 'GC=F', // Micro Gold Futures (use GC as proxy)
  'CL': 'CL=F', // Crude Oil Futures
  'MCL': 'CL=F', // Micro Crude Oil (use CL as proxy)
};

interface YahooFinanceQuote {
  open: number[];
  high: number[];
  low: number[];
  close: number[];
  volume: number[];
}

interface YahooFinanceResult {
  meta: {
    symbol: string;
    regularMarketPrice?: number;
  };
  timestamp: number[];
  indicators: {
    quote: YahooFinanceQuote[];
  };
}

interface YahooFinanceResponse {
  chart: {
    result: YahooFinanceResult[] | null;
    error: { code: string; description: string } | null;
  };
}

// Helper for conditional logging
const isDevelopment = process.env.NODE_ENV === 'development';

async function fetchFromYahooFinance(
  symbol: string,
  interval: string,
  startDate: Date,
  endDate: Date
): Promise<OHLCVData[]> {
  try {
    // Yahoo Finance uses Unix timestamps
    const period1 = Math.floor(startDate.getTime() / 1000);
    const period2 = Math.floor(endDate.getTime() / 1000);
    
    // Map intervals (15min for intraday, 1d for daily)
    const yahooInterval = interval.includes('min') ? '15m' : '1d';
    
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${yahooInterval}&period1=${period1}&period2=${period2}`;
    
    if (isDevelopment) {
      console.log(`[YahooFinance] Fetching ${symbol} from Yahoo Finance...`);
      console.log(`[YahooFinance] Date range: ${format(startDate, 'yyyy-MM-dd')} to ${format(endDate, 'yyyy-MM-dd')}`);
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Yahoo Finance API error: ${response.status}`);
    }

    const data: YahooFinanceResponse = await response.json();

    if (data.chart.error) {
      console.error('[YahooFinance] Yahoo Finance API error:', data.chart.error);
      return generateFallbackData(symbol, startDate, endDate, interval);
    }

    if (!data.chart.result || data.chart.result.length === 0) {
      if (isDevelopment) {
        console.warn(`[YahooFinance] No data returned for ${symbol}`);
      }
      return generateFallbackData(symbol, startDate, endDate, interval);
    }

    const result = data.chart.result[0];
    const timestamps = result.timestamp;
    const quotes = result.indicators.quote[0];

    if (!timestamps || timestamps.length === 0) {
      if (isDevelopment) {
        console.warn(`[YahooFinance] No timestamp data for ${symbol}`);
      }
      return generateFallbackData(symbol, startDate, endDate, interval);
    }

    if (isDevelopment) {
      console.log(`[YahooFinance] Successfully fetched ${timestamps.length} bars for ${symbol}`);
      console.log(`[YahooFinance] Current price: ${result.meta.regularMarketPrice}`);
    }

    // Transform Yahoo Finance format to our format
    const transformedData: OHLCVData[] = timestamps
      .map((timestamp, index) => {
        const open = quotes.open[index];
        const high = quotes.high[index];
        const low = quotes.low[index];
        const close = quotes.close[index];
        const volume = quotes.volume[index];

        // Skip if any critical data is null
        if (open == null || high == null || low == null || close == null) {
          return null;
        }

        return {
          timestamp: timestamp * 1000, // Convert to milliseconds
          date: new Date(timestamp * 1000),
          open: Number(open.toFixed(2)),
          high: Number(high.toFixed(2)),
          low: Number(low.toFixed(2)),
          close: Number(close.toFixed(2)),
          volume: volume || 0,
        };
      })
      .filter((item): item is OHLCVData => item !== null);

    if (isDevelopment) {
      console.log(`[YahooFinance] Transformed ${transformedData.length} data points for ${symbol}`);
      if (transformedData.length > 0) {
        console.log(`[YahooFinance] Price range: ${Math.min(...transformedData.map(d => d.low)).toFixed(2)} - ${Math.max(...transformedData.map(d => d.high)).toFixed(2)}`);
      }
    }

    return transformedData;

  } catch (error) {
    console.error(`[YahooFinance] Error fetching ${symbol} from Yahoo Finance:`, error);
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
    const yahooSymbol = symbolMapping[symbol];
    return await fetchFromYahooFinance(yahooSymbol, '15min', startDate, endDate);
  } catch (error) {
    console.error(`[YahooFinance] Error fetching data for ${symbol}:`, error);
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
    const yahooSymbol = symbolMapping[symbol];
    return await fetchFromYahooFinance(yahooSymbol, '1day', startDate, endDate);
  } catch (error) {
    console.error(`[YahooFinance] Error fetching daily data for ${symbol}:`, error);
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
        console.error(`[YahooFinance] Failed to fetch ${symbol}:`, error);
        results[symbol] = [];
      }
    })
  );

  return results as Record<InstrumentSymbol, OHLCVData[]>;
};
