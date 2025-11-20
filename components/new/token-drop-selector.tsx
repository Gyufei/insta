'use client';

import { divide } from 'safebase';
import { isAddress } from 'viem';

import { IToken } from '@/config/tokens';

import AccountSelect from '@/components/common/account-select';
import { NumberInput } from '@/components/common/number-input';
import { TokenSelect } from '@/components/common/token-select';
import { Input } from '@/components/ui/input';
// Removed local Select imports for account list; now encapsulated in AccountSelect
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';

import { cn } from '@/lib/utils';
import { formatNumber, truncateNumber } from '@/lib/utils/number';
import { DEFAULT_TOKEN_DECIMALS } from '@/config/network-config';
import { useAddressBalance } from '@/lib/data/balance/use-address-balance';

interface TokenSelectorProps {
  selectedToken?: IToken;
  onTokenChange: (token: IToken) => void;
  value: string;
  onValueChange: (value: string) => void;
  balance: string;
  isBalancePending: boolean;
  label: string;
  fromTokenSymbol?: string;
  fromTokenAmount?: string;
  placeholder?: string;
  disabled?: boolean;
  showMaxButton?: boolean;
  onMaxClick?: () => void;
  className?: string;
  justHasBalance?: boolean;
  noMonUsd?: boolean;
  // Optional: account selection for "You pay"
  accountOptions?: { label: string; value: string; wallet_type?: 'EOA' | 'DSA' }[];
  selectedAccount?: string;
  onAccountChange?: (value: string) => void;
  accountSelectLabel?: string;
  // Optional: custom address toggle for "You receive"
  customAddressEnabled?: boolean;
  onCustomAddressToggle?: (enabled: boolean) => void;
  customAddress?: string;
  onCustomAddressChange?: (addr: string) => void;
}

export function TokenDropSelector({
  selectedToken,
  onTokenChange,
  value,
  onValueChange,
  balance,
  isBalancePending,
  label,
  fromTokenSymbol,
  fromTokenAmount,
  placeholder,
  disabled = false,
  showMaxButton = false,
  onMaxClick,
  className,
  justHasBalance = false,
  noMonUsd = false,
  accountOptions,
  selectedAccount,
  onAccountChange,
  accountSelectLabel = 'Select Account / Wallet',
  customAddressEnabled,
  onCustomAddressToggle,
  customAddress,
  onCustomAddressChange,
}: TokenSelectorProps) {
  // 使用通用工具：当小数超过 2 位时截断，否则保持原样
  const hasValidCustomAddress = !!customAddressEnabled && !!customAddress && isAddress(customAddress);
  const {
    balance: customAddrBalance,
    isBalancePending: isCustomAddrPending,
  } = useAddressBalance(
    customAddress || '',
    selectedToken?.address || '',
    selectedToken?.decimals ?? DEFAULT_TOKEN_DECIMALS,
    hasValidCustomAddress
  );

  const effectiveBalance = hasValidCustomAddress ? customAddrBalance : balance;
  const effectivePending = hasValidCustomAddress ? isCustomAddrPending : isBalancePending;

  return (
    <div className={cn('flex flex-col gap-[10px]', className)}>
      {/* Account / Wallet selector (move to top as per UI) */}
      <AccountSelect
        accountOptions={accountOptions}
        selectedAccount={selectedAccount}
        onAccountChange={onAccountChange}
        accountSelectLabel={accountSelectLabel}
      />

      {onCustomAddressToggle && (
        <div className="flex items-center justify-end gap-2">
          <span className="text-sm text-[#A5ADC6]">Custom Address</span>
          <Switch
            checked={!!customAddressEnabled}
            onCheckedChange={(checked) => onCustomAddressToggle?.(checked)}
          />
        </div>
      )}

      {/* Custom Address input field (only when enabled) */}
      {onCustomAddressToggle && customAddressEnabled && (
        <div className="flex flex-col gap-2 mt-2">
          <Input
            type="text"
            autoComplete="off"
            placeholder="Input Wallet Address"
            value={customAddress || ''}
            onChange={(e) => onCustomAddressChange && onCustomAddressChange(e.target.value)}
            className={cn(
              'w-full h-10',
              customAddress && !isAddress(customAddress) && 'border-destructive'
            )}
          />
        </div>
      )}

      <div className="flex justify-between items-center gap-[10px] mt-2">
        <div className="flex-1 flex flex-col gap-[10px]">
          <TokenSelect
            selectedToken={selectedToken}
            onTokenChange={onTokenChange}
            disableMonUsd={noMonUsd}
            filterByBalance={justHasBalance}
            label={label}
          />
        </div>
      </div>
      <Separator className="my-2" />
      <div className="flex flex-col justify-center gap-[10px]">
        <div className="flex flex-col items-start gap-2">
          <NumberInput
            className={cn(
              '!text-[32px] !font-medium bg-transparent border-none h-10 p-0 shadow-none focus-visible:ring-0 w-full',
              disabled
                ? '!text-[#131E40] disabled:text-[#131E40] disabled:opacity-100'
                : Number(value) < Number(effectiveBalance)
                  ? '!text-red'
                  : '!text-[#131E40]'
            )}
            value={value}
            onChange={onValueChange}
            disabled={disabled}
            placeholder={placeholder}
          />
        </div>
        {/* helper text: from shows USD, to shows conversion formula */}
        <div className="flex justify-between items-center font-normal">
          <span className="text-sm text-[#A5ADC6]">
            {label?.toLowerCase() === 'from' ? (
              <>
                {/* $
                {truncateIfExceeds(
                  multiply(value || '0', getPriceForTokenSymbol(selectedToken?.symbol)),
                  2
                )} */}
              </>
            ) : label?.toLowerCase() === 'to' ? (
              (() => {
                const fromSymbol = fromTokenSymbol || '';

                if (!fromSymbol || !selectedToken?.symbol) {
                  return null;
                }

                // if (Number(toPrice) <= 0 || Number(fromPrice) <= 0) {
                //   // Fallback when price data is missing
                //   return <>~ ${usdApprox}</>;
                // }

                // Prefer live quote-based rate if amounts are available
                const fromAmt = Number(fromTokenAmount || '');
                const toAmt = Number(value || '');
                if (isFinite(fromAmt) && isFinite(toAmt) && fromAmt > 0 && toAmt > 0) {
                  const rateFromQuote = truncateNumber(divide(String(toAmt), String(fromAmt)), 6);
                  return (
                    <>
                      1 {fromSymbol} = {rateFromQuote} {selectedToken.symbol}
                    </>
                  );
                }

                return null;
              })()
            ) : (
              <></>
            )}
          </span>
          <span className="text-sm flex items-center gap-1 text-[#A5ADC6]">
            {selectedToken && <span>{selectedToken?.symbol}: </span>}
            {effectivePending ? (
              <Skeleton className="w-10 h-4" />
            ) : (
              <span>{formatNumber(effectiveBalance)}</span>
            )}
            {showMaxButton && onMaxClick && (
              <span className="text-[#6E75F9] cursor-pointer ml-1 font-medium" onClick={onMaxClick}>
                MAX
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}