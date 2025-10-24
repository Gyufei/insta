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

  const { inputValue, btnDisabled, errorData, handleInputChange } = useTokenInput(balance);

  const { handleSetMax, handleInput } = useSetMax(inputValue, balance, handleInputChange);
  const receiveAmount = inputValue || '0';

  const handleWithdraw = () => {
    if (!inputValue || btnDisabled || isPending) return;
    const amount = parseBig(inputValue, selectedToken.decimals);
    withdraw(amount.toString());
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
        placeholder="Amount to withdraw"
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
