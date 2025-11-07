import { useAccount } from 'wagmi';

import { useAccountStore } from '@/lib/state/account';

import { ApiPath } from '../api-path';
import { createQueryHook } from '../helpers';

export interface IAccountTokenBalance {
  network: string;
  token: string;
  address: string;
  balance: string;
  decimals: number;
  formattedBalance: string;
}

export function useApiBalance(enabled?: boolean) {
  const { address: wallet } = useAccount();
  const { currentAccountType } = useAccountStore();

  return createQueryHook<IAccountTokenBalance[]>(
    ApiPath.accountBalance,
    (account) => [
      'account',
      'balance',
      currentAccountType === 'EOA' ? `${wallet}+${wallet}` : `${wallet}+${account}`,
    ],
    (url, account) => {
      if (!wallet || (currentAccountType === 'DSA' && !account)) {
        return null;
      }

      url.searchParams.set('wallet', wallet);
      url.searchParams.set(
        'sandbox_account',
        currentAccountType === 'EOA' ? wallet : account || ''
      );

      return url;
    },
    {
      withAccount: currentAccountType === 'EOA' ? false : true,
      enabled,
      staleTime: 60_000,
    }
  )();
}
