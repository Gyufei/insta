import { TokenData } from '@/lib/data/tokens';
import { useAprioriWithdraw } from '@/lib/data/use-apriori-withdraw';
import { TokenDisplay } from '@/components/side-drawer/common/token-display';
import { TokenInput } from '@/components/side-drawer/common/token-input';
import { ActionButton } from '@/components/side-drawer/common/action-button';
import { ErrorMessage } from '@/components/side-drawer/common/error-message';
import { useTokenInput } from '@/components/side-drawer/use-token-input';
import { HrLine } from '@/components/hr-line';
import { SetMax } from '@/components/side-drawer/common/set-max';
import { useAprioriBalance } from '@/lib/data/use-aprior-balance';
import { WithdrawEstReceive } from './withdraw-est-receive';
import { useSetMax } from '@/components/side-drawer/common/use-set-max';
import { parseBig } from '@/lib/utils/number';

export function Withdraw() {
  const monToken = TokenData.find((token) => token.symbol === 'MON') || TokenData[0];
  const aprMonToken = TokenData.find((token) => token.symbol === 'aprMON') || TokenData[1];

  const { mutate: withdraw, isPending } = useAprioriWithdraw();

  const { data: aprioriBalance, isLoading: isBalancePending } = useAprioriBalance();
  const balance = aprioriBalance?.balance || '0';
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
      <HrLine />
      <TokenInput
        inputValue={inputValue}
        onInputChange={handleInput}
        placeholder="Amount to withdraw"
      />
      <HrLine />
      <SetMax checked={isMax} onChange={handleSetMax} />
      <HrLine />
      <WithdrawEstReceive receiveToken={monToken} receiveAmount={receiveAmount} />
      <HrLine />
      <ActionButton disabled={btnDisabled} onClick={handleWithdraw} isPending={isPending}>
        Withdraw
      </ActionButton>
      <ErrorMessage show={errorData.showError} message={errorData.errorMessage} />
    </>
  );
}
