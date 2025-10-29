'use client';

import { useEffect, useRef, useMemo } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData, Time, IPriceLine } from 'lightweight-charts';
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
  const priceLinesRef = useRef<IPriceLine[]>([]);
  const { resolvedTheme } = useTheme();
  
  // Memoize candlestick data to avoid recalculations
  const candlestickData = useMemo(() => {
    return data
      .map((level) => ({
        time: (new Date(level.date).getTime() / 1000) as Time,
        open: level.open,
        high: level.high,
        low: level.low,
        close: level.close,
      }))
      .sort((a, b) => (a.time as number) - (b.time as number));
  }, [data]);

  // Create chart only once
  useEffect(() => {
    if (!chartContainerRef.current || chartRef.current) return;

    // Responsive height
    const isMobile = window.innerWidth < 640;
    const chartHeight = isMobile ? 400 : 600;

    // Theme-aware colors
    const isDark = resolvedTheme === 'dark';
    const bgColor = isDark ? '#1f2937' : '#ffffff';
    const textColor = isDark ? '#e5e7eb' : '#333333';
    const gridColor = isDark ? '#374151' : '#f0f0f0';

    // Create chart with optimized settings
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
        borderVisible: false, // Simplify appearance
      },
      rightPriceScale: {
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
        borderVisible: false, // Simplify appearance
      },
      crosshair: {
        mode: 1, // Normal mode (less CPU intensive than magnet mode)
        vertLine: {
          width: 1,
          color: isDark ? '#4b5563' : '#d1d5db',
          style: 1, // Dashed
          labelBackgroundColor: isDark ? '#374151' : '#9ca3af',
        },
        horzLine: {
          width: 1,
          color: isDark ? '#4b5563' : '#d1d5db',
          style: 1, // Dashed
          labelBackgroundColor: isDark ? '#374151' : '#9ca3af',
        },
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: false, // Disable for better performance
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
    });

    chartRef.current = chart;

    // Add candlestick series with optimized settings
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
      priceScaleId: 'right',
      // Performance optimizations
      priceLineVisible: false,
      lastValueVisible: true,
    });

    seriesRef.current = candlestickSeries;

    // Debounced resize handler for better performance
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (chartContainerRef.current && chartRef.current) {
          const isMobile = window.innerWidth < 640;
          const chartHeight = isMobile ? 400 : 600;
          chart.applyOptions({
            width: chartContainerRef.current.clientWidth,
            height: chartHeight,
          });
        }
      }, 150); // Debounce 150ms
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(resizeTimeout); // Clean up debounce timeout
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        seriesRef.current = null;
      }
    };
  }, []);

  // Update theme without recreating chart
  useEffect(() => {
    if (!chartRef.current) return;

    const isDark = resolvedTheme === 'dark';
    const bgColor = isDark ? '#1f2937' : '#ffffff';
    const textColor = isDark ? '#e5e7eb' : '#333333';
    const gridColor = isDark ? '#374151' : '#f0f0f0';

    chartRef.current.applyOptions({
      layout: {
        background: { color: bgColor },
        textColor: textColor,
      },
      grid: {
        vertLines: { color: gridColor },
        horzLines: { color: gridColor },
      },
    });
  }, [resolvedTheme]);

  // Update data and IB lines
  useEffect(() => {
    if (!seriesRef.current || !chartRef.current || !candlestickData.length) return;

    // Clear all existing price lines to avoid duplicates
    priceLinesRef.current.forEach((line) => {
      try {
        seriesRef.current?.removePriceLine(line);
      } catch (error) {
        console.warn('Could not remove price line:', error);
      }
    });
    priceLinesRef.current = [];

    // Update candlestick data
    seriesRef.current.setData(candlestickData);

    // Add IB level lines only if we have data
    if (data.length > 0) {
      const latestData = data[0];
      const newPriceLines: IPriceLine[] = [];

      // IB 1H High
      if (latestData.initialBalance.ib1hHigh > 0) {
        const line = seriesRef.current.createPriceLine({
          price: latestData.initialBalance.ib1hHigh,
          color: '#3b82f6',
          lineWidth: 2,
          lineStyle: 0, // solid
          axisLabelVisible: true,
          title: 'IB 1H High',
        });
        newPriceLines.push(line);
      }

      // IB 1H Low
      if (latestData.initialBalance.ib1hLow > 0) {
        const line = seriesRef.current.createPriceLine({
          price: latestData.initialBalance.ib1hLow,
          color: '#3b82f6',
          lineWidth: 2,
          lineStyle: 0, // solid
          axisLabelVisible: true,
          title: 'IB 1H Low',
        });
        newPriceLines.push(line);
      }

      // IB 15M High
      if (latestData.initialBalance.ib15mHigh > 0) {
        const line = seriesRef.current.createPriceLine({
          price: latestData.initialBalance.ib15mHigh,
          color: '#8b5cf6',
          lineWidth: 1,
          lineStyle: 1, // dashed
          axisLabelVisible: true,
          title: 'IB 15M High',
        });
        newPriceLines.push(line);
      }

      // IB 15M Low
      if (latestData.initialBalance.ib15mLow > 0) {
        const line = seriesRef.current.createPriceLine({
          price: latestData.initialBalance.ib15mLow,
          color: '#8b5cf6',
          lineWidth: 1,
          lineStyle: 1, // dashed
          axisLabelVisible: true,
          title: 'IB 15M Low',
        });
        newPriceLines.push(line);
      }

      // Store references to new price lines
      priceLinesRef.current = newPriceLines;
    }

    chartRef.current?.timeScale().fitContent();
  }, [candlestickData, data]);

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

