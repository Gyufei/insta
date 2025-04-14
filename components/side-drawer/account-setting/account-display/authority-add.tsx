'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { isAddress } from 'viem';
import { useCreateAuthority } from '@/lib/data/use-create-authority';
import { ERROR_MESSAGES } from '@/config/error-msg';
import { WithLoading } from '@/components/with-loading';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function AuthorityAdd() {
  const { mutateAsync: createAuthority, isPending } = useCreateAuthority();

  const [isError, setIsError] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleAdd = async () => {
    if (!isAddress(inputValue)) {
      toast.error(ERROR_MESSAGES.INVALID_ADDRESS);
      setIsError(true);
      return;
    }

    try {
      await createAuthority(inputValue);
      setInputValue('');
      toast.success('Authority added successfully');
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
    <div className="relative mt-4 flex flex-grow items-center">
      <Input
        type="text"
        autoComplete="off"
        placeholder="New Authority"
        className={isError ? 'border-destructive' : ''}
        value={inputValue}
        onChange={handleInputChange}
        aria-invalid={isError}
      />
      <Button
        disabled={!inputValue || isPending}
        onClick={handleAdd}
        size="sm"
        className="absolute top-[2px] right-1"
      >
        <WithLoading isLoading={!!isPending} className="mr-2" />
        Add
      </Button>
    </div>
  );
}
