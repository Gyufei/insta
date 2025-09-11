import { useBalance } from 'wagmi';

import { useMemo } from 'react';

import { formatBig } from '@/lib/utils/number';

export function useRPCNativeBalance(chainId: number, address: string) {
  const {
    data: balanceData,
    isPending,
    refetch,
  } = useBalance({
    address: address as `0x${string}`,
    chainId,
    query: {
      enabled: !!address,
    },
  });

  const balance = useMemo(() => {
    if (!address) return '0';
    return formatBig(String(balanceData?.value), balanceData?.decimals);
  }, [balanceData?.decimals, balanceData?.value, address]);

  return {
    isPending: isPending,
    balance,
    refetch,
  };
}
