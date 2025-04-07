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
    if (!address) return '0';
    return balanceData?.value;
  }, [balanceData, address]);

  const balance = useMemo(() => {
    if (!address) return '0';
    return divide(String(balanceBig), String(10 ** (balanceData?.decimals || 18)));
  }, [balanceBig, balanceData?.decimals, address]);

  return {
    isPending: address && isPending,
    balanceBig,
    balance,
  };
}
