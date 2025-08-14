'use client';

import { useMemo } from 'react';

import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { useFavorites } from '../../common/favorite-context';
import { useMarkets } from '../../common/use-markets';

interface WatchlistMarket {
  id: string;
  title: string;
  imageUrl: string;
  totalVolume: number;
  endDate: string;
  topOutcome: {
    name: string;
    logo: string;
    probability: string;
  };
}

export const metadata: Metadata = {
  title: 'Odds Market  - Watchlist',
};

export default function Watchlist() {
  const { favorites } = useFavorites();

  const { data: marketsData, isLoading, error } = useMarkets();

  const favoriteMarkets: WatchlistMarket[] = useMemo(() => {
    if (!marketsData) return [];

    // Transform and filter markets
    const watchlistMarkets = marketsData?.market_list
      .filter((market) => favorites[market.market_id?.toString()])
      .map((market) => ({
        id: market.market_id?.toString() || '',
        title: market.title || '',
        imageUrl: market.image_url || '/image/img_placeholder.png',
        totalVolume: parseFloat(market.volume?.replace(/[^0-9.-]+/g, '') || '0'),
        endDate: market.endDate || '',
        topOutcome: {
          name: market.outcomes?.[0]?.name || 'Unknown',
          logo: market.outcomes?.[0]?.logo || '/images/img_placeholder.png',
          probability: market.outcomes?.[0]?.probability?.toString() + '%' || '0%',
        },
      }))
      .filter(Boolean);

    return watchlistMarkets;
  }, [marketsData, favorites]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex md:flex-row flex-col md:gap-3 gap-0 md:items-center items-start leading-[140%]">
          <span className="text-xl font-medium text-[#131E40]">Watchlist</span>
          <span className="text-[#A5ADC6] font-normal text-sm mt-[6px]">
            Track your favorite markets
          </span>
        </div>
        <div className="animate-pulse space-y-4 border border-[#ebebeb] rounded-[8px] p-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg p-4 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:gap-3 gap-0 items-center leading-[140%]">
          <span className="text-xl font-medium text-[#131E40]">Watchlist</span>
          <span className="text-[#A5ADC6] font-normal text-sm mt-[6px]">
            Track your favorite markets
          </span>
        </div>
        <div className="bg-red-50 border border-[#ebebeb] rounded-[8px] p-4 text-red-700">
          {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex md:flex-row flex-col md:gap-3 gap-0 md:items-center items-start leading-[140%]">
        <span className="text-xl font-medium text-[#131E40]">Watchlist</span>
        <span className="text-[#A5ADC6] font-normal text-sm mt-[6px]">
          Track your favorite markets
        </span>
      </div>

      <div className="border border-[#ebebeb] rounded-[8px] p-4">
        {/* 表头：仅大屏显示 */}
        <div className="py-3 border-b grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 hidden md:grid">
          <div className="md:col-span-6 col-span-4">MARKET</div>
          <div className="md:col-span-2 col-span-3">VOLUME</div>
          <div className="md:col-span-2 col-span-3">TOP OUTCOME</div>
          <div className="md:col-span-2 col-span-2 text-right">CHANCE</div>
        </div>

        <div className="divide-y">
          {favoriteMarkets.length === 0 ? (
            <div className="py-4 text-center text-gray-500 mt-4">
              No markets in your watchlist yet.
            </div>
          ) : (
            <>
              {favoriteMarkets.map((market) => (
                <div
                  key={market.id}
                  className="py-4 md:grid md:grid-cols-12 md:gap-4 md:items-center flex flex-col gap-2 md:bg-transparent mb-4 md:mb-0"
                >
                  {/* MARKET */}
                  <div className="md:col-span-6 flex items-center gap-6 min-w-0 w-full">
                    <div className="md:hidden text-xs text-gray-400 mb-1">MARKET</div>
                    <Link
                      href={`/odds/market/${market.id}`}
                      className="flex items-center gap-3 min-w-0 hover:text-pro-blue w-full"
                    >
                      <Image
                        src={market.imageUrl}
                        alt=""
                        width={40}
                        height={40}
                        className="rounded-lg object-cover flex-shrink-0 md:h-10 md:w-10 h-5 w-5"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-medium mb-1 truncate">{market.title}</div>
                        <div className="text-sm text-gray-600">{market.endDate}</div>
                      </div>
                    </Link>
                  </div>

                  {/* VOLUME */}
                  <div className="md:col-span-2 whitespace-nowrap w-full flex md:block justify-between items-center">
                    <div className="md:hidden text-xs text-gray-400 mb-1">VOLUME</div>
                    <span className="font-medium">${market.totalVolume.toLocaleString()}</span>
                  </div>

                  {/* TOP OUTCOME */}
                  <div className="md:col-span-2 min-w-0 w-full flex md:block items-center gap-2 justify-between md:justify-end">
                    <div className="md:hidden text-xs text-gray-400 mb-1">TOP OUTCOME</div>
                    <div className="flex items-center gap-2">
                      <Image
                        src={market.topOutcome.logo}
                        alt={market.topOutcome.name}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full flex-shrink-0"
                      />
                      <span className="font-medium truncate">{market.topOutcome.name}</span>
                    </div>
                  </div>

                  {/* CHANCE */}
                  <div className="md:col-span-2 flex items-center md:justify-end justify-between gap-2 flex-shrink-0 w-full">
                    <div className="md:hidden text-xs text-gray-400 mb-1">CHANCE</div>
                    <span className="font-medium">{market.topOutcome.probability}</span>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
