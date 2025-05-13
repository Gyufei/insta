import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ApiPath } from '@/lib/data/api-path';
import { Fetcher } from '@/lib/fetcher';
import { useUserInfo } from './use-user-info';

interface WatchListActionParams {
  marketId: string;
  action: 'add' | 'remove';
}

export function useWatchListAction() {
  const { data: userInfo } = useUserInfo();
  const userId = userInfo?.user_id;

  const addToWatchList = useMutation({
    mutationFn: async ({ marketId, action }: WatchListActionParams) => {
      const res = await Fetcher(ApiPath.oddsWatchList, {
        method: 'POST',
        body: JSON.stringify({
          user_id: userId,
          market_id: marketId,
          action,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return res;
    },
    onSuccess: (_, variables) => {
      toast.success(`Market ${variables.action === 'add' ? 'added to' : 'removed from'} watchlist`);
    },
    onError: () => {
      toast.error('Failed to update watchlist. Please try again.');
    },
  });

  return {
    addToWatchList,
  };
}
