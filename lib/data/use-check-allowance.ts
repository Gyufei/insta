import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

import { useState } from 'react';

import { Fetcher } from '../fetcher';
import { ITxResponse } from '../model';
import { useSendTx } from '../web3/use-send-tx';
import { ApiPath } from './api-path';

const CheckUrlMap = {
  badge: `${ApiPath.badgeAllowance}`,
  tokenStation: `${ApiPath.tokenStationAllowance}`,
};

export function useCheckAllowance(checkName: 'badge' | 'tokenStation', tokenName: string) {
  const { address } = useAccount();
  const { send } = useSendTx();

  async function checkAllowance() {
    if (!address) return null;

    const path = CheckUrlMap[checkName];

    const checkAllowanceRes = await Fetcher(`${path}?wallet=${address}&token_name=${tokenName}`);

    return checkAllowanceRes as { allowance: string; txParams: ITxResponse };
  }

  const res = useQuery({
    queryKey: ['check-allowance', tokenName, address],
    queryFn: checkAllowance,
    enabled: !!tokenName && !!address,
  });

  const { data: allowanceRes, isLoading, refetch } = res;

  const allowance = Number(allowanceRes?.allowance || 0);
  const txParams = allowanceRes?.txParams;

  const [isApproving, setIsApproving] = useState(false);
  const [approveError, setApproveError] = useState<string | null>(null);

  async function handleApprove() {
    setIsApproving(true);
    try {
      const res = await send(txParams as ITxResponse);
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
