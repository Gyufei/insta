import { ActionButton } from '@/components/side-drawer/common/action-button';
import { SetMax } from '@/components/side-drawer/common/set-max';
import { SideDrawerLayout } from '@/components/side-drawer/common/side-drawer-layout';
import { TokenDisplay } from '@/components/side-drawer/common/token-display';
import { TokenInput } from '@/components/side-drawer/common/token-input';
import { useSetMax } from '@/components/side-drawer/common/use-set-max';
import { SideDrawerBackHeader } from '@/components/side-drawer/side-drawer-back-header';
import { useTokenInput } from '@/components/side-drawer/use-token-input';
import { TokenDisplayCard } from '@/components/common/token-display-card';

import { G_MONAD, MONAD } from '@/config/tokens';
import { useMagmaDeposit } from '@/lib/data/use-magma-deposit';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { parseBig } from '@/lib/utils/number';
import { useAccountBalance } from '@/lib/web3/use-account-balance';

export function MagmaDeposit() {
  const monToken = MONAD;
  const gMonToken = G_MONAD;

  const { setIsOpen } = useSideDrawerStore();
  const { mutate: deposit, isPending } = useMagmaDeposit();

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
            logo={gMonToken.logo}
            symbol={gMonToken.symbol}
            title="Estimated Receive"
            content={receiveAmount}
          />
          <ActionButton
            disabled={btnDisabled}
            onClick={handleDeposit}
            isPending={isPending}
            error={errorData}
          >
            Deposit
          </ActionButton>
        </div>
      </SideDrawerLayout>
    </>
  );
}
