import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

import { useSelectedAccount } from '@/lib/data/account-address/use-selected-account';
import { ApiPath } from '@/lib/data/api-path';
import { Fetcher } from '@/lib/fetcher';
import { useAccountStore } from '@/lib/state/account';

interface IUserInfoResponse {
  user_id: string;
  user_name: string;
  avatar: string;
  email: string;
  bio: string;
}

export function useOddsUserInfo() {
  const { address } = useAccount();
  const { data: accountInfo } = useSelectedAccount();
  const { currentAccountType } = useAccountStore();

  function executeQuery() {
    return Fetcher<IUserInfoResponse>(ApiPath.oddsUserInfo, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        wallet: address,
        wallet_type: currentAccountType,
        sandbox_account: accountInfo?.sandbox_account,
      }),
    });
  }

  return useQuery<IUserInfoResponse>({
    queryKey: [
      'user',
      'info',
      currentAccountType === 'EOA' ? address : accountInfo?.sandbox_account,
    ],
    queryFn: executeQuery,
    enabled: !!address && !!accountInfo?.sandbox_account,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
