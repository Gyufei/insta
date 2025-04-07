import { multiply } from 'safebase';
import SideDrawerBackHeader from '@/components/side-drawer/side-drawer-back-header';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { TokenData } from '@/lib/data/tokens';
import { useAprioriDeposit } from '@/lib/data/use-apriori-deposit';
import { TokenDisplay } from '@/components/side-drawer/common/token-display';
import { TokenInput } from '@/components/side-drawer/common/token-input';
import { ActionButton } from '@/components/side-drawer/common/action-button';
import { ErrorMessage } from '@/components/side-drawer/common/error-message';
import { useTokenInput } from '@/components/side-drawer/use-token-input';
import { HrLine } from '@/components/side-drawer/common/hr-line';
import { SetMax } from '@/components/side-drawer/common/set-max';
import { useWalletBalance } from '@/lib/web3/use-wallet-balance';
import { DepositEstReceive } from './deposit-est-receive';

export function AprioriDeposit() {
  const monToken = TokenData.find((token) => token.symbol === 'MON') || TokenData[0];
  const aprMonToken = TokenData.find((token) => token.symbol === 'aprMON') || TokenData[1];

  const { setIsOpen } = useSideDrawerStore();
  const { mutate: deposit, isPending } = useAprioriDeposit();

  const { balance, isPending: isBalancePending } = useWalletBalance();
  const { inputValue, btnDisabled, errorData, handleInputChange } = useTokenInput(balance);

  const receiveAmount = inputValue || '0';

  const handleDeposit = () => {
    if (!inputValue || btnDisabled || isPending) return;
    const amount = multiply(inputValue, String(10 ** (monToken?.decimals || 18)));
    deposit(amount);
  };

  return (
    <>
      <SideDrawerBackHeader title="Deposit" onClick={() => setIsOpen(false)} />
      <div className="scrollbar-hover flex-grow overflow-x-hidden overflow-y-scroll">
        <div className="mx-auto" style={{ maxWidth: '296px' }}>
          <div className="pt-2 pb-10 sm:pt-4">
            <TokenDisplay
              isPending={isBalancePending}
              token={monToken}
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
            <DepositEstReceive receiveToken={aprMonToken} receiveAmount={receiveAmount} />
            <HrLine />
            <ActionButton disabled={btnDisabled} onClick={handleDeposit} isPending={isPending}>
              Deposit
            </ActionButton>
            <ErrorMessage show={errorData.showError} message={errorData.errorMessage} />
          </div>
        </div>
      </div>
    </>
  );
}
