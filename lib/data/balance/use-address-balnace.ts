import {
  BACKEND_NATIVE_ADDRESS,
  DEFAULT_NATIVE_ADDRESS,
  DEFAULT_TOKEN_DECIMALS,
  NetworkConfigs,
} from '@/config/network-config';

import { isSameAddress } from '@/lib/utils';
import { truncateNumber } from '@/lib/utils/number';
import { useRPCNativeBalance } from '@/lib/web3/use-rpc-native-balance';

import { useUniswapTokenBalance } from './use-uniswap-token-balance';

export function useAddressBalance(
  address: string,
  tokenAddress: string,
  tokenDecimals: number = DEFAULT_TOKEN_DECIMALS
) {
  const isNative =
    isSameAddress(tokenAddress, DEFAULT_NATIVE_ADDRESS) ||
    isSameAddress(tokenAddress, BACKEND_NATIVE_ADDRESS);

  const { balance: nativeBalance, isPending: isNativeBalancePending } = useRPCNativeBalance(
    NetworkConfigs.monadTestnet.id,
    address
  );

  const { data: tokenBalance, isPending: isTokenBalancePending } = useUniswapTokenBalance(
    address,
    tokenAddress,
    tokenDecimals
  );

  const balance = isNative
    ? truncateNumber(nativeBalance, 4)
    : truncateNumber(tokenBalance?.balance || '0', 4);
  const isBalancePending = isNative ? isNativeBalancePending : isTokenBalancePending;

  return {
    balance,
    isBalancePending,
    isNative,
  };
}
