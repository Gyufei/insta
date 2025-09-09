import { divide } from 'safebase';

import { useMemo } from 'react';

import { useAllChainBalanceByApi } from './use-all-chain-balance-by-api';

export function useMonadBalanceByApi() {
  const { data: balanceData, isPending } = useAllChainBalanceByApi();

  const monadBalanceRes = balanceData?.find(
    (token) => token.network === 'MON' && token.token === 'MON'
  );

  const balance = useMemo(() => {
    if (!monadBalanceRes?.balance) {
      return '0';
    }

    return divide(
      String(monadBalanceRes?.balance || '0'),
      String(10 ** (monadBalanceRes?.decimals || 18))
    );
  }, [monadBalanceRes?.balance, monadBalanceRes?.decimals]);

  return {
    balance,
    isPending,
  };
}
