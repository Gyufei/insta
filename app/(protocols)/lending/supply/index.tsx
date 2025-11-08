import { useAccount } from 'wagmi';

import { useMemo } from 'react';

import { NetworkConfigs } from '@/config/network-config';
import { IToken } from '@/config/tokens';

import { ActionButton } from '@/components/side-drawer/common/action-button';
import { SetMax } from '@/components/side-drawer/common/set-max';
import { SideDrawerLayout } from '@/components/side-drawer/common/side-drawer-layout';
import { TokenDisplay } from '@/components/side-drawer/common/token-display';
import { TokenInput } from '@/components/side-drawer/common/token-input';
import { useSetMax } from '@/components/side-drawer/common/use-set-max';
import { SideDrawerBackHeader } from '@/components/side-drawer/side-drawer-back-header';
import { useTokenInput } from '@/components/side-drawer/use-token-input';

import { useRPCTokenBalance } from '@/lib/data/balance/use-rpc-token-balance';
import { useCurvanceDeposit } from '@/lib/data/use-curvance-deposit';
import { useEnhancedAnalytics } from '@/lib/hooks/use-enhanced-analytics';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { useUrlPathDrawerChange } from '@/lib/state/use-url-path-drawer-change';
import { parseBig } from '@/lib/utils/number';

type LendingSupplyProps = {
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
};

export function LendingSupply() {
  const { currentComponent } = useSideDrawerStore();
  const props = (currentComponent?.props || {}) as LendingSupplyProps;

  const token: IToken = useMemo(
    () => ({
      address: props?.base_token?.address || '0x0',
      name: props?.base_token?.name || 'Token',
      symbol: props?.base_token?.symbol || 'TOKEN',
      logo: props?.base_token?.logo || '/icons/token.svg',
      decimals: props?.base_token?.decimals || 18,
    }),
    [props?.base_token]
  );

  const { address } = useAccount();
  const { balance, isPending: isBalancePending } = useRPCTokenBalance(
    NetworkConfigs.monadTestnet.id,
    address || '',
    token.address,
    [token],
    true
  );

  const { inputValue, btnDisabled, errorData, handleInputChange } = useTokenInput(balance);
  const { isMax, handleSetMax, handleInput } = useSetMax(inputValue, balance, handleInputChange);
  const { handleBack } = useUrlPathDrawerChange('/lending');

  const { mutate: deposit, isPending } = useCurvanceDeposit();
  const { trackEvent } = useEnhancedAnalytics();

  const handleDeposit = () => {
    if (!inputValue || btnDisabled || isPending) return;
    const amount = parseBig(inputValue, token.decimals);

    const payload = {
      base_token: token.address,
      base_c_token: props?.base_c_token?.address || '',
      deposit_amount: amount.toString(),
    };

    trackEvent('LENDING_SUPPLY', {
      event_category: 'protocol_interaction',
      event_label: 'lending_supply_attempt',
      include_user_id: true,
      custom_parameters: {
        protocol: 'lending',
        action: 'supply',
        market: props?.market_address,
        token: token.symbol,
        amount: inputValue,
      },
    });

    deposit(payload, {
      onSuccess: () => {
        trackEvent('LENDING_SUPPLY', {
          event_category: 'protocol_interaction',
          event_label: 'lending_supply_success',
          include_user_id: true,
          custom_parameters: {
            protocol: 'lending',
            action: 'supply_success',
            token: token.symbol,
            amount: inputValue,
          },
        });
        handleBack();
      },
      onError: (error: Error) => {
        trackEvent('LENDING_SUPPLY', {
          event_category: 'protocol_interaction',
          event_label: 'lending_supply_failed',
          error_message: error?.message || 'Unknown error',
          include_user_id: true,
          custom_parameters: {
            protocol: 'lending',
            action: 'supply_failed',
            token: token.symbol,
            amount: inputValue,
          },
        });
      },
    });
  };

  return (
    <>
      <SideDrawerBackHeader title={`Supply ${token.symbol}`} onClick={handleBack} />
      <SideDrawerLayout>
        <div className="pt-2 pb-10 sm:pt-4">
          <TokenDisplay
            isPending={isBalancePending}
            token={token}
            balance={balance}
            balanceLabel="Token Balance"
          />
          <TokenInput
            inputValue={inputValue}
            onInputChange={handleInput}
            placeholder={`Amount to supply`}
          />
          <SetMax checked={isMax} onChange={handleSetMax} />
          <ActionButton
            disabled={btnDisabled}
            onClick={handleDeposit}
            isPending={isPending}
            error={errorData}
          >
            Supply
          </ActionButton>
        </div>
      </SideDrawerLayout>
    </>
  );
}
