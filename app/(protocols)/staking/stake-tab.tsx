'use client';

import { useAppKitNetwork } from '@reown/appkit/react';
import * as Sentry from '@sentry/nextjs';

import { useEffect, useState } from 'react';

import { APR_MONAD, type IToken, MONAD } from '@/config/tokens';

import { TokenSelectorDropdown } from '@/components/common/token-selector-dropdown';
import { WithLoading } from '@/components/common/with-loading';
import { ActionButton } from '@/components/new/action-button';
import { TokenInput } from '@/components/new/token-input';
import { useSetMax } from '@/components/side-drawer/common/use-set-max';
import { useTokenInput } from '@/components/side-drawer/use-token-input';

import { useDSAMonadNativeBalance } from '@/lib/data/balance/use-dsa-monad-native-balance';
import { useAprioriBalance } from '@/lib/data/use-apriori-balance';
import { useAprioriDeposit } from '@/lib/data/use-apriori-deposit';
import { useAprioriQuote } from '@/lib/data/use-apriori-quote';
import { useMagmaBalance } from '@/lib/data/use-magma-balance';
import { useMagmaDeposit } from '@/lib/data/use-magma-deposit';
import { useEnhancedAnalytics } from '@/lib/hooks/use-enhanced-analytics';
import { ensureMonadNetworkSync } from '@/lib/utils/network-guard';
import { formatNumber, truncateIfExceeds } from '@/lib/utils/number';
import { parseBig } from '@/lib/utils/number';
import { multiply } from 'safebase';

import { type StakingProjectId, getStakingProject } from './staking-config';

interface StakeTabProps {
  selectedProject: StakingProjectId;
}

