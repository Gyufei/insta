import { useAccount } from 'wagmi';

import { ApiPath } from './api-path';
import { createQueryHook } from './helpers';

export interface IAccountTokenBalance {
  network: string;
  token: string;
  address: string;
  balance: string;
  decimals: number;
  formattedBalance: string;
}

export function useApiAccountTokenBalance() {
  const { address: wallet } = useAccount();

  return createQueryHook<IAccountTokenBalance[]>(
    ApiPath.accountBalance,
    (account) => ['account', 'balance', wallet ?? '' + account ?? ''],
    (url, account) => {
      if (!wallet || !account) {
        return null;
      }

      url.searchParams.set('wallet', wallet);
      url.searchParams.set('sandbox_account', account);

      return url;
    },
    {
      withAccount: true,
    }
  )();
}
