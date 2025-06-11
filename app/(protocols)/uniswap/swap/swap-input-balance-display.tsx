import { useEffect, useState } from 'react';

import { WithLoading } from '@/components/common/with-loading';
import { Button } from '@/components/ui/button';

import { useGetAccountBalance } from '../../../../lib/web3/use-get-account-balance';

interface BalanceDisplayProps {
  tokenAddress: string;
  showMaxButton?: boolean;
  onMaxClick: () => void;
  onBalanceChange?: (balance: string) => void;
}

export function SwapInputBalanceDisplay({
  tokenAddress,
  showMaxButton,
  onMaxClick,
  onBalanceChange,
}: BalanceDisplayProps) {
  const [enableQuery, setEnableQuery] = useState(false);
  const { balance, isBalancePending } = useGetAccountBalance(tokenAddress, enableQuery);

  useEffect(() => {
    if (tokenAddress) {
      setEnableQuery(true);
    }
  }, [tokenAddress]);

  useEffect(() => {
    if (balance && onBalanceChange) {
      onBalanceChange(balance);
    }
  }, [balance, onBalanceChange]);

  return (
    <div className="flex justify-end items-center gap-1 my-1">
      <WithLoading isLoading={isBalancePending}>
        <span className="text-xs text-gray-400">{balance === '0' ? '0.00' : balance}</span>
      </WithLoading>
      {showMaxButton && (
        <Button variant="outline" size="sm" className="h-5 px-1 text-xs" onClick={onMaxClick}>
          Max
        </Button>
      )}
    </div>
  );
}
