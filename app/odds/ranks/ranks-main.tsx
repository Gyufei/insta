"use client";
import { Clock } from 'lucide-react';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import Image from 'next/image';

import { type TimeRange, useProfitLeaders, useVolumeLeaders } from '../common/use-ranks';
import ColorAvatar from '../components/ColorAvatar';

export default function Ranks() {
  const [timeRange, setTimeRange] = useState<TimeRange>('All');
  const [isHovered, setIsHovered] = useState<TimeRange | null>(null);
  const [countdown, setCountdown] = useState('');

  const {
    data: volumeData,
    isLoading: isLoadingVolume,
    error: volumeError,
  } = useVolumeLeaders(timeRange);
  const {
    data: profitData,
    isLoading: isLoadingProfit,
    error: profitError,
  } = useProfitLeaders(timeRange);

  const volumeLeaders = useMemo(() => {
    if (!volumeData) return [];

    return volumeData?.volume_leaders.map((leader) => ({
      id: leader.rank,
      rank: leader.rank,
      name: leader.name,
      avatar: leader.avatar,
      volume: leader.volume,
    }));
  }, [volumeData]);

  const profitLeaders = useMemo(() => {
    if (!profitData) return [];

    return profitData?.profit_leaders.map((leader) => ({
      id: leader.rank,
      rank: leader.rank,
      name: leader.name,
      avatar: leader.avatar,
      profit: leader.profit,
    }));
  }, [profitData]);

  const calculateTimeToNextMidnight = useCallback(() => {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setUTCHours(24, 0, 0, 0);

    const diff = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  }, []);

  useEffect(() => {
    // Initial calculation
    setCountdown(calculateTimeToNextMidnight());

    // Update every second
    const interval = setInterval(() => {
      setCountdown(calculateTimeToNextMidnight());
    }, 1000);

    return () => clearInterval(interval);
  }, [calculateTimeToNextMidnight]);

  return (
    <div className="mx-auto px-4 py-8 w-full">
      <h1 className="text-4xl font-bold text-center mb-6">Ranks</h1>

      {/* Time Range Selector */}
      <div className="flex items-center justify-center gap-1 mb-4">
        {(['Day', 'Week', 'Month', 'All'] as TimeRange[]).map((range) => (
          <button
            key={range}
            onMouseEnter={() => setIsHovered(range)}
            onMouseLeave={() => setIsHovered(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              timeRange === range
                ? 'bg-[var(--color-odd-main)] text-white'
                : isHovered === range
                  ? 'bg-[var(--color-odd-main-light)] text-[var(--color-odd-main)]'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setTimeRange(range)}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Reset Timer */}
      <div className="flex items-center justify-center gap-2 text-gray-600 mb-8">
        <Clock className="h-4 w-4" />
        <span className="text-sm">Resets in {countdown}</span>
      </div>

      {/* Leaderboards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Volume Leaders */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-5 w-1 bg-blue-600 rounded-full" />
            <h2 className="text-xl font-bold">Volume</h2>
          </div>

          <div className="space-y-4">
            {isLoadingVolume ? (
              // Loading state
              <div className="animate-pulse space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-6 bg-gray-200 h-4 rounded"></div>
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 h-4 bg-gray-200 rounded"></div>
                    <div className="w-24 h-4 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : volumeError ? (
              // Error state
              <div className="text-center py-4 text-red-600">
                {volumeError?.message || 'Failed to load volume leaders'}
              </div>
            ) : (
              // Data display
              volumeLeaders.map((user) => (
                <div key={user.id} className="flex items-center gap-4">
                  <div className="w-6 text-gray-500 font-medium">{user.rank}</div>
                  {user?.avatar ? (
                    <Image
                      width={32}
                      height={32}
                      src={user?.avatar || ''}
                      alt=""
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <ColorAvatar name={user.name} className="w-8 h-8" />
                  )}
                  <div className="flex-1 font-medium truncate">{user.name}</div>
                  <div className="text-right font-medium">{user.volume}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Profit Leaders */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-5 w-1 bg-blue-600 rounded-full" />
            <h2 className="text-xl font-bold">Profit</h2>
          </div>

          <div className="space-y-4">
            {isLoadingProfit ? (
              // Loading state
              <div className="animate-pulse space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-6 bg-gray-200 h-4 rounded"></div>
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 h-4 bg-gray-200 rounded"></div>
                    <div className="w-24 h-4 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : profitError ? (
              // Error state
              <div className="text-center py-4 text-red-600">
                {profitError?.message || 'Failed to load profit leaders'}
              </div>
            ) : (
              // Data display
              profitLeaders.map((user) => (
                <div key={user.id} className="flex items-center gap-4">
                  <div className="w-6 text-gray-500 font-medium">{user.rank}</div>
                  {user?.avatar ? (
                    <Image
                      width={32}
                      height={32}
                      src={user.avatar}
                      alt=""
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <ColorAvatar name={user.name} className="w-8 h-8" />
                  )}
                  <div className="flex-1 font-medium truncate">{user.name}</div>
                  <div className="text-right font-medium">{user.profit}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
