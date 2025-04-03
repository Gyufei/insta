import { useState } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { ITxData } from '../model';
import { toast } from 'sonner';
import { ApiPath } from '../data/api-path';
import { Fetcher } from '../fetcher';

export function useSendTx() {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function sendTxApi(signature: string) {
    const params = {
      wallet: address,
      signature,
    };

    const url = new URL(ApiPath.sendTx);

    const res = await Fetcher<ITxData>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!res) {
      throw new Error('Send transaction failed');
    }

    return res;
  }

  const send = async (txData: ITxData) => {
    if (!walletClient) {
      throw new Error('Wallet client not found');
    }

    if (!txData) {
      throw new Error('Invalid transaction data');
    }

    const { to, data, gas, value } = txData;

    const toAddress = to.startsWith('0x') ? to : `0x${to}`;
    const txDataHex = data.startsWith('0x') ? data : `0x${data}`;

    try {
      setIsPending(true);
      const txReq = await walletClient.prepareTransactionRequest({
        account: address,
        to: toAddress as `0x${string}`,
        data: txDataHex as `0x${string}`,
        gas: BigInt(gas),
        ...(value ? { value: BigInt(value) } : {}),
      });

      const signature = await walletClient.signTransaction(txReq);

      const res = await sendTxApi(signature);

      setIsSuccess(true);
      return res;
    } catch (err) {
      setIsError(true);
      setError(err as Error);
      toast.error('Transaction failed');
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return {
    send,
    isPending,
    isSuccess,
    isError,
    error,
  };
}
