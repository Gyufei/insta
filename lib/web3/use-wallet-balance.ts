import { useMemo } from 'react';
import { divide } from 'safebase';
import { useAccount, useBalance } from 'wagmi';

export function useWalletBalance() {
  const { address } = useAccount();

  const { data: balanceData, isPending } = useBalance({
    address: address as `0x${string}`,
    query: {
      enabled: !!address,
    },
  });

  const balanceBig = useMemo(() => {
    return balanceData?.value;
  }, [balanceData]);

  const balance = useMemo(() => {
    return divide(String(balanceBig), String(10 ** (balanceData?.decimals || 18)));
  }, [balanceBig, balanceData?.decimals]);

  return {
    isPending,
    balanceBig,
    balance,
  };
}
