import { erc20Abi } from 'viem';
import { useReadContract } from 'wagmi';

import { useMemo } from 'react';

import { DEFAULT_TOKEN_DECIMALS } from '@/config/network-config';

import { useSelectedAccount } from '@/lib/data/use-account';
import { formatBig } from '@/lib/utils/number';

export function useAccountTokenBalance(tokenAddress: string, enableQuery = true) {
  const { data: account, isLoading: isAccountInfoPending } = useSelectedAccount();

  const accountAddress = account?.sandbox_account;

  const res = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [accountAddress as `0x${string}`],
    query: {
      enabled: !!accountAddress && !!tokenAddress && enableQuery,
      initialData: BigInt(0),
    },
  });

  const { data: balanceData, isPending: isBalancePending } = res;

  const balanceBig = useMemo(() => {
    if (!accountAddress || !tokenAddress) return '0';
    return balanceData;
  }, [balanceData, accountAddress, tokenAddress]);

  const balance = useMemo(() => {
    if (!accountAddress || !tokenAddress) return '0';
    return formatBig(String(balanceBig), DEFAULT_TOKEN_DECIMALS); // ERC20 代币通常使用 18 位小数
  }, [balanceBig, accountAddress, tokenAddress]);

  return {
    ...res,
    balanceBig,
    balance,
    isPending: !!accountAddress && !!tokenAddress && (isAccountInfoPending || isBalancePending),
  };
}
