import { ApiPath } from '@/lib/data/api-path';
import { createQueryHook } from '@/lib/data/helpers';

export type TimeRange = 'Day' | 'Week' | 'Month' | 'All';

// Map TimeRange to API timeframe parameter
const timeframeMap: Record<TimeRange, string> = {
  Day: '1D',
  Week: '1W',
  Month: '1M',
  All: 'ALL',
};

interface IVolumeLeadersResponse {
  volume_leaders: Array<{
    rank: number;
    name: string;
    avatar?: string;
    volume: string;
  }>;
}

interface IProfitLeadersResponse {
  profit_leaders: Array<{
    rank: number;
    name: string;
    avatar?: string;
    profit: string;
  }>;
}

export function useVolumeLeaders(timeRange: TimeRange) {
  return createQueryHook<IVolumeLeadersResponse>(
    ApiPath.oddsMarketRankVolume,
    () => ['volume-leaders', timeRange],
    (url) => {
      const timeframe = timeframeMap[timeRange];
      if (timeRange !== 'All') {
        url.searchParams.set('timeframe', timeframe);
      }
      return url;
    },
    {
      withAccount: false,
    }
  )();
}

export function useProfitLeaders(timeRange: TimeRange) {
  return createQueryHook<IProfitLeadersResponse>(
    ApiPath.oddsMarketRankProfit,
    () => ['profit-leaders', timeRange],
    (url) => {
      const timeframe = timeframeMap[timeRange];
      if (timeRange !== 'All') {
        url.searchParams.set('timeframe', timeframe);
      }
      return url;
    },
    {
      withAccount: false,
    }
  )();
}
