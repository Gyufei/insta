import { utils } from 'safebase';

import { DEFAULT_NATIVE_ADDRESS } from '@/config/network-config';

import { useWalletBalance } from './use-wallet-balance';
import { useWalletTokenBalance } from './use-wallet-token-balance';

interface BalanceResult {
  balance: string;
  balanceBig: string | bigint | undefined;
  isBalancePending: boolean;
  isNative: boolean;
}

export function useGetWalletBalance(
  chainId: number,
  tokenAddress: string,
  enableQuery = true
): BalanceResult {
  const isNative = tokenAddress === DEFAULT_NATIVE_ADDRESS;

  const {
    balance: nativeBalance,
    balanceBig: nativeBalanceBig,
    isPending: isNativeBalancePending,
  } = useWalletBalance(chainId, isNative && enableQuery);

  const {
    balance: tokenBalance,
    balanceBig: tokenBalanceBig,
    isPending: isTokenBalancePending,
  } = useWalletTokenBalance(chainId, tokenAddress, !isNative && enableQuery);

  const balance = isNative
    ? utils.roundResult(nativeBalance, 4)
    : utils.roundResult(tokenBalance, 4);

  const balanceBig = isNative ? nativeBalanceBig : tokenBalanceBig;
  const isBalancePending = isNative ? !!isNativeBalancePending : !!isTokenBalancePending;

  return {
    balance,
    balanceBig,
    isBalancePending,
    isNative,
  };
}
