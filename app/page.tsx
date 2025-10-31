'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { subDays, format } from 'date-fns';
import { InstrumentSymbol, TradingSessionType, TradingLevel } from '@/lib/types';
import { hasSessionClosedSince, formatTimeUntilBoundary } from '@/lib/sessionBoundaries';
import FilterPanel from '@/components/FilterPanel';
import InitialBalanceCard from '@/components/InitialBalanceCard';
import TradingLevelsTable from '@/components/TradingLevelsTable';
import AdPlacement from '@/components/AdPlacement';
import AffiliateLinks from '@/components/AffiliateLinks';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';
import SocialShare from '@/components/SocialShare';

// Dynamic import for TradingChart to disable SSR and improve initial load
const TradingChart = dynamic(() => import('@/components/TradingChart'), {
  ssr: false,
  loading: () => (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded overflow-hidden transition-colors">
      <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
      </div>
      <div className="p-2 sm:p-4">
        <div className="h-[400px] sm:h-[600px] bg-gray-100 dark:bg-gray-700 rounded animate-pulse flex items-center justify-center">
          <div className="text-gray-400 dark:text-gray-500 text-sm">Loading chart...</div>
        </div>
      </div>
    </div>
  ),
});

// Cache key for localStorage
const CACHE_KEY = 'iblevels_trading_data_cache';
const CACHE_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes max cache

