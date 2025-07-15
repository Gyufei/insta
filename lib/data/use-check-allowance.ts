import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

import { useState } from 'react';

import { Fetcher } from '../fetcher';
import { ITxResponse } from '../model';
import { useSendTx } from '../web3/use-send-tx';
import { ApiPath } from './api-path';

const CheckUrlMap = {
  badge: `${ApiPath.badgeAllowance}`,
  'tokenStation-ccip': `${ApiPath.tokenStationAllowanceCCIP}`,
  'tokenStation-bridge': `${ApiPath.tokenStationAllowanceBridge}`,
};

export function useCheckAllowance(
  checkName: 'badge' | 'tokenStation-ccip' | 'tokenStation-bridge',
  tokenName: string
) {
  const { address } = useAccount();
  const { send } = useSendTx();

  async function checkAllowance() {
    if (!address) return null;

    if (tokenName === 'ETH') {
      return {
        allowance: Infinity,
        txParams: {
          to: address,
          value: 0,
        },
      };
    }

    const path = CheckUrlMap[checkName];

    const checkAllowanceRes = await Fetcher(`${path}?wallet=${address}&token_name=${tokenName}`);

    return checkAllowanceRes as { allowance: string; txParams: ITxResponse };
  }

  const res = useQuery({
    queryKey: ['check-allowance', checkName, tokenName, address],
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
