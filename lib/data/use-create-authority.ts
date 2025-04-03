import { ApiPath } from './api-path';
import { useMutation } from '@tanstack/react-query';
import { Fetcher } from '../fetcher';
import { ITxData } from '../model';
import { useSendTx } from '../web3/use-send-tx';
import { toast } from 'sonner';
import { useGetAccount } from './use-get-account';
import { useAccount } from 'wagmi';
import { ERROR_MESSAGES } from '@/config/error-msg';

export interface CreateAuthorityParams {
  wallet: string;
  sandbox_account: string;
  manager: string;
}

export function useCreateAuthority() {
  const { address } = useAccount();
  const { data: accountInfo } = useGetAccount();
  const { send, isPending: isSending } = useSendTx();

  async function createAuthority(manager: string) {
    if (!address) {
      toast.info(ERROR_MESSAGES.WALLET_NOT_CONNECTED);
      return;
    }

    if (!accountInfo?.sandbox_account) {
      toast.info(ERROR_MESSAGES.ACCOUNT_NOT_CREATED);
      return;
    }

    const params = {
      wallet: address,
      sandbox_account: accountInfo?.sandbox_account,
      manager,
    };

    const url = new URL(ApiPath.addAuthority);

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
      toast.error(ERROR_MESSAGES.CREATE_AUTHORITY_FAILED);
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
