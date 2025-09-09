/* eslint-disable @typescript-eslint/no-unused-vars */
import { UNISWAP_TOKENS } from '@/app/(protocols)/uniswap/use-uniswap-token';

import {
  BACKEND_NATIVE_ADDRESS,
  DEFAULT_NATIVE_ADDRESS,
  NetworkConfigs,
} from '@/config/network-config';

import { useMonadBalanceByApi } from '@/lib/data/balance/use-monad-balance-by-api';

import { useSelectedAccount } from '../account-address/use-selected-account';
import { useUniswapTokenBalance } from './use-uniswap-token-balance';
import { isSameAddress } from '../../utils';
import { truncateNumber } from '../../utils/number';
import { useRPCTokenBalance } from '../../web3/use-rpc-token-balance';

interface BalanceResult {
  balance: string;
  isBalancePending: boolean;
  isNative: boolean;
}

export function useGetAccountBalance(tokenAddress: string, enableQuery = true): BalanceResult {
  const { data: account, isLoading: isAccountInfoPending } = useSelectedAccount();
  const accountAddress = account?.sandbox_account;
  const tokens = UNISWAP_TOKENS;

  const isNative =
    isSameAddress(tokenAddress, DEFAULT_NATIVE_ADDRESS) ||
    isSameAddress(tokenAddress, BACKEND_NATIVE_ADDRESS);

  const { balance: nativeBalance, isPending: isNativeBalancePending } = useMonadBalanceByApi();

  const { data: tokenBalance, isPending: isTokenBalancePending } = useUniswapTokenBalance(
    accountAddress || '',
    tokenAddress
  );

  const balance = isNative ? truncateNumber(nativeBalance, 4) : truncateNumber(tokenBalance?.balance || '0', 4);
  const isBalancePending = isNative ? isNativeBalancePending : isTokenBalancePending;

  return {
    balance,
    isBalancePending,
    isNative,
  };
}
