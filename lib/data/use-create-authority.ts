import { ApiPath } from './api-path';
import { useMutation } from '@tanstack/react-query';
import { Fetcher } from '../fetcher';
import { ITxData } from '../model';
import { useSendTx } from '../web3/use-send-tx';
import { toast } from 'sonner';

export interface CreateAuthorityParams {
  wallet: string;
  sandbox_account: string;
  manager: string;
}

export function useCreateAuthority() {
  const { send, isPending: isSending } = useSendTx();

  async function createAuthority(params: CreateAuthorityParams) {
    if (!params.wallet) {
      toast.info('Please connect wallet first');
      return;
    }

    const url = new URL(ApiPath.addAuthority);

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
      toast.error('Create authority failed');
      throw err;
    }
  }

  const mutation = useMutation({
    mutationFn: createAuthority,
  });

  return {
    ...mutation,
    isPending: mutation.isPending || isSending,
  };
}
