'use client';

import { toast } from 'sonner';
import { isAddress } from 'viem';

import { useState } from 'react';

import { ERROR_MESSAGES } from '@/config/const-msg';

import { WithLoading } from '@/components/common/with-loading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useSelectedAccount } from '@/lib/data/account-address/use-selected-account';
import { useCreateAuthority } from '@/lib/data/use-create-authority';
import { cn } from '@/lib/utils';

export function AuthorityAdd() {
  const { data: accountInfo } = useSelectedAccount();
  const accountAddress = accountInfo?.sandbox_account;

  const { mutateAsync: createAuthority, isPending } = useCreateAuthority();

  const [isError, setIsError] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleAdd = async () => {
    if (!isAddress(inputValue)) {
      toast.error(ERROR_MESSAGES.INVALID_ADDRESS);
      setIsError(true);
      return;
    }

    if (!accountAddress) {
      toast.error(ERROR_MESSAGES.ACCOUNT_NOT_CREATED);
      return;
    }

    try {
      await createAuthority(inputValue);
      setInputValue('');
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setIsError(false);
  };

  return (
    <div className="relative mt-3 flex flex-grow items-center">
      <Input
        type="text"
        autoComplete="off"
        placeholder="New Authority"
        className={cn(
          'h-10 bg-white border border-[#EBEBEB] pr-[70px]',
          isError ? 'border-destructive' : ''
        )}
        value={inputValue}
        onChange={handleInputChange}
        aria-invalid={isError}
      />
      <Button
        disabled={!inputValue || isPending}
        onClick={handleAdd}
        size="sm"
        className="absolute h-8 top-[4px] right-1 disabled:bg-[#FAFAFA] bg-[#6E75F920] disabled:text-[#A5ADC6] text-[#6E75F9] hover:text-white hover:bg-[#6E75F9]"
      >
        <WithLoading isLoading={!!isPending} className="mr-2" />
        Add
      </Button>
    </div>
  );
}
