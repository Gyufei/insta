'use client';

import {
  CategoryScale,
  Chart as ChartJS,
  type ChartOptions,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';

import React, { useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';

import RangeTabs from '@/components/common/range-tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { IMetricsItem, useMetrics } from '@/lib/data/use-metrics';
import { formatNumber, formatNumberUnit } from '@/lib/utils/number';

// 注册 Chart.js 组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

type TimeRange = '14D' | '30D' | 'ALL';

function filterByRange(data: IMetricsItem[], range: TimeRange) {
  if (range === 'ALL') return data;
  const days = range === '14D' ? 14 : 30;
  return data.slice(-days);
}

function MetricsChart({
  series,
}: {
  series: { label: string; values: { time: number; value: number }[] };
}) {
  const chartData = useMemo(() => {
    const labels = series.values.map((item) => {
      const date = new Date(item.time * 1000);
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      return `${mm}-${dd}`;
    });

    return {
      labels,
      datasets: [
        {
          label: series.label,
          data: series.values.map((item) => item.value),
          borderColor: '#6C63FF',
          backgroundColor: 'rgba(108, 99, 255, 0.25)',
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: '#6C63FF',
          pointHoverBorderColor: '#ffffff',
          pointHoverBorderWidth: 2,
        },
      ],
    };
  }, [series]);

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#6C63FF',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function (context) {
            return `${formatNumberUnit(context.parsed.y)}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: '#9CA3AF',
          font: {
            family: 'Aeonik, system-ui, sans-serif',
            size: 12,
          },
        },
      },
      y: {
        display: true,
        beginAtZero: true,
        grid: {
          color: '#F2F2F2',
        },
        border: {
          display: false,
        },
        ticks: {
          color: '#9CA3AF',
          font: {
            family: 'Aeonik, system-ui, sans-serif',
            size: 12,
          },
          maxTicksLimit: 5,
          callback: function (value) {
            return formatNumberUnit(Number(value));
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  return (
    <div className="w-full" style={{ height: 260 }}>
      <Line data={chartData} options={options} />
    </div>
  );
}

export function MetricsContent() {
  const [leftRange, setLeftRange] = useState<TimeRange>('14D');
  // const [rightRange, setRightRange] = useState<TimeRange>('14D');
  const { data = [], isLoading, error } = useMetrics();

  const baseData = useMemo<IMetricsItem[]>(() => {
    return data || [];
  }, [data]);

  const leftFiltered = useMemo(
    () => filterByRange(baseData || [], leftRange),
    [baseData, leftRange]
  );
  // const rightFiltered = useMemo(
  //   () => filterByRange(baseData || [], rightRange),
  //   [baseData, rightRange]
  // );

  const holdersSeries = useMemo(() => {
    return leftFiltered.map((d) => ({
      time: Math.floor(new Date(d.date).getTime() / 1000),
      value: d.data.holders,
    }));
  }, [leftFiltered]);

  // const sandboxSeries = useMemo(() => {
  //   return rightFiltered.map((d) => ({
  //     time: Math.floor(new Date(d.date).getTime() / 1000),
  //     value: d.data.sandboxAccounts,
  //   }));
  // }, [rightFiltered]);

  const holdersLatest = leftFiltered.length
    ? leftFiltered[leftFiltered.length - 1].data.holders
    : 0;

  // const sandboxLatest = rightFiltered.length
  //   ? rightFiltered[rightFiltered.length - 1].data.sandboxAccounts
  //   : 0;

  return (
    <div className="grid grid-cols-1 gap-4 px-4 2xl:px-12">
      <Card className="border-[#EBEBEB] rounded-[8px]">
        <CardHeader className="flex items-start justify-between gap-4 px-5">
          <div>
            <CardDescription className="text-[#A5ADC6] text-sm">monUSD Holders</CardDescription>
            <CardTitle className="text-[32px] font-medium leading-[140%] text-primary mt-[10px]">
              {formatNumber(holdersLatest)}
            </CardTitle>
          </div>
          <RangeTabs value={leftRange} onChange={setLeftRange} />
        </CardHeader>
        <CardContent className="px-5">
          {isLoading ? (
            <div className="w-full h-[260px] flex items-center justify-center bg-gray-50">
              <div className="animate-spin w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
            </div>
          ) : error ? (
            <div className="w-full h-[260px] flex items-center justify-center text-red-600">
              {error.message}
            </div>
          ) : (
            <MetricsChart series={{ label: 'Holders', values: holdersSeries }} />
          )}
        </CardContent>
      </Card>

      {/* <Card className="border-[#EBEBEB] rounded-[8px]">
        <CardHeader className="flex items-start justify-between gap-4 px-5">
          <div>
            <CardDescription className="text-[#A5ADC6] text-sm">Sandbox Users</CardDescription>
            <CardTitle className="text-[32px] font-medium leading-[140%] text-primary mt-[10px]">
              {formatNumber(sandboxLatest)}
            </CardTitle>
          </div>
          <RangeTabs value={rightRange} onChange={setRightRange} />
        </CardHeader>
        <CardContent className="px-5">
          {isLoading ? (
            <div className="w-full h-[260px] flex items-center justify-center bg-gray-50">
              <div className="animate-spin w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
            </div>
          ) : error ? (
            <div className="w-full h-[260px] flex items-center justify-center text-red-600">
              {error.message}
            </div>
          ) : (
            <MetricsChart series={{ label: 'SandboxUsers', values: sandboxSeries }} />
          )}
        </CardContent>
      </Card> */}
    </div>
  );
}
