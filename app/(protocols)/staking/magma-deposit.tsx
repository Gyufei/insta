import { G_MONAD, MONAD } from '@/config/tokens';

import { TokenDisplayCard } from '@/components/common/token-display-card';
import { ActionButton } from '@/components/side-drawer/common/action-button';
import { SetMax } from '@/components/side-drawer/common/set-max';
import { SideDrawerLayout } from '@/components/side-drawer/common/side-drawer-layout';
import { TokenDisplay } from '@/components/side-drawer/common/token-display';
import { TokenInput } from '@/components/side-drawer/common/token-input';
import { useSetMax } from '@/components/side-drawer/common/use-set-max';
import { SideDrawerBackHeader } from '@/components/side-drawer/side-drawer-back-header';
import { useTokenInput } from '@/components/side-drawer/use-token-input';

import { useDSAMonadNativeBalance } from '@/lib/data/balance/use-dsa-monad-native-balance';
import { useMagmaDeposit } from '@/lib/data/use-magma-deposit';
import { useUrlPathDrawerChange } from '@/lib/state/use-url-path-drawer-change';
import { parseBig } from '@/lib/utils/number';

/**
 * Magma Deposit Component
 * Handles depositing MON tokens to receive gMON tokens
 */
export function MagmaDeposit() {
  const monToken = MONAD;
  const gMonToken = G_MONAD;

  const { mutate: deposit, isPending } = useMagmaDeposit();

  const { balance, isPending: isBalancePending } = useDSAMonadNativeBalance();
  const { inputValue, btnDisabled, errorData, handleInputChange } = useTokenInput(balance);
  const { isMax, handleSetMax, handleInput } = useSetMax(inputValue, balance, handleInputChange);

  const { handleBack } = useUrlPathDrawerChange('/staking');

  const receiveAmount = inputValue || '0';

  /**
   * Handle deposit operation
   * Converts MON to gMON at 1:1 ratio
   */
  const handleDeposit = () => {
    if (!inputValue || btnDisabled || isPending) return;
    const amount = parseBig(inputValue, monToken?.decimals);
    deposit(amount.toString(), {
      onSuccess: () => {
        handleBack();
      },
    });
  };

  return (
    <>
      <SideDrawerBackHeader title="Deposit" onClick={handleBack} />
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