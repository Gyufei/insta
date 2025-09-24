'use client';

import { Snail, Star } from 'lucide-react';

import { useMemo, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { cn } from '@/lib/utils';
import { useIsMobile } from '@/lib/utils/use-mobile';

import { useFavorites } from '../common/favorite-context';
import { CATEGORIES } from '../common/odds-const';
import { useMarketActivities } from '../common/use-market-activities';
import { useMarkets } from '../common/use-markets';
import { IVolumeLeaderItem, useVolumeLeader } from '../common/use-volume-leader';
import ColorAvatar from '../components/ColorAvatar';
import MarketCard from '../components/MarketCard';
import MarketSkeleton from '../components/MarketSkeleton';

type FilterType = { type: 'category' | 'status'; value: string };

export default function MarketList() {
  const [activeFilter, setActiveFilter] = useState<FilterType>({
    type: 'category',
    value: 'all',
  });

  const { favorites } = useFavorites();
  const [showFavorites, setShowFavorites] = useState(false);
  const [visibleCount, setVisibleCount] = useState<number>(18);

  const isMobile = useIsMobile();
  const [showTabs, setShowTabs] = useState<'Markets' | 'Activity' | 'Volume'>('Markets');

  // Format timestamp to relative time
  const formatRelativeTime = (timestamp: number) => {
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - timestamp) / 1000);

    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
    return `${Math.floor(diffSeconds / 86400)}d ago`;
  };

  const {
    data: activitiesData,
    isLoading: isLoadingActivities,
    error: activityError,
  } = useMarketActivities();

  const activities = useMemo(() => {
    if (!activitiesData) return [];

    const formattedActivities = activitiesData.activities.slice(0, 10).map((activity) => ({
      ...activity,
      time: formatRelativeTime(activity.time),
    }));

    return formattedActivities;
  }, [activitiesData]);

  const {
    data: volumeLeadersData,
    isLoading: isLoadingVolumeLeaders,
    error: volumeLeadersError,
  } = useVolumeLeader();

  const volumeLeaders = useMemo(() => {
    if (!volumeLeadersData) return [];

    const formattedLeaders = volumeLeadersData.volume_leaders.map((leader: IVolumeLeaderItem) => ({
      ...leader,
      volume: `$${parseInt(leader.volume).toLocaleString()}`,
    }));

    return formattedLeaders;
  }, [volumeLeadersData]);

  const {
    data: marketData,
    isLoading: isMarketLoading,
    error: marketError,
  } = useMarkets(
    activeFilter.type === 'category' ? activeFilter.value : undefined,
    activeFilter.type === 'status' ? activeFilter.value : undefined
  );

  const markets = useMemo(() => {
    if (!marketData) return [];

    const transformedMarkets = marketData.market_list
      .map((market) => {
        const volume = market.volume || '0';

        const formattedVolume = typeof volume === 'string' ? volume : '0';

        return {
          id: market.market_id?.toString() || '',
          title: market.title || '',
          imageUrl: market.image_url || '/images/img_placeholder.png',
          volume: formattedVolume,
          outcomes: Array.isArray(market.outcomes)
            ? market.outcomes.map((outcome) => ({
                name: outcome.name || '',
                probability: Number(outcome.probability || 0),
                status: outcome?.status,
                players: Number(outcome.players || 0),
              }))
            : [],
          visitors: Array.isArray(market.outcomes)
            ? market.outcomes.reduce(
                (sum: number, outcome) => sum + (Number(outcome.players) || 0),
                0
              )
            : 0,
        };
      })
      .filter(Boolean);

    return transformedMarkets;
  }, [marketData]);

  // Filter markets based on selected category
  const filteredMarkets = useMemo(() => {
    if (!markets) return [];
    return showFavorites ? markets.filter((market) => favorites[market.id]) : markets;
  }, [markets, showFavorites, favorites]);

  const visibleMarkets = filteredMarkets.slice(0, visibleCount);
  const hasMore = visibleCount < filteredMarkets.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const handleCategoryChange = (category: string) => {
    const path = category.toLowerCase();
    setActiveFilter({ type: 'category', value: path });
  };

  const handleStatusChange = (status: string) => {
    if (activeFilter.type === 'status' && activeFilter.value === status) {
      setActiveFilter({ type: 'category', value: 'all' });
    } else {
      setActiveFilter({ type: 'status', value: status });
    }
  };

  const [mbSelectedValue, setMbSelectedValue] = useState('All');

  function handleMbCategoryChange(val: string) {
    setMbSelectedValue(val);

    if (val === 'Favorites') {
      setShowFavorites(!showFavorites);
      return;
    }

    if (val === 'Ended') {
      handleStatusChange('ended');
    } else if (val === 'Resolved') {
      handleStatusChange('resolved');
    } else {
      handleCategoryChange(val);
    }
  }

  return (
    <>
      {/* Categories */}
      <div className="border-b bg-white mt-5 w-full md:block hidden">
        <div className="flex items-center justify-between">
          <div className="flex-1 overflow-x-auto overflow-visible no-scrollbar">
            <div className="flex items-center gap-6 min-w-max">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  className={`px-2 py-3 relative whitespace-nowrap font-medium ${
                    activeFilter.type === 'category' &&
                    activeFilter.value.toLowerCase() === category.toLowerCase()
                      ? 'text-[var(--color-tab-text-active)]'
                      : 'text-[var(--color-tab-text)] hover:text-[var(--color-tab-text-hover)]'
                  }`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                  {activeFilter.type === 'category' &&
                    activeFilter.value.toLowerCase() === category.toLowerCase() && (
                      <div className="w-full h-[2px] bg-[#131E40] absolute bottom-[-0.5px] left-0"></div>
                    )}
                </button>
              ))}
              <button
                className={`px-2 py-3 relative whitespace-nowrap font-medium ${
                  activeFilter.type === 'status' && activeFilter.value === 'ended'
                    ? 'text-[var(--color-tab-text-active)]'
                    : 'text-[var(--color-tab-text)] hover:text-[var(--color-tab-text-hover)]'
                }`}
                onClick={() => handleStatusChange('ended')}
              >
                Ended
                {activeFilter.type === 'status' && activeFilter.value.toLowerCase() === 'ended' && (
                  <div className="w-full h-[2px] bg-[#131E40] absolute bottom-[-0.5px] left-0"></div>
                )}
              </button>
              <button
                className={`px-2 py-3 relative whitespace-nowrap font-medium ${
                  activeFilter.type === 'status' && activeFilter.value === 'resolved'
                    ? 'text-[var(--color-tab-text-active)]'
                    : 'text-[var(--color-tab-text)] hover:text-[var(--color-tab-text-hover)]'
                }`}
                onClick={() => handleStatusChange('resolved')}
              >
                Resolved
                {activeFilter.type === 'status' &&
                  activeFilter.value.toLowerCase() === 'resolved' && (
                    <div className="w-full h-[2px] bg-[#131E40] absolute bottom-[-0.5px] left-0"></div>
                  )}
              </button>
            </div>
          </div>

          <div className="flex-none pl-6">
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className={`p-2 rounded-lg transition-colors ${
                showFavorites ? 'text-[#131E40]' : 'text-[#A5ADC6] hover:text-[#6E75F9]'
              }`}
            >
              <Star
                className={`h-5 w-5 ${showFavorites ? 'fill-yellow-500 text-yellow-500' : ''}`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="md:hidden relative flex justify-between items-center mt-4">
        <div className="absolute bottom-0  right-0 left-0 h-[1px] bg-[#ebebeb]"></div>
        <div className="flex items-center gap-2">
          <div
            onClick={() => setShowTabs('Markets')}
            className={cn(
              'text-sm px-2 py-3 font-medium ',
              showTabs === 'Markets' ? 'text-[#131E40] border-b border-[#131E40]' : 'text-[#A5ADC6]'
            )}
          >
            Markets
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div
            onClick={() => setShowTabs('Activity')}
            className={cn(
              'text-sm px-2 py-3 font-medium ',
              showTabs === 'Activity'
                ? 'text-[#131E40] border-b border-[#131E40]'
                : 'text-[#A5ADC6]'
            )}
          >
            Recent Activity
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div
            onClick={() => setShowTabs('Volume')}
            className={cn(
              'text-sm px-2 py-3 font-medium ',
              showTabs === 'Volume' ? 'text-[#131E40] border-b border-[#131E40]' : 'text-[#A5ADC6]'
            )}
          >
            Top Volume This Week
          </div>
        </div>
      </div>

      <div className={cn('md:hidden block mt-4', isMobile && showTabs !== 'Markets' && 'hidden')}>
        <Select value={mbSelectedValue} onValueChange={handleMbCategoryChange}>
          <SelectTrigger className="w-full mt-3 shadow-none focus-visible:ring-0">
            <SelectValue placeholder="Select a token" />
          </SelectTrigger>
          <SelectContent className="border border-[#EBEBEB] shadow-none">
            {CATEGORIES.map((category) => (
              <SelectItem
                className="border-b border-[#EBEBEB] last:border-b-0"
                key={category}
                value={category}
              >
                <div className="flex items-center gap-2">
                  <span>{category}</span>
                </div>
              </SelectItem>
            ))}
            <SelectItem value={'Ended'}>
              <div className="flex items-center gap-2">
                <span>Ended</span>
              </div>
            </SelectItem>
            <SelectItem value={'Resolved'}>
              <div className="flex items-center gap-2">
                <span>Resolved</span>
              </div>
            </SelectItem>
            <SelectItem value={'Favorites'}>
              <div className="flex items-center gap-2">
                <span>Collect</span>
                <Star
                  className={cn('h-4 w-4', showFavorites ? 'fill-yellow-500 text-yellow-500' : '')}
                />
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Markets Grid */}
      <main
        className={cn(
          'w-full md:py-8 py-4 min-h-[600px]',
          isMobile && showTabs !== 'Markets' && 'hidden'
        )}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-w-7xl mx-auto">
          {marketError && (
            <div className="col-span-3 text-center py-12 bg-white rounded-lg border p-8">
              <div className="relative w-[200px] h-12 mb-6 mx-auto overflow-hidden">
                <div className="absolute left-0 animate-[crawl_4s_ease-in-out_infinite]">
                  <Snail className="h-12 w-12 text-gray-400 transition-transform" />
                </div>
              </div>
              <p className="text-gray-600 text-lg">
                We&apos;re experiencing high demand, don&apos;t fret — it&apos;s not your fault.
              </p>
            </div>
          )}

          {isMarketLoading
            ? // Show skeleton cards while loading
              Array.from({ length: 6 }).map((_, index) => <MarketSkeleton key={index} />)
            : !marketError && visibleMarkets.length > 0
              ? visibleMarkets.map((market) =>
                  market.id ? (
                    <MarketCard
                      key={market.id}
                      id={market.id}
                      title={market.title}
                      imageUrl={market.imageUrl}
                      volume={market.volume}
                      outcomes={market.outcomes}
                    />
                  ) : null
                )
              : !marketError && (
                  <div className="col-span-3 text-center py-12 text-gray-500 bg-white rounded-lg border p-8">
                    No markets found for the selected category.
                  </div>
                )}
        </div>

        {hasMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleLoadMore}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-900 font-medium transition-colors"
            >
              Load more
            </button>
          </div>
        )}
      </main>

      {/* Recent Activity and Top Volume Sections */}
      <div className={cn('w-full md:px-4 px-0 md:py-8 py-1 md:border-t border-none')}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Recent Activity */}
          <div className={cn(isMobile && showTabs !== 'Activity' && 'hidden')}>
            <div className="md:flex hidden items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-[#131E40]">Recent Activity</h2>
            </div>
            <div className="space-y-1">
              {isLoadingActivities ? (
                // Loading state
                <div className="animate-pulse space-y-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : activityError ? (
                // Error state
                <div className="text-center py-4 text-red-600">{activityError?.message}</div>
              ) : activities.length === 0 ? (
                // Empty state
                <div className="text-center py-4 text-gray-500">No recent activity</div>
              ) : (
                // Activity list
                activities.map((activity, index) => (
                  <div
                    key={`${activity.market.id}-${index}`}
                    className="flex items-center justify-between hover:bg-gray-50 py-2 px-3 -mx-3 rounded-lg md:border-none border-b border-[#EBEBEB]"
                    style={{ maxWidth: '100%' }}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {activity.user.avatar ? (
                        <Image
                          src={activity.user.avatar}
                          alt=""
                          className="w-8 h-8 rounded-full"
                          width={32}
                          height={32}
                        />
                      ) : (
                        <ColorAvatar name={activity.user.name} className="w-8 h-8" />
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="font-medium truncate">{activity.user.name}</span>
                          <span className="text-gray-500">•</span>
                          <span
                            className={`font-medium ${
                              activity.action.type === 'bought' ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {activity.action.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <span className="font-medium">
                            {parseFloat(activity.action.amount).toLocaleString()}
                          </span>
                          <span className="font-medium text-gray-700">
                            {activity.action.outcome.name}
                          </span>
                          <span>@</span>
                          <span className="font-medium">{activity.action.price}¢</span>
                          <span className="text-gray-400">•</span>
                          <span>
                            $
                            {(parseFloat(activity.action.amount) * activity.action.price).toFixed(
                              2
                            )}
                          </span>
                        </div>
                        <Link
                          href={`/odds/market/${activity.market.id}?chain=monad`}
                          className="text-sm text-gray-500 hover:text-pro-blue block mt-1"
                          style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '400px',
                          }}
                        >
                          {activity.market.title}
                        </Link>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 flex-shrink-0 ml-4">
                      {activity.time}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Top Volume This Week */}
          <div className={cn(isMobile && showTabs !== 'Volume' && 'hidden')}>
            <h2 className="text-lg md:block hidden font-medium text-[#131E40] mb-6">
              Top Volume This Week
            </h2>
            <div className="md:space-y-4 space-y-0 md:py-0 py-1">
              {isLoadingVolumeLeaders ? (
                // Loading state
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-6 bg-gray-200 h-4 rounded"></div>
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 h-4 bg-gray-200 rounded"></div>
                      <div className="w-24 h-4 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : volumeLeadersError ? (
                // Error state
                <div className="text-center py-4 text-red-600">{volumeLeadersError?.message}</div>
              ) : (
                // Data display
                volumeLeaders.map((leader) => (
                  <div
                    key={leader.rank}
                    className="flex py-4 md:py-0 items-center gap-4 md:border-none border-b border-[#ebebeb]"
                  >
                    <div className="w-6 text-gray-500">{leader.rank}</div>
                    {leader.avatar ? (
                      <Image
                        src={leader.avatar}
                        alt=""
                        className="w-8 h-8 rounded-full"
                        width={32}
                        height={32}
                      />
                    ) : (
                      <ColorAvatar name={leader.name} className="w-8 h-8" />
                    )}
                    <div className="flex-1 font-medium truncate">{leader.name}</div>
                    <div className="text-gray-600">{leader.volume}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
