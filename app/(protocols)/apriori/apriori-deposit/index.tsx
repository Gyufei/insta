import { APR_MONAD, MONAD } from '@/config/tokens';

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
import { useAprioriDeposit } from '@/lib/data/use-apriori-deposit';
import { useEnhancedAnalytics } from '@/lib/hooks/use-enhanced-analytics';
import { useUrlPathDrawerChange } from '@/lib/state/use-url-path-drawer-change';
import { parseBig } from '@/lib/utils/number';

export function AprioriDeposit() {
  const monToken = MONAD;
  const aprMonToken = APR_MONAD;

  const { mutate: deposit, isPending } = useAprioriDeposit();
  const { trackEvent } = useEnhancedAnalytics();

  const { balance, isPending: isBalancePending } = useDSAMonadNativeBalance();
  const { inputValue, btnDisabled, errorData, handleInputChange } = useTokenInput(balance);
  const { isMax, handleSetMax, handleInput } = useSetMax(inputValue, balance, handleInputChange);

  const { handleBack } = useUrlPathDrawerChange('/apriori');

  const receiveAmount = inputValue || '0';

  const handleDeposit = () => {
    if (!inputValue || btnDisabled || isPending) return;
    const amount = parseBig(inputValue, monToken?.decimals);

    // Track deposit attempt
    trackEvent('APRIORI_STAKE', {
      event_category: 'protocol_interaction',
      event_label: 'apriori_deposit_attempt',
      include_user_id: true,
      custom_parameters: {
        protocol: 'apriori',
        action: 'deposit',
        token: monToken?.symbol,
        amount: inputValue,
        receive_token: aprMonToken?.symbol,
        receive_amount: receiveAmount,
      },
    });

    deposit(amount.toString(), {
      onSuccess: () => {
        // Track successful deposit
        trackEvent('APRIORI_STAKE', {
          event_category: 'protocol_interaction',
          event_label: 'apriori_deposit_success',
          include_user_id: true,
          custom_parameters: {
            protocol: 'apriori',
            action: 'deposit_success',
            token: monToken?.symbol,
            amount: inputValue,
          },
        });
        handleBack();
      },
      onError: (error: Error) => {
        // Track failed deposit
        trackEvent('ERROR_OCCURRED', {
          event_category: 'protocol_interaction',
          event_label: 'apriori_deposit_failed',
          error_message: error?.message || 'Unknown error',
          include_user_id: true,
          custom_parameters: {
            protocol: 'apriori',
            action: 'deposit_failed',
            token: monToken?.symbol,
            amount: inputValue,
          },
        });
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
            logo={aprMonToken.logo}
            symbol={aprMonToken.symbol}
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
