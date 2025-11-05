'use client';

import AccountSelect from '@/components/common/account-select';
import { divide, multiply } from 'safebase';
import { isAddress } from 'viem';

import { IToken, TokenPriceMap } from '@/config/tokens';

import { NumberInput } from '@/components/common/number-input';
import { TokenSelect } from '@/components/common/token-select';
import { Input } from '@/components/ui/input';
// Removed local Select imports for account list; now encapsulated in AccountSelect
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';

import { useTokenStationPrice } from '@/lib/data/use-token-station-price';
import { cn } from '@/lib/utils';
import { formatNumber, truncateIfExceeds, truncateNumber } from '@/lib/utils/number';

interface TokenSelectorProps {
  selectedToken?: IToken;
  onTokenChange: (token: IToken) => void;
  value: string;
  onValueChange: (value: string) => void;
  balance: string;
  isBalancePending: boolean;
  label: string;
  fromTokenSymbol?: string;
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
  const { data: priceData } = useTokenStationPrice();
  const ethPrice = priceData?.eth_price || '0';
  const monPrice = priceData?.mon_price || '0';

  function getPriceForTokenSymbol(symbol?: string): string {
    if (!symbol) return '0';
    const upper = symbol.toUpperCase();
    if (upper === 'ETH' || upper === 'METH') return ethPrice;
    if (upper === 'MON' || upper === 'WMON') return monPrice;
    if (upper === 'USDT' || upper === 'USDC' || upper === 'MONUSD') return '1';
    if (TokenPriceMap[upper] !== undefined) return String(TokenPriceMap[upper]);
    return '0';
  }

  // 使用通用工具：当小数超过 2 位时截断，否则保持原样
  return (
    <div className={cn('flex flex-col gap-[10px]', className)}>
      {/* Account / Wallet selector (move to top as per UI) */}
      <AccountSelect
        accountOptions={accountOptions}
        selectedAccount={selectedAccount}
        onAccountChange={onAccountChange}
        accountSelectLabel={accountSelectLabel}
      />

      {onCustomAddressChange && (
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
                : Number(value) < Number(balance)
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
                $
                {truncateIfExceeds(
                  multiply(value || '0', getPriceForTokenSymbol(selectedToken?.symbol)),
                  2
                )}
              </>
            ) : label?.toLowerCase() === 'to' ? (
              (() => {
                const fromSymbol = fromTokenSymbol || '';
                const fromPrice = getPriceForTokenSymbol(fromSymbol);
                const toPrice = getPriceForTokenSymbol(selectedToken?.symbol);
                const usdApprox = truncateIfExceeds(fromPrice || '0', 2);

                if (!fromSymbol || !selectedToken?.symbol) {
                  return null;
                }

                if (Number(toPrice) <= 0 || Number(fromPrice) <= 0) {
                  // Fallback when price data is missing
                  return <>~ ${usdApprox}</>;
                }

                const rate = truncateNumber(divide(fromPrice, toPrice), 6);
                return (
                  <>
                    1 {fromSymbol} = {rate} {selectedToken.symbol} ~ ${usdApprox}
                  </>
                );
              })()
            ) : (
              <></>
            )}
          </span>
          <span className="text-sm flex items-center gap-1 text-[#A5ADC6]">
            {selectedToken && <span>{selectedToken?.symbol}: </span>}
            {isBalancePending ? (
              <Skeleton className="w-10 h-4" />
            ) : (
              <span>{formatNumber(balance)}</span>
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
