import { useEffect, useMemo, useState } from 'react';



import { MONAD } from '@/config/tokens';



import { TokenDisplayCard } from '@/components/common/token-display-card';
import { ActionButton } from '@/components/side-drawer/common/action-button';
import { SideDrawerLayout } from '@/components/side-drawer/common/side-drawer-layout';
import { SideDrawerBackHeader } from '@/components/side-drawer/side-drawer-back-header';
import { useTokenInput } from '@/components/side-drawer/use-token-input';



import { useDSAMonadNativeBalance } from '@/lib/data/balance/use-dsa-monad-native-balance';
import { useNadFunBuy } from '@/lib/data/use-nadfun-buy';
import { useNadFunTokenMarketInfo } from '@/lib/data/use-nadfun-token-market-info';
import { useEnhancedAnalytics } from '@/lib/hooks/use-enhanced-analytics';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { useUrlPathDrawerChange } from '@/lib/state/use-url-path-drawer-change';
import { formatBig, parseBig, truncateNumber } from '@/lib/utils/number';

import { TokenHeader } from '../common/token-header';
import { TokenInputSection } from '../common/token-input-section';
import { useNadFunReceiveAmount } from '../common/use-nadfun-receive-amount';

export function NadFunBuyToken() {
  const monToken = MONAD;
  const { currentComponent } = useSideDrawerStore();
  const { handleBack } = useUrlPathDrawerChange('/nad-fun');
  const { token } = currentComponent?.props || { token: null };
  const { trackEvent } = useEnhancedAnalytics();

  const { balance } = useDSAMonadNativeBalance();
  const { inputValue, btnDisabled, errorData, setErrorData, handleInputChange } =
    useTokenInput(balance);
  const { mutateAsync: buyToken, isPending } = useNadFunBuy();
  const { data: marketInfo, isLoading: isMarketInfoLoading } = useNadFunTokenMarketInfo(
    token?.address
  );
  const { calcTokenOut } = useNadFunReceiveAmount(token?.address, marketInfo);

  const [tokenOut, setTokenOut] = useState<bigint>(BigInt(0));

  const tokenOutDisplay = useMemo(() => {
    return truncateNumber(formatBig(tokenOut.toString()), 6);
  }, [tokenOut]);

  function handleInput(value: string) {
    try {
      handleInputChange(value);

      if (Number(value) === 0) {
        setTokenOut(BigInt(0));
        return;
      }

      const tokenOut = calcTokenOut(value);
      setTokenOut(tokenOut);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorData({
          showError: true,
          errorMessage: error.message,
        });
      }
    }
  }
  async function handleBuyToken() {
    if (!token?.address) return;

    const amountIn = parseBig(inputValue);

    // Track buy token attempt
    trackEvent('NAD_TOKEN_BUY', {
      event_category: 'protocol_interaction',
      event_label: 'nad_fun_buy_token_attempt',
      include_user_id: true,
      custom_parameters: {
        protocol: 'nad_fun',
        action: 'buy_token',
        token_address: token.address,
        token_symbol: token.symbol,
        amount_in: inputValue,
        amount_out_expected: tokenOutDisplay,
      },
    });

    try {
      await buyToken(
        {
          amount_in: amountIn.toString(),
          amount_out_min: tokenOut.toString(),
          token: token.address,
        },
        {
          onSuccess: () => {
            // Track successful buy
            trackEvent('NAD_TOKEN_BUY', {
              event_category: 'protocol_interaction',
              event_label: 'nad_fun_buy_token_success',
              include_user_id: true,
              custom_parameters: {
                protocol: 'nad_fun',
                action: 'buy_token_success',
                token_address: token.address,
                token_symbol: token.symbol,
                amount_in: inputValue,
              },
            });
            handleBack();
          },
          onError: (error: Error) => {
            // Track failed buy
            trackEvent('ERROR_OCCURRED', {
              event_category: 'protocol_interaction',
              event_label: 'nad_fun_buy_token_failed',
              error_message: error?.message || 'Unknown error',
              include_user_id: true,
              custom_parameters: {
                protocol: 'nad_fun',
                action: 'buy_token_failed',
                token_address: token.address,
                token_symbol: token.symbol,
              },
            });
          },
        }
      );
    } catch (error) {
      // Error is already handled in the hook
    }
  }

  useEffect(() => {
    handleInputChange('');
    setErrorData({
      showError: false,
      errorMessage: '',
    });
    setTokenOut(BigInt(0));
  }, [token]);

  useEffect(() => {
    if (!isMarketInfoLoading && Number(inputValue) > 0) {
      const tokenOut = calcTokenOut(inputValue);
      setTokenOut(tokenOut);
    }
  }, [isMarketInfoLoading, inputValue]);

  if (!token) {
    return null;
  }

  const setInputButtons = [
    { label: 'Reset', onClick: () => handleInput('') },
    { label: '0.5 MON', onClick: () => handleInput('0.5') },
    { label: '1 MON', onClick: () => handleInput('1') },
    { label: '2 MON', onClick: () => handleInput('2') },
    { label: '5 MON', onClick: () => handleInput('5') },
  ];

  console.log(errorData);

  return (
    <>
      <SideDrawerBackHeader title={`Buy ${token?.symbol}`} onClick={handleBack} />
      <SideDrawerLayout>
        <TokenHeader token={token} />
        <TokenInputSection
          inputValue={inputValue}
          onInputChange={handleInput}
          balance={balance}
          tokenSymbol="Mon"
          suffix={monToken?.symbol}
          setInputButtons={setInputButtons}
        />

        <TokenDisplayCard
          logo={token?.logo}
          symbol={token?.symbol}
          title="Estimated Receive"
          content={tokenOutDisplay || '0'}
        />

        <ActionButton
          disabled={btnDisabled}
          onClick={handleBuyToken}
          isPending={isPending}
          error={errorData}
        >
          Buy
        </ActionButton>
      </SideDrawerLayout>
    </>
  );
}