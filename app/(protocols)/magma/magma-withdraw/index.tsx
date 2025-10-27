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
import { Separator } from '@/components/ui/separator';



import { useMagmaBalance } from '@/lib/data/use-magma-balance';
import { useMagmaWithdraw } from '@/lib/data/use-magma-withdraw';
import { useEnhancedAnalytics } from '@/lib/hooks/use-enhanced-analytics';
import { useUrlPathDrawerChange } from '@/lib/state/use-url-path-drawer-change';
import { parseBig } from '@/lib/utils/number';

export function MagmaWithdraw() {
  const { handleBack } = useUrlPathDrawerChange('/magma');

  const monToken = MONAD;
  const gMonToken = G_MONAD;

  const { mutate: withdraw, isPending } = useMagmaWithdraw();
  const { trackEvent } = useEnhancedAnalytics();

  const { data: magmaBalance, isLoading: isBalancePending } = useMagmaBalance();
  const balance = magmaBalance?.balance || '0';
  const { inputValue, btnDisabled, errorData, handleInputChange } = useTokenInput(balance);
  const { isMax, handleSetMax, handleInput } = useSetMax(inputValue, balance, handleInputChange);

  const receiveAmount = inputValue || '0';

  const handleWithdraw = () => {
    if (!inputValue || btnDisabled || isPending) return;
    const amount = parseBig(inputValue, gMonToken?.decimals);

    // Track withdraw attempt
    trackEvent('MAGMA_UNSTAKE', {
      event_category: 'protocol_interaction',
      event_label: 'magma_withdraw_attempt',
      include_user_id: true,
      custom_parameters: {
        protocol: 'magma',
        action: 'withdraw',
        token: gMonToken?.symbol,
        amount: inputValue,
        receive_token: monToken?.symbol,
        receive_amount: receiveAmount,
      },
    });

    withdraw(amount.toString(), {
      onSuccess: () => {
        // Track successful withdraw
        trackEvent('MAGMA_UNSTAKE', {
          event_category: 'protocol_interaction',
          event_label: 'magma_withdraw_success',
          include_user_id: true,
          custom_parameters: {
            protocol: 'magma',
            action: 'withdraw_success',
            token: gMonToken?.symbol,
            amount: inputValue,
          },
        });
        handleBack();
      },
      onError: (error: Error) => {
        // Track failed withdraw
        trackEvent('ERROR_OCCURRED', {
          event_category: 'protocol_interaction',
          event_label: 'magma_withdraw_failed',
          error_message: error?.message || 'Unknown error',
          include_user_id: true,
          custom_parameters: {
            protocol: 'magma',
            action: 'withdraw_failed',
            token: gMonToken?.symbol,
            amount: inputValue,
          },
        });
      },
    });
  };

  return (
    <>
      <SideDrawerBackHeader title="Withdraw" onClick={handleBack} />
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