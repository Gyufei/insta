import { ApiPath } from './api-path';
import { useMutation } from '@tanstack/react-query';
import { Fetcher } from '../fetcher';
import { ITxData } from '../model';
import { useSendTx } from '../web3/use-send-tx';
import { toast } from 'sonner';
import { ERROR_MESSAGES } from '@/config/error-msg';

interface RequestBody {
  owner: string;
}

export function useCreateAccount() {
  const { send, isPending: isSending } = useSendTx();

  async function createAccount(address: string) {
    if (!address) {
      toast.info(ERROR_MESSAGES.WALLET_NOT_CONNECTED);
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

      if (!txData.data) {
        toast.error(ERROR_MESSAGES.INVALID_TX_DATA);
        return;
      }

      await send(txData);
    } catch (err) {
      toast.error(ERROR_MESSAGES.CREATE_ACCOUNT_FAILED);
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
