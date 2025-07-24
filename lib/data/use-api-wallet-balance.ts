import { useMemo } from 'react';

import { NetworkConfigs } from '@/config/network-config';

import { useApiAccountTokenBalance } from './use-api-account-token-balance';

interface BalanceResult {
  balance: string;
  isBalancePending: boolean;
}

export function useApiWalletBalance(chainId: number, tokenAddress: string): BalanceResult {
  const { data: balanceData, isPending: isBalancePending } = useApiAccountTokenBalance();

  const balanceNetwork =
    chainId === NetworkConfigs.base.id
      ? 'BASE'
      : chainId === NetworkConfigs.monadTestnet.id
        ? 'MON'
        : 'ETH';

  const balance = useMemo(() => {
    const bResArr = balanceData?.filter((bRes) => bRes.network === balanceNetwork);

    const targetToken = bResArr?.find(
      (bRes) => bRes.address.toLowerCase() === tokenAddress.toLowerCase()
    );

    return targetToken?.formattedBalance || '0';
  }, [balanceData, balanceNetwork, tokenAddress]);

  return {
    balance,
    isBalancePending,
  };
}
