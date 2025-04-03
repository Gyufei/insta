import { useState } from 'react';
import { multiply } from 'safebase';

import { useTokenInput } from '@/components/side-drawer/use-token-input';
import SideDrawerBackHeader from '../side-drawer-back-header';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { TokenData } from '@/lib/data/tokens';
import { useWithdraw } from '@/lib/data/use-withdraw';
import { SetMax } from '../deposit-token/set-max';
import { TokenDisplay } from '../deposit-token/token-display';
import { TokenInput } from '../deposit-token/token-input';
import { ActionButton } from '../deposit-token/action-button';
import { ErrorMessage } from '../deposit-token/error-message';
import { HrLine } from '../deposit-token/hr-line';
import { useAccountBalance } from '@/lib/web3/use-account-balance';

export function WithdrawToken() {
  const { setCurrentComponent } = useSideDrawerStore();

  const token = TokenData.find((token) => token.symbol === 'MON') || TokenData[0];

  const { balance } = useAccountBalance();

  const { mutate: withdraw, isPending } = useWithdraw();

  const [isMax, setIsMax] = useState(false);
  const [prevValue, setPrevValue] = useState('');

  const { inputValue, btnDisabled, showError, handleInputChange } = useTokenInput(balance);

  const handleWithdraw = () => {
    if (!inputValue || btnDisabled || isPending) return;
    const amount = multiply(inputValue, String(10 ** (token?.decimals || 18)));
    withdraw(amount);
  };

  const handleSetMax = (checked: boolean) => {
    setIsMax(checked);
    if (checked) {
      setPrevValue(inputValue);
      handleInputChange(balance);
    } else {
      handleInputChange(prevValue);
    }
  };

  return (
    <>
      <SideDrawerBackHeader title="Withdraw" onClick={() => setCurrentComponent('Balance')} />
      <div className="scrollbar-hover flex-grow overflow-x-hidden overflow-y-scroll">
        <div className="mx-auto" style={{ maxWidth: '296px' }}>
          <div className="pt-2 pb-10 sm:pt-4">
            <TokenDisplay token={token} balance={balance} balanceLabel="Supply" />
            <HrLine />
            <TokenInput
              inputValue={inputValue}
              onInputChange={handleInputChange}
              placeholder="Amount to withdraw"
            />
            <HrLine />
            <SetMax checked={isMax} disabled={false} onChange={handleSetMax} />
            <HrLine />
            <ActionButton disabled={btnDisabled} onClick={handleWithdraw} isPending={isPending}>
              Withdraw
            </ActionButton>
            <ErrorMessage show={showError} />
          </div>
        </div>
      </div>
    </>
  );
}
