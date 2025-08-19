import { erc20Abi } from 'viem';
import { useAccount, useReadContract } from 'wagmi';

import { useMemo } from 'react';

import { DEFAULT_TOKEN_DECIMALS } from '@/config/network-config';

import { formatBig } from '@/lib/utils/number';

import { isSameAddress } from '../utils';

// current wallet address's token balance query use rpc
// deprecated, use api query
// but token use api query must be in list, so reserve this for future other token
export function useWalletTokenBalance(
  chainId: number,
  tokenAddress: string,
  tokens: { address: string; decimals: number }[],
  enableQuery = true
) {
  const { address } = useAccount();
  const currentToken = tokens.find((token) => isSameAddress(token.address, tokenAddress));

  const res = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    chainId: Number(chainId),
    query: {
      enabled: !!address && !!tokenAddress && enableQuery,
      initialData: BigInt(0),
    },
  });

  const { data: balanceData, isPending: isBalancePending } = res;

  const balanceBig = useMemo(() => {
    if (!address || !tokenAddress) return '0';
    return balanceData;
  }, [balanceData, address, tokenAddress]);

  const balance = useMemo(() => {
    if (!address || !tokenAddress) return '0';
    return formatBig(String(balanceBig), currentToken?.decimals || DEFAULT_TOKEN_DECIMALS); // ERC20 代币通常使用 18 位小数
  }, [balanceBig, address, tokenAddress, currentToken]);

  return {
    ...res,
    balanceBig,
    balance,
    isPending: !!address && !!tokenAddress && isBalancePending,
  };
}
