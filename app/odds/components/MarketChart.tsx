/* eslint-disable @typescript-eslint/no-explicit-any */
import { LineStyle, createChart } from 'lightweight-charts';

import React, { useCallback, useEffect, useRef } from 'react';

import { useMarketItemChart } from '../common/use-market-item-chart';

interface MarketChartProps {
  marketId: string;
  timeframe: '1H' | '6H' | '1D' | '1W' | '1M' | 'ALL';
  outcomeCount?: number;
  outcomeNames?: string[];
}

export default function MarketChart({
  marketId,
  timeframe,
  outcomeCount = 2,
  outcomeNames,
}: MarketChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRefs = useRef<any[]>([]);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const logoHiderRef = useRef<HTMLStyleElement | null>(null);

  const { data: chartData, isLoading, error } = useMarketItemChart(marketId, timeframe);

  const handleResize = useCallback(() => {
    if (chartRef.current && chartContainerRef.current) {
      chartRef.current.applyOptions({
        width: chartContainerRef.current.clientWidth,
      });
    }
  }, []);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create style element to hide TradingView logo
    const style = document.createElement('style');
    style.textContent = '#tv-attr-logo { display: none !important; }';
    document.head.appendChild(style);
    logoHiderRef.current = style;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 280,
      layout: {
        background: { color: '#ffffff' },
        textColor: '#333',
        fontFamily: 'Aeonik, system-ui, sans-serif',
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { color: '#f0f0f0' },
      },
      rightPriceScale: {
        autoScale: false,
        scaleMargins: {
          top: 0.08,
          bottom: 0.08,
        },
        borderVisible: true,
        visible: true,
        borderColor: '#f0f0f0',
        ticksVisible: true,
        textColor: '#999',
        tickMarkLength: 0,
        entireTextOnly: true,
        drawTicks: true,
        alignLabels: true,
        tickSpacing: 60,
        minMove: 1,
        mode: 0,
        minimumValue: 0,
        maximumValue: 100,
        handleScale: false,
        handleScroll: false,
        fixedRange: {
          minValue: 0,
          maxValue: 100,
        },
        ticks: {
          visible: true,
          values: [0, 20, 40, 60, 80, 100],
          formatter: (price: number) => `${price}%`,
        },
      },
      timeScale: {
        borderVisible: false,
        visible: false,
        handleScale: false,
        handleScroll: false,
      },
      handleScale: false,
      handleScroll: false,
      crosshair: {
        vertLine: {
          width: 1,
          color: '#999',
          style: LineStyle.Solid,
        },
        horzLine: {
          width: 1,
          color: '#999',
          style: LineStyle.Solid,
        },
      },
    } as any);

    // Color palette for multiple outcomes
    const colors = [
      '#10B981', // Green
      '#EF4444', // Red
      '#3B82F6', // Blue
      '#8B5CF6', // Purple
      '#EC4899', // Pink
      '#F59E0B', // Yellow
      '#6366F1', // Indigo
    ];

    // Add series for each outcome
    seriesRefs.current = Array(outcomeCount)
      .fill(null)
      .map((_, index) => {
        return (chart as any).addLineSeries({
          type: 'Line',
          color: colors[index % colors.length],
          lineWidth: 3,
          autoscaleInfoProvider: () => ({
            priceRange: {
              minValue: 0,
              maxValue: 100,
            },
          }),
          priceFormat: {
            type: 'price',
            precision: 2,
            minMove: 0.01,
          },
          lastValueVisible: false,
          priceLineVisible: false,
          crosshairMarkerVisible: true,
          crosshairMarkerRadius: 6,
        } as any);
      });

    if (chartData && chartData.data_points.length > 0) {
      // Set data for each series
      seriesRefs.current.forEach((series, index) => {
        const seriesData = chartData.data_points
          .filter((point) => point.values[index] !== undefined)
          .map((point) => ({
            time: Math.floor(point.time / 1000), // Convert to seconds and ensure integer
            value: point.values[index],
          }))
          .sort((a, b) => a.time - b.time); // Ensure chronological order

        series.setData(seriesData);
      });

      // Fit content after data is loaded
      chart.timeScale().fitContent();
    }

    // Create labels for each outcome
    const labels = Array(outcomeCount)
      .fill(null)
      .map((_, index) => {
        const label = document.createElement('div');
        label.style.position = 'absolute';
        label.style.top = '0';
        label.style.left = '0';
        label.style.padding = '4px 8px';
        label.style.backgroundColor = `${colors[index]}`;
        label.style.color = 'white';
        label.style.borderRadius = '4px';
        label.style.fontSize = '12px';
        label.style.fontWeight = '500';
        label.style.whiteSpace = 'nowrap';
        label.style.opacity = '0';
        label.style.transition = 'all 0.2s ease-out';
        label.style.zIndex = '10';
        label.style.pointerEvents = 'none';
        label.style.willChange = 'opacity';

        if (chartContainerRef.current) {
          chartContainerRef.current.appendChild(label);
        }

        return label;
      });

    // Update label positions
    const LABEL_OFFSET = 10; // Define offset constant at the top level

    const updateLabelPositions = (param: any) => {
      const currentTime = param?.time;
      if (!currentTime || !chartContainerRef.current) {
        labels.forEach((label) => {
          label.style.opacity = '0';
        });
        return;
      }

      // Find the closest data point
      const point = chartData?.data_points.find(
        (d) => Math.floor(d.time / 1000) === Math.floor(currentTime)
      );
      if (!point) return;

      const timeCoord = chart.timeScale().timeToCoordinate(currentTime);
      if (timeCoord === null) return;

      // Update each label
      labels.forEach((label, index) => {
        const coord = seriesRefs.current[index].priceToCoordinate(point.values[index]);
        if (coord === null) return;

        label.style.opacity = '1';
        label.textContent = `${outcomeNames?.[index] || `Outcome ${index + 1}`}: ${point.values[index].toFixed(1)}%`;

        const top = coord - label.offsetHeight / 2;
        const left = timeCoord + LABEL_OFFSET;

        // Position label
        label.style.transform = `translate(${left}px, ${top}px)`;
        label.dataset.originalTop = top.toString();
      });

      // Handle label overlap
      const sortedLabels = labels
        .map((label, index) => ({
          label,
          top: parseFloat(label.dataset.originalTop || '0') || 0,
          index,
        }))
        .sort((a, b) => a.top - b.top);

      // Adjust positions to prevent overlap
      let lastAdjustedTop = sortedLabels[0].top;
      for (let i = 1; i < sortedLabels.length; i++) {
        const curr = sortedLabels[i];
        const minSpace = 25; // Slightly reduced spacing for better compactness

        if (curr.top - lastAdjustedTop < minSpace) {
          const newTop = lastAdjustedTop + minSpace;
          const left = timeCoord + LABEL_OFFSET;
          curr.label.style.transform = `translate(${left}px, ${newTop}px)`;
          lastAdjustedTop = newTop;
        } else {
          lastAdjustedTop = curr.top;
        }
      }
    };

    chart.subscribeCrosshairMove(updateLabelPositions);

    // Set up ResizeObserver
    resizeObserverRef.current = new ResizeObserver(handleResize);
    resizeObserverRef.current.observe(chartContainerRef.current);

    chartRef.current = chart;

    const chartConRefCurrent = chartContainerRef.current;

    return () => {
      // Clean up ResizeObserver
      if (resizeObserverRef.current && chartConRefCurrent) {
        resizeObserverRef.current.unobserve(chartConRefCurrent);
        resizeObserverRef.current.disconnect();
      }

      // Clean up labels
      labels.forEach((label) => {
        if (chartConRefCurrent && label.parentNode === chartConRefCurrent) {
          chartConRefCurrent.removeChild(label);
        }
      });

      // Remove logo hider style element
      if (logoHiderRef.current) {
        logoHiderRef.current.remove();
      }
      chart.remove();
    };
  }, [timeframe, outcomeCount, handleResize, chartData, outcomeNames]);

  if (isLoading) {
    return (
      <div className="w-full h-[280px] flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[280px] flex items-center justify-center bg-gray-50 text-red-600">
        {error.message}
      </div>
    );
  }

  return <div ref={chartContainerRef} className="w-full relative" style={{ height: '280px' }} />;
}
