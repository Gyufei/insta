import { toast } from 'sonner';

import { SideDrawerLayout } from '@/components/side-drawer/common/side-drawer-layout';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { useTokenInput } from '@/components/side-drawer/use-token-input';
import { ActionButton } from '@/components/side-drawer/common/action-button';
import { ErrorMessage } from '@/components/side-drawer/common/error-message';
import { TokenData } from '@/lib/data/tokens';
import { useNadFunSell } from '@/lib/data/use-nadfun-sell';
import { multiply, utils } from 'safebase';
import { formatBig } from '@/lib/utils/number';
import { TokenHeader } from '../common/token-header';
import { TokenInputSection } from '../common/token-input-section';
import SideDrawerBackHeader from '@/components/side-drawer/side-drawer-back-header';
import { TokenDisplayCard } from '@/components/token-display-card';

export function NadFunSellToken() {
  const monToken = TokenData.find((token) => token.symbol === 'MON') || TokenData[0];
  const { currentComponent, setIsOpen } = useSideDrawerStore();
  const { token } = currentComponent?.props || { token: null };

  const balance = token?.balance ? formatBig(token.balance) : '0';

  const { inputValue, btnDisabled, errorData, handleInputChange } = useTokenInput(balance);
  const { mutateAsync: sellToken, isPending } = useNadFunSell();

  async function handleSellToken() {
    if (!token?.address) return;

    try {
      await sellToken({
        amount_in: inputValue,
        amount_out_min: '0',
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
    handleInputChange(roundedAmount);
  }

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
          onInputChange={handleInputChange}
          balance={balance}
          tokenSymbol={token?.symbol}
          suffix={token?.symbol}
          setInputButtons={setInputButtons}
        />

        <TokenDisplayCard
          logo={monToken.iconUrl}
          symbol={monToken.symbol}
          title="Estimated Receive"
          content={inputValue || '0'}
        />

        <ActionButton disabled={btnDisabled} onClick={handleSellToken} isPending={isPending}>
          Sell
        </ActionButton>

        <ErrorMessage show={errorData.showError} message={errorData.errorMessage} />
      </SideDrawerLayout>
    </>
  );
}
