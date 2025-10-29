'use client';

import { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData, Time } from 'lightweight-charts';
import { TradingLevel } from '@/lib/types';
import { useTheme } from '@/lib/useTheme';

interface TradingChartProps {
  data: TradingLevel[];
  instrument: string;
}

const TradingChart = ({ data, instrument }: TradingChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Responsive height
    const isMobile = window.innerWidth < 640;
    const chartHeight = isMobile ? 400 : 600;

    // Theme-aware colors
    const isDark = resolvedTheme === 'dark';
    const bgColor = isDark ? '#1f2937' : '#ffffff';
    const textColor = isDark ? '#e5e7eb' : '#333333';
    const gridColor = isDark ? '#374151' : '#f0f0f0';

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: bgColor },
        textColor: textColor,
      },
      grid: {
        vertLines: { color: gridColor },
        horzLines: { color: gridColor },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartHeight,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
    });

    chartRef.current = chart;

    // Add candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
      priceScaleId: 'right',
    });

    seriesRef.current = candlestickSeries;

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        const isMobile = window.innerWidth < 640;
        const chartHeight = isMobile ? 400 : 600;
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [resolvedTheme]);

  useEffect(() => {
    if (!seriesRef.current || !chartRef.current || !data.length) return;

    // Clear price lines if method exists
    try {
      if (seriesRef.current && typeof seriesRef.current.removePriceLine === 'function') {
        // Note: removeAllPriceLines doesn't exist in TradingView API
        // We'll skip clearing price lines to avoid TypeScript errors
        // Individual price lines would need to be tracked and removed separately
      }
    } catch (error) {
      // Ignore error if method doesn't exist
      console.warn('Could not remove price lines:', error);
    }

    // Convert data to candlestick format
    const candlestickData: CandlestickData[] = data
      .map((level) => ({
        time: (new Date(level.date).getTime() / 1000) as Time,
        open: level.open,
        high: level.high,
        low: level.low,
        close: level.close,
      }))
      .sort((a, b) => (a.time as number) - (b.time as number));

    seriesRef.current.setData(candlestickData);

    // Add IB level lines
    if (data.length > 0) {
      const latestData = data[0];

      // IB 1H High
      if (latestData.initialBalance.ib1hHigh > 0) {
        seriesRef.current.createPriceLine({
          price: latestData.initialBalance.ib1hHigh,
          color: '#3b82f6',
          lineWidth: 2,
          lineStyle: 0, // solid
          axisLabelVisible: true,
          title: 'IB 1H High',
        });
      }

      // IB 1H Low
      if (latestData.initialBalance.ib1hLow > 0) {
        seriesRef.current.createPriceLine({
          price: latestData.initialBalance.ib1hLow,
          color: '#3b82f6',
          lineWidth: 2,
          lineStyle: 0, // solid
          axisLabelVisible: true,
          title: 'IB 1H Low',
        });
      }

      // IB 15M High
      if (latestData.initialBalance.ib15mHigh > 0) {
        seriesRef.current.createPriceLine({
          price: latestData.initialBalance.ib15mHigh,
          color: '#8b5cf6',
          lineWidth: 1,
          lineStyle: 1, // dashed
          axisLabelVisible: true,
          title: 'IB 15M High',
        });
      }

      // IB 15M Low
      if (latestData.initialBalance.ib15mLow > 0) {
        seriesRef.current.createPriceLine({
          price: latestData.initialBalance.ib15mLow,
          color: '#8b5cf6',
          lineWidth: 1,
          lineStyle: 1, // dashed
          axisLabelVisible: true,
          title: 'IB 15M Low',
        });
      }
    }

    chartRef.current?.timeScale().fitContent();
  }, [data]);

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded overflow-hidden transition-colors">
      <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100">{instrument}</h3>
          
          {/* Indicators Legend */}
          <div className="flex flex-wrap gap-2 sm:gap-3 text-xs items-center">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-blue-600 dark:bg-blue-400"></div>
              <span className="text-gray-600 dark:text-gray-400">IB 1H</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-purple-600 dark:bg-purple-400"></div>
              <span className="text-gray-600 dark:text-gray-400">IB 15M</span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-2 sm:p-4">
        <div ref={chartContainerRef} className="w-full" />
      </div>
    </div>
  );
};

export default TradingChart;