export function StakeTab({ selectedProject }: StakeTabProps) {
  const { chainId } = useAppKitNetwork();
  // 根据项目配置可选择的代币
  const availableTokens: IToken[] = [MONAD];
  const [selectedToken, setSelectedToken] = useState<IToken>(MONAD);

  // 动态获取项目配置
  const project = getStakingProject(selectedProject);

  // 输出代币选择状态 - 根据项目确定可用的输出代币
  const availableOutputTokens: IToken[] = [project.token];
  const [selectedOutputToken, setSelectedOutputToken] = useState<IToken>(project.token);

  // 当项目切换时，更新输出代币选择
  useEffect(() => {
    setSelectedOutputToken(project.token);
  }, [selectedProject, project.token]);

  const aprioriDeposit = useAprioriDeposit();
  const magmaDeposit = useMagmaDeposit();
  const { mutate: deposit, isPending } =
    selectedProject === 'magma' ? magmaDeposit : aprioriDeposit;
  const {
    balance: dsaBalance,
    isPending: isDsaBalanceLoading,
    refetch: refetchDsaBalance,
  } = useDSAMonadNativeBalance();
  const { inputValue, btnDisabled, errorData, handleInputChange } = useTokenInput(dsaBalance);

  const aprioriBalanceResult = useAprioriBalance();
  const magmaBalanceResult = useMagmaBalance();
  const { handleSetMax, handleInput } = useSetMax(inputValue, dsaBalance, handleInputChange);
  const { trackEvent } = useEnhancedAnalytics();

  // 根据选择的项目使用对应的数据
  const balanceResults = {
    apriori: aprioriBalanceResult,
    magma: magmaBalanceResult,
  };

  const currentBalanceResult = balanceResults[selectedProject];
  const balance = currentBalanceResult.data?.balance || '0';
  const isLoading = currentBalanceResult.isLoading;

  // 移至报价逻辑之后计算

  // ===== Apriori dynamic exchange rate =====
  const quoteParams =
    selectedProject === 'apriori'
      ? { token_in: MONAD.symbol, token_out: APR_MONAD.symbol, amount: '1' }
      : undefined;
  const { data: aprioriQuoteResult } = useAprioriQuote(quoteParams);
  const dynamicExchangeRate = (() => {
    const out = aprioriQuoteResult?.amount_out;
    if (!out) return '';
    const formatted = truncateIfExceeds(String(out), 4);
    return `1 ${MONAD.symbol} = ${formatted} ${APR_MONAD.symbol}`;
  })();
  // 根据 span 展示的汇率计算接收数量
  const receiveAmount = (() => {
    if (selectedProject !== 'apriori') return inputValue || 0;
    const rateOut = aprioriQuoteResult?.amount_out;
    if (!rateOut || !inputValue) return '0';
    try {
      return multiply(String(inputValue), String(rateOut));
    } catch {
      const num = Number(inputValue) * Number(rateOut);
      return isFinite(num) ? String(num) : '0';
    }
  })();
  const handleDeposit = () => {
    const ok = ensureMonadNetworkSync({
      chainId,
    });

    if (!ok) return;

    // ===== SECURITY: Input validation =====
    if (!inputValue || btnDisabled || isPending) return;

    // SECURITY: Validate selected token
    if (!selectedToken || !selectedToken.address) {
      console.error('[STAKE] Invalid selected token', selectedToken);
      return;
    }

    // SECURITY: Validate numeric input
    const inputNum = parseFloat(inputValue);
    if (!Number.isFinite(inputNum) || inputNum <= 0) {
      console.error('[STAKE] Invalid stake amount', inputValue);
      return;
    }

    // SECURITY: Validate against balance
    const balanceNum = parseFloat(dsaBalance || '0');
    if (!Number.isFinite(balanceNum) || balanceNum < 0) {
      console.error('[STAKE] Invalid balance value', dsaBalance);
      return;
    }
    if (inputNum > balanceNum) {
      console.error('[STAKE] Insufficient balance', {
        requested: inputNum,
        available: balanceNum,
      });
      return;
    }

    // SECURITY: Validate token decimals
    const decimals = selectedToken.decimals;
    if (!Number.isFinite(decimals) || decimals < 0 || decimals > 77) {
      console.error('[STAKE] Invalid token decimals', decimals);
      return;
    }

    const amount = parseBig(inputValue, decimals);

    // SECURITY: Validate amount conversion
    const amountStr = amount.toString();
    if (!amountStr || amountStr === '0' || amountStr === 'NaN') {
      console.error('[STAKE] Failed to parse stake amount', {
        inputValue,
        decimals,
        result: amountStr,
      });
      return;
    }

    // SECURITY: Validate output token
    if (!selectedOutputToken || !selectedOutputToken.address) {
      console.error('[STAKE] Invalid output token', selectedOutputToken);
      return;
    }

    // SECURITY: Log stake parameters
    console.log('[STAKE] Stake parameters:', {
      protocol: selectedProject,
      token: selectedToken.symbol,
      amount: inputValue,
      amountWei: amountStr,
      outputToken: selectedOutputToken.symbol,
    });

    // Determine event name based on selected project
    const eventName = selectedProject === 'magma' ? 'MAGMA_STAKE' : 'APRIORI_STAKE';

    Sentry.addBreadcrumb({
      category: 'action',
      message: `click_${selectedProject}_stake`,
      level: 'info',
      data: {
        protocol: selectedProject,
        token: selectedToken?.symbol,
        amount: inputValue,
        receive_token: selectedOutputToken?.symbol,
      },
    });

    // Track deposit attempt
    trackEvent(eventName, {
      event_category: 'protocol_interaction',
      event_label:
        selectedProject === 'magma' ? 'magma_deposit_attempt' : 'apriori_deposit_attempt',
      include_user_id: true,
      custom_parameters: {
        protocol: selectedProject,
        action: 'deposit',
        token: selectedToken?.symbol,
        amount: inputValue,
        receive_token: selectedOutputToken?.symbol,
        receive_amount: receiveAmount,
      },
    });

    try {
      deposit(amountStr, {
        onSuccess: () => {
          Sentry.addBreadcrumb({
            category: 'action',
            message: `${selectedProject}_stake_success`,
            level: 'info',
            data: {
              protocol: selectedProject,
              token: selectedToken?.symbol,
              amount: inputValue,
            },
          });

          // Track successful deposit
          trackEvent(eventName, {
            event_category: 'protocol_interaction',
            event_label:
              selectedProject === 'magma' ? 'magma_deposit_success' : 'apriori_deposit_success',
            include_user_id: true,
            custom_parameters: {
              protocol: selectedProject,
              action: 'deposit_success',
              token: selectedToken?.symbol,
              amount: inputValue,
            },
          });
          // Clear input after success and force balance refresh
          handleInputChange('');
          currentBalanceResult.refetch?.();
          refetchDsaBalance?.();
          setTimeout(() => currentBalanceResult.refetch?.(), 2000);
        },
        onError: (error: Error) => {
          Sentry.captureException(error, {
            tags: {
              page: 'staking',
              protocol: selectedProject,
              error_type: 'stake',
            },
            extra: {
              token: selectedToken?.symbol,
              amount: inputValue,
            },
          });

          // Track failed deposit
          trackEvent('ERROR_OCCURRED', {
            event_category: 'protocol_interaction',
            event_label:
              selectedProject === 'magma' ? 'magma_deposit_failed' : 'apriori_deposit_failed',
            error_message: error?.message || 'Unknown error',
            include_user_id: true,
            custom_parameters: {
              protocol: selectedProject,
              action: 'deposit_failed',
              token: selectedToken?.symbol,
              amount: inputValue,
            },
          });
        },
      });
    } catch (err) {
      Sentry.captureException(err, {
        tags: {
          page: 'staking',
          protocol: selectedProject,
          error_type: 'stake_exception',
        },
        extra: {
          token: selectedToken?.symbol,
          amount: inputValue,
        },
      });
      throw err;
    }
  };

  return (
    <div className="w-full relative">
      {/* MON Token Input Section */}
      <div className="bg-white border border-[#E5E5E5] rounded-lg p-4 mb-4">
        {/* Token Selector */}
        <div className="flex items-center justify-between mb-3">
          <TokenSelectorDropdown
            tokens={availableTokens}
            selectedToken={selectedToken}
            onTokenChange={setSelectedToken}
          />
          <div className="text-sm text-[#999999] flex items-center justify-center">
            Balance:{' '}
            <WithLoading
              isLoading={isDsaBalanceLoading}
            >{`${formatNumber(dsaBalance)}`}</WithLoading>
            <span className="text-[#6E75F9] cursor-pointer ml-2" onClick={() => handleSetMax(true)}>
              Max
            </span>
          </div>
        </div>

        {/* Amount Display */}
        <div className="text-2xl font-semibold text-black mb-1">
          <TokenInput inputValue={inputValue} onInputChange={handleInput} placeholder="0" />
        </div>
      </div>

      {/* Floating Conversion Arrow */}
      <div className="absolute left-1/2 transform -translate-x-1/2 z-10" style={{ top: '102px' }}>
        <div className="w-10 h-10 bg-white border border-[#E5E5E5] rounded-xl flex items-center justify-center shadow-sm">
          <svg width="16" height="32" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 3V13M8 13L12 9M8 13L4 9"
              stroke="#052019"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* aprMON Token Output Section */}
      <div className="bg-white border border-[#E5E5E5] rounded-lg p-4">
        {/* Token Display */}
        <div className="flex items-center justify-between mb-3">
          <TokenSelectorDropdown
            tokens={availableOutputTokens}
            selectedToken={selectedOutputToken}
            onTokenChange={setSelectedOutputToken}
          />
          <div className="text-sm text-[#999999] flex items-center justify-center">
            Balance: <WithLoading isLoading={isLoading}>{`${formatNumber(balance)}`}</WithLoading>
          </div>
        </div>

        {/* Amount Display */}
        <div className="text-[32px] font-medium text-black mb-1">
          {receiveAmount ? truncateIfExceeds(String(receiveAmount || '0'), 4) : '0'}
        </div>
      </div>
      <ActionButton
        disabled={btnDisabled}
        onClick={handleDeposit}
        isPending={isPending}
        error={errorData}
        exchangeRate={
          selectedProject === 'apriori'
            ? dynamicExchangeRate || project.exchangeRate
            : project.exchangeRate
        }
      >
        Stake
      </ActionButton>
    </div>
  );
}
