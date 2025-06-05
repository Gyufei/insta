import { ActionButton } from '@/components/side-drawer/common/action-button';
import { SetMax } from '@/components/side-drawer/common/set-max';
import { SideDrawerLayout } from '@/components/side-drawer/common/side-drawer-layout';
import { TokenDisplay } from '@/components/side-drawer/common/token-display';
import { TokenInput } from '@/components/side-drawer/common/token-input';
import { useSetMax } from '@/components/side-drawer/common/use-set-max';
import { SideDrawerBackHeader } from '@/components/side-drawer/side-drawer-back-header';
import { useTokenInput } from '@/components/side-drawer/use-token-input';
import { TokenDisplayCard } from '@/components/common/token-display-card';
import { Separator } from '@/components/ui/separator';

import { G_MONAD, MONAD } from '@/config/tokens';
import { useMagmaBalance } from '@/lib/data/use-magma-balance';
import { useMagmaWithdraw } from '@/lib/data/use-magma-withdraw';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { formatBig, parseBig } from '@/lib/utils/number';

export function MagmaWithdraw() {
  const { setIsOpen } = useSideDrawerStore();

  const monToken = MONAD;
  const gMonToken = G_MONAD;

  const { mutate: withdraw, isPending } = useMagmaWithdraw();

  const { data: magmaBalance, isLoading: isBalancePending } = useMagmaBalance();
  const balance = formatBig(magmaBalance?.balance || '0');
  const { inputValue, btnDisabled, errorData, handleInputChange } = useTokenInput(balance);
  const { isMax, handleSetMax, handleInput } = useSetMax(inputValue, balance, handleInputChange);

  const receiveAmount = inputValue || '0';

  const handleWithdraw = () => {
    if (!inputValue || btnDisabled || isPending) return;
    const amount = parseBig(inputValue, gMonToken?.decimals);
    withdraw(amount.toString());
  };

  return (
    <>
      <SideDrawerBackHeader title="Withdraw" onClick={() => setIsOpen(false)} />
      <SideDrawerLayout>
        <TokenDisplay
          isPending={isBalancePending}
          token={gMonToken}
          balance={balance}
          balanceLabel="Token Balance"
        />
        <TokenInput
          inputValue={inputValue}
          onInputChange={handleInput}
          placeholder="Amount to withdraw"
        />
        <SetMax checked={isMax} onChange={handleSetMax} />
        <TokenDisplayCard
          logo={monToken.logo}
          symbol={monToken.symbol}
          title="Estimated Receive"
          content={receiveAmount}
        />
        <Separator />
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
