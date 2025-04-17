import { useQuery } from '@tanstack/react-query';

import { Fetcher } from '../fetcher';
import { ApiPath } from './api-path';

export interface IAprioriInfo {
  transactionNum: number;
  tvl: string;
  holders: number;
}

export function useMagmaInfo() {
  async function fetchInfo() {
    const response = await Fetcher<{
      totalDepositWithdrawEventsMats: { count: number }[];
      tvlMats: { sum: string }[];
      uniqueWalletsDepositsMats: { count: number }[];
    }>(ApiPath.magmaInfo, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        operationName: 'GetStats',
        variables: {},
        query: `query GetStats {
          tvlMats {
            sum
            __typename
          }
          uniqueWalletsDepositsMats {
            count
            __typename
          }
          totalDepositWithdrawEventsMats {
            count
            __typename
          }
        }`,
      }),
    });

    if (!response) {
      return null;
    }

    const transactionNum = response?.totalDepositWithdrawEventsMats[0].count;
    const tvl = response?.tvlMats[0].sum;
    const holders = response?.uniqueWalletsDepositsMats[0].count;

    return {
      transactionNum,
      tvl,
      holders,
    };
  }

  const res = useQuery({
    queryKey: ['magma', 'info'],
    queryFn: fetchInfo,
  });

  return res;
}
