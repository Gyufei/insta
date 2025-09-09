import { useMemo } from 'react';

import { NetworkConfigs } from '@/config/network-config';

import { useAllChainBalanceByApi } from './use-all-chain-balance-by-api';

export function useAccountOrWalletBalanceByApi(chainId: number, tokenAddress: string) {
  const res = useAllChainBalanceByApi();
  const { data: balanceData, isPending: isBalancePending } = res;

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
    ...res,
    balance,
    isBalancePending,
  };
}
