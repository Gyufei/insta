'use client';

import Image from 'next/image';

import { IToken } from '@/config/tokens';

import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';

interface TokenSelectorDropdownProps {
  /** Available tokens for selection */
  tokens: IToken[];
  /** Currently selected token */
  selectedToken?: IToken;
  /** Callback when token selection changes */
  onTokenChange: (token: IToken) => void;
  /** Whether the selector is disabled */
  disabled?: boolean;
  /** Custom className for styling */
  className?: string;
}

/**
 * Simple Token Selector Dropdown Component
 * Provides a clean dropdown interface for token selection without borders
 */
export function TokenSelectorDropdown({
  tokens,
  selectedToken,
  onTokenChange,
  disabled = false,
  className = '',
}: TokenSelectorDropdownProps) {
  return (
    <Select
      value={selectedToken?.address}
      onValueChange={(value) => {
        const token = tokens.find((t) => t.address === value);
        if (token) {
          onTokenChange(token);
        }
      }}
      disabled={disabled}
    >
      <SelectTrigger
        className={`
          border-none shadow-none bg-transparent p-0 !h-[24px] gap-2 
          focus:ring-0 focus-visible:ring-0 hover:bg-transparent
          ${className}
        `}
      >
        <div className="flex items-center gap-2 cursor-pointer">
          {selectedToken && (
            <>
              <Image src={selectedToken.logo} alt={selectedToken.symbol} width={20} height={20} />
              <span className="font-medium text-base text-black">{selectedToken.symbol}</span>
            </>
          )}
        </div>
      </SelectTrigger>
      <SelectContent className="min-w-[200px]">
        {tokens.map((token) => (
          <SelectItem key={token.address} value={token.address}>
            <div className="flex items-center gap-2">
              <Image src={token.logo} alt={token.symbol} width={20} height={20} />
              <div className="flex flex-col">
                <span className="font-medium">{token.symbol}</span>
                {/* <span className="text-xs text-gray-500">{token.name}</span> */}
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
