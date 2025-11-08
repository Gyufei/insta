import { useMemo } from 'react';

import { IToken } from '@/config/tokens';

import { ActionButton } from '@/components/side-drawer/common/action-button';
import { SetMax } from '@/components/side-drawer/common/set-max';
import { SideDrawerLayout } from '@/components/side-drawer/common/side-drawer-layout';
import { TokenDisplay } from '@/components/side-drawer/common/token-display';
import { TokenInput } from '@/components/side-drawer/common/token-input';
import { useSetMax } from '@/components/side-drawer/common/use-set-max';
import { SideDrawerBackHeader } from '@/components/side-drawer/side-drawer-back-header';
import { useTokenInput } from '@/components/side-drawer/use-token-input';

import { useCurvanceWithdraw } from '@/lib/data/use-curvance-withdraw';
import { useEnhancedAnalytics } from '@/lib/hooks/use-enhanced-analytics';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { useUrlPathDrawerChange } from '@/lib/state/use-url-path-drawer-change';
import { parseBig } from '@/lib/utils/number';

type LendingWithdrawProps = {
  market_address: string;
  base_token: {
    address: string;
    name: string;
    symbol: string;
    logo?: string;
    decimals: number;
  };
  base_c_token?: {
    address: string;
    decimals?: number;
  };
  user_share_display_balance?: string; // display shares balance
};

export function LendingWithdraw() {
  const { currentComponent } = useSideDrawerStore();
  const props = (currentComponent?.props || {}) as LendingWithdrawProps;

  const token: IToken = useMemo(
    () => ({
      address: props?.base_c_token?.address || '0x0',
      name: `${props?.base_token?.symbol || 'Token'} Shares`,
      symbol: `${props?.base_token?.symbol || 'TOKEN'}-c`,
      logo: props?.base_token?.logo || '/icons/token.svg',
      decimals: props?.base_c_token?.decimals || props?.base_token?.decimals || 18,
    }),
    [props?.base_token, props?.base_c_token]
  );

  const sharesBalance = props?.user_share_display_balance || '0';
  const { inputValue, btnDisabled, errorData, handleInputChange } = useTokenInput(sharesBalance);
  const { isMax, handleSetMax, handleInput } = useSetMax(
    inputValue,
    sharesBalance,
    handleInputChange
  );

  const { handleBack } = useUrlPathDrawerChange('/lending');
  const { mutate: withdraw, isPending } = useCurvanceWithdraw();
  const { trackEvent } = useEnhancedAnalytics();

  const handleWithdraw = () => {
    if (!inputValue || btnDisabled || isPending) return;
    const shares = parseBig(inputValue, token.decimals);

    const payload = {
      base_token: props?.base_token?.address || '',
      base_c_token: props?.base_c_token?.address || '',
      withdraw_shares: shares.toString(),
    };

    trackEvent('LENDING_WITHDRAW', {
      event_category: 'protocol_interaction',
      event_label: 'lending_withdraw_attempt',
      include_user_id: true,
      custom_parameters: {
        protocol: 'lending',
        action: 'withdraw',
        market: props?.market_address,
        token: token.symbol,
        amount: inputValue,
      },
    });

    withdraw(payload, {
      onSuccess: () => {
        trackEvent('LENDING_WITHDRAW', {
          event_category: 'protocol_interaction',
          event_label: 'lending_withdraw_success',
          include_user_id: true,
          custom_parameters: {
            protocol: 'lending',
            action: 'withdraw_success',
            token: token.symbol,
            amount: inputValue,
          },
        });
        handleBack();
      },
      onError: (error: Error) => {
        trackEvent('LENDING_WITHDRAW', {
          event_category: 'protocol_interaction',
          event_label: 'lending_withdraw_failed',
          error_message: error?.message || 'Unknown error',
          include_user_id: true,
          custom_parameters: {
            protocol: 'curvance',
            action: 'withdraw_failed',
            token: token.symbol,
            amount: inputValue,
          },
        });
      },
    });
  };

  return (
    <>
      <SideDrawerBackHeader
        title={`Withdraw ${props?.base_token?.symbol || 'Token'}`}
        onClick={handleBack}
      />
      <SideDrawerLayout>
        <div className="pt-2 pb-10 sm:pt-4">
          <TokenDisplay
            isPending={false}
            token={token}
            balance={sharesBalance}
            balanceLabel="Token Balance"
          />
          <TokenInput
            inputValue={inputValue}
            onInputChange={handleInput}
            placeholder={`Shares to withdraw`}
          />
          <SetMax checked={isMax} onChange={handleSetMax} />
          <ActionButton
            disabled={btnDisabled}
            onClick={handleWithdraw}
            isPending={isPending}
            error={errorData}
          >
            Withdraw
          </ActionButton>
        </div>
      </SideDrawerLayout>
    </>
  );
}
