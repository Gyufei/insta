import { toast } from 'sonner';
import { useAccount } from 'wagmi';
import { ApiPath } from './api-path';
import { useMutation } from '@tanstack/react-query';
import { Fetcher } from '../fetcher';
import { ITxData } from '../model';
import { useSendTx } from '../web3/use-send-tx';
import { useGetAccount } from './use-get-account';
import { ERROR_MESSAGES } from '@/config/error-msg';

interface AprioriWithdrawParams {
  wallet: string;
  sandbox_account: string;
  shares: string;
}

export function useAprioriWithdraw() {
  const { address } = useAccount();
  const { data: accountInfo } = useGetAccount();
  const { send, isPending: isSending } = useSendTx();

  const account = accountInfo?.sandbox_account;

  async function aprioriWithdraw(shares: string) {
    if (!address) {
      toast.info(ERROR_MESSAGES.WALLET_NOT_CONNECTED);
      return;
    }

    if (!account) {
      toast.info(ERROR_MESSAGES.ACCOUNT_NOT_CREATED);
      return;
    }

    const url = new URL(ApiPath.aprioriWithdraw);

    const params: AprioriWithdrawParams = {
      wallet: address,
      sandbox_account: account,
      shares,
    };

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
      toast.error(ERROR_MESSAGES.WITHDRAW_FAILED);
      throw err;
    }
  }

  const mutation = useMutation({
    mutationFn: aprioriWithdraw,
  });

  return {
    ...mutation,
    isPending: mutation.isPending || isSending,
  };
} 