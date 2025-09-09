import { BACKEND_NATIVE_ADDRESS, DEFAULT_NATIVE_ADDRESS } from '@/config/network-config';
import { IToken } from '@/config/tokens';

import { isSameAddress } from '../utils';
import { truncateNumber } from '../utils/number';
import { useBalanceByRPC } from './use-balance-by-rpc';
import { useTokenBalanceByRPC } from './use-token-balance-by-rpc';

interface BalanceResult {
  balance: string;
  balanceBig: string | bigint | undefined;
  isBalancePending: boolean;
  isNative: boolean;
}

export function useRPCBalance(
  chainId: number,
  address: string,
  tokenAddress: string,
  tokens: IToken[],
  enableQuery = true
): BalanceResult {
  const isNative =
    isSameAddress(tokenAddress, DEFAULT_NATIVE_ADDRESS) ||
    isSameAddress(tokenAddress, BACKEND_NATIVE_ADDRESS);

  const {
    balance: nativeBalance,
    balanceBig: nativeBalanceBig,
    isPending: isNativeBalancePending,
  } = useBalanceByRPC(chainId, address);

  const {
    balance: tokenBalance,
    balanceBig: tokenBalanceBig,
    isPending: isTokenBalancePending,
  } = useTokenBalanceByRPC(chainId, address, tokenAddress, tokens, !isNative && enableQuery);

  const balance = isNative ? truncateNumber(nativeBalance, 4) : truncateNumber(tokenBalance, 4);

  const balanceBig = isNative ? nativeBalanceBig : tokenBalanceBig;
  const isBalancePending = Boolean(isNative) ? isNativeBalancePending : isTokenBalancePending;

  return {
    balance,
    balanceBig,
    isBalancePending,
    isNative,
  };
}
