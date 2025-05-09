'use client';

import { useMemo } from 'react';

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
          logo: market.outcomes?.[0]?.logo || '/image/img_placeholder.png',
          probability: market.outcomes?.[0]?.probability?.toString() + '%' || '0%',
        },
      }))
      .filter(Boolean);

    return watchlistMarkets;
  }, [marketsData, favorites]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Watchlist</h1>
          <p className="text-gray-600 mt-2">Track your favorite markets</p>
        </div>
        <div className="animate-pulse space-y-4">
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
        <div>
          <h1 className="text-3xl font-bold">Watchlist</h1>
          <p className="text-gray-600 mt-2">Track your favorite markets</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">{error.message}</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Watchlist</h1>
        <p className="text-gray-600 mt-2">Track your favorite markets</p>
      </div>

      {favoriteMarkets.length > 0 ? (
        <div>
          <div className="py-3 border-b grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
            <div className="col-span-6">MARKET</div>
            <div className="col-span-2">VOLUME</div>
            <div className="col-span-2">TOP OUTCOME</div>
            <div className="col-span-2 text-right">CHANCE</div>
          </div>

          <div className="divide-y">
            {favoriteMarkets.map((market) => (
              <div
                key={market.id}
                className="py-4 grid grid-cols-12 gap-4 items-center transition-colors hover:bg-gray-100/50"
              >
                <div className="col-span-6 flex items-center gap-3 min-w-0">
                  <Link
                    href={`/odds/market/${market.id}`}
                    className="flex items-center gap-3 min-w-0 hover:text-[var(--color-odd-main)]"
                  >
                    <Image
                      src={market.imageUrl}
                      alt=""
                      width={40}
                      height={40}
                      className="rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium mb-1 truncate">{market.title}</div>
                      <div className="text-sm text-gray-600">{market.endDate}</div>
                    </div>
                  </Link>
                </div>

                <div className="col-span-2 whitespace-nowrap">
                  ${market.totalVolume.toLocaleString()}
                </div>

                <div className="col-span-2 min-w-0">
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

                <div className="col-span-2 flex items-center justify-end gap-2 flex-shrink-0">
                  <span className="font-medium">{market.topOutcome.probability}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">No markets in your watchlist yet.</div>
      )}
    </div>
  );
}
