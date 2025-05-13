import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

import { ApiPath } from '@/lib/data/api-path';
import { useSelectedAccount } from '@/lib/data/use-account';
import { Fetcher } from '@/lib/fetcher';

interface IUserInfoResponse {
  user_id: string;
  user_name: string;
  avatar: string;
  email: string;
  bio: string;
}

export function useUserInfo() {
  const { address } = useAccount();
  const { data: accountInfo } = useSelectedAccount();

  function executeQuery() {
    return Fetcher<IUserInfoResponse>(ApiPath.oddsUserInfo, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        wallet: address,
        sandbox_account: accountInfo?.sandbox_account,
      }),
    });
  }

  return useQuery<IUserInfoResponse>({
    queryKey: ['user', 'info', address, accountInfo?.sandbox_account],
    queryFn: executeQuery,
    enabled: !!address && !!accountInfo?.sandbox_account,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
