import { useTokenInput } from '@/components/side-drawer/use-token-input';

import { MONAD } from '@/lib/data/tokens';
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

export function WithdrawToken() {
  const { setIsOpen } = useSideDrawerStore();

  const token = MONAD;

  const { balance } = useAccountBalance();

  const { mutate: withdraw, isPending } = useWithdraw();

  const { inputValue, btnDisabled, errorData, handleInputChange } = useTokenInput(balance);
  const { isMax, handleSetMax, handleInput } = useSetMax(inputValue, balance, handleInputChange);

  const handleWithdraw = () => {
    if (!inputValue || btnDisabled || isPending) return;
    const amount = parseBig(inputValue, token?.decimals);
    withdraw(amount);
  };

  return (
    <>
      <SideDrawerBackHeader title="Withdraw" onClick={() => setIsOpen(false)} />
      <SideDrawerLayout>
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
