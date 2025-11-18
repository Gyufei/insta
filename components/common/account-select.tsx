import React from "react";
import { Wallet } from "lucide-react";
import { cn, formatAddress } from "@/lib/utils";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";

export interface AccountOption {
  label?: string;
  value: string;
  wallet_type?: string;
}

export interface AccountSelectProps {
  accountOptions?: AccountOption[];
  selectedAccount?: string;
  onAccountChange?: (value: string) => void;
  accountSelectLabel?: string;
  className?: string;
  placeholder?: string;
}

/**
 * Reusable account selection component extracted from token-drop-selector.
 * Keeps the same visual style and selected-state padding animation.
 */
export function AccountSelect({
  accountOptions,
  selectedAccount,
  onAccountChange,
  accountSelectLabel = "Account",
  className,
  placeholder = "Select account",
}: AccountSelectProps) {
  if (!accountOptions || !onAccountChange) return null;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {accountSelectLabel ? (
        <div className="text-sm text-[#131E40] font-normal">{accountSelectLabel}</div>
      ) : null}
      <div className="relative w-full">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Wallet className="h-5 w-5 text-primary" />
        </div>
        <Select value={selectedAccount || ""} onValueChange={(value) => onAccountChange?.(value)}>
          <SelectTrigger className="w-full !h-10 pl-10 shadow-none focus-visible:ring-0">
            <SelectValue placeholder={placeholder}>
              {selectedAccount &&
                formatAddress(selectedAccount, {
                  prefix: 12,
                  suffix: 12,
                })}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-white">
            {accountOptions?.map((account) => {
              const isSelected = selectedAccount === account.value;
              return (
                <SelectItem
                  key={account.value}
                  value={account.value}
                  className={cn(
                    "flex justify-between items-center my-2 w-full h-14 px-3 border rounded-[8px] bg-white",
                    isSelected ? "border-[#6E75F9] bg-[#6E75F910]" : "border-[#EBEBEB]"
                  )}
                >
                  <div
                    className={cn(
                      "flex-1 min-w-0 flex justify-between items-center transition-all duration-200 ease-in-out",
                      isSelected ? "pr-10" : "pr-0"
                    )}
                  >
                    <span className="text-sm text-[#131E40]">
                      {formatAddress(account.value, { prefix: 12, suffix: 12 })}
                    </span>
                    {account.wallet_type && (
                      <div className="bg-[#6E75F910] text-xs text-[#6E75F9] px-2 h-5 flex items-center justify-center">
                        {account.wallet_type}
                      </div>
                    )}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default AccountSelect;