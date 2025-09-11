import { divide, subtract } from 'safebase';

import { useMemo, useState } from 'react';

import Image from 'next/image';

import { MONAD, MonUSD } from '@/config/tokens';

import { useTokenInput } from '@/components/side-drawer/use-token-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useApiBalance } from '@/lib/data/balance/use-api-balance';
import { useClaimedAirdrop } from '@/lib/data/use-claimed-airdrop';
import { useWithdraw } from '@/lib/data/use-withdraw';
import { isSameAddress } from '@/lib/utils';
import { parseBig } from '@/lib/utils/number';

import { ActionButton } from '../common/action-button';
import { SetMax } from '../common/set-max';
import { SideDrawerLayout } from '../common/side-drawer-layout';
import { TokenDisplay } from '../common/token-display';
import { TokenInput } from '../common/token-input';
import { useSetMax } from '../common/use-set-max';
import { SideDrawerBackHeader } from '../side-drawer-back-header';
import { usePathChangeBack } from '../use-path-change-back';

const TOKENS = [MONAD, MonUSD];

export function WithdrawToken() {
  const [selectedToken, setSelectedToken] = useState(MONAD.address);

  const token = TOKENS.find((t) => isSameAddress(t.address, selectedToken)) || MONAD;

  const { handleBack } = usePathChangeBack();

  const { data: balanceData } = useApiBalance();

  const { data: airdropData } = useClaimedAirdrop();
  const airdropAmount = useMemo(() => {
    if (!airdropData) return 0;
    return divide(airdropData?.mon_amount, String(10 ** MONAD.decimals));
  }, [airdropData]);

  const tokenBalance = useMemo(() => {
    if (!balanceData) return 0;

    const monBalances = balanceData.filter((bRes) => bRes.network === 'MON');
    const balanceRes = monBalances.find((bRes) => bRes.token === token.symbol);
    const balanceBig = balanceRes?.balance;
    const balance = divide(String(balanceBig), String(10 ** (balanceRes?.decimals || 18)));

    return balance;
  }, [balanceData, token.symbol]);

  const canClaimAmount = useMemo(() => {
    if (Number(tokenBalance) < Number(airdropAmount)) return 0;
    return subtract(String(tokenBalance), String(airdropAmount));
  }, [airdropAmount, tokenBalance]);

  const { mutate: withdraw, isPending } = useWithdraw();

  const { inputValue, btnDisabled, errorData, handleInputChange } = useTokenInput(canClaimAmount);
  const { isMax, handleSetMax, handleInput } = useSetMax(
    inputValue,
    canClaimAmount,
    handleInputChange
  );

  const handleWithdraw = () => {
    if (!inputValue || btnDisabled || isPending) return;
    const amount = parseBig(inputValue, token?.decimals);
    withdraw(
      { amount: amount.toString(), tokenAddress: token.address },
      {
        onSuccess: () => {
          handleBack();
        },
      }
    );
  };

  return (
    <>
      <SideDrawerBackHeader title="Withdraw" onClick={handleBack} />
      <SideDrawerLayout>
        <div className="mb-4">
          <h1 className="text-xl text-primary font-medium mb-3">Select Token</h1>
          <Select value={selectedToken} onValueChange={setSelectedToken}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a token" />
            </SelectTrigger>
            <SelectContent>
              {TOKENS.map((token) => (
                <SelectItem key={token.address} value={token.address}>
                  <div className="flex items-center gap-2">
                    <Image src={token.logo} alt={token.name} width={20} height={20} />
                    <span>{token.symbol}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <TokenDisplay token={token} balance={canClaimAmount} balanceLabel="Supply" />
        <TokenInput
          inputValue={inputValue}
          onInputChange={handleInput}
          placeholder="Amount to withdraw"
        />
        <SetMax checked={isMax} disabled={false} onChange={handleSetMax} />
        <ActionButton
          disabled={btnDisabled}
          onClick={handleWithdraw}
          isPending={isPending}
          error={errorData}
        >
          Withdraw
        </ActionButton>
      </SideDrawerLayout>
    </>
  );
}
