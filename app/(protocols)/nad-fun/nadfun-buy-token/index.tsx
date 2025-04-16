import { utils } from 'safebase';

import { useEffect, useMemo, useState } from 'react';

import { ActionButton } from '@/components/side-drawer/common/action-button';
import { ErrorMessage } from '@/components/side-drawer/common/error-message';
import { SideDrawerLayout } from '@/components/side-drawer/common/side-drawer-layout';
import { SideDrawerBackHeader } from '@/components/side-drawer/side-drawer-back-header';
import { useTokenInput } from '@/components/side-drawer/use-token-input';
import { TokenDisplayCard } from '@/components/token-display-card';

import { TokenData } from '@/lib/data/tokens';
import { useNadFunBuy } from '@/lib/data/use-nadfun-buy';
import { useNadFunTokenMarketInfo } from '@/lib/data/use-nadfun-token-market-info';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { formatBig, parseBig } from '@/lib/utils/number';
import { useAccountBalance } from '@/lib/web3/use-account-balance';

import { TokenHeader } from '../common/token-header';
import { TokenInputSection } from '../common/token-input-section';
import { useNadFunReceiveAmount } from '../common/use-nadfun-receive-amount';

export function NadFunBuyToken() {
  const monToken = TokenData.find((token) => token.symbol === 'MON') || TokenData[0];
  const { currentComponent, setIsOpen } = useSideDrawerStore();
  const { token } = currentComponent?.props || { token: null };

  const { balance } = useAccountBalance();
  const { inputValue, btnDisabled, errorData, setErrorData, handleInputChange } =
    useTokenInput(balance);
  const { mutateAsync: buyToken, isPending } = useNadFunBuy();
  const { data: marketInfo, isLoading: isMarketInfoLoading } = useNadFunTokenMarketInfo(
    token?.address
  );
  const { calcTokenOut } = useNadFunReceiveAmount(token?.address, marketInfo);

  const [tokenOut, setTokenOut] = useState<bigint>(BigInt(0));

  const tokenOutDisplay = useMemo(() => {
    return utils.roundResult(formatBig(tokenOut.toString()), 6);
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

    try {
      await buyToken({
        amount_in: amountIn.toString(),
        amount_out_min: tokenOut.toString(),
        token: token.address,
      });
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
      <SideDrawerBackHeader title={`Buy ${token?.symbol}`} onClick={() => setIsOpen(false)} />
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

        <ActionButton disabled={btnDisabled} onClick={handleBuyToken} isPending={isPending}>
          Buy
        </ActionButton>

        <ErrorMessage show={errorData.showError} message={errorData.errorMessage} />
      </SideDrawerLayout>
    </>
  );
}
