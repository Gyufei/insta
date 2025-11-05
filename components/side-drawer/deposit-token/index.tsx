import { useAccount } from 'wagmi';

import { NetworkConfigs } from '@/config/network-config';
import { MONAD } from '@/config/tokens';

import { useTokenInput } from '@/components/side-drawer/use-token-input';

import { useRPCNativeBalance } from '@/lib/data/balance/use-rpc-native-balance';
import { useDeposit } from '@/lib/data/use-deposit';
import { useEnhancedAnalytics } from '@/lib/hooks/use-enhanced-analytics';
import { parseBig } from '@/lib/utils/number';

import { ActionButton } from '../common/action-button';
import { SideDrawerLayout } from '../common/side-drawer-layout';
import { TokenDisplay } from '../common/token-display';
import { TokenInput } from '../common/token-input';
import { SideDrawerBackHeader } from '../side-drawer-back-header';
import { usePathChangeBack } from '../use-path-change-back';

export function DepositToken() {
  const { address } = useAccount();
  const token = MONAD;

  const { handleBack } = usePathChangeBack();
  const { mutate: deposit, isPending } = useDeposit();
  const { trackEvent } = useEnhancedAnalytics();

  const { balance, isPending: isBalancePending } = useRPCNativeBalance(
    NetworkConfigs.monadTestnet.id,
    address || ''
  );
  const { inputValue, btnDisabled, errorData, handleInputChange } = useTokenInput(balance);

  const handleDeposit = () => {
    if (!inputValue || btnDisabled || isPending) return;
    const amount = parseBig(inputValue, token?.decimals);
    
    // GA上报：存款操作
    trackEvent('DEPOSIT_INITIATED', {
      event_category: 'portfolio',
      event_label: 'token_deposit',
      token_symbol: token.symbol,
      token_address: token.address,
      amount: inputValue,
      custom_parameters: {
        operation: 'deposit',
        token_name: token.name
      }
    });
    
    deposit(amount.toString(), {
      onSuccess: () => {
        // GA上报：存款成功
        trackEvent('DEPOSIT_COMPLETED', {
          event_category: 'portfolio',
          event_label: 'token_deposit_success',
          token_symbol: token.symbol,
          token_address: token.address,
          amount: inputValue,
          custom_parameters: {
            operation: 'deposit',
            token_name: token.name
          }
        });
        handleBack();
      },
      onError: (error) => {
        // GA上报：存款失败
        trackEvent('ERROR_OCCURRED', {
          event_category: 'error',
          event_label: 'deposit_token_failed',
          error_message: error?.message || 'Unknown error',
          token_symbol: token.symbol,
          token_address: token.address,
          amount: inputValue,
          custom_parameters: {
            operation: 'deposit',
            token_name: token.name
          }
        });
      }
    });
  };

  return (
    <>
      <SideDrawerBackHeader title="Deposit" onClick={handleBack} />
      <SideDrawerLayout>
        <TokenDisplay
          isPending={isBalancePending}
          token={token}
          balance={balance}
          balanceLabel="Token Balance"
        />
        <TokenInput
          inputValue={inputValue}
          onInputChange={handleInputChange}
          placeholder="Amount to deposit"
        />
        <ActionButton
          disabled={btnDisabled}
          onClick={handleDeposit}
          isPending={isPending}
          error={errorData}
        >
          Deposit
        </ActionButton>
      </SideDrawerLayout>
    </>
  );
}
