import { BACKEND_NATIVE_ADDRESS, DEFAULT_NATIVE_ADDRESS } from '@/config/network-config';
import { IToken } from '@/config/tokens';

import { isSameAddress } from '../../utils';
import { truncateNumber } from '../../utils/number';
import { useRPCNativeBalance } from './use-rpc-native-balance';
import { useRPCTokenBalance } from './use-rpc-token-balance';

interface BalanceResult {
  balance: string;
  isBalancePending: boolean;
  isNative: boolean;
  refetch?: () => Promise<unknown>;
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
    isPending: isNativeBalancePending,
    refetch: refetchNative,
  } = useRPCNativeBalance(
    chainId,
    address
  );

  const {
    balance: tokenBalance,
    isPending: isTokenBalancePending,
    refetch: refetchToken,
  } = useRPCTokenBalance(
    chainId,
    address,
    tokenAddress,
    tokens,
    !isNative && enableQuery
  );

  const balance = isNative
    ? truncateNumber(nativeBalance, 4)
    : truncateNumber(tokenBalance?.balance || '0', 4);

  const isBalancePending = Boolean(isNative) ? isNativeBalancePending : isTokenBalancePending;
  const refetch = isNative ? refetchNative : refetchToken;

  return {
    balance,
    isBalancePending,
    isNative,
    refetch,
  };
}
