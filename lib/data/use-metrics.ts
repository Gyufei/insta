import { ApiPath } from './api-path';
import { createQueryHook } from './helpers';

export interface IMetricsItem {
  date: string;
  data: {
    holders: number;
    sandboxAccounts: number;
  };
}

export function useMetrics() {
  const queryResult = createQueryHook<IMetricsItem[]>(
    ApiPath.metrics,
    () => ['metrics'],
    (url) => url,
    {
      withAccount: false,
    }
  )();

  // 对数据按日期排序
  const sortedData = queryResult.data?.sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return {
    ...queryResult,
    data: sortedData,
  };
}


