import { useBalance } from 'wagmi';

import { useMemo } from 'react';

import { useSelectedAccount } from '../data/use-account';
import { formatBig } from '../utils/number';

export function useAccountBalance(enableQuery = true) {
  const { data: accountInfo, isLoading: isAccountInfoPending } = useSelectedAccount();

  const accountAddress = accountInfo?.sandbox_account;

  const { data: balanceData, isPending: isBalancePending } = useBalance({
    address: accountAddress as `0x${string}`,
    query: {
      enabled: !!accountAddress && enableQuery,
    },
  });

  const balanceBig = useMemo(() => {
    if (!accountAddress) return '0';
    return balanceData?.value;
  }, [balanceData, accountAddress]);

  const balance = useMemo(() => {
    if (!accountAddress) return '0';
    return formatBig(String(balanceBig), balanceData?.decimals);
  }, [balanceBig, balanceData?.decimals, accountAddress]);

  return {
    balanceBig,
    balance,
    isPending: !!accountAddress && (isAccountInfoPending || isBalancePending),
  };
}
