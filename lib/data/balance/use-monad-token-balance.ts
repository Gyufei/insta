import { useQuery } from '@tanstack/react-query';
import { divide } from 'safebase';

import { DEFAULT_TOKEN_DECIMALS } from '@/config/network-config';

import { Fetcher } from '@/lib/fetcher';

import { ApiPath } from '../api-path';

export interface IUniswapTokenBalance {
  balance: string;
}

export function useMonadTokenBalance(
  address: string,
  tokenAddress: string,
  decimals: number = DEFAULT_TOKEN_DECIMALS
) {
  function formatBalance(balance: string) {
    return divide(balance, String(10 ** decimals));
  }

  async function queryFunc(url: URL) {
    if (!tokenAddress || !address) {
      return null;
    }

    url.searchParams.set('token_address', tokenAddress);
    url.searchParams.set('wallet', address);

    const res = await Fetcher<IUniswapTokenBalance>(url.toString());

    const balance = formatBalance(res.balance);

    return {
      balance,
    };
  }

  const res = useQuery({
    queryKey: ['monad', 'token', 'balance', tokenAddress ?? '', address ?? ''],
    queryFn: () => queryFunc(new URL(ApiPath.monadTokenBalance)),
    enabled: !!tokenAddress && !!address,
  });

  return res;
}
