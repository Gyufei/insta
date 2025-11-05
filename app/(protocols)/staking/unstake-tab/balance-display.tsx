import { useState, useEffect } from 'react';

import { MONAD, type IToken } from '@/config/tokens';

import { TokenSelectorDropdown } from '@/components/common/token-selector-dropdown';

import { ActionButton } from '@/components/new/action-button';
import { TokenInput } from '@/components/new/token-input';
import { useSetMax } from '@/components/side-drawer/common/use-set-max';
import { useTokenInput } from '@/components/side-drawer/use-token-input';
import { Separator } from '@/components/ui/separator';

import { useAprioriWithdraw } from '@/lib/data/use-apriori-withdraw';
import { useMagmaWithdraw } from '@/lib/data/use-magma-withdraw';
import { useEnhancedAnalytics } from '@/lib/hooks/use-enhanced-analytics';
import { formatNumber } from '@/lib/utils/number';
import { parseBig } from '@/lib/utils/number';

import { type StakingProjectId, getStakingProject } from '../staking-config';
import { WithdrawEstReceive } from './withdraw-est-receive';

interface BalanceDisplayProps {
  selectedProject: StakingProjectId;
  balance: string;
}

/**
 * Balance Display Component - Shows token balance and withdrawal button
 * Displays the current staked token balance with project-specific token information
 */
export function BalanceDisplay({ selectedProject, balance }: BalanceDisplayProps) {
  const monToken = MONAD;
  const project = getStakingProject(selectedProject);
  
  // 动态获取可用的代币选项 - 根据项目确定
  const availableTokens: IToken[] = [project.token];
  const [selectedToken, setSelectedToken] = useState<IToken>(project.token);
  
  // 当项目切换时，更新选中的代币
  useEffect(() => {
    setSelectedToken(project.token);
  }, [selectedProject, project.token]);

  // 根据项目类型使用不同的提款 hook
  const aprioriWithdraw = useAprioriWithdraw();
  const magmaWithdraw = useMagmaWithdraw();

  const withdrawHooks = {
    apriori: aprioriWithdraw,
    magma: magmaWithdraw,
  };

  const { mutate: withdraw, isPending } = withdrawHooks[selectedProject];
  const { trackEvent } = useEnhancedAnalytics();

  const { inputValue, btnDisabled, errorData, handleInputChange } = useTokenInput(balance);

  const { handleSetMax, handleInput } = useSetMax(inputValue, balance, handleInputChange);
  const receiveAmount = inputValue || '0';

  const handleWithdraw = () => {
    if (!inputValue || btnDisabled || isPending) return;
    const amount = parseBig(inputValue, selectedToken.decimals);
    // Determine event name and labels based on project
    const eventName = selectedProject === 'magma' ? 'MAGMA_UNSTAKE' : 'APRIORI_UNSTAKE';
    const attemptLabel = selectedProject === 'magma' ? 'magma_withdraw_attempt' : 'apriori_withdraw_request_attempt';
    const successLabel = selectedProject === 'magma' ? 'magma_withdraw_success' : 'apriori_withdraw_request_success';
    const failedLabel = selectedProject === 'magma' ? 'magma_withdraw_failed' : 'apriori_withdraw_request_failed';

    // Track withdraw attempt
    trackEvent(eventName, {
      event_category: 'protocol_interaction',
      event_label: attemptLabel,
      include_user_id: true,
      custom_parameters: {
        protocol: selectedProject,
        action: selectedProject === 'magma' ? 'withdraw' : 'withdraw_request',
        token: selectedToken.symbol,
        amount: inputValue,
        receive_token: monToken.symbol,
        receive_amount: receiveAmount,
      },
    });

    withdraw(amount.toString(), {
      onSuccess: () => {
        // Track successful withdraw
        trackEvent(eventName, {
          event_category: 'protocol_interaction',
          event_label: successLabel,
          include_user_id: true,
          custom_parameters: {
            protocol: selectedProject,
            action: selectedProject === 'magma' ? 'withdraw_success' : 'withdraw_request_success',
            token: selectedToken.symbol,
            amount: inputValue,
          },
        });
      },
      onError: (error: Error) => {
        // Track failed withdraw
        trackEvent('ERROR_OCCURRED', {
          event_category: 'protocol_interaction',
          event_label: failedLabel,
          error_message: error?.message || 'Unknown error',
          include_user_id: true,
          custom_parameters: {
            protocol: selectedProject,
            action: selectedProject === 'magma' ? 'withdraw_failed' : 'withdraw_request_failed',
            token: selectedToken.symbol,
            amount: inputValue,
          },
        });
      },
    });
  };

  return (
    <div className="rounded-xl border border-[#EBEBEB] bg-white p-6 shadow-sm">
      {/* Token Header with Dropdown */}
      <div className="flex items-center justify-between mb-6">
        <TokenSelectorDropdown
          tokens={availableTokens}
          selectedToken={selectedToken}
          onTokenChange={setSelectedToken}
        />
        <div className="text-sm text-[#999999]">
          Balance: {formatNumber(balance)}{' '}
          <span className="text-[#6E75F9] cursor-pointer" onClick={() => handleSetMax(true)}>
            Max
          </span>
        </div>
      </div>

      <TokenInput
        inputValue={inputValue}
        onInputChange={handleInput}
        placeholder="0"
      />
      <Separator className="mt-6 mb-5" />
      <WithdrawEstReceive receiveToken={monToken} receiveAmount={receiveAmount} />
      <ActionButton
        disabled={btnDisabled}
        onClick={handleWithdraw}
        isPending={isPending}
        error={errorData}
      >
        Submit Withdraw
      </ActionButton>
    </div>
  );
}
