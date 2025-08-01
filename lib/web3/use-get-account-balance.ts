import { DEFAULT_NATIVE_ADDRESS, NetworkConfigs } from '@/config/network-config';

import { useApiMonadBalance } from '@/lib/data/use-api-monad-balance';
import { useAccountTokenBalance } from '@/lib/web3/use-account-token-balance';

import { truncateNumber } from '../utils/number';

interface BalanceResult {
  balance: string;
  balanceBig: string | bigint | undefined;
  isBalancePending: boolean;
  isNative: boolean;
}

export function useGetAccountBalance(tokenAddress: string, enableQuery = true): BalanceResult {
  const isNative = tokenAddress === DEFAULT_NATIVE_ADDRESS;

  const {
    balance: nativeBalance,
    balanceBig: nativeBalanceBig,
    isPending: isNativeBalancePending,
  } = useApiMonadBalance();

  const {
    balance: tokenBalance,
    balanceBig: tokenBalanceBig,
    isPending: isTokenBalancePending,
  } = useAccountTokenBalance(
    NetworkConfigs.monadTestnet.id,
    tokenAddress,
    !isNative && enableQuery
  );

  const balance = isNative ? truncateNumber(nativeBalance, 4) : truncateNumber(tokenBalance, 4);

  const balanceBig = isNative ? nativeBalanceBig : tokenBalanceBig;
  const isBalancePending = isNative ? isNativeBalancePending : isTokenBalancePending;

  return {
    balance,
    balanceBig,
    isBalancePending,
    isNative,
  };
}
