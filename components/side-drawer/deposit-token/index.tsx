import { multiply } from 'safebase';
import SideDrawerBackHeader from '../side-drawer-back-header';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { TokenData } from '@/lib/data/tokens';
import { useDeposit } from '@/lib/data/use-deposit';
import { TokenDisplay } from './token-display';
import { TokenInput } from './token-input';
import { ActionButton } from './action-button';
import { ErrorMessage } from './error-message';
import { useTokenInput } from '@/components/side-drawer/use-token-input';
import { HrLine } from './hr-line';
import { SetMax } from './set-max';
import { useWalletBalance } from '@/lib/web3/use-wallet-balance';

export function DepositToken() {
  const token = TokenData.find((token) => token.symbol === 'MON') || TokenData[0];

  const { setCurrentComponent } = useSideDrawerStore();
  const { mutate: deposit, isPending } = useDeposit();

  const { balance, isPending: isBalancePending } = useWalletBalance();
  const { inputValue, btnDisabled, showError, handleInputChange } = useTokenInput(balance);

  const handleDeposit = () => {
    if (!inputValue || btnDisabled || isPending) return;
    const amount = multiply(inputValue, String(10 ** (token?.decimals || 18)));
    deposit(amount);
  };

  return (
    <>
      <SideDrawerBackHeader title="Deposit" onClick={() => setCurrentComponent('Balance')} />
      <div className="scrollbar-hover flex-grow overflow-x-hidden overflow-y-scroll">
        <div className="mx-auto" style={{ maxWidth: '296px' }}>
          <div className="pt-2 pb-10 sm:pt-4">
            <TokenDisplay
              isPending={isBalancePending}
              token={token}
              balance={balance}
              balanceLabel="Token Balance"
            />
            <HrLine />
            <TokenInput
              inputValue={inputValue}
              onInputChange={handleInputChange}
              placeholder="Amount to deposit"
            />
            <HrLine />
            <SetMax
              checked={false}
              disabled={true}
              tooltip="You can't set max amount since gas fee amount should be left"
            />
            <HrLine />
            <ActionButton disabled={btnDisabled} onClick={handleDeposit} isPending={isPending}>
              Deposit
            </ActionButton>
            <ErrorMessage show={showError} />
          </div>
        </div>
      </div>
    </>
  );
}
