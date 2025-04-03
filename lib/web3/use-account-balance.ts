import { useMemo } from 'react';
import { divide } from 'safebase';
import { useBalance } from 'wagmi';
import { useGetAccount } from '../data/use-get-account';

export function useAccountBalance() {
  const { data: accountInfo, isPending: isAccountInfoPending } = useGetAccount();

  const { data: balanceData, isPending: isBalancePending } = useBalance({
    address: accountInfo?.sandbox_account as `0x${string}`,
    query: {
      enabled: Boolean(accountInfo?.sandbox_account && !isAccountInfoPending),
    },
  });

  const balanceBig = useMemo(() => {
    return balanceData?.value;
  }, [balanceData]);

  const balance = useMemo(() => {
    return divide(String(balanceBig), String(10 ** (balanceData?.decimals || 18)));
  }, [balanceBig, balanceData?.decimals]);

  return {
    balanceBig,
    balance,
    isPending: isAccountInfoPending || isBalancePending,
  };
}
