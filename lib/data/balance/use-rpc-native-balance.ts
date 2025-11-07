import { useBalance } from 'wagmi';

import { useMemo } from 'react';

import { formatBig } from '@/lib/utils/number';

export function useRPCNativeBalance(
  chainId: number,
  address: string,
  enabled?: boolean,
  staleTime?: number
) {
  const {
    data: balanceData,
    isPending,
    refetch,
  } = useBalance({
    address: address as `0x${string}`,
    chainId,
    query: {
      enabled: (enabled ?? true) && !!address,
      staleTime: staleTime ?? 60_000,
    },
  });

  const balance = useMemo(() => {
    if (!address || !balanceData?.value) return '0';
    return formatBig(String(balanceData.value), balanceData.decimals);
  }, [balanceData?.decimals, balanceData?.value, address]);

  return {
    isPending: isPending,
    balance,
    refetch,
  };
}
