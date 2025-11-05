import { APR_MONAD, MONAD } from '@/config/tokens';



import { ActionButton } from '@/components/side-drawer/common/action-button';
import { SetMax } from '@/components/side-drawer/common/set-max';
import { TokenDisplay } from '@/components/side-drawer/common/token-display';
import { TokenInput } from '@/components/side-drawer/common/token-input';
import { useSetMax } from '@/components/side-drawer/common/use-set-max';
import { useTokenInput } from '@/components/side-drawer/use-token-input';
import { Separator } from '@/components/ui/separator';



import { useAprioriBalance } from '@/lib/data/use-apriori-balance';
import { useAprioriWithdraw } from '@/lib/data/use-apriori-withdraw';
import { useEnhancedAnalytics } from '@/lib/hooks/use-enhanced-analytics';
import { parseBig } from '@/lib/utils/number';

import { WithdrawEstReceive } from './withdraw-est-receive';

export function Withdraw() {
  const monToken = MONAD;
  const aprMonToken = APR_MONAD;

  const { mutate: withdraw, isPending } = useAprioriWithdraw();
  const { trackEvent } = useEnhancedAnalytics();

  const { data: aprioriBalance, isLoading: isBalancePending } = useAprioriBalance();
  const balance = aprioriBalance?.balance || '0';
  const { inputValue, btnDisabled, errorData, handleInputChange } = useTokenInput(balance);
  const { isMax, handleSetMax, handleInput } = useSetMax(inputValue, balance, handleInputChange);

  const receiveAmount = inputValue || '0';

  const handleWithdraw = () => {
    if (!inputValue || btnDisabled || isPending) return;
    const amount = parseBig(inputValue, aprMonToken?.decimals);

    // Track withdraw request attempt
    trackEvent('APRIORI_UNSTAKE', {
      event_category: 'protocol_interaction',
      event_label: 'apriori_withdraw_request_attempt',
      include_user_id: true,
      custom_parameters: {
        protocol: 'apriori',
        action: 'withdraw_request',
        token: aprMonToken?.symbol,
        amount: inputValue,
        receive_token: monToken?.symbol,
        receive_amount: receiveAmount,
      },
    });

    withdraw(amount.toString(), {
      onSuccess: () => {
        // Track successful withdraw request
        trackEvent('APRIORI_UNSTAKE', {
          event_category: 'protocol_interaction',
          event_label: 'apriori_withdraw_request_success',
          include_user_id: true,
          custom_parameters: {
            protocol: 'apriori',
            action: 'withdraw_request_success',
            token: aprMonToken?.symbol,
            amount: inputValue,
          },
        });
      },
      onError: (error: Error) => {
        // Track failed withdraw request
        trackEvent('ERROR_OCCURRED', {
          event_category: 'protocol_interaction',
          event_label: 'apriori_withdraw_request_failed',
          error_message: error?.message || 'Unknown error',
          include_user_id: true,
          custom_parameters: {
            protocol: 'apriori',
            action: 'withdraw_request_failed',
            token: aprMonToken?.symbol,
            amount: inputValue,
          },
        });
      },
    });
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