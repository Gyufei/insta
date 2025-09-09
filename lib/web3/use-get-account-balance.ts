/* eslint-disable @typescript-eslint/no-unused-vars */
import { UNISWAP_TOKENS } from '@/app/(protocols)/uniswap/use-uniswap-token';

import {
  BACKEND_NATIVE_ADDRESS,
  DEFAULT_NATIVE_ADDRESS,
  NetworkConfigs,
} from '@/config/network-config';

import { useMonadBalanceByApi } from '@/lib/data/balance/use-monad-balance-by-api';

import { useSelectedAccount } from '../data/account-address/use-selected-account';
import { isSameAddress } from '../utils';
import { truncateNumber } from '../utils/number';
import { useTokenBalanceByRPC } from './use-token-balance-by-rpc';

interface BalanceResult {
  balance: string;
  balanceBig: string | bigint | undefined;
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

  const {
    balance: nativeBalance,
    balanceBig: nativeBalanceBig,
    isPending: isNativeBalancePending,
  } = useMonadBalanceByApi();

  const {
    balance: tokenBalance,
    balanceBig: tokenBalanceBig,
    isPending: isTokenBalancePending,
  } = useTokenBalanceByRPC(
    NetworkConfigs.monadTestnet.id,
    accountAddress || '',
    tokenAddress,
    tokens,
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
