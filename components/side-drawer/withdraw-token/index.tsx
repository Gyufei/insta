import { multiply } from 'safebase';

import { useTokenInput } from '@/components/side-drawer/use-token-input';
import SideDrawerBackHeader from '../side-drawer-back-header';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { TokenData } from '@/lib/data/tokens';
import { useWithdraw } from '@/lib/data/use-withdraw';
import { SetMax } from '../common/set-max';
import { TokenDisplay } from '../common/token-display';
import { TokenInput } from '../common/token-input';
import { ActionButton } from '../common/action-button';
import { ErrorMessage } from '../common/error-message';
import { HrLine } from '../common/hr-line';
import { useAccountBalance } from '@/lib/web3/use-account-balance';
import { useSetMax } from '../common/use-set-max';

export function WithdrawToken() {
  const { setIsOpen } = useSideDrawerStore();

  const token = TokenData.find((token) => token.symbol === 'MON') || TokenData[0];

  const { balance } = useAccountBalance();

  const { mutate: withdraw, isPending } = useWithdraw();

  const { inputValue, btnDisabled, errorData, handleInputChange } = useTokenInput(balance);
  const { isMax, handleSetMax, handleInput } = useSetMax(inputValue, balance, handleInputChange);

  const handleWithdraw = () => {
    if (!inputValue || btnDisabled || isPending) return;
    const amount = multiply(inputValue, String(10 ** (token?.decimals || 18)));
    withdraw(amount);
  };

  return (
    <>
      <SideDrawerBackHeader title="Withdraw" onClick={() => setIsOpen(false)} />
      <div className="scrollbar-hover flex-grow overflow-x-hidden overflow-y-scroll">
        <div className="mx-auto" style={{ maxWidth: '296px' }}>
          <div className="pt-2 pb-10 sm:pt-4">
            <TokenDisplay token={token} balance={balance} balanceLabel="Supply" />
            <HrLine />
            <TokenInput
              inputValue={inputValue}
              onInputChange={handleInput}
              placeholder="Amount to withdraw"
            />
            <HrLine />
            <SetMax checked={isMax} disabled={false} onChange={handleSetMax} />
            <HrLine />
            <ActionButton disabled={btnDisabled} onClick={handleWithdraw} isPending={isPending}>
              Withdraw
            </ActionButton>
            <ErrorMessage show={errorData.showError} message={errorData.errorMessage} />
          </div>
        </div>
      </div>
    </>
  );
}
