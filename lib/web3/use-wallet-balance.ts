import { useAccount, useBalance } from 'wagmi';

import { useMemo } from 'react';

import { formatBig } from '../utils/number';

export function useWalletBalance(chainId: number, enableQuery = true) {
  const { address } = useAccount();

  const { data: balanceData, isPending } = useBalance({
    address: address as `0x${string}`,
    chainId,
    query: {
      enabled: !!address && enableQuery,
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
