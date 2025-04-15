import { toast } from 'sonner';

import { SideDrawerLayout } from '@/components/side-drawer/common/side-drawer-layout';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { useTokenInput } from '@/components/side-drawer/use-token-input';
import { ActionButton } from '@/components/side-drawer/common/action-button';
import { ErrorMessage } from '@/components/side-drawer/common/error-message';
import { TokenData } from '@/lib/data/tokens';
import { useNadFunSell } from '@/lib/data/use-nadfun-sell';
import { multiply, utils } from 'safebase';
import { formatBig, parseBig } from '@/lib/utils/number';
import { TokenHeader } from '../common/token-header';
import { TokenInputSection } from '../common/token-input-section';
import SideDrawerBackHeader from '@/components/side-drawer/side-drawer-back-header';
import { TokenDisplayCard } from '@/components/token-display-card';
import { useNadFunReceiveAmount } from '../common/use-nadfun-receive-amount';
import { useEffect, useMemo, useState } from 'react';

export function NadFunSellToken() {
  const monToken = TokenData.find((token) => token.symbol === 'MON') || TokenData[0];
  const { currentComponent, setIsOpen } = useSideDrawerStore();
  const { token } = currentComponent?.props || { token: null };

  const balance = token?.balance ? formatBig(token.balance) : '0';

  const { inputValue, btnDisabled, errorData, handleInputChange } = useTokenInput(balance);
  const { mutateAsync: sellToken, isPending } = useNadFunSell();
  const { calcTokenIn } = useNadFunReceiveAmount(token?.address);

  const [error, setError] = useState({
    showError: false,
    errorMessage: '',
  });

  const allError = useMemo(() => {
    return {
      ...errorData,
      ...error,
    };
  }, [errorData, error]);

  const [tokenOut, setTokenOut] = useState<bigint>(BigInt(0));

  const tokenOutDisplay = useMemo(() => {
    return utils.roundResult(formatBig(tokenOut.toString()), 6);
  }, [tokenOut]);

  function handleInput(value: string) {
    setError({
      showError: false,
      errorMessage: '',
    });

    try {
      handleInputChange(value);

      if (Number(value) === 0) {
        setTokenOut(BigInt(0));
        return;
      }

      const tokenOut = calcTokenIn(value);
      setTokenOut(tokenOut);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError({
          showError: true,
          errorMessage: error.message,
        });
      }
    }
  }

  async function handleSellToken() {
    if (!token?.address) return;

    const amountIn = parseBig(inputValue);

    try {
      await sellToken({
        amount_in: amountIn,
        amount_out_min: tokenOut.toString(),
        token: token.address,
      });
      toast.success('Token sold successfully');
    } catch (error) {
      // Error is already handled in the hook
    }
  }

  function handlePercentage(percentage: number) {
    const amount = multiply(balance, String(percentage));
    const roundedAmount = utils.roundResult(amount, 10);
    handleInput(roundedAmount);
  }

  useEffect(() => {
    handleInputChange('');
    setError({
      showError: false,
      errorMessage: '',
    });
    setTokenOut(BigInt(0));
  }, [token]);

  if (!token) {
    return null;
  }

  const setInputButtons = [
    { label: 'Reset', onClick: () => handlePercentage(0) },
    { label: '20%', onClick: () => handlePercentage(0.2) },
    { label: '50%', onClick: () => handlePercentage(0.5) },
    { label: '75%', onClick: () => handlePercentage(0.75) },
    { label: 'Max', onClick: () => handlePercentage(1) },
  ];

  return (
    <>
      <SideDrawerBackHeader title={`Sell ${token?.symbol}`} onClick={() => setIsOpen(false)} />
      <SideDrawerLayout>
        <TokenHeader token={token} />
        <TokenInputSection
          inputValue={inputValue}
          onInputChange={handleInput}
          balance={balance}
          tokenSymbol={token?.symbol}
          suffix={token?.symbol}
          setInputButtons={setInputButtons}
        />

        <TokenDisplayCard
          logo={monToken.iconUrl}
          symbol={monToken.symbol}
          title="Estimated Receive"
          content={tokenOutDisplay || '0'}
        />

        <ActionButton disabled={btnDisabled} onClick={handleSellToken} isPending={isPending}>
          Sell
        </ActionButton>

        <ErrorMessage show={allError.showError} message={allError.errorMessage} />
      </SideDrawerLayout>
    </>
  );
}
