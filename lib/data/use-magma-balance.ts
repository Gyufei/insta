import { useAccount } from 'wagmi';

import { useAccountStore } from '../state/account';
import { ApiPath } from './api-path';
import { createQueryHook } from './helpers';

export interface IMagmaBalance {
  balance: string;
}

export function useMagmaBalance() {
  const { address } = useAccount();
  const { currentAccountType } = useAccountStore();

  return createQueryHook<IMagmaBalance>(
    ApiPath.magmaBalance,
    (account) => ['magma', 'balance', currentAccountType === 'EOA' ? address || '' : account || ''],
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
