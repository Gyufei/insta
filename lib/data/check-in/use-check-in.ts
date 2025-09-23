import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

// removed toast messages from hook to avoid cross-page toasts

import { Fetcher } from '../../fetcher';
import { ITxResponse } from '../../model';
import { useSendTx } from '../../web3/use-send-tx';
import { ApiPath } from '../api-path';

export function useCheckIn() {
  const { address } = useAccount();
  const { send } = useSendTx();
  const queryClient = useQueryClient();

  async function executeMutation() {
    try {
      const txRes = await Fetcher<ITxResponse>(ApiPath.checkIn, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet: address,
        }),
      });

      const txhash = await send(txRes);

      const saveHashRes = await Fetcher<{ status: boolean; message: string }>(
        ApiPath.checkInComplete,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tx_hash: txhash,
            wallet: address,
          }),
        }
      );

      return saveHashRes;
    } catch (error) {
      throw error;
    }
  }

  const mutation = useMutation({
    mutationFn: executeMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isCheckIn'] });
    },
  });

  return mutation;
}
