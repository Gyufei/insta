import { ApiPath } from './api-path';
import { useMutation } from '@tanstack/react-query';
import { Fetcher } from '../fetcher';
import { ITxData } from '../model';
import { useSendTx } from '../web3/use-send-tx';
import { toast } from 'sonner';

interface RequestBody {
  owner: string;
}

export function useCreateAccount() {
  const { send, isPending: isSending } = useSendTx();

  async function createAccount(address: string) {
    if (!address) {
      toast.info('Please connect wallet first');
      return;
    }

    const url = new URL(ApiPath.account);
    const body: RequestBody = {
      owner: address,
    };

    try {
      const txData = await Fetcher<ITxData>(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!txData.status || !txData.data) {
        toast.error('Invalid transaction data');
        return;
      }

      await send(txData);
    } catch (err) {
      toast.error('Create account failed');
      throw err;
    }
  }

  const mutation = useMutation({
    mutationFn: createAccount,
  });

  return {
    ...mutation,
    isPending: mutation.isPending || isSending,
  };
}
