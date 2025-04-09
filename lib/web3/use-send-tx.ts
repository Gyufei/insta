import { useState } from 'react';
import { useAccount, useSendTransaction, useSignTypedData } from 'wagmi';
import { ITxData, ITxResponse } from '../model';
import { ApiPath } from '../data/api-path';
import { Fetcher } from '../fetcher';
import { keccak256, toHex } from 'viem';
import { ERROR_MESSAGES } from '@/config/error-msg';
import { getTxTypeData } from './tx-type-data';

export function useSendTx() {
  const PaymentProxyHash = keccak256(toHex('PaymentProxy v2'));

  const { address } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();
  const { signTypedDataAsync } = useSignTypedData();

  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function sendTxApi(txData: ITxData, signature: string) {
    const params = {
      nonce: 0,
      ...txData,
      wallet: address,
      signature,
    };

    const url = new URL(ApiPath.sendTx);

    const res = await Fetcher<ITxResponse>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!res) {
      throw new Error(ERROR_MESSAGES.SEND_TX_FAILED);
    }

    return res;
  }

  const send = async (txRes: ITxResponse) => {
    if (!txRes.tx_data) {
      throw new Error(ERROR_MESSAGES.INVALID_TX_DATA);
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

      if (data.startsWith(PaymentProxyHash)) {
        const txTypeData = getTxTypeData(txRes.tx_data);
        const signature = await signTypedDataAsync(txTypeData);
        const res = await sendTxApi(txRes.tx_data, signature);
        setIsSuccess(true);
        return res;
      } else {
        const hash = await sendTransactionAsync(txParams);
        setIsSuccess(true);
        return hash;
      }
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
