import { useTokenInput } from '@/components/side-drawer/use-token-input';

import { MONAD } from '@/lib/data/tokens';
import { useDeposit } from '@/lib/data/use-deposit';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { parseBig } from '@/lib/utils/number';
import { useWalletBalance } from '@/lib/web3/use-wallet-balance';

import { ActionButton } from '../common/action-button';
import { SideDrawerLayout } from '../common/side-drawer-layout';
import { TokenDisplay } from '../common/token-display';
import { TokenInput } from '../common/token-input';
import { SideDrawerBackHeader } from '../side-drawer-back-header';

export function DepositToken() {
  const token = MONAD;

  const { setIsOpen } = useSideDrawerStore();
  const { mutate: deposit, isPending } = useDeposit();

  const { balance, isPending: isBalancePending } = useWalletBalance();
  const { inputValue, btnDisabled, errorData, handleInputChange } = useTokenInput(balance);

  const handleDeposit = () => {
    if (!inputValue || btnDisabled || isPending) return;
    const amount = parseBig(inputValue, token?.decimals);
    deposit(amount);
  };

  return (
    <>
      <SideDrawerBackHeader title="Deposit" onClick={() => setIsOpen(false)} />
      <SideDrawerLayout>
        <TokenDisplay
          isPending={isBalancePending}
          token={token}
          balance={balance}
          balanceLabel="Token Balance"
        />
        <TokenInput
          inputValue={inputValue}
          onInputChange={handleInputChange}
          placeholder="Amount to deposit"
        />
        <ActionButton
          disabled={btnDisabled}
          onClick={handleDeposit}
          isPending={isPending}
          error={errorData}
        >
          Deposit
        </ActionButton>
      </SideDrawerLayout>
    </>
  );
}
