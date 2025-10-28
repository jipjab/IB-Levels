import { NextRequest, NextResponse } from 'next/server';
import { InstrumentSymbol, TradingSessionType, TradingLevel } from '@/lib/types';
import { fetchHistoricalData } from '@/lib/yahooFinance';
import { calculateInitialBalance, getSessionOpenClose } from '@/lib/calculations';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const instrumentsParam = searchParams.get('instruments');
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    const sessionParam = searchParams.get('session');

    // Check API key status
    const hasApiKey = !!process.env.TWELVE_DATA_API_KEY && 
                     process.env.TWELVE_DATA_API_KEY !== 'your_api_key_here';
    
    console.log('🔑 API Status:', hasApiKey ? 'Twelve Data API Enabled' : 'Using Sample Data (No API Key)');

    // Validate parameters
    if (!instrumentsParam || !startDateParam || !endDateParam || !sessionParam) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
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
        { status: 400 }
      );
    }

    const tradingLevels: TradingLevel[] = [];
    
    console.log(`📊 Fetching data for: ${instruments.join(', ')} | ${format(startDate, 'yyyy-MM-dd')} to ${format(endDate, 'yyyy-MM-dd')} | ${session} session`);

    // Fetch data for each instrument
    for (const instrument of instruments) {
      try {
        const data = await fetchHistoricalData(instrument, startDate, endDate);

        if (data.length === 0) {
          console.log(`No data generated for ${instrument}`);
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
        console.error(`Error processing ${instrument}:`, error);
      }
    }

    // Sort by date descending
    tradingLevels.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    console.log(`✅ Generated ${tradingLevels.length} trading levels`);

    return NextResponse.json({
      success: true,
      data: tradingLevels,
      meta: {
        dataSource: hasApiKey ? 'twelvedata' : 'sample',
        apiKeyConfigured: hasApiKey,
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

