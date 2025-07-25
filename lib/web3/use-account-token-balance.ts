import { UNISWAP_TOKENS } from '@/app/(protocols)/uniswap/use-uniswap-token';

import { useSelectedAccount } from '@/lib/data/use-account';

import { useAddressTokenBalance } from './use-address-token-balance';

export function useAccountTokenBalance(chainId: number, tokenAddress: string, enableQuery = true) {
  const { data: account, isLoading: isAccountInfoPending } = useSelectedAccount();
  const tokens = UNISWAP_TOKENS;

  const accountAddress = account?.sandbox_account;

  const res = useAddressTokenBalance(
    chainId,
    accountAddress || '',
    tokenAddress,
    tokens,
    enableQuery
  );

  return {
    ...res,
    isPending: isAccountInfoPending || res.isPending,
  };
}
