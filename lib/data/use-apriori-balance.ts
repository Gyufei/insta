import { useAccount } from 'wagmi';

import { useAccountStore } from '../state/account';
import { ApiPath } from './api-path';
import { createQueryHook } from './helpers';

export interface IApriorBalance {
  balance: string;
}

export function useAprioriBalance() {
  const { address } = useAccount();
  const { currentAccountType } = useAccountStore();

  return createQueryHook<IApriorBalance>(
    ApiPath.aprioriBalance,
    (account) => [
      'apriori',
      'balance',
      currentAccountType === 'EOA' ? address || '' : account || '',
    ],
    (url, account) => {
      if (
        (currentAccountType === 'EOA' && !address) ||
        (currentAccountType === 'DSA' && !account)
      ) {
        return null;
      }
      url.searchParams.set(
        'sandbox_account',
        currentAccountType === 'EOA' ? address || '' : account || ''
      );
      return url;
    },
    {
      withAccount: true,
    }
  )();
}