interface CacheData {
  data: TradingLevel[];
  timestamp: number;
  instruments: string[];
  startDate: string;
  endDate: string;
  session: string;
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [instruments, setInstruments] = useState<InstrumentSymbol[]>(['ES', 'NQ']);
  // Optimized: Start with 7 days instead of 30 for faster initial load
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 7));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [session, setSession] = useState<TradingSessionType>('NewYork');
  const [tradingLevels, setTradingLevels] = useState<TradingLevel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number | null>(null);
  const [nextBoundary, setNextBoundary] = useState<string>('');

  useEffect(() => {
    setMounted(true);
    
    // Try to load cached data
    const loadCachedData = () => {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const cacheData: CacheData = JSON.parse(cached);
          
          // Validate cache data structure
          if (!cacheData.data || !Array.isArray(cacheData.data)) {
            console.warn('⚠️ Invalid cache data structure, clearing...');
            localStorage.removeItem(CACHE_KEY);
            return false;
          }
          
          const cacheAge = Date.now() - cacheData.timestamp;
          
          // Check if cache is still valid
          if (cacheAge < CACHE_EXPIRY_MS && 
              !hasSessionClosedSince(session, cacheData.timestamp)) {
            console.log('📦 Loading cached data (age: ' + Math.floor(cacheAge / 60000) + 'm)');
            setTradingLevels(cacheData.data);
            setLastFetchTime(cacheData.timestamp);
            return true;
          } else {
            console.log('🗑️ Cache expired or session closed');
            localStorage.removeItem(CACHE_KEY);
          }
        }
      } catch (error) {
        console.error('❌ Error loading cache, clearing:', error);
        // Clear corrupted cache
        try {
          localStorage.removeItem(CACHE_KEY);
        } catch (e) {
          console.error('Failed to clear cache:', e);
        }
      }
      return false;
    };
    
    const hasCache = loadCachedData();
    if (!hasCache) {
      console.log('🚀 No valid cache, will fetch fresh data');
    }
  }, [session]);
  
  // Update next boundary timer
  useEffect(() => {
    if (!mounted) return;
    
    const updateBoundary = () => {
      setNextBoundary(formatTimeUntilBoundary(session));
    };
    
    updateBoundary();
    const interval = setInterval(updateBoundary, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [mounted, session]);

  const fetchTradingData = useCallback(async (force: boolean = false) => {
    console.log('🔄 fetchTradingData called', { 
      force, 
      instrumentsCount: instruments.length,
      mounted 
    });
    
    if (instruments.length === 0) {
      console.log('⚠️ No instruments selected');
      setTradingLevels([]);
      setError(null);
      setLastFetchTime(null);
      try {
        localStorage.removeItem(CACHE_KEY);
      } catch (e) {
        console.error('Failed to clear cache:', e);
      }
      return;
    }

    // Check if we should use cached data
    if (!force && lastFetchTime) {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const cacheData: CacheData = JSON.parse(cached);
          
          // Check if filter parameters have changed
          const instrumentsChanged = 
            instruments.sort().join(',') !== cacheData.instruments.sort().join(',');
          const dateRangeChanged = 
            startDate.toISOString() !== cacheData.startDate ||
            endDate.toISOString() !== cacheData.endDate;
          const sessionChanged = session !== cacheData.session;
          
          // If filters changed, invalidate cache and fetch fresh data
          if (instrumentsChanged || dateRangeChanged || sessionChanged) {
            console.log('🔄 Filters changed, fetching fresh data...');
            localStorage.removeItem(CACHE_KEY);
          } else {
            // Filters haven't changed, check cache age
            const cacheAge = Date.now() - lastFetchTime;
            const sessionClosed = hasSessionClosedSince(session, lastFetchTime);
            
            if (cacheAge < CACHE_EXPIRY_MS && !sessionClosed) {
              console.log('⚡ Using cached data (age: ' + Math.floor(cacheAge / 60000) + 'm)');
              return;
            } else {
              console.log('🔄 Cache expired or session closed, fetching fresh data...');
            }
          }
        }
      } catch (error) {
        console.warn('Error checking cache:', error);
        localStorage.removeItem(CACHE_KEY);
      }
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        instruments: instruments.join(','),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        session: session,
      });

      console.log('🚀 Fetching fresh trading data:', {
        instruments: instruments.join(', '),
        dateRange: `${format(startDate, 'yyyy-MM-dd')} to ${format(endDate, 'yyyy-MM-dd')}`,
        session: session,
        reason: force ? 'Manual refresh' : 'Auto-refresh (filters changed or cache expired)'
      });

      const response = await fetch(`/api/trading-data?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();

      // Log data source info
      if (result.meta) {
        const dataSourceEmoji = result.meta.dataSource === 'yahoofinance' ? '📊' : '🎲';
        const dataSourceText = result.meta.dataSource === 'yahoofinance' ? 'Yahoo Finance (Real Futures Data)' : 'Sample Data';
        console.log(`${dataSourceEmoji} Data Source: ${dataSourceText}`);
        console.log(`✅ Using FREE Yahoo Finance API for accurate futures pricing`);
      }

      if (result.success) {
        const fetchTime = Date.now();
        setTradingLevels(result.data || []);
        setLastFetchTime(fetchTime);
        console.log(`✅ Loaded ${result.data?.length || 0} trading levels`);
        
        // Cache the data
        try {
          const cacheData: CacheData = {
            data: result.data || [],
            timestamp: fetchTime,
            instruments: instruments,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            session: session,
          };
          localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
          console.log('💾 Data cached for quick access');
        } catch (cacheError) {
          console.warn('Failed to cache data:', cacheError);
        }
        
        if (result.data?.length === 0) {
          setError('No data available for the selected date range. Try extending the date range.');
        }
      } else {
        setError(result.error || 'Failed to fetch trading data');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching data';
      setError(errorMessage);
      console.error('❌ Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [instruments, startDate, endDate, session, lastFetchTime]);

  // Auto-fetch data when filters change or on mount
  useEffect(() => {
    console.log('📍 Auto-fetch useEffect triggered', { 
      mounted, 
      instrumentsCount: instruments.length,
      session 
    });
    
    if (mounted && instruments.length > 0) {
      console.log('✅ Triggering fetch...');
      fetchTradingData();
    } else if (mounted && instruments.length === 0) {
      console.log('⚠️ Mounted but no instruments selected');
    }
  }, [mounted, instruments, startDate, endDate, session, fetchTradingData]);

  const handleReset = () => {
    setInstruments(['ES', 'NQ']);
    setStartDate(subDays(new Date(), 1));
    setEndDate(new Date());
    setSession('NewYork');
    localStorage.removeItem(CACHE_KEY); // Clear cache on reset
  };

  const handleApply = () => {
    fetchTradingData(true); // Force refresh
  };

  // Get unique instruments from trading levels for charts
  const uniqueInstruments = Array.from(
    new Set(tradingLevels.map((level) => level.instrument))
  );

  // Group levels by instrument for cards
  const latestLevelsByInstrument = uniqueInstruments
    .map((instrument) => {
      const levels = tradingLevels.filter((l) => l.instrument === instrument);
      return levels[0]; // Most recent
    })
    .filter(Boolean);

  if (!mounted) {
    return null;
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/" className="cursor-pointer" aria-label="Go to home page">
                <Logo size="md" showText={true} />
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <p className="hidden md:block text-xs text-gray-500 dark:text-gray-400">
                Initial Balance Levels & Trading Data
              </p>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Description Section */}
      <div className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700 transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Professional Initial Balance Levels for Futures Traders
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Professional Initial Balance (IB) analysis for futures traders. Get real-time trading levels for ES, NQ, GC, CL and more — completely free, no signup required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* What It Is */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700 transition-colors">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    What is Initial Balance?
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Initial Balance (IB) is a Market Profile concept representing the high and low price range during the first period of a trading session. We calculate both 1-hour and 15-minute IB levels to identify key support and resistance zones.
                  </p>
                </div>
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700 transition-colors">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    How It Works
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Select your futures contracts (ES, NQ, GC, CL, etc.), choose a date range, and pick your trading session (Asia, London, or New York). We fetch real market data from Yahoo Finance and automatically calculate IB levels with interactive charts and exportable tables.
                  </p>
                </div>
              </div>
            </div>

            {/* Why Use It */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700 transition-colors">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Why Use IBLevels?
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    100% free with no API keys or signups. Get accurate futures data, track multiple sessions, analyze historical patterns, and make informed trading decisions. Perfect for day traders using Initial Balance methodology.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Start Guide */}
          <div className="bg-blue-50 dark:bg-gray-800/50 rounded-lg p-4 sm:p-6 border border-blue-200 dark:border-gray-700">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 text-center">
              Quick Start Guide
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="flex items-start gap-2">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-500 text-white text-xs font-bold">1</span>
                <p className="text-sm text-gray-700 dark:text-gray-300">Select futures instruments below</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-500 text-white text-xs font-bold">2</span>
                <p className="text-sm text-gray-700 dark:text-gray-300">Choose your date range</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-500 text-white text-xs font-bold">3</span>
                <p className="text-sm text-gray-700 dark:text-gray-300">Pick trading session (NY, London, Asia)</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-500 text-white text-xs font-bold">4</span>
                <p className="text-sm text-gray-700 dark:text-gray-300">View levels, charts & export data</p>
              </div>
            </div>
          </div>
        </div>
      </div>

          {/* Filter Panel */}
          <FilterPanel
            instruments={instruments}
            startDate={startDate}
            endDate={endDate}
            session={session}
            onInstrumentsChange={setInstruments}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onSessionChange={setSession}
            onReset={handleReset}
            onApply={handleApply}
          />
          
          {/* Data Status Bar */}
          {lastFetchTime && tradingLevels.length > 0 && (
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>
                  Last updated: {new Date(lastFetchTime).toLocaleTimeString()}
                  {' • '}
                  {Math.floor((Date.now() - lastFetchTime) / 60000)}m ago
                </span>
                <span>
                  Next {session} boundary: {nextBoundary}
                </span>
              </div>
            </div>
          )}

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8 sm:py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
            <p className="mt-4 text-sm sm:text-base text-gray-600 dark:text-gray-400">Loading trading data...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 sm:p-4 mb-6 sm:mb-8">
            <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Content */}
        {!loading && !error && tradingLevels.length > 0 && (
          <>
            {/* Trading Levels Table - Primary Content */}
            <div className="mb-6 sm:mb-8">
              <TradingLevelsTable levels={tradingLevels} />
            </div>

            {/* Initial Balance Cards - Mobile First */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4 mb-6">
              {latestLevelsByInstrument.map((level) => (
                <InitialBalanceCard key={level.instrument} level={level} />
              ))}
            </div>

            {/* Secondary Content - Charts & Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* Charts */}
              <div className="lg:col-span-3 space-y-4 sm:space-y-6">
                {uniqueInstruments.map((instrument) => {
                  const instrumentData = tradingLevels.filter(
                    (l) => l.instrument === instrument
                  );
                  return (
                    <TradingChart
                      key={instrument}
                      data={instrumentData}
                      instrument={instrument}
                    />
                  );
                })}
              </div>

              {/* Sidebar - Desktop Only */}
              <div className="hidden lg:block space-y-4">
                {/* Initial Balance Cards */}
                {latestLevelsByInstrument.map((level) => (
                  <InitialBalanceCard key={level.instrument} level={level} />
                ))}

                {/* Advertisement */}
                <AdPlacement />
                
                {/* TradingView Link */}
                <div className="flex justify-center">
                  <AffiliateLinks platform="tradingview" variant="button" />
                </div>
              </div>
            </div>

            {/* Mobile Ad Section */}
            <div className="lg:hidden mb-6">
              <AdPlacement />
              
              {/* TradingView Link */}
              <div className="flex justify-center mt-4">
                <AffiliateLinks platform="tradingview" variant="button" />
              </div>
            </div>
          </>
        )}

        {!loading && !error && tradingLevels.length === 0 && (
          <div className="text-center py-20 border-t border-gray-100 dark:border-gray-800">
            <svg
              className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="mt-3 text-sm font-medium text-gray-900 dark:text-gray-100">Select instruments to view data</h3>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Choose one or more futures contracts and click Apply
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-950 border-t border-gray-700 dark:border-gray-800 text-white py-8 mt-auto transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Social Share Section */}
          <div className="mb-6 pb-6 border-b border-gray-700 dark:border-gray-800">
            <div className="flex flex-col items-center gap-4">
              {/* Title and description */}
              <div className="text-center">
                <h3 className="text-sm font-semibold text-white mb-1">
                  Share IBLevels with your trading community!
                </h3>
                <p className="text-xs text-gray-400">
                  Help other traders discover free Initial Balance levels
                </p>
              </div>
              
              {/* Share buttons */}
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
                <SocialShare variant="horizontal" />
              </div>
            </div>
          </div>

          {/* Footer Bottom with Logo and Copyright */}
          <div className="flex flex-col items-center gap-6">
            {/* Logo */}
            <Link href="/" className="cursor-pointer" aria-label="Go to home page">
              <Logo size="sm" showText={true} variant="light" />
            </Link>

            {/* Legal Disclaimer - Desktop: Full text, Mobile: Collapsible */}
            <div className="w-full max-w-5xl">
              {/* Mobile: Collapsible version */}
              <details className="lg:hidden">
                <summary className="cursor-pointer text-xs text-gray-400 hover:text-gray-300 text-center py-2 select-none">
                  Legal Disclaimer & Risk Warning (tap to view)
                </summary>
                <div className="text-xs text-gray-400 dark:text-gray-500 space-y-2 mt-3 pt-3 border-t border-gray-700">
                  <p>
                    <strong className="text-gray-300">Risk:</strong> Trading is risky. Content is for informational purposes only, not financial advice. Past performance doesn&apos;t guarantee future results.
                  </p>
                  
                  <p>
                    <strong className="text-gray-300">Data:</strong> Provided by Yahoo Finance (FREE). Charts powered by TradingView™. All data &quot;as is&quot; - verify independently.
                  </p>
                  
                  <p>
                    <strong className="text-gray-300">No Affiliation:</strong> We have no access to your trading accounts and no affiliation with TradingView or Yahoo Finance.
                  </p>
                </div>
              </details>

              {/* Desktop: Full version */}
              <div className="hidden lg:block text-xs text-gray-400 dark:text-gray-500 space-y-3">
                <p>
                  <strong className="text-gray-300">Risk Disclosure:</strong> Trading and investing are risky and many will lose money in connection with trading and investing activities. All content on this site is for informational and educational purposes only and should not be considered financial advice. Decisions to buy, sell, hold or trade in securities, commodities and other investments involve risk and are best made based on the advice of qualified financial professionals. Past performance does not guarantee future results.
                </p>
                
                <p>
                  <strong className="text-gray-300">No Personal Trading Access:</strong> As a provider of technical analysis information, we have no access to the personal trading accounts or brokerage statements of our customers. As a result, we have no reason to believe our customers perform better or worse than traders as a whole based on any content, tool, or platform feature we provide.
                </p>
                
                <p>
                  <strong className="text-gray-300">Third-Party Services:</strong> Charts used on this site are powered by TradingView, in which the majority of our technical indicators are built on. TradingView™ is a registered trademark of TradingView, Inc. <a href="https://www.tradingview.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">https://www.tradingview.com</a>. TradingView.com is not affiliated with the owner, developer, or provider of the services described herein.
                </p>
                
                <p>
                  <strong className="text-gray-300">Market Data:</strong> Market data is provided by Yahoo Finance. Real-time and historical futures data is sourced from Yahoo Finance API services, which aggregates data from major exchanges including CME Group. All data is provided free of charge.
                </p>
                
                <p>
                  <strong className="text-gray-300">Data Accuracy:</strong> All data is provided &quot;as is&quot; and should be verified independently for trading purposes. While we strive for accuracy, we make no warranties regarding the completeness, accuracy, or timeliness of the information provided.
                </p>
              </div>
            </div>

            {/* Copyright */}
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
              &copy; {new Date().getFullYear()} IBLevels. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
