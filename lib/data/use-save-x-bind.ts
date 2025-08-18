import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAccount } from 'wagmi';

import { Fetcher } from '@/lib/fetcher';

import { ApiPath } from './api-path';

interface SaveXBindRequest {
  code: string;
  redirect_uri: string;
}

interface SaveXBindResponse {
  id: string;
  name: string;
  username: string;
}

export function useSaveXBind() {
  const queryClient = useQueryClient();
  const { address } = useAccount();

  async function saveXBind(data: SaveXBindRequest) {
    const response = await Fetcher<SaveXBindResponse>(ApiPath.twitterBind, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        wallet: address!,
        code: data.code,
        redirect_uri: data.redirect_uri,
      }),
    });
    return response;
  }

  return useMutation<SaveXBindResponse | undefined, Error, SaveXBindRequest>({
    mutationFn: saveXBind,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
    onError: (e: Error) => {
      if (e.message.includes('already exists')) {
        toast.error('Twitter account already linked');
      } else {
        toast.error(e.message || 'Failed to link Twitter account');
      }
    },
  });
}
