import { useMemo } from 'react';
import { useBalance } from 'wagmi';
import { useSelectedAccount } from '../data/use-account';
import { formatBig } from '../utils/number';

export function useAccountBalance() {
  const { data: accountInfo, isLoading: isAccountInfoPending } = useSelectedAccount();

  const hasAccount = Boolean(accountInfo?.sandbox_account);

  const { data: balanceData, isPending: isBalancePending } = useBalance({
    address: accountInfo?.sandbox_account as `0x${string}`,
    query: {
      enabled: hasAccount && !isAccountInfoPending,
    },
  });

  const balanceBig = useMemo(() => {
    if (!hasAccount) return '0';
    return balanceData?.value;
  }, [balanceData, hasAccount]);

  const balance = useMemo(() => {
    if (!hasAccount) return '0';
    return formatBig(String(balanceBig), balanceData?.decimals);
  }, [balanceBig, balanceData?.decimals, hasAccount]);

  return {
    balanceBig,
    balance,
    isPending: hasAccount && (isAccountInfoPending || isBalancePending),
  };
}
