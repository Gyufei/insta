import { divide } from 'safebase';

import { useMemo } from 'react';

import { useApiAccountTokenBalance } from './use-api-account-token-balance';

export function useApiMonadBalance() {
  const { data: balanceData, isPending } = useApiAccountTokenBalance();

  const monadBalanceRes = balanceData?.find(
    (token) => token.network === 'MON' && token.token === 'MON'
  );

  const balanceBig = useMemo(() => {
    return monadBalanceRes?.balance;
  }, [monadBalanceRes]);

  const balance = useMemo(() => {
    return divide(String(balanceBig), String(10 ** (monadBalanceRes?.decimals || 18)));
  }, [balanceBig, monadBalanceRes?.decimals]);

  return {
    balanceBig,
    balance,
    isPending,
  };
}
