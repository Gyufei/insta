import { SideDrawerBackHeader } from '@/components/side-drawer/side-drawer-back-header';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { TokenData } from '@/lib/data/tokens';
import { useAprioriDeposit } from '@/lib/data/use-apriori-deposit';
import { TokenDisplay } from '@/components/side-drawer/common/token-display';
import { TokenInput } from '@/components/side-drawer/common/token-input';
import { ActionButton } from '@/components/side-drawer/common/action-button';
import { ErrorMessage } from '@/components/side-drawer/common/error-message';
import { useTokenInput } from '@/components/side-drawer/use-token-input';
import { SetMax } from '@/components/side-drawer/common/set-max';
import { SideDrawerLayout } from '@/components/side-drawer/common/side-drawer-layout';
import { useAccountBalance } from '@/lib/web3/use-account-balance';
import { parseBig } from '@/lib/utils/number';
import { useSetMax } from '@/components/side-drawer/common/use-set-max';
import { TokenDisplayCard } from '@/components/token-display-card';

export function AprioriDeposit() {
  const monToken = TokenData.find((token) => token.symbol === 'MON') || TokenData[0];
  const aprMonToken = TokenData.find((token) => token.symbol === 'aprMON') || TokenData[1];

  const { setIsOpen } = useSideDrawerStore();
  const { mutate: deposit, isPending } = useAprioriDeposit();

  const { balance, isPending: isBalancePending } = useAccountBalance();
  const { inputValue, btnDisabled, errorData, handleInputChange } = useTokenInput(balance);
  const { isMax, handleSetMax, handleInput } = useSetMax(inputValue, balance, handleInputChange);

  const receiveAmount = inputValue || '0';

  const handleDeposit = () => {
    if (!inputValue || btnDisabled || isPending) return;
    const amount = parseBig(inputValue, monToken?.decimals);
    deposit(amount);
  };

  return (
    <>
      <SideDrawerBackHeader title="Deposit" onClick={() => setIsOpen(false)} />
      <SideDrawerLayout>
        <div className="pt-2 pb-10 sm:pt-4">
          <TokenDisplay
            isPending={isBalancePending}
            token={monToken}
            balance={balance}
            balanceLabel="Token Balance"
          />
          <TokenInput
            inputValue={inputValue}
            onInputChange={handleInput}
            placeholder="Amount to deposit"
          />
          <SetMax checked={isMax} onChange={handleSetMax} />
          <TokenDisplayCard
            logo={aprMonToken.iconUrl}
            symbol={aprMonToken.symbol}
            title="Estimated Receive"
            content={receiveAmount}
          />
          <ActionButton disabled={btnDisabled} onClick={handleDeposit} isPending={isPending}>
            Deposit
          </ActionButton>
          <ErrorMessage show={errorData.showError} message={errorData.errorMessage} />
        </div>
      </SideDrawerLayout>
    </>
  );
}
