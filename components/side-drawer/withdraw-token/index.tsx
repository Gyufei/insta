import { useState } from 'react';

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

import { useWithdraw } from '@/lib/data/use-withdraw';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { parseBig } from '@/lib/utils/number';
import { useAccountBalance } from '@/lib/web3/use-account-balance';

import { ActionButton } from '../common/action-button';
import { SetMax } from '../common/set-max';
import { SideDrawerLayout } from '../common/side-drawer-layout';
import { TokenDisplay } from '../common/token-display';
import { TokenInput } from '../common/token-input';
import { useSetMax } from '../common/use-set-max';
import { SideDrawerBackHeader } from '../side-drawer-back-header';

const TOKENS = [MONAD, MonUSD];

export function WithdrawToken() {
  const { setIsOpen } = useSideDrawerStore();
  const [selectedToken, setSelectedToken] = useState(MONAD.address);

  const token = TOKENS.find((t) => t.address === selectedToken) || MONAD;

  const { balance } = useAccountBalance();

  const { mutate: withdraw, isPending } = useWithdraw();

  const { inputValue, btnDisabled, errorData, handleInputChange } = useTokenInput(balance);
  const { isMax, handleSetMax, handleInput } = useSetMax(inputValue, balance, handleInputChange);

  const handleWithdraw = () => {
    if (!inputValue || btnDisabled || isPending) return;
    const amount = parseBig(inputValue, token?.decimals);
    withdraw({ amount, tokenAddress: token.address });
  };

  return (
    <>
      <SideDrawerBackHeader title="Withdraw" onClick={() => setIsOpen(false)} />
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
        <TokenDisplay token={token} balance={balance} balanceLabel="Supply" />
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
