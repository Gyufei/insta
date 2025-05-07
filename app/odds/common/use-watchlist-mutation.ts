import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ApiPath } from '@/lib/data/api-path';
import { Fetcher } from '@/lib/fetcher';

interface WatchListMutationParams {
  marketId: string;
  action: 'add' | 'remove';
  userId: string;
}

export function useWatchListMutation() {
  const addToWatchList = useMutation({
    mutationFn: async ({ marketId, action, userId }: WatchListMutationParams) => {
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
