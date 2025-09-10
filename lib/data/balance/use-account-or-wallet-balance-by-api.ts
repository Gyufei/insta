import { divide } from 'safebase';

import { useMemo } from 'react';

import { NetworkConfigs } from '@/config/network-config';

import { useApiBalance } from './use-api-balance';

export function useAccountOrWalletBalanceByApi(chainId: number, tokenAddress: string) {
  const res = useApiBalance();
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

    const bal = divide(
      String(targetToken?.balance || '0'),
      String(10 ** (targetToken?.decimals || 18))
    );

    return bal || '0';
  }, [balanceData, balanceNetwork, tokenAddress]);

  return {
    ...res,
    balance,
    isBalancePending,
  };
}
