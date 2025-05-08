import { ApiPath } from '@/lib/data/api-path';
import { createQueryHook } from '@/lib/data/helpers';

interface ChartDataPoint {
  time: number;
  values: number[];
}

interface ChartData {
  outcomes: string[];
  series: string[];
  data_points: ChartDataPoint[];
}

export function useMarketItemChart(
  marketId: string,
  timeframe: '1H' | '6H' | '1D' | '1W' | '1M' | 'ALL'
) {
  return createQueryHook<ChartData>(
    ApiPath.oddsMarketChart.replace('{marketId}', marketId),
    () => ['market', 'chart', marketId, timeframe],
    (url) => {
      if (!marketId) {
        return null;
      }
      url.searchParams.set('timeframe', timeframe);
      return url;
    },
    {
      withAccount: false,
    }
  )();
}
