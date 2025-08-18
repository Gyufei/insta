import { BACKEND_NATIVE_ADDRESS, DEFAULT_NATIVE_ADDRESS } from '@/config/network-config';
import { IToken } from '@/config/tokens';

import { truncateNumber } from '../utils/number';
import { useAddressBalance } from './use-address-balance';
import { useAddressTokenBalance } from './use-address-token-balance';

interface BalanceResult {
  balance: string;
  balanceBig: string | bigint | undefined;
  isBalancePending: boolean;
  isNative: boolean;
}

export function useGetAddressBalance(
  chainId: number,
  address: string,
  tokenAddress: string,
  tokens: IToken[],
  enableQuery = true
): BalanceResult {
  const isNative =
    tokenAddress === DEFAULT_NATIVE_ADDRESS || tokenAddress === BACKEND_NATIVE_ADDRESS;

  const {
    balance: nativeBalance,
    balanceBig: nativeBalanceBig,
    isPending: isNativeBalancePending,
  } = useAddressBalance(chainId, address);

  const {
    balance: tokenBalance,
    balanceBig: tokenBalanceBig,
    isPending: isTokenBalancePending,
  } = useAddressTokenBalance(chainId, address, tokenAddress, tokens, !isNative && enableQuery);

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
