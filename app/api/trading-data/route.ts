import { NextRequest, NextResponse } from 'next/server';
import { InstrumentSymbol, TradingSessionType, TradingLevel } from '@/lib/types';
import { fetchHistoricalData } from '@/lib/yahooFinance';
import { calculateInitialBalance, getSessionOpenClose } from '@/lib/calculations';
import { format } from 'date-fns';
import { rateLimit, getClientIp, createRateLimitHeaders } from '@/lib/rateLimit';
import cache, { generateCacheKey } from '@/lib/cache';

export const dynamic = 'force-dynamic';

// Helper function for logging (can be replaced with proper logger in production)
const log = {
  info: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[INFO] ${message}`, ...args);
    }
  },
  error: (message: string, ...args: any[]) => {
    console.error(`[ERROR] ${message}`, ...args);
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(`[WARN] ${message}`, ...args);
  }
};

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = getClientIp(request.headers);
    const rateLimitResult = rateLimit(
      clientIp,
      parseInt(process.env.API_RATE_LIMIT || '60'),
      60 * 1000 // 1 minute window
    );

    const rateLimitHeaders = createRateLimitHeaders(rateLimitResult);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Please try again later.',
        },
        {
          status: 429,
          headers: rateLimitHeaders,
        }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const instrumentsParam = searchParams.get('instruments');
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    const sessionParam = searchParams.get('session');

    log.info('API Status: Using Yahoo Finance (Free, Real Futures Data)');

    // Validate parameters
    if (!instrumentsParam || !startDateParam || !endDateParam || !sessionParam) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400, headers: rateLimitHeaders }
      );
    }

    const instruments = instrumentsParam.split(',') as InstrumentSymbol[];
    const startDate = new Date(startDateParam);
    const endDate = new Date(endDateParam);
    const session = sessionParam as TradingSessionType;

    // Validate session
    if (!['Asia', 'London', 'NewYork'].includes(session)) {
      return NextResponse.json(
        { success: false, error: 'Invalid session type' },
        { status: 400, headers: rateLimitHeaders }
      );
    }

    // Check cache first
    const cacheKey = generateCacheKey('trading-data', {
      instruments: instrumentsParam,
      startDate: startDateParam,
      endDate: endDateParam,
      session,
    });

    const cachedData = cache.get<{ data: TradingLevel[]; meta: any }>(cacheKey);
    
    if (cachedData) {
      log.info('Cache hit for:', cacheKey);
      return NextResponse.json(
        {
          success: true,
          ...cachedData,
          cached: true,
        },
        { headers: rateLimitHeaders }
      );
    }

    const tradingLevels: TradingLevel[] = [];
    
    log.info(`Fetching data for: ${instruments.join(', ')} | ${format(startDate, 'yyyy-MM-dd')} to ${format(endDate, 'yyyy-MM-dd')} | ${session} session`);

    // Fetch data for each instrument
    for (const instrument of instruments) {
      try {
        const data = await fetchHistoricalData(instrument, startDate, endDate);

        if (data.length === 0) {
          log.warn(`No data generated for ${instrument}`);
          continue;
        }

        // Group data by day
        const dayMap = new Map<string, typeof data>();
        data.forEach((d) => {
          const dateKey = format(d.date, 'yyyy-MM-dd');
          if (!dayMap.has(dateKey)) {
            dayMap.set(dateKey, []);
          }
          dayMap.get(dateKey)!.push(d);
        });

        // Calculate levels for each day
        dayMap.forEach((dayData, dateKey) => {
          const sessionDate = new Date(dateKey);
          const openClose = getSessionOpenClose(dayData, sessionDate, session);
          
          // Skip if no valid data
          if (openClose.open === 0) {
            return;
          }
          
          const initialBalance = calculateInitialBalance(
            dayData,
            sessionDate,
            session
          );

          // Calculate total volume for the day
          const totalVolume = dayData.reduce((sum, d) => sum + (d.volume || 0), 0);
          const avgVolume = dayData.length > 0 ? totalVolume / dayData.length : 100000;

          tradingLevels.push({
            date: dateKey,
            session,
            instrument,
            open: openClose.open,
            close: openClose.close,
            high: openClose.high,
            low: openClose.low,
            volume: avgVolume,
            initialBalance,
          });
        });
      } catch (error) {
        log.error(`Error processing ${instrument}:`, error);
      }
    }

    // Sort by date descending
    tradingLevels.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    log.info(`Generated ${tradingLevels.length} trading levels`);

    const responseData = {
      data: tradingLevels,
      meta: {
        dataSource: 'yahoofinance',
        apiKeyConfigured: true, // Yahoo Finance is free, no key needed
      },
    };

    // Cache the response
    cache.set(cacheKey, responseData);
    log.info('Cached response for:', cacheKey);

    return NextResponse.json(
      {
        success: true,
        ...responseData,
        cached: false,
      },
      { headers: rateLimitHeaders }
    );
  } catch (error) {
    log.error('API Error:', error);
    
    // Don't expose internal error details in production
    const errorMessage = process.env.NODE_ENV === 'development'
      ? error instanceof Error ? error.message : 'Internal server error'
      : 'An error occurred while processing your request';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { 
        status: 500,
        headers: {
          'X-RateLimit-Limit': '60',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(Date.now() + 60000).toISOString(),
        }
      }
    );
  }
}

