'use client';

import { Banknote, Clock, Ear, Settings2, Share2, Star } from 'lucide-react';

import { useEffect, useMemo, useState } from 'react';

import Image from 'next/image';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { formatDate } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils/number';

import { useFavorites } from '../../common/favorite-context';
import { useMarketDetail } from '../../common/use-market-detail';
import { useMarketHolder } from '../../common/use-market-holder';
import { useMarketItemActivity } from '../../common/use-market-item-activity';
import ColorAvatar from '../../components/ColorAvatar';
import MarketChart from '../../components/MarketChart';
import MarketHolders from '../../components/MarketHolders';
import Orderbook from '../../components/Orderbook';
import TradingBox, { IOutcome, ITradeState } from '../../components/TradingBox';

export default function MarketDetail({ mId }: { mId: string }) {
  const [selectedOutcome, setSelectedOutcome] = useState<IOutcome | null>(null);

  const [expandedOutcome, setExpandedOutcome] = useState<string | null>(null);
  const { favorites, toggleFavorite } = useFavorites();
  const [tradeState, setTradeState] = useState<ITradeState>({
    direction: 'buy',
    outcome: null,
    sharesToBuy: 0,
    sharesToSell: 0,
    price: null,
  });

  const [selectedTimeframe, setSelectedTimeframe] = useState<
    '1H' | '6H' | '1D' | '1W' | '1M' | 'ALL'
  >('ALL');

  const [activeTab, setActiveTab] = useState<'holders' | 'activity'>('holders');
  const [selectedOutcomeFilter, setSelectedOutcomeFilter] = useState<string>('All');
  const [isOutcomeFilterOpen, setIsOutcomeFilterOpen] = useState(false);

  const { data: market, isLoading: isMarketLoading, error: marketError } = useMarketDetail(mId);

  const {
    data: holdersData,
    isLoading: isLoadingHolders,
    error: holdersError,
  } = useMarketHolder(mId);

  const {
    data: activitiesData,
    isLoading: isLoadingActivities,
    error: activityError,
  } = useMarketItemActivity(mId);

  const activities = useMemo(() => {
    if (!activitiesData) return [];

    const formatted = activitiesData.activities?.map((activity) => {
      const timestamp = new Date(activity.time);
      const now = new Date();
      const diffSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);

      let timeAgo;
      if (diffSeconds < 60) timeAgo = `${diffSeconds}s ago`;
      else if (diffSeconds < 3600) timeAgo = `${Math.floor(diffSeconds / 60)}m ago`;
      else if (diffSeconds < 86400) timeAgo = `${Math.floor(diffSeconds / 3600)}h ago`;
      else timeAgo = `${Math.floor(diffSeconds / 86400)}d ago`;

      return {
        user: activity.user,
        type: activity.action.type,
        outcome: activity.action.outcome,
        amount: parseFloat(activity.action.amount),
        price: activity.action.price,
        time: timeAgo,
      };
    });

    return formatted;
  }, [activitiesData]);

  const topHolders = useMemo(() => {
    if (!holdersData)
      return {
        '0': [],
        '1': [],
      };

    return holdersData;
  }, [holdersData]);

  useEffect(() => {
    if (market && market.outcomes && market.outcomes.length > 0) {
      setSelectedOutcome({
        ...market.outcomes[0],
        index: 0,
      });
    }
  }, [market]);

  const filteredActivities = useMemo(() => {
    let filtered = [...activities];

    if (selectedOutcomeFilter !== 'All') {
      filtered = filtered.filter((activity) => activity.outcome.name === selectedOutcomeFilter);
    }

    return filtered;
  }, [activities, selectedOutcomeFilter]);

  if (isMarketLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-[400px] bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (marketError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {marketError?.message}
        </div>
      </div>
    );
  }

  if (!market) {
    return <div className="p-8">Market not found</div>;
  }

  return (
    <div className="px-4 mt-4">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">{market.title}</h1>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-base text-gray-600 flex-1 min-w-0">
              <div
                className={`px-2 py-1 rounded text-sm font-medium ${
                  market.state === 'online'
                    ? 'bg-green-50 text-green-700'
                    : market.state === 'offline'
                      ? 'bg-yellow-50 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                }`}
              >
                {market.state || 'Unknown'}
              </div>
              <div className="flex items-center gap-1">
                <Banknote className="h-4 w-4" />
                <span>${formatCurrency(market.volume)} Vol.</span>
              </div>
              {market.resolution_type === 'date' && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1" tld-tooltip="">
                        <Clock className="h-4 w-4" />
                        <span>{formatDate(market.resolution_details?.date)}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[300px]">
                      <p className="text-xs">
                        This market will be resolved automatically at the specified deadline
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {market.resolution_type === 'event' && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1">
                        <Ear className="h-4 w-4" />
                        <span>{market.resolution_details?.event_name}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[300px]">
                      <p className="text-xs">
                        This market will be resolved when the specified event occurs
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                      <Star
                        className={`h-5 w-5 ${favorites[mId || ''] ? 'fill-yellow-500 text-yellow-500' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          if (mId) toggleFavorite(mId);
                        }}
                      />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[300px]">
                    <p className="text-xs">
                      {favorites[mId || ''] ? 'Remove from watchlist' : 'Add to watchlist'}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white">
              <div className="flex items-center justify-between border-b">
                <div className="flex items-center gap-2 py-4">
                  {(['1H', '6H', '1D', '1W', '1M', 'ALL'] as const).map((timeframe) => (
                    <button
                      key={timeframe}
                      onClick={() => setSelectedTimeframe(timeframe)}
                      className={`px-3 py-1 text-sm rounded-full transition-colors ${
                        selectedTimeframe === timeframe
                          ? 'bg-[var(--color-odd-main)] text-[var(--color-button-text)]'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {timeframe}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 px-4">
                  <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Settings2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <MarketChart
                marketId={mId || ''}
                timeframe={selectedTimeframe}
                outcomeCount={market.outcomes?.length || 0}
                outcomeNames={market.outcomes?.map((outcome) => outcome.name) || []}
              />
            </div>

            <div className="lg:hidden">
              <TradingBox
                selectedOutcome={selectedOutcome}
                onOutcomeSelect={setSelectedOutcome}
                tradeState={tradeState}
                onTradeStateChange={setTradeState}
                market={{ ...market, market_id: mId }}
              />
            </div>

            <div className="bg-white">
              <div className="flex items-center py-3 text-sm font-medium text-gray-500 border-b">
                <div className="flex-1">OUTCOME</div>
                <div className="w-32 text-right pr-[2px]">CHANCE</div>
                <div className="w-48"></div>
              </div>

              <div className="divide-y">
                {(market.outcomes || []).map((outcome, index) => (
                  <div key={index} className="flex flex-col cursor-pointer">
                    <div
                      className="flex items-center justify-between py-4 hover:bg-gray-50"
                      onClick={() => {
                        if (expandedOutcome === outcome.name) {
                          setExpandedOutcome(null);
                        } else {
                          setExpandedOutcome(outcome.name);
                        }
                        setSelectedOutcome({
                          ...outcome,
                          index,
                        });
                        setTradeState((prev) => ({
                          ...prev,
                          outcome: outcome.name,
                          price: outcome.price,
                        }));
                      }}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <Image
                          src={outcome.logo}
                          alt={outcome.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <h3 className="font-medium">{outcome.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>${formatCurrency(outcome.volume)} Vol.</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold w-32 text-right">
                          {outcome.probability}%
                        </span>
                        <div className="flex gap-2 w-48 justify-end">
                          <button
                            className={`w-24 px-4 py-2 rounded-lg font-medium transition-colors ${
                              tradeState.direction === 'sell'
                                ? 'hidden'
                                : 'bg-[var(--color-yes-bg)] text-[var(--color-yes-text)] hover:bg-[var(--color-yes-hover)]'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOutcome({
                                ...outcome,
                                index,
                              });
                              setTradeState((prev) => ({
                                ...prev,
                                outcome: outcome.name,
                                price: outcome.price,
                              }));
                            }}
                          >
                            ${outcome.price}
                          </button>
                          <button
                            className={`w-24 px-4 py-2 rounded-lg font-medium transition-colors ${
                              tradeState.direction === 'buy'
                                ? 'hidden'
                                : 'bg-[var(--color-no-bg)] text-[var(--color-no-text)] hover:bg-[var(--color-no-hover)]'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOutcome({
                                ...outcome,
                                index,
                              });
                              setTradeState((prev) => ({
                                ...prev,
                                outcome: outcome.name,
                                price: outcome.price,
                              }));
                            }}
                          >
                            ${outcome.price}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className={`border-t ${expandedOutcome === outcome.name ? '' : 'hidden'}`}>
                      <Orderbook
                        marketId={mId || ''}
                        outcomeIndex={index}
                        isVisible={expandedOutcome === outcome.name}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white">
              <h2 className="text-xl font-bold mb-2">About this market</h2>
              {market.image_url && (
                <div className="mb-4">
                  <Image
                    src={market.image_url}
                    alt={market.title}
                    width={1000}
                    height={1000}
                    className="w-full h-[240px] object-cover rounded-lg"
                  />
                </div>
              )}
              <p className="text-gray-700 whitespace-pre-wrap">{market.description}</p>
            </div>

            <div className="bg-white">
              <div className="flex border-b">
                <div className="flex items-center justify-between w-full">
                  <div className="flex">
                    <button
                      className={`px-2 py-3 font-medium ${
                        activeTab === 'holders'
                          ? 'text-[var(--color-tab-text-active)] border-b-2 border-[var(--color-tab-border-active)]'
                          : 'text-[var(--color-tab-text)] hover:text-[var(--color-tab-text-hover)]'
                      }`}
                      onClick={() => setActiveTab('holders')}
                    >
                      Top Holders
                    </button>
                    <button
                      className={`ml-4 px-2 py-3 font-medium ${
                        activeTab === 'activity'
                          ? 'text-[var(--color-tab-text-active)] border-b-2 border-[var(--color-tab-border-active)]'
                          : 'text-[var(--color-tab-text)] hover:text-[var(--color-tab-text-hover)]'
                      }`}
                      onClick={() => setActiveTab('activity')}
                    >
                      Activity
                    </button>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => setIsOutcomeFilterOpen(!isOutcomeFilterOpen)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
                    >
                      <span>{selectedOutcomeFilter}</span>
                      <svg
                        className={`w-4 h-4 transition-transform ${isOutcomeFilterOpen ? 'rotate-180' : ''}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>

                    {isOutcomeFilterOpen && (
                      <div className="absolute right-0 top-full mt-1 bg-white border rounded-lg shadow-lg overflow-hidden z-10">
                        {['All', ...(market?.outcomes?.map((o) => o.name) || [])].map((outcome) => (
                          <button
                            key={outcome}
                            className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${
                              outcome === selectedOutcomeFilter
                                ? 'text-[var(--color-odd-main)]'
                                : 'text-gray-900'
                            }`}
                            onClick={() => {
                              setSelectedOutcomeFilter(outcome);
                              setIsOutcomeFilterOpen(false);
                            }}
                          >
                            {outcome}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {activeTab === 'holders' ? (
                <div className="pt-6">
                  <div className="grid grid-cols-2 gap-12">
                    <div>
                      {topHolders && market.outcomes?.[0] && (
                        <>
                          {isLoadingHolders ? (
                            <div className="animate-pulse space-y-4">
                              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                              <div className="space-y-2">
                                {[1, 2, 3, 4, 5].map((i) => (
                                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                                ))}
                              </div>
                            </div>
                          ) : holdersError ? (
                            <div className="text-red-600">{holdersError.message}</div>
                          ) : (
                            <MarketHolders
                              title={`${market.outcomes[0].name} holders`}
                              holders={
                                topHolders[market.outcomes[0].name as keyof typeof topHolders] ||
                                topHolders['0'] ||
                                []
                              }
                              isPositive={true}
                            />
                          )}
                        </>
                      )}
                    </div>

                    <div>
                      {topHolders && market.outcomes?.[1] && (
                        <>
                          {isLoadingHolders ? (
                            <div className="animate-pulse space-y-4">
                              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                              <div className="space-y-2">
                                {[1, 2, 3, 4, 5].map((i) => (
                                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                                ))}
                              </div>
                            </div>
                          ) : holdersError ? (
                            <div className="text-red-600">{holdersError.message}</div>
                          ) : (
                            <MarketHolders
                              title={`${market.outcomes[1].name} holders`}
                              holders={
                                topHolders[market.outcomes[1].name as keyof typeof topHolders] ||
                                topHolders['1'] ||
                                []
                              }
                              isPositive={false}
                            />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="pt-6">
                  {isLoadingActivities ? (
                    <div className="py-8 text-center">
                      <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                      <div className="text-gray-500">Loading activities...</div>
                    </div>
                  ) : activityError ? (
                    <div className="py-8 text-center text-red-600">{activityError.message}</div>
                  ) : filteredActivities.length === 0 ? (
                    <div className="py-8 text-center text-gray-500">
                      No activities found matching your filters.
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {filteredActivities.map((activity, index) => (
                        <div
                          key={`${activity.user.name}-${index}`}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            {activity.user.avatar ? (
                              <Image
                                src={activity.user.avatar}
                                alt=""
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded-full"
                              />
                            ) : (
                              <ColorAvatar name={activity.user.name} className="w-8 h-8" />
                            )}
                            <div>
                              <span className="font-medium">{activity.user.name}</span>{' '}
                              <span className="text-gray-600">{activity.type}</span>{' '}
                              <span
                                className={
                                  activity.type === 'bought' ? 'text-green-600' : 'text-red-600'
                                }
                              >
                                {activity.amount.toLocaleString()}
                              </span>{' '}
                              <span className="font-medium text-gray-600">
                                {activity.outcome.name}
                              </span>{' '}
                              <span className="text-gray-600">
                                at ${activity.price} ($
                                {(activity.amount * activity.price).toFixed(2)})
                              </span>
                            </div>
                          </div>
                          <span className="text-gray-500">{activity.time}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-24">
              <TradingBox
                selectedOutcome={selectedOutcome}
                onOutcomeSelect={setSelectedOutcome}
                tradeState={tradeState}
                onTradeStateChange={setTradeState}
                market={market}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
