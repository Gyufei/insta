import Image from 'next/image';

import { APR_MONAD, MONAD } from '@/config/tokens';

import { ActionButton } from '@/components/new/action-button';
import { TokenInput } from '@/components/new/token-input';
import { useSetMax } from '@/components/side-drawer/common/use-set-max';
import { useTokenInput } from '@/components/side-drawer/use-token-input';
import { Separator } from '@/components/ui/separator';

import { useAprioriWithdraw } from '@/lib/data/use-apriori-withdraw';
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
  const aprMonToken = APR_MONAD;
  const project = getStakingProject(selectedProject);

  const { mutate: withdraw, isPending } = useAprioriWithdraw();

  const { inputValue, btnDisabled, errorData, handleInputChange } = useTokenInput(balance);

  const { handleSetMax, handleInput } = useSetMax(inputValue, balance, handleInputChange);
  const receiveAmount = inputValue || '0';

  const handleWithdraw = () => {
    if (!inputValue || btnDisabled || isPending) return;
    const amount = parseBig(inputValue, aprMonToken?.decimals);
    withdraw(amount.toString());
  };

  return (
    <div className="rounded-xl border border-[#EBEBEB] bg-white p-6 shadow-sm">
      {/* Token Header with Dropdown */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Image src={project.token.logo} alt={project.token.symbol} width={24} height={24} />
          <span className="font-semibold text-lg">{project.token.symbol}</span>
        </div>
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
      <Separator className="mt-3 mb-5" />
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
