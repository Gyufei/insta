import { ActionButton } from '@/components/side-drawer/common/action-button';
import { SetMax } from '@/components/side-drawer/common/set-max';
import { TokenDisplay } from '@/components/side-drawer/common/token-display';
import { TokenInput } from '@/components/side-drawer/common/token-input';
import { useSetMax } from '@/components/side-drawer/common/use-set-max';
import { useTokenInput } from '@/components/side-drawer/use-token-input';
import { Separator } from '@/components/ui/separator';

import { APR_MONAD, MONAD } from '@/lib/data/tokens';
import { useAprioriBalance } from '@/lib/data/use-apriori-balance';
import { useAprioriWithdraw } from '@/lib/data/use-apriori-withdraw';
import { formatBig, parseBig } from '@/lib/utils/number';

import { WithdrawEstReceive } from './withdraw-est-receive';

export function Withdraw() {
  const monToken = MONAD;
  const aprMonToken = APR_MONAD;

  const { mutate: withdraw, isPending } = useAprioriWithdraw();

  const { data: aprioriBalance, isLoading: isBalancePending } = useAprioriBalance();
  const balance = formatBig(aprioriBalance?.balance || '0');
  const { inputValue, btnDisabled, errorData, handleInputChange } = useTokenInput(balance);
  const { isMax, handleSetMax, handleInput } = useSetMax(inputValue, balance, handleInputChange);

  const receiveAmount = inputValue || '0';

  const handleWithdraw = () => {
    if (!inputValue || btnDisabled || isPending) return;
    const amount = parseBig(inputValue, aprMonToken?.decimals);
    withdraw(amount);
  };

  return (
    <>
      <TokenDisplay
        isPending={isBalancePending}
        token={aprMonToken}
        balance={balance}
        balanceLabel="Token Balance"
      />
      <TokenInput
        inputValue={inputValue}
        onInputChange={handleInput}
        placeholder="Amount to withdraw"
      />
      <SetMax checked={isMax} onChange={handleSetMax} />
      <WithdrawEstReceive receiveToken={monToken} receiveAmount={receiveAmount} />
      <Separator />
      <ActionButton
        disabled={btnDisabled}
        onClick={handleWithdraw}
        isPending={isPending}
        error={errorData}
      >
        Withdraw
      </ActionButton>
    </>
  );
}
