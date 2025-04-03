import { ApiPath } from './api-path';
import { useMutation } from '@tanstack/react-query';
import { Fetcher } from '../fetcher';
import { ITxData } from '../model';
import { useSendTx } from '../web3/use-send-tx';
import { toast } from 'sonner';
import { ERROR_MESSAGES } from '@/config/error-msg';

export interface DeleteAuthorityParams {
  wallet: string;
  sandbox_account: string;
  manager: string;
}

export function useDeleteAuthority() {
  const { send, isPending: isSending } = useSendTx();

  async function deleteAuthority(params: DeleteAuthorityParams) {
    if (!params.wallet) {
      toast.info(ERROR_MESSAGES.WALLET_NOT_CONNECTED);
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

      if (!txData) {
        toast.error(ERROR_MESSAGES.INVALID_TX_DATA);
        return;
      }

      await send(txData);
    } catch (err) {
      toast.error(ERROR_MESSAGES.DELETE_AUTHORITY_FAILED);
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
