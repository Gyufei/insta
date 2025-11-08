'use client';

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

import { useCurvanceBorrow } from '@/lib/data/use-curvance-borrow';
import { useEnhancedAnalytics } from '@/lib/hooks/use-enhanced-analytics';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { useUrlPathDrawerChange } from '@/lib/state/use-url-path-drawer-change';
import { parseBig } from '@/lib/utils/number';

type LendingBorrowProps = {
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
  user_max_borrow_display_amount?: string; // optional constraint provided by page
};

export function LendingBorrow() {
  const { currentComponent } = useSideDrawerStore();
  const props = (currentComponent?.props || {}) as LendingBorrowProps;

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

  const borrowLimit = props?.user_max_borrow_display_amount || '0';
  const { inputValue, btnDisabled, errorData, handleInputChange } = useTokenInput(borrowLimit);
  const { isMax, handleSetMax, handleInput } = useSetMax(
    inputValue,
    borrowLimit,
    handleInputChange
  );
  const { handleBack } = useUrlPathDrawerChange('/lending');

  const { mutate: borrow, isPending } = useCurvanceBorrow();
  const { trackEvent } = useEnhancedAnalytics();

  const handleBorrow = () => {
    if (!inputValue || btnDisabled || isPending) return;
    const amount = parseBig(inputValue, token.decimals);

    const payload = {
      borrowable_token: token.address,
      borrowable_c_token: props?.borrowable_c_token?.address || '',
      borrow_amount: amount.toString(),
    };

    trackEvent('LENDING_BORROW', {
      event_category: 'protocol_interaction',
      event_label: 'lending_borrow_attempt',
      include_user_id: true,
      custom_parameters: {
        protocol: 'lending',
        action: 'borrow',
        market: props?.market_address,
        token: token.symbol,
        amount: inputValue,
      },
    });

    borrow(payload, {
      onSuccess: () => {
        trackEvent('LENDING_BORROW', {
          event_category: 'protocol_interaction',
          event_label: 'lending_borrow_success',
          include_user_id: true,
          custom_parameters: {
            protocol: 'lending',
            action: 'borrow_success',
            token: token.symbol,
            amount: inputValue,
          },
        });
        handleBack();
      },
      onError: (error: Error) => {
        trackEvent('LENDING_BORROW', {
          event_category: 'protocol_interaction',
          event_label: 'lending_borrow_failed',
          error_message: error?.message || 'Unknown error',
          include_user_id: true,
          custom_parameters: {
            protocol: 'lending',
            action: 'borrow_failed',
            token: token.symbol,
            amount: inputValue,
          },
        });
      },
    });
  };

  return (
    <>
      <SideDrawerBackHeader title={`Borrow ${token.symbol}`} onClick={handleBack} />
      <SideDrawerLayout>
        <div className="pt-2 pb-10 sm:pt-4">
          <TokenDisplay
            isPending={false}
            token={token}
            balance={borrowLimit}
            balanceLabel="Borrow Limit"
          />
          <TokenInput
            inputValue={inputValue}
            onInputChange={handleInput}
            placeholder={`Amount to borrow`}
          />
          <SetMax checked={isMax} onChange={handleSetMax} />
          <ActionButton
            disabled={btnDisabled}
            onClick={handleBorrow}
            isPending={isPending}
            error={errorData}
          >
            Borrow
          </ActionButton>
        </div>
      </SideDrawerLayout>
    </>
  );
}
