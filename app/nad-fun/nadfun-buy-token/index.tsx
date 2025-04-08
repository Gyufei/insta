import { toast } from 'sonner';

import { SideDrawerLayout } from '@/components/side-drawer/common/side-drawer-layout';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { useTokenInput } from '@/components/side-drawer/use-token-input';
import { useAccountBalance } from '@/lib/web3/use-account-balance';
import { ActionButton } from '@/components/side-drawer/common/action-button';
import { ErrorMessage } from '@/components/side-drawer/common/error-message';
import { useNadFunBuy } from '@/lib/data/use-nadfun-buy';
import { TokenData } from '@/lib/data/tokens';
import { TokenHeader } from '../common/token-header';
import { TokenInputSection } from '../common/token-input-section';
import { EstimatedReceive } from '../common/estimated-receive';

export function NadFunBuyToken() {
  const monToken = TokenData.find((token) => token.symbol === 'MON') || TokenData[0];
  const { currentComponent, setIsOpen } = useSideDrawerStore();
  const { token } = currentComponent?.props || { token: null };

  const { balance } = useAccountBalance();
  const { inputValue, btnDisabled, errorData, handleInputChange } = useTokenInput(balance);
  const { mutateAsync: buyToken, isPending } = useNadFunBuy();

  async function handleBuyToken() {
    if (!token?.address) return;

    try {
      await buyToken({
        amount_in: inputValue,
        amount_out_min: '0',
        token: token.address,
      });
      toast.success('Token purchased successfully');
    } catch (error) {
      // Error is already handled in the hook
    }
  }

  if (!token) {
    return null;
  }

  const setInputButtons = [
    { label: 'Reset', onClick: () => handleInputChange('') },
    { label: '0.5 MON', onClick: () => handleInputChange('0.5') },
    { label: '1 MON', onClick: () => handleInputChange('1') },
    { label: '2 MON', onClick: () => handleInputChange('2') },
    { label: '5 MON', onClick: () => handleInputChange('5') },
  ];

  return (
    <>
      <TokenHeader 
        token={token} 
        title={`Buy ${token?.symbol}`} 
        onBackClick={() => setIsOpen(false)} 
      />
      <SideDrawerLayout>
        <TokenInputSection
          inputValue={inputValue}
          onInputChange={handleInputChange}
          balance={balance}
          tokenSymbol="Mon"
          suffix={monToken?.symbol}
          setInputButtons={setInputButtons}
        />

        <EstimatedReceive
          inputValue={inputValue}
          receiveTokenSymbol={token?.symbol}
        />

        <ActionButton disabled={btnDisabled} onClick={handleBuyToken} isPending={isPending}>
          Buy
        </ActionButton>

        <ErrorMessage show={errorData.showError} message={errorData.errorMessage} />
      </SideDrawerLayout>
    </>
  );
}
