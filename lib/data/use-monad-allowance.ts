import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

import { useState } from 'react';

import { BACKEND_NATIVE_ADDRESS, DEFAULT_NATIVE_ADDRESS } from '@/config/network-config';

import { Fetcher } from '../fetcher';
import { ITxResponse } from '../model';
import { useSendTx } from '../web3/use-send-tx';
import { ApiPath } from './api-path';

export function useCheckMonadAllowance(tokenAddress: string, spenderAddress: string) {
  const { address } = useAccount();
  const { send } = useSendTx();

  async function checkAllowance() {
    if (!address) return null;

    if (tokenAddress === DEFAULT_NATIVE_ADDRESS || tokenAddress === BACKEND_NATIVE_ADDRESS) {
      return {
        allowance: Infinity,
        txParams: {
          to: address,
          value: 0,
        },
      };
    }

    const path = ApiPath.monadTokenAllowance;

    const checkAllowanceRes = await Fetcher(
      `${path}?wallet=${address}&token_address=${tokenAddress}&spender=${spenderAddress}`
    );

    return checkAllowanceRes as { allowance: string; txParams: ITxResponse };
  }

  const res = useQuery({
    queryKey: ['monad-check-allowance', tokenAddress, address, spenderAddress],
    queryFn: checkAllowance,
    enabled: !!tokenAddress && !!address,
  });

  const { data: allowanceRes, isLoading, refetch } = res;

  const allowance = Number(allowanceRes?.allowance || 0);
  const txParams = allowanceRes?.txParams;

  const [isApproving, setIsApproving] = useState(false);
  const [approveError, setApproveError] = useState<string | null>(null);

  async function handleApprove() {
    setIsApproving(true);
    try {
      const res = await send({ tx_data: txParams } as unknown as ITxResponse);
      refetch();
      setIsApproving(false);
      return res;
    } catch (error) {
      setApproveError('Approve failed');
      return null;
    }
  }

  return {
    allowance,
    isLoading,
    isApproving,
    approveError,
    handleApprove,
  };
}
