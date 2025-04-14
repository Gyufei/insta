'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { isAddress } from 'viem';
import { useCreateAuthority } from '@/lib/data/use-create-authority';
import { ERROR_MESSAGES } from '@/config/error-msg';
import { WithLoading } from '@/components/with-loading';
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
      <input
        type="text"
        autoComplete="off"
        placeholder="New Authority"
        className={`form-input h-10 w-full py-3! pr-18! ${isError ? 'border-red-500!' : ''}`}
        style={{ paddingLeft: '0.75rem' }}
        value={inputValue}
        onChange={handleInputChange}
      />
      <button
        disabled={!inputValue || isPending}
        onClick={handleAdd}
        className="bg-blue disabled:bg-gray-200 dark:disabled:bg-slate-200 scale-down-sm hover:bg-blue active:bg-blue disabled:text-gray-300 absolute top-1 right-1 flex h-8 w-16 flex-shrink-0 cursor-pointer items-center justify-center rounded-sm px-3 text-sm leading-none font-semibold text-white shadow-none duration-0 outline-none select-none focus:outline-none active:shadow-none"
      >
        <div className="flex w-full items-center justify-center truncate">
          <WithLoading isLoading={!!isPending} className="mr-2" />
          <div className="flex items-center truncate py-0.5">Add</div>
        </div>
      </button>
    </div>
  );
}
