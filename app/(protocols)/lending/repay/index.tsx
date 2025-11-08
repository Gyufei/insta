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
import { useCurvanceRepay } from '@/lib/data/use-curvance-repay';
import { useEnhancedAnalytics } from '@/lib/hooks/use-enhanced-analytics';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { useUrlPathDrawerChange } from '@/lib/state/use-url-path-drawer-change';
import { parseBig } from '@/lib/utils/number';

type LendingRepayProps = {
  market_address: string;
  borrowable_token: {
    address: string;
    name: string;
    symbol: string;
    logo?: string;
    decimals: number;
  };
  borrowable_c_token?: {
    address: string;
    decimals?: number;
  };
  user_debt_display_balance?: string; // display debt balance (max repay)
};

export function LendingRepay() {
  const { currentComponent } = useSideDrawerStore();
  const props = (currentComponent?.props || {}) as LendingRepayProps;

  const token: IToken = useMemo(
    () => ({
      address: props?.borrowable_token?.address || '0x0',
      name: props?.borrowable_token?.name || 'Token',
      symbol: props?.borrowable_token?.symbol || 'TOKEN',
      logo: props?.borrowable_token?.logo || '/icons/token.svg',
      decimals: props?.borrowable_token?.decimals || 18,
    }),
    [props?.borrowable_token]
  );

  const { address } = useAccount();
  const { balance: walletBalance, isPending: isWalletPending } = useRPCTokenBalance(
    NetworkConfigs.monadTestnet.id,
    address || '',
    token.address,
    [token],
    true
  );

  const debtBalance = props?.user_debt_display_balance || '0';

  // Use the smaller of wallet vs debt as the input constraint
  const inputConstraintBalance = useMemo(() => {
    const w = parseFloat(walletBalance || '0');
    const d = parseFloat(debtBalance || '0');
    return String(Math.min(w || 0, d || 0));
  }, [walletBalance, debtBalance]);

  const { inputValue, btnDisabled, errorData, handleInputChange } =
    useTokenInput(inputConstraintBalance);
  const { isMax, handleSetMax, handleInput } = useSetMax(
    inputValue,
    inputConstraintBalance,
    handleInputChange
  );
  const { handleBack } = useUrlPathDrawerChange('/lending');

  const { mutate: repay, isPending } = useCurvanceRepay();
  const { trackEvent } = useEnhancedAnalytics();

  const handleRepay = () => {
    if (!inputValue || btnDisabled || isPending) return;
    const amount = parseBig(inputValue, token.decimals);

    const payload = {
      borrowable_token: token.address,
      borrowable_c_token: props?.borrowable_c_token?.address || '',
      repay_amount: amount.toString(),
    };

    trackEvent('LENDING_REPAY', {
      event_category: 'protocol_interaction',
      event_label: 'lending_repay_attempt',
      include_user_id: true,
      custom_parameters: {
        protocol: 'lending',
        action: 'repay',
        market: props?.market_address,
        token: token.symbol,
        amount: inputValue,
      },
    });

    repay(payload, {
      onSuccess: () => {
        trackEvent('LENDING_REPAY', {
          event_category: 'protocol_interaction',
          event_label: 'lending_repay_success',
          include_user_id: true,
          custom_parameters: {
            protocol: 'lending',
            action: 'repay_success',
            token: token.symbol,
            amount: inputValue,
          },
        });
        handleBack();
      },
      onError: (error: Error) => {
        trackEvent('LENDING_REPAY', {
          event_category: 'protocol_interaction',
          event_label: 'lending_repay_failed',
          error_message: error?.message || 'Unknown error',
          include_user_id: true,
          custom_parameters: {
            protocol: 'lending',
            action: 'repay_failed',
            token: token.symbol,
            amount: inputValue,
          },
        });
      },
    });
  };

  return (
    <>
      <SideDrawerBackHeader title={`Repay ${token.symbol}`} onClick={handleBack} />
      <SideDrawerLayout>
        <div className="pt-2 pb-10 sm:pt-4">
          <TokenDisplay
            isPending={isWalletPending}
            token={token}
            balance={walletBalance}
            balanceLabel="Wallet Balance"
          />
          <TokenDisplay
            isPending={false}
            token={token}
            balance={debtBalance}
            balanceLabel="Debt Balance"
          />
          <TokenInput
            inputValue={inputValue}
            onInputChange={handleInput}
            placeholder={`Amount to repay`}
          />
          <SetMax checked={isMax} onChange={handleSetMax} />
          <ActionButton
            disabled={btnDisabled}
            onClick={handleRepay}
            isPending={isPending}
            error={errorData}
          >
            Repay
          </ActionButton>
        </div>
      </SideDrawerLayout>
    </>
  );
}
