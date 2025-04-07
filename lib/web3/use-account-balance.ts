import { useMemo } from 'react';
import { divide } from 'safebase';
import { useBalance } from 'wagmi';
import { useGetAccount } from '../data/use-get-account';

export function useAccountBalance() {
  const { data: accountInfo, isPending: isAccountInfoPending } = useGetAccount();

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
    return divide(String(balanceBig), String(10 ** (balanceData?.decimals || 18)));
  }, [balanceBig, balanceData?.decimals, hasAccount]);

  return {
    balanceBig,
    balance,
    isPending: hasAccount && (isAccountInfoPending || isBalancePending),
  };
}
