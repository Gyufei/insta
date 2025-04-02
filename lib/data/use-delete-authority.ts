import { ApiPath } from './api-path';
import { useMutation } from '@tanstack/react-query';
import { Fetcher } from '../fetcher';
import { ITxData } from '../model';
import { useSendTx } from '../web3/use-send-tx';
import { toast } from 'sonner';

export interface DeleteAuthorityParams {
  wallet: string;
  sandbox_account: string;
  manager: string;
}

export function useDeleteAuthority() {
  const { send, isPending: isSending } = useSendTx();

  async function deleteAuthority(params: DeleteAuthorityParams) {
    if (!params.wallet) {
      toast.info('Please connect wallet first');
      return;
    }

    const url = new URL(ApiPath.deleteAuthority);

    try {
      const txData = await Fetcher<ITxData>(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!txData.status || !txData.data) {
        toast.error('Invalid transaction data');
        return;
      }

      await send(txData);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete authority failed');
      throw err;
    }
  }

  const mutation = useMutation({
    mutationFn: deleteAuthority,
  });

  return {
    ...mutation,
    isPending: mutation.isPending || isSending,
  };
} 