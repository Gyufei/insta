import { useState } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { ITxData } from '../model';
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

  const send = async (txRes: ITxData) => {
    if (!walletClient) {
      throw new Error('Wallet client not found');
    }

    if (!txRes.tx_data) {
      throw new Error('Invalid transaction data');
    }

    const { from, to, data, gas, value } = txRes.tx_data;

    try {
      setIsPending(true);

      const txParams = {
        account: address,
        from: from as `0x${string}`,
        to: to as `0x${string}`,
        data: data as `0x${string}`,
        gas: BigInt(gas),
        ...(value ? { value: BigInt(value) } : {}),
      };

      const signature = await walletClient.signTransaction(txParams);
      console.log('signature', signature);

      const res = await sendTxApi(signature);
      setIsSuccess(true);
      return res;
    } catch (err) {
      setIsError(true);
      setError(err as Error);
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
