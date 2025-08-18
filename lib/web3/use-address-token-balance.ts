import { erc20Abi } from 'viem';
import { useReadContract } from 'wagmi';

import { useMemo } from 'react';

import { DEFAULT_TOKEN_DECIMALS, TOKEN_DECIMALS } from '@/config/network-config';
import { IToken } from '@/config/tokens';

import { formatBig } from '@/lib/utils/number';

export function useAddressTokenBalance(
  chainId: number,
  address: string,
  tokenAddress: string,
  tokens: IToken[],
  enableQuery = true
) {
  const currentToken = tokens.find((token) => token.address === tokenAddress);

  const res = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    chainId,
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

    const decimals = TOKEN_DECIMALS[String(chainId)][tokenAddress];

    return formatBig(
      String(balanceBig),
      currentToken?.decimals || decimals || DEFAULT_TOKEN_DECIMALS
    ); // ERC20 代币通常使用 18 位小数
  }, [balanceBig, address, tokenAddress, currentToken]);

  return {
    ...res,
    balanceBig,
    balance,
    isPending: !!address && !!tokenAddress && isBalancePending,
  };
}
