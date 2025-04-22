import { useBalance } from 'wagmi';

import { useMemo } from 'react';

import { useSelectedAccount } from '../data/use-account';
import { formatBig } from '../utils/number';

export function useAccountBalance() {
  const { data: accountInfo, isLoading: isAccountInfoPending } = useSelectedAccount();

  const account = accountInfo?.sandbox_account;

  const { data: balanceData, isPending: isBalancePending } = useBalance({
    address: account as `0x${string}`,
    query: {
      enabled: !!account,
    },
  });

  const balanceBig = useMemo(() => {
    if (!account) return '0';
    return balanceData?.value;
  }, [balanceData, account]);

  const balance = useMemo(() => {
    if (!account) return '0';
    return formatBig(String(balanceBig), balanceData?.decimals);
  }, [balanceBig, balanceData?.decimals, account]);

  return {
    balanceBig,
    balance,
    isPending: !!account && (isAccountInfoPending || isBalancePending),
  };
}
