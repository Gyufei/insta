'use client';

import Image from 'next/image';
import { toast } from 'sonner';

import { IToken } from '@/config/tokens';

import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';

interface TargetTokenSelectorProps {
  /** Available tokens for selection */
  tokens: IToken[];
  /** Currently selected token */
  selectedToken?: IToken;
  /** Callback when token selection changes */
  onTokenChange: (token: IToken) => void;
  /** Whether the selector is disabled */
  disabled?: boolean;
  /** Block interactions without greying out; defaults to disabled semantics */
  blocked?: boolean;
  /** Message to show when blocked trigger is clicked */
  blockedMessage?: string;
  /** Custom className for styling */
  className?: string;
}

/**
 * Simple Token Selector Dropdown Component
 * Provides a clean dropdown interface for token selection without borders
 */
export function TargetTokenSelector({
  tokens,
  selectedToken,
  onTokenChange,
  disabled = false,
  blocked,
  blockedMessage = 'You cannot deposit as collateral on both tokens.',
  className = '',
}: TargetTokenSelectorProps) {
  const isBlocked = (blocked ?? disabled) || false;
  return (
    <Select
      value={selectedToken?.address}
      onValueChange={(value) => {
        if (isBlocked) {
          toast.warning(blockedMessage);
          return;
        }
        const token = tokens.find((t) => t.address === value);
        if (token) {
          onTokenChange(token);
        }
      }}
    >
      <SelectTrigger
        className={`
          border-none shadow-none bg-transparent p-0 !h-[24px] gap-2 
          focus:ring-0 focus-visible:ring-0 hover:bg-transparent
          ${className}
        `}
        onClick={(e) => {
          if (isBlocked) {
            e.preventDefault();
            e.stopPropagation();
            toast.warning(blockedMessage);
          }
        }}
      >
        <div className="flex items-center gap-2 cursor-pointer">
          {selectedToken && (
            <>
              <Image
                src={selectedToken.logo}
                alt={selectedToken.symbol}
                className="h-10 w-10 rounded-full bg-[#201f1e]"
                width={20}
                height={20}
              />
              <span className="font-medium text-base text-black">{selectedToken.symbol}</span>
            </>
          )}
        </div>
      </SelectTrigger>
      <SelectContent
        position="popper"
        className="min-w-[220px] data-[side=bottom]:translate-y-2 rounded-xl border border-slate-200 shadow-md"
      >
        {tokens.map((token) => (
          <SelectItem
            key={token.address}
            value={token.address}
            className="py-3 my-1 gap-3 rounded-md data-[state=checked]:bg-violet-100 data-[state=checked]:text-[#131E40]"
          >
            <div className="flex items-center gap-3">
              <Image src={token.logo} alt={token.symbol} width={24} height={24} className="rounded-full bg-[#201f1e]" />
              <div className="flex flex-col">
                <span className="font-medium text-[16px] leading-5">{token.symbol}</span>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
