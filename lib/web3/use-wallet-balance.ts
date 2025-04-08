import { useMemo } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { formatBig } from '../utils/number';

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
    return formatBig(String(balanceBig), balanceData?.decimals);
  }, [balanceBig, balanceData?.decimals, address]);

  return {
    isPending: address && isPending,
    balanceBig,
    balance,
  };
}
