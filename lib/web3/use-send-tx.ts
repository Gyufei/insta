import { useSendTransaction } from 'wagmi';
import { ITxData } from '../model';
import { toast } from 'sonner';
export function useSendTx() {
  const { sendTransaction, isPending, isSuccess, isError, error } = useSendTransaction();

  const send = async (txData: ITxData) => {
    if (!txData.status || !txData.data) {
      throw new Error('Invalid transaction data');
    }

    const { to, data, gas } = txData.data;

    const toAddress = to.startsWith('0x') ? to : `0x${to}`;
    const txDataHex = data.startsWith('0x') ? data : `0x${data}`;

    try {
      const hash = await sendTransaction({
        to: toAddress as `0x${string}`,
        data: txDataHex as `0x${string}`,
        gas: BigInt(gas),
      });
      return hash;
    } catch (err) {
      toast.error('Transaction failed');
      throw err;
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
